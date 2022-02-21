# Configure Replication
This section outlines how to set up streaming replication on one or more
database replicas, covering both synchronous and asynchronous options.

Before you begin, make sure you have at least two separate instances of
TimescaleDB running.

If you installed TimescaleDB using a Docker container, use a
[PostgreSQL entry point script][docker-postgres-scripts] to run the
configuration. For sample Docker configuration and run scripts, see the
[streaming replication Docker repository][timescale-streamrep-docker].

To configure replication on self-hosted TimescaleDB, you need to perform these
procedures:
1.   [Configure the primary database][configure-primary-db]
1.   [Configure replication parameters][configure-params]
1.   [Create replication slots][create-replication-slots]
1.   [Configure host-based authentication parameters][configure-pghba]
1.   [Create a base backup on the replica][create-base-backup]
1.   Replication and recovery settings
1.   Configure replication modes
1.   View replication diagnostics

## Configure the primary database
To configure the primary database, you need a PostgreSQL user with a role that allows it to initialize streaming replication. This is the user each replica uses to stream from the primary database.

<procedure>

### Configuring the primary database
1.  On the primary database, as a user with superuser priveleges, such as the
    `postgres` user, set the password encryption level to `scram-sha-256`:
    ```sql
    SET password_encryption = 'scram-sha-256';
    ```
1.  Create a new user called `repuser`:
    ```sql
    CREATE ROLE repuser WITH REPLICATION PASSWORD '<PASSWORD>' LOGIN;
    ```

<highlight type="important">
The [scram-sha-256](https://www.postgresql.org/docs/current/static/sasl-authentication.html#SASL-SCRAM-SHA-256) encryption level is the most secure
password based authentication available in PostgreSQL. It is only available in PostgreSQL 10 and later.
</highlight>

</procedure>

## Configure replication parameters
There are several replication settings that need to be added or edited to the
`postgresql.conf` configuration file.

<procedure>

### Configuring replication parameters
1.  Set the `synchronous_commit` parameter to `off`.
1.  Set the `max_wal_senders` parameter to the total number of concurrent
    connections from replicas or backup clients. As a minimum, this should equal
    the number of replicas you intend to have.
1.  Set the `wal_level` parameter to the amount of information written to the
    PostgreSQL Write-Ahead Log (WAL). For replication to work, there needs to be enough data in the WAL to support archiving and replication. The default
    value is usually appropriate.
1.  Set the `max_replication_slots` parameter to the total number of replication
    slots the primary database can support.
1.  Set the `listen_address` parameter to the address of the primary database.
    Do not leave this parameter as the local loopback address, because the
    remote replicas must be able to connect to the primary to stream the WAL.
1.  Restart PostgreSQL to pick up the changes. This must be done before you
    create replication slots.

</procedure>

The most common streaming replication use case is asynchronous replication with
one or more replicas. In this example, the WAL is streamed to the replica, but
the primary server does not wait for confirmation that the WAL has been written
to disk on either the primary or the replica. This is the most performant
replication configuration, but it does carry the risk of a small amount of data
loss in the event of a system crash. It also makes no guarantees that the
replica is fully up to date with the primary, which could cause inconsistencies
between read queries on the primary and the replica. The example configuration
for this use case:
```yaml
listen_addresses = '*'
wal_level = replica
max_wal_senders = 1
max_replication_slots = 1
synchronous_commit = off
```

If you need stronger consistency on the replicas, or if your query load is heavy
enough to cause significant lag between the primary and replica nodes in
asynchronous mode, consider a synchronous replication configuration instead.

## Create replication slots
When you have configured `postgresql.conf` and restarted PostgreSQL, you can
create a [replication slot][postgres-rslots-docs] for each replica. Replication
slots ensure that the primary does not delete segments from the WAL until they
have been received by the replicas. This is important in case a replica goes
down for an extended time. The primary needs to verify that a WAL segment has
been consumed by a replica, so that it can safely delete data. You can use
[archiving][postgres-archive-docs] for this purpose, but replication slots
provide the strongest protection for streaming replication.

<procedure>

### Creating replication slots
1.  At the `psql` slot, create the first replication slot. The name of the slot
    is arbitrary, in this example, it id called `replica_1_slot`:
    ```sql
    SELECT * FROM pg_create_physical_replication_slot('replica_1_slot');
    ```
1.  Repeat for each required replication slot.

</procedure>

## Configure host-based authentication parameters
There are several replication settings that need to be added or edited to the
`pg_hba.conf` configuration file. In this example, the settings restrict
replication connections to traffic coming from `REPLICATION_HOST_IP` as the
PostgreSQL user `repuser` with a valid password. `REPLICATION_HOST_IP` can
initiate streaming replication from that machine without additional credentials.
You can change the `address` and `method` values to match your security and
network settings.

For more information about `pg_hba.conf`, see the
[`pg_hba` documentation][pg-hba-docs].

<procedure>

### Configuring host-based authentication parameters
1.  Open the `pg_hba.conf` configuration file and add or edit this line:
    ```yaml
    TYPE  DATABASE    USER    ADDRESS METHOD            AUTH_METHOD
    host  replication repuser <REPLICATION_HOST_IP>/32  scram-sha-256
    ```
1.  Restart PostgreSQL to pick up the changes.

</procedure>

## Create a base backup on the replica
Replicas work by streaming the primary server's WAL log and replaying its
transactions in PostgreSQL recovery mode. To do this, the replica needs to be in
a state where it can replay the log. You can do this by restoring the replica
from a base backup of the primary instance.

<procedure>
## Creating a base backup on the replica
1.  Stop PostgreSQL services.
1.  If the replica database already contains data, delete it before you run the
    backup, by removing the PostgreSQL data directory:
    ```bash
    rm -rf <DATA_DIRECTORY>/*
    ```
    If you don't know the location of the data directory, find it with the
    `show data_directory;` command.
1.  Restore from the base backup, using the IP address of the primary database
    and the replication username:
    ```bash
    pg_basebackup -h <PRIMARY_IP> \
    -D <DATA_DIRECTORY> \
    -U repuser -vP -W
    ```
    The -W flag prompts you for a password. If you are using this command in an
    automated setup, you might need to use a [pgpass file][pgpass-file].
1.  When the backup is complete, create a
    [recovery.conf][postgres-recovery-docs] file in your data directory,
    and set the appropriate permissions. When PostgreSQL finds a `recovery.conf`
    file in its data directory, it starts in recovery mode and streams the WAL through the replication protocol:
    ```bash
    touch <DATA_DIRECTORY>/recovery.conf
    chmod 0600 <DATA_DIRECTORY>/recovery.conf
    ```
</procedure>

<!--- Lana, you're up to here! --LKB 20220221-->

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

Any clients can perform reads on the replica. Verify this
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

* `on` - Default value. The server does not return "success" until the WAL
  transaction has been written to disk on the primary and any replicas.
* `off` - The server returns "success" when the WAL transaction has been
  sent to the operating system to write to the WAL on disk on the primary, but
  does not wait for the operating system to actually write it. This can cause
  a small amount of data loss if the server crashes when some data has not been
  written, but it does not result in data corruption. Turning
  `synchronous_commit` off is a well known PostgreSQL optimization for
  workloads that can withstand some data loss in the event of a system
  crash.
* `local` - Enforces `on` behavior only on the primary server.
* `remote_write` - The database returns "success" to a client when the
  WAL record has been sent to the operating system for writing to the WAL on
  the replicas, but before confirmation that the record has actually been
  persisted to disk. This is basically asynchronous commit except it waits
  for the replicas as well as the primary. In practice, the extra wait time
  incurred waiting for the replicas significantly decreases replication lag.
* `remote_apply` - Requires confirmation that the WAL records have been
  written to the WAL *and* applied to the databases on all replicas. This
  provides the strongest consistency of any of the `synchronous_commit`
  options. In this mode, replicas always reflect the latest state of
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
primary database supports for synchronous replication, and configures *how*
the primary database waits for them. The setting supports several
different formats:

* `FIRST num_sync (replica_name_1, replica_name_2)` - This waits for
  confirmation from the first `num_sync` replicas before returning
  "success". The list of replica_names determines the relative priority of
  the replicas. Replica names are determined by the `application_name`
  setting on the replicas.
* `ANY num_sync (replica_name_1, replica_name_2)`  - This waits for
  confirmation from `num_sync` replicas in the provided list, regardless of
  their priority/position in the list. This is essentially a quorum
  function.

<highlight type="warning">
Any synchronous replication mode forces the primary to wait until all
required replicas have written the WAL or applied the database transaction,
depending on the `synchronous_commit` level. This could cause the
primary to hang indefinitely if a required replica crashes. When the replica
reconnects, it replays any of the WAL it needs to catch up. Only then does
the primary be able to resume writes. To mitigate this, provision more than the
amount of nodes required under the `synchronous_standby_names` setting and list
them in the `FIRST` or `ANY` clauses. This allows the primary to move
forward as long as a quorum of replicas have written the most recent WAL
transaction. Replicas that were out of service is able to reconnect and
replay the missed WAL transactions asynchronously.
</highlight>

## View replication diagnostics [](view-replication-diagnostics)
PostgreSQL provides a valuable view for getting information about each replica
-- [pg_stat_replication][postgres-pg-stat-replication-docs]. Run `select * from
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
compare WAL locations between the primary and the replicas. Finally, the
`state` field is useful for determining exactly what each replica is currently
doing (available modes are `startup`, `catchup`, `streaming`, `backup`, and
`stopping`).

## Failover
PostgreSQL offers failover functionality (i.e., promoting the replica to the
primary in the event of a failure on the primary) through [pg_ctl][pgctl-docs]
or the `trigger_file`, but it does not provide out-of-the-box support for
automatic failover. Read more in the PostgreSQL [failover
documentation][failover-docs]). [patroni][patroni-github] offers a configurable
high availability solution with automatic failover functionality.

[postgres-streaming-replication-docs]: https://www.postgresql.org/docs/current/static/warm-standby.html#STREAMING-REPLICATION
[postgres-partition-limitations]: https://www.postgresql.org/docs/current/static/logical-replication-restrictions.html
[postgres-logrep-docs]: https://www.postgresql.org/docs/current/static/logical-replication.html
[timescale-docker]: https://github.com/timescale/timescaledb-docker
[docker-postgres-scripts]: https://docs.docker.com/samples/library/postgres/#how-to-extend-this-image
[timescale-streamrep-docker]: https://github.com/timescale/streaming-replication-docker
[postgres-rslots-docs]: https://www.postgresql.org/docs/current/static/warm-standby.html#STREAMING-REPLICATION-SLOTS
[postgres-archive-docs]: https://www.postgresql.org/docs/current/static/continuous-archiving.html
[postgres-synchronous-commit-docs]: https://www.postgresql.org/docs/current/runtime-config-wal.html#GUC-SYNCHRONOUS-COMMIT
[postgres-recovery-docs]: https://www.postgresql.org/docs/current/static/recovery-config.html
[timescale-setup-docs]: /install/latest/
[postgres-pg-stat-replication-docs]: https://www.postgresql.org/docs/10/static/monitoring-stats.html#PG-STAT-REPLICATION-VIEW
[pgctl-docs]: https://www.postgresql.org/docs/current/static/app-pg-ctl.html
[failover-docs]: https://www.postgresql.org/docs/current/static/warm-standby-failover.html
[patroni-github]: https://github.com/zalando/patroni
[pg-hba-docs]: https://www.postgresql.org/docs/current/static/auth-pg-hba-conf.html
[pgpass-file]: https://www.postgresql.org/docs/current/static/libpq-pgpass.html

[configure-primary-db]: /how-to-guides/replication-and-ha/configure-replication#configure-the-primary-database
[configure-params]: /how-to-guides/replication-and-ha/configure-replication#configure-replication-parameters
[create-replication-slots]: /how-to-guides/replication-and-ha/configure-replication#create-replication-slots
[configure-pghba]: /how-to-guides/replication-and-ha/configure-replication#configure-host-based-authentication-parameters
[create-base-backup]: /how-to-guides/replication-and-ha/configure-replication#create-a-base-backup-on-the-replica
