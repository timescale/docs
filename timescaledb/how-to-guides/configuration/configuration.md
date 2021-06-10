# Configuration
By default, TimescaleDB uses the default PostgreSQL server configuration
settings. However, in some cases, these settings are not appropriate, especially
if you have larger servers that use more hardware resources such as CPU, memory,
and storage. This section explains some of the settings you are most likely to
need to adjust.

For most parameters, you can use our [tuning tool][tstune-conf] to adjust your
configuration. For more advanced configuration settings, or to change parameters
that aren't included in the `timescaledb-tune` tool, you
can [manually adjust][postgresql-conf] the  `postgresql.conf` configuration
file.

## Memory settings [](memory)
Settings:
*   `shared_buffers`
*   `effective_cache_size`
*   `work_mem`
*   `maintenance_work_mem`
*   `max_connections`

You can adjust each of these to match the machine's available memory. To make it
easier, you can use the [PgTune][pgtune] site to work out what settings to use:
enter your machine details, and select the `data warehouse` DB type to see the
suggested parameters.  (suggested DB Type: Data warehouse).

<highlight type="tip">
You can adjust all of these settings with `timescaledb-tune`.
</highlight>

## Worker settings [](workers)
Settings:
*   `timescaledb.max_background_workers`
*   `max_parallel_workers`
*   `max_worker_processes`

PostgreSQL uses worker pools to provide workers for live queries and background
jobs. If you do not configure these settings, your queries and background jobs
could run more slowly.

TimescaleDB background workers are configured with
`timescaledb.max_background_workers`. Each database needs a background worker
allocated to schedule jobs. Additional workers run background jobs as required.
This setting should be the sum of the total number of databases and the total
number of concurrent background workers you want running at any one time. By default, `timescaledb-tune` sets `timescaledb.max_background_workers` to 8. You can change this setting directly, use the `--max-bg-workers` flag, or adjust the `TS_TUNE_MAX_BG_WORKERS` [Docker environment variable][docker-conf].

TimescaleDB parallel workers are configured with `max_parallel_workers`. For
larger queries, PostgreSQL automatically uses parallel workers if they are
available. Increasing this setting can improve query performance for large
queries that trigger the use of parallel workers. By default, this setting
corresponds to the number of CPUs available. You can change this parameter
directly, by adjusting the `--cpus` flag, or by using the `TS_TUNE_NUM_CPUS`
[Docker environment variable][docker-conf].

The `max_worker_processes` setting defines the total pool of workers available
to both background and parallel workers, as well a small number of built-in
PostgreSQL workers. It should be at least the sum of
`timescaledb.max_background_workers` and `max_parallel_workers`. When you adjust
`timescaledb.max_background_workers` or `max_parallel_workers`, the
`max_worker_processes` setting is automatically updated to the sum of those two
parameters.

<highlight type="tip">
You can adjust all of these settings with `timescaledb-tune`.
</highlight>

<!---
Lana, you're up to here! LKB 2021-06-10
-->

### Disk-write settings [](disk-write)

In order to increase write throughput, there are [multiple
settings][async-commit] to adjust the behavior that PostgreSQL uses to write
data to disk. We find the performance to be good with the default (safest)
settings. If you want a bit of additional performance, you can set
`synchronous_commit = 'off'`([PostgreSQL docs][synchronous-commit]).
Please note that when disabling
`synchronous_commit` in this way, an operating system or database crash might
result in some recent allegedly-committed transactions being lost. We actively
discourage changing the `fsync` setting.

### Lock settings [](locks)

TimescaleDB relies heavily on table partitioning for scaling
time-series workloads, which has implications for [lock
management][lock-management]. A hypertable needs to acquire locks on
many chunks (sub-tables) during queries, which can exhaust the default
limits for the number of allowed locks held. This might result in a
warning like the following:

```sql
psql: FATAL:  out of shared memory
HINT:  You might need to increase max_locks_per_transaction.
```

To avoid this issue, it is necessary to increase the
`max_locks_per_transaction` setting from the default value (which is
typically 64). Since changing this parameter requires a database
restart, it is advisable to estimate a good setting that also allows
some growth. For most use cases we recommend the following setting:

```
max_locks_per_transaction = 2 * num_chunks
```

where `num_chunks` is the maximum number of chunks you expect to have in a hypertable.
This setting takes into account that the number of locks taken by a hypertable query
is roughly equal to the
number of chunks in the hypertable, or double that number if the query
also uses an index. You can see how many chunks you currently have using the
[`chunk_detailed_size`][chunk_detailed_size] command.
 Also note that `max_locks_per_transaction` is not
an exact setting; it only controls the *average* number of object
locks allocated for each transaction. For more information, please
review the official PostgreSQL documentation on
[lock management][lock-management].


## TimescaleDB configuration and tuning [](timescaledb-config)

Just as you can tune settings in PostgreSQL, TimescaleDB provides a number of configuration
settings that may be useful to your specific installation and performance needs. These can
also be set within the `postgresql.conf` file or as command-line parameters
when starting PostgreSQL.

### Policies [](policies)

#### `timescaledb.max_background_workers (int)` [](max_background_workers)

Max background worker processes allocated to TimescaleDB.  Set to at
least 1 + number of databases in Postgres instance to use background
workers. Default value is 8.

### Distributed hypertables [](multinode)

#### `timescaledb.enable_2pc (bool)` [](enable_2pc)

Enables two-phase commit for distributed hypertables. If disabled, it
will use a one-phase commit instead, which is faster but can result in
inconsistent data. It is by default enabled.

#### `timescaledb.enable_per_data_node_queries (bool)` [](enable_per_data_node_queries)

If enabled, TimescaleDB will combine different chunks belonging to the
same hypertable into a single query per data node. It is by default enabled.

#### `timescaledb.max_insert_batch_size (int)` [](max_insert_batch_size)

When acting as a access node, TimescaleDB splits batches of inserted
tuples across multiple data nodes. It will batch up to
`max_insert_batch_size` tuples per data node before flushing. Setting
this to 0 disables batching, reverting to tuple-by-tuple inserts. The
default value is 1000.

#### `timescaledb.enable_connection_binary_data (bool)` [](enable_connection_binary_data)

Enables binary format for data exchanged between nodes in the
cluster. It is by default enabled.

#### `timescaledb.enable_client_ddl_on_data_nodes (bool)` [](enable_client_ddl_on_data_nodes)

Enables DDL operations on data nodes by a client and do not restrict
execution of DDL operations only by access node. It is by default disabled.

#### `timescaledb.enable_async_append (bool)` [](enable_async_append)

Enables optimization that runs remote queries asynchronously across
data nodes. It is by default enabled.

#### `timescaledb.enable_remote_explain (bool)` [](enable_remote_explain)

Enable getting and showing `EXPLAIN` output from remote nodes. This
will require sending the query to the data node, so it can be affected
by the network connection and availability of data nodes. It is by default disabled.

#### `timescaledb.remote_data_fetcher (enum)` [](remote_data_fetcher)

Pick data fetcher type based on type of queries you plan to run, which
can be either `rowbyrow` or `cursor`. The default is `rowbyrow`.

#### `timescaledb.ssl_dir (string)` [](ssl_dir)

Specifies the path used to search user certificates and keys when
connecting to data nodes using certificate authentication. Defaults to
`timescaledb/certs` under the PostgreSQL data directory.

#### `timescaledb.passfile (string)` [](passfile)

Specifies the name of the file where passwords are stored and when
connecting to data nodes using password authentication.

### Administration [](administration)

#### `timescaledb.restoring (bool)` [](restoring)

Set TimescaleDB in restoring mode. It is by default disabled.

#### `timescaledb.license (string)` [](license)

TimescaleDB license type. Determines which features are enabled. The
variable can be set to `timescale` or `apache`.  Defaults to `timescale`.

#### `timescaledb.telemetry_level (enum)` [](telemetry_level)

Telemetry settings level. Level used to determine which telemetry to
send. Can be set to `off` or `basic`. Defaults to `basic`.

#### `timescaledb.last_tuned (string)` [](last_tuned)

Records last time `timescaledb-tune` ran.

#### `timescaledb.last_tuned_version (string)` [](last_tuned_version)

Version of `timescaledb-tune` used to tune when it ran.



## Changing configuration with Docker [](docker-config)

When running TimescaleDB via a [Docker container][docker], there are
two approaches to modifying your PostgreSQL configuration.  In the
following example, we modify the size of the database instance's
write-ahead-log (WAL) from 1GB to 2GB in a Docker container named
`timescaledb`.

#### Modifying postgres.conf inside Docker

1. Get into a shell in Docker in order to change the configuration on a running container.
```
docker start timescaledb
docker exec -i -t timescaledb /bin/bash
```

2. Edit and then save the config file, modifying the setting for the desired configuration parameter (e.g., `max_wal_size`).
```
vi /var/lib/postgresql/data/postgresql.conf
```

3. Restart the container so the config gets reloaded.
```
docker restart timescaledb
```

4. Test to see if the change worked.
```
    docker exec -it timescaledb psql -U postgres

    postgres=# show max_wal_size;
     max_wal_size
    --------------
    2GB
```

#### Specify configuration parameters as boot options

Alternatively, one or more parameters can be passed in to the `docker run`
command via a `-c` option, as in the following.

```
docker run -i -t timescale/timescaledb:latest-pg10 postgres -cmax_wal_size=2GB
```

Additional examples of passing in arguments at boot can be found in our
[discussion about using WAL-E][wale] for incremental backup.

[tstune-conf]: /how-to-guides/configuration/timescaledb-tune
[postgresql-conf]: /how-to-guides/configuration/postgres-config
[docker-conf]: /how-to-guides/configuration/docker-config
[pgtune]: http://pgtune.leopard.in.ua/
[async-commit]: https://www.postgresql.org/docs/current/static/wal-async-commit.html
[synchronous-commit]: https://www.postgresql.org/docs/current/static/runtime-config-wal.html#GUC-SYNCHRONOUS-COMMIT
[lock-management]: https://www.postgresql.org/docs/current/static/runtime-config-locks.html
[docker]: /how-to-guides/install-timescaledb//docker/installation-docker
[wale]: /how-to-guides/backup-and-restore/docker-and-wale/
[chunk_detailed_size]: /api/:currentVersion:/hypertable/chunk_detailed_size
