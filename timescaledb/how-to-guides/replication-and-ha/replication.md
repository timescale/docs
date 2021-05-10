# Replication

PostgreSQL relies on replication for high availability, failover, and balancing
read loads across multiple nodes. Replication ensures that data written to the
primary PostgreSQL database is mirrored on one or more nodes. By virtue of
having multiple nodes with an exact copy of the primary database available, the
primary database can be replaced with a replica node in the event of a failure
or outage on the primary server. Replica nodes can also be used as read only
databases (sometimes called "read replicas"), allowing reads to be horizontally
scaled by spreading the read query volume across multiple nodes.

TimescaleDB supports replication using PostgreSQL's built-in [streaming replication][postgres-streaming-replication-docs].  Using
[logical replication][postgres-logrep-docs] with TimescaleDB is *not recommended*, as it requires schema synchronization between the primary and
replica nodes and replicating partition root tables, which are
[not currently supported][postgres-partition-limitations].

This tutorial will outline the basic configuration needed to set up streaming
replication on one or more replicas, covering both synchronous and asynchronous
options. It assumes you have at least two separate instances of TimescaleDB
running.  If you're using our [Docker Image][timescale-docker], we recommend
using a [PostgreSQL entrypoint script][docker-postgres-scripts] to run the
configuration. For our sample Docker configuration and run scripts, check out
our [Streaming Replication Docker Repository][timescale-streamrep-docker].

<highlight type="tip">
PostgreSQL achieves streaming replication by having replicas continuously
stream the WAL from the primary database.  See the official
[replication documentation](https://www.postgresql.org/docs/current/static/warm-standby.html#STREAMING-REPLICATION) for details. For more
information about how PostgreSQL implements Write-Ahead Logging,
see their [WAL Documentation](https://www.postgresql.org/docs/current/static/wal-intro.html).
</highlight>

## Configure the primary database

Create a PostgreSQL user with a role that allows it to initialize streaming
replication. This will be the user each replica uses to stream from the primary
database. Run the command as the `postgres` user, or another user that is
configured with superuser privileges on the database you're working with.

```sql
SET password_encryption = 'scram-sha-256';
CREATE ROLE repuser WITH REPLICATION PASSWORD 'password' LOGIN;
```

<highlight type="warning">
[scram-sha-256](https://www.postgresql.org/docs/current/static/sasl-authentication.html#SASL-SCRAM-SHA-256) is PostgreSQL's most secure
password based authentication, but it is only available in PostgreSQL 10 and
above. If you are using an earlier version, consider using `md5` authentication
by replacing the first line in the above SQL with `SET password_encryption = true;`
and changing the `AUTH_METHOD` in `pg_hba` to `md5`. (see [Configure Host Based Authentication](#configure-host-based-authentication))
</highlight>

### Configure replication parameters

There are several replication settings that must be added to `postgresql.conf`
(if you're unsure of where PostgreSQL is reading `postgresql.conf` from, just
execute `show config_file;` in a `psql` shell). You can either comment out the
existing settings in `postgresql.conf` and add the desired value, or you can
simply append the desired settings to the `postgresql.conf`.

`synchronous_commit` has a number of settings that strongly impact data
consistency and performance. For this tutorial, we'll focus on the common
setting of turning `synchronous_commit` off. For more detail on the different
modes, see [Replication Modes](#replication-modes)

* `max_wal_senders` - The total number of concurrent connections from replicas
or backup clients. At the very least, this should equal the number of replicas
you intend to have.
* `wal_level` - The amount of information written to the PostgreSQL Write-Ahead
  Log (WAL). For replication to work, there needs to be enough data in the WAL
  to support archiving and replication. The default level of `replica` covers
  this, but it bears mentioning here since it is an absolute requirement for
  streaming replication.
* `max_replication_slots` - The total number of replication slots the primary
  database can support. See below for more information about replication slots.
* `listen_address` - Since remote replicas will be connecting to the primary to
  stream the WAL, we'll need to make sure that the primary is not just listening
  on the local loopback.

### Sample replication configuration

The most common streaming replication use case is asynchronous replication with
one or more replicas. We'll use that as that as our sample configuration.

In cases where you need stronger consistency on the replicas or where your
query load is heavy enough to cause significant lag between the primary and
replica nodes in asyncronous mode, you may want to consider one of the
synchronous replication configurations.

#### Asynchronous replication with one replica

```
listen_addresses = '*'
wal_level = replica
max_wal_senders = 1
max_replication_slots = 1
synchronous_commit = off
```

In this example, the WAL will be streamed to the replica, but the primary server
will not wait for confirmation that the WAL has been written to disk on either
the primary or the replica. This is the most performant replication
configuration, but it does carry the risk of a small amount of data loss in the
event of a system crash. It also makes no guarantees that the replica will be
fully up to date with the primary, which could cause inconsistencies between
read queries on the primary and the replica.

For replication settings to apply, you must restart PostgreSQL, not just
reload the configuration file. This needs to be done before creating replication
slots in the next step.

### Create replication slots

After configuring `postgresql.conf` and restarting PostgreSQL, create a
[replication slot][postgres-rslots-docs] for each replica.  Replication slots
ensure that the primary does not delete segments from the WAL until they have
been received by the replicas. This is crucial for cases where a replica goes
down for extended periods of time -- without verifying that a WAL segment has
already been consumed by a replica, the primary may delete data needed for
replication. To some extent, you can achieve this using
[archiving][postgres-archive-docs], but replication slots provide the strongest
protection of WAL data for streaming replication.  The name of the slot is
arbitrary -- we'll call the slot for this replica `replica_1_slot`.

```sql
SELECT * FROM pg_create_physical_replication_slot('replica_1_slot');
```

### Configure host-based authentication [](configure-host-based-authentication)

Configure the `pg_hba.conf` file (run `show hba_file;` in a `psql` shell if
you're unsure of its location) to accept connections from the replication user
on the host of each replica.

```sql
# TYPE     DATABASE        USER            ADDRESS METHOD               AUTH_METHOD
host       replication     repuser         <REPLICATION_HOST_IP>/32     scram-sha-256
```

<highlight type="tip">
The above settings will restrict replication connections to traffic coming
from `REPLICATION_HOST_IP` as the PostgreSQL user `repuser` with a valid
password.  `REPLICATION_HOST_IP` will be able to initiate streaming replication
from that machine without additional credentials.  You may want to
change the `address` and `method` values to match your security and network
settings. Read more about `pg_hba.conf` in the [official documentation](https://www.postgresql.org/docs/current/static/auth-pg-hba-conf.html).
</highlight>

## Configure the replica database

Replicas work by streaming the primary server's WAL log and replaying its
transactions in what PostgreSQL calls "recovery mode".  Before this can happen,
the replica needs to be in a state where it can replay the log. This is achieved
by restoring the replica from a base backup of the primary instance.

### Create a base backup on the replica

Stop PostgreSQL. If the replica's PostgreSQL database already has data, you will
need to remove it prior to running the backup.  This can be done by removing the
contents of the PostgreSQL data directory. To determine the location of the
data directory, run `show data_directory;` in a `psql` shell.

```bash
rm -rf <DATA_DIRECTORY>/*
```

Now run the `pg_basebackup` command using the IP address of the primary database
along with the replication username.

```bash
pg_basebackup -h <PRIMARY_IP> -D <DATA_DIRECTORY> -U repuser -vP -W
```

<highlight type="warning">
The -W flag will prompt you for a password on the command line. This may
cause problems for automated setups. If you are using password based
authentication in an automated setup, you may need to make use of a
[pgpass file](https://www.postgresql.org/docs/current/static/libpq-pgpass.html).
</highlight>

When the backup finishes, create a [recovery.conf][postgres-recovery-docs] file
in your data directory, ensuring it has the proper permissions.  When
PostgreSQL finds a `recovery.conf` file in its data directory, it knows to start
up in recovery mode and begin streaming the WAL through the replication
protocol.

```bash
touch <DATA_DIRECTORY>/recovery.conf
chmod 0600 <DATA_DIRECTORY>/recovery.conf
```

### Replication and recovery settings

Add settings for communicating with the primary server to `recovery.conf`. In
streaming replication, the `application_name` in `primary_conninfo` should be
the same as the name used in the primary's `synchronous_standby_names` settings.

```
standby_mode = on # Ensures that the replica continues to fetch WAL records from the primary
primary_conninfo = 'host=<PRIMARY_IP> port=5432 user=repuser password=<POSTGRES_USER_PASSWORD> application_name=r1'
primary_slot_name = 'replica_1_slot' # Name of the replication slot we created on the master
```

Next, update the `postgresql.conf` file to mirror the configuration of the
primary database. For asynchronous replication, this would look like:

```
hot_standby = on
wal_level = replica
max_wal_senders = 2
max_replication_slots = 2
synchronous_commit = off
```

<highlight type="warning">
In order to allow reads on the replica, `hot_standby` must be set to `on`.
This allows read-only queries on the replica. By default, this
setting is set to `on` in PostgreSQL 10, but in earlier versions it defaults to
`off`.
</highlight>

Finally, restart PostgreSQL. At this point, the replica should be fully
synchronized with the primary database and prepared to stream from it. The
logs on the replica should look something like this:

```
LOG:  database system was shut down in recovery at 2018-03-09 18:36:23 UTC
LOG:  entering standby mode
LOG:  redo starts at 0/2000028
LOG:  consistent recovery state reached at 0/3000000
LOG:  database system is ready to accept read only connections
LOG:  started streaming WAL from primary at 0/3000000 on timeline 1
```

Any clients will be able to perform reads on the replica. Verify this
by running inserts, updates, or other modifications to your data on the primary
and querying the replica to ensure they have been properly copied over.
This is fully compatible with TimescaleDB's functionality, provided
you [set up TimescaleDB][timescale-setup-docs] on the primary database.

## Configure replication modes [](replication-modes)

This walkthrough gets asynchronous streaming replication working, but
in many cases stronger consistency between the primary and replicas is
required. Under heavy workloads, replicas can lag far behind the primary,
providing stale data to clients reading from the replicas. Moreover, in cases
where any data loss is fatal, asynchronous replication may not provide enough
of a durability guarantee. Luckily [`synchronous_commit`][postgres-synchronous-commit-docs] has several options
with varying consistency/performance tradeoffs:

<highlight type="warning">
If `synchronous_standby_names` is empty, the settings `on`, `remote_apply`,
`remote_write` and `local` all provide the same synchronization level:
transaction commits only wait for local flush to disk.
</highlight>

* `on` - Default value. The server will not return "success" until the WAL
  transaction has been written to disk on the primary and any replicas.
* `off` - The server will return "success" when the WAL transaction has been
  sent to the operating system to write to the WAL on disk on the primary, but
  will not wait for the operating system to actually write it. This can cause
  a small amount of data loss if the server crashes when some data has not been
  written, but it will not result in data corruption. Turning
  `synchronous_commit` off is a well known PostgreSQL optimization for
  workloads that can withstand some data loss in the event of a system
  crash.
* `local` - Enforces `on` behavior only on the primary server.
* `remote_write` - The database will return "success" to a client when the
  WAL record has been sent to the operating system for writing to the WAL on
  the replicas, but before confirmation that the record has actually been
  persisted to disk. This is basically asynchronous commit except it waits
  for the replicas as well as the primary. In practice, the extra wait time
  incurred waiting for the replicas significantly decreases replication lag.
* `remote_apply` - Requires confirmation that the WAL records have been
  written to the WAL *and* applied to the databases on all replicas.  This
  provides the strongest consistency of any of the `synchronous_commit`
  options. In this mode, replicas will always reflect the latest state of
  the primary, and the concept of replication lag (see [Replication
  Diagnostics](#view-replication-diagnostics)) is basically non-existent.

This matrix visualizes the level of consistency each mode provides:

Mode | WAL Sent to OS (Primary) | WAL Persisted (Primary) | WAL Sent to OS (Primary + Replicas) | WAL Persisted (Primary + Replicas) | Transaction Applied (Primary + Replicas)
--- | --- | --- | --- | --- | ---
Off | X | | | |
Local | X | X | | |
Remote Write | X | X | X | |
On | X | X | X | X |
Remote Apply | X | X | X | X | X

An important complementary setting to `synchronous_commit` is
`synchronous_standby_names`. This setting lists the names of all replicas the
primary database will support for synchronous replication, and configures *how*
the primary database will wait for them. The setting supports several
different formats:

* `FIRST num_sync (replica_name_1, replica_name_2)` - This will wait for
  confirmation from the first `num_sync` replicas before returning
  "success". The list of replica_names determines the relative priority of
  the replicas. Replica names are determined by the `application_name`
  setting on the replicas.
* `ANY num_sync (replica_name_1, replica_name_2)`  - This will wait for
  confirmation from `num_sync` replicas in the provided list, regardless of
  their priority/position in the list.  This is essentially a quorum
  function.

<highlight type="warning">
Any synchronous replication mode will force the primary to wait until all
required replicas have written the WAL or applied the database transaction,
depending on the `synchronous_commit` level. This could cause the
primary to hang indefinitely if a required replica crashes. When the replica
reconnects, it will replay any of the WAL it needs to catch up. Only then will
the primary be able to resume writes. To mitigate this, provision more than the
amount of nodes required under the `synchronous_standby_names` setting and list
them in the `FIRST` or `ANY` clauses. This will allow the primary to move
forward as long as a quorum of replicas have written the most recent WAL
transaction. Replicas that were out of service will be able to reconnect and
replay the missed WAL transactions asynchronously.
</highlight>

## View replication diagnostics [](view-replication-diagnostics)

PostgreSQL provides a valuable view for getting information about each replica
-- [pg_stat_replication][postgres-pg-stat-replication-docs].  Run `select * from
pg_stat_replication;` from the primary database to view this data. The output
looks like this:

```sql
-[ RECORD 1 ]----+------------------------------
pid              | 52343
usesysid         | 16384
usename          | repuser
application_name | r2
client_addr      | 10.0.13.6
client_hostname  |
client_port      | 59610
backend_start    | 2018-02-07 19:07:15.261213+00
backend_xmin     |
state            | streaming
sent_lsn         | 16B/43DB36A8
write_lsn        | 16B/43DB36A8
flush_lsn        | 16B/43DB36A8
replay_lsn       | 16B/43107C28
write_lag        | 00:00:00.009966
flush_lag        | 00:00:00.03208
replay_lag       | 00:00:00.43537
sync_priority    | 2
sync_state       | sync
-[ RECORD 2 ]----+------------------------------
pid              | 54498
usesysid         | 16384
usename          | repuser
application_name | r1
client_addr      | 10.0.13.5
client_hostname  |
client_port      | 43402
backend_start    | 2018-02-07 19:45:41.410929+00
backend_xmin     |
state            | streaming
sent_lsn         | 16B/43DB36A8
write_lsn        | 16B/43DB36A8
flush_lsn        | 16B/43DB36A8
replay_lsn       | 16B/42C3B9C8
write_lag        | 00:00:00.019736
flush_lag        | 00:00:00.044073
replay_lag       | 00:00:00.644004
sync_priority    | 1
sync_state       | sync
```

This view is particularly useful for calculating replication lag, which
measures how far behind the primary the current state of the replica is. The
`replay_lag` field gives a measure of the seconds between the most recent WAL
transaction on the primary and the last reported database commit on the replica.
Coupled with `write_lag` and `flush_lag`, this provides insight into how far
behind the replica is. The `*_lsn` fields also come in handy, allowing you to
compare WAL locations between the primary and the replicas.  Finally, the
`state` field is useful for determining exactly what each replica is currently
doing (available modes are `startup`, `catchup`, `streaming`, `backup`, and
`stopping`).

## Failover

PostgreSQL offers failover functionality (i.e., promoting the replica to the
primary in the event of a failure on the primary) through [pg_ctl][pgctl-docs]
or the `trigger_file`, but it does not provide out-of-the-box support for
automatic failover.  Read more in the PostgreSQL [failover
documentation][failover-docs]). [patroni][patroni-github] offers a configurable
high availability solution with automatic failover functionality.

[postgres-streaming-replication-docs]: https://www.postgresql.org/docs/current/static/warm-standby.html#STREAMING-REPLICATION
[postgres-partition-limitations]: https://www.postgresql.org/docs/10/static/logical-replication-restrictions.html
[postgres-logrep-docs]: https://www.postgresql.org/docs/current/static/logical-replication.html
[timescale-docker]: https://github.com/timescale/timescaledb-docker
[docker-postgres-scripts]: https://docs.docker.com/samples/library/postgres/#how-to-extend-this-image
[timescale-streamrep-docker]: https://github.com/timescale/streaming-replication-docker
[postgres-rslots-docs]: https://www.postgresql.org/docs/current/static/warm-standby.html#STREAMING-REPLICATION-SLOTS
[postgres-archive-docs]: https://www.postgresql.org/docs/current/static/continuous-archiving.html
[postgres-wal-docs]: https://www.postgresql.org/docs/current/static/wal-intro.html
[postgres-synchronous-commit-docs]: https://www.postgresql.org/docs/current/runtime-config-wal.html#GUC-SYNCHRONOUS-COMMIT
[postgres-scram-docs]: https://www.postgresql.org/docs/current/static/sasl-authentication.html#SASL-SCRAM-SHA-256
[hba-docs]: https://www.postgresql.org/docs/current/static/auth-pg-hba-conf.html
[postgres-pgpass-docs]: https://www.postgresql.org/docs/current/static/libpq-pgpass.html
[postgres-recovery-docs]: https://www.postgresql.org/docs/current/static/recovery-config.html
[postgres-pgpass-docs]: https://www.postgresql.org/docs/current/static/libpq-pgpass.html
[timescale-setup-docs]: /how-to-guides/install-timescaledb/post-install-setup/
[postgres-pg-stat-replication-docs]: https://www.postgresql.org/docs/10/static/monitoring-stats.html#PG-STAT-REPLICATION-VIEW
[pgctl-docs]: https://www.postgresql.org/docs/current/static/app-pg-ctl.html
[failover-docs]: https://www.postgresql.org/docs/current/static/warm-standby-failover.html
[patroni-github]: https://github.com/zalando/patroni
