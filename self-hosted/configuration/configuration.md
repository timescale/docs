---
title: Configuring TimescaleDB
excerpt: How to configure a TimescaleDB instance
products: [self_hosted]
keywords: [configuration]
tags: [settings]
---

# Configuring TimescaleDB

TimescaleDB works with the default PostgreSQL server configuration settings.
However, we find that these settings are typically too conservative and
can be limiting when using larger servers with more resources (CPU, memory,
disk, etc). Adjusting these settings, either
[automatically with our tool `timescaledb-tune`][tstune] or manually editing
your machine's `postgresql.conf`, can improve performance.

<Highlight type="tip">
You can determine the location of `postgresql.conf` by running
`SHOW config_file;` from your PostgreSQL client (for example, `psql`).
</Highlight>

In addition, other TimescaleDB specific settings can be modified through the
`postgresql.conf` file as covered in the [TimescaleDB settings][ts-settings] section.

## Using `timescaledb-tune`

To streamline the configuration process, use [`timescaledb-tune`][tstune] that
handles setting the most common parameters to appropriate values based on your
system, accounting for memory, CPU, and PostgreSQL version. `timescaledb-tune`
is packaged along with the binary releases as a dependency, so if you installed
one of the binary releases (including Docker), you should have access to the
tool. Alternatively, with a standard Go environment, you can also `go get` the
repository to install it.

`timescaledb-tune` reads your system's `postgresql.conf` file and offers
interactive suggestions for updating your settings:

```bash
Using postgresql.conf at this path:
/usr/local/var/postgres/postgresql.conf

Is this correct? [(y)es/(n)o]: y
Writing backup to:
/var/folders/cr/zpgdkv194vz1g5smxl_5tggm0000gn/T/timescaledb_tune.backup201901071520

shared_preload_libraries needs to be updated
Current:
#shared_preload_libraries = 'timescaledb'
Recommended:
shared_preload_libraries = 'timescaledb'
Is this okay? [(y)es/(n)o]: y
success: shared_preload_libraries will be updated

Tune memory/parallelism/WAL and other settings? [(y)es/(n)o]: y
Recommendations based on 8.00 GB of available memory and 4 CPUs for PostgreSQL 11

Memory settings recommendations
Current:
shared_buffers = 128MB
#effective_cache_size = 4GB
#maintenance_work_mem = 64MB
#work_mem = 4MB
Recommended:
shared_buffers = 2GB
effective_cache_size = 6GB
maintenance_work_mem = 1GB
work_mem = 26214kB
Is this okay? [(y)es/(s)kip/(q)uit]:
```

These changes are then written to your `postgresql.conf` and take effect
on the next (re)start. If you are starting on fresh instance and don't feel
the need to approve each group of changes, you can also automatically accept
and append the suggestions to the end of your `postgresql.conf` like so:

```bash
timescaledb-tune --quiet --yes --dry-run >> /path/to/postgresql.conf
```

## PostgreSQL configuration and tuning

If you prefer to tune the settings yourself, or are curious about the
suggestions that `timescaledb-tune` makes, then check these. However,
`timescaledb-tune` does not cover all settings that you need to adjust.

### Memory settings

<Highlight type="tip">
All of these settings are handled by `timescaledb-tune`.
</Highlight>
The settings `shared_buffers`, `effective_cache_size`, `work_mem`, and
`maintenance_work_mem` need to be adjusted to match the machine's available
memory. Get the configuration values from the [PgTune][pgtune]
website (suggested DB Type: Data warehouse). You should also adjust the
`max_connections` setting to match the ones given by PgTune since there is a
connection between `max_connections` and memory settings. Other settings from
PgTune may also be helpful.

### Worker settings

<Highlight type="tip">
All of these settings are handled by `timescaledb-tune`.
</Highlight>
PostgreSQL utilizes worker pools to provide the required workers needed to
support both live queries and background jobs. If you do not configure these
settings, you may observe performance degradation on both queries and
background jobs.

TimescaleDB background workers are configured using the
`timescaledb.max_background_workers` setting. You should configure this
setting to the sum of your total number of databases and the
total number of concurrent background workers you want running at any given
point in time. You need a background worker allocated to each database to run
a lightweight scheduler that schedules jobs. On top of that, any additional
workers you allocate here run background jobs when needed.

For larger queries, PostgreSQL automatically uses parallel workers if
they are available. To configure this use the `max_parallel_workers` setting.
Increasing this setting improves query performance for
larger queries. Smaller queries may not trigger parallel workers. By default,
this setting corresponds to the number of CPUs available. Use the `--cpus` flag
or the `TS_TUNE_NUM_CPUS` docker environment variable to change it.

Finally, you must configure `max_worker_processes` to be at least the sum of
`timescaledb.max_background_workers` and `max_parallel_workers`.
`max_worker_processes` is the total pool of workers available to both
background and parallel workers (as well as a handful of built-in PostgreSQL
workers).

By default, `timescaledb-tune` sets `timescaledb.max_background_workers` to 16.
In order to change this setting, use the `--max-bg-workers` flag or the
`TS_TUNE_MAX_BG_WORKERS` docker environment variable. The `max_worker_processes`
setting is automatically adjusted as well.

### Disk-write settings

In order to increase write throughput, there are
[multiple settings][async-commit] to adjust the behavior that PostgreSQL uses
to write data to disk. In tests, performance is good with the default, or safest,
settings. If you want a bit of additional performance, you can set
`synchronous_commit = 'off'`([PostgreSQL docs][synchronous-commit]).
Please note that when disabling
`synchronous_commit` in this way, an operating system or database crash might
result in some recent allegedly committed transactions being lost. We actively
discourage changing the `fsync` setting.

### Lock settings

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
max_locks_per_transaction = 2 * num_chunks / max_connections
```
where `num_chunks` is the maximum number of chunks you expect to have in a
hypertable and `max_connections` is the number of connections configured for
PostgreSQL.
This takes into account that the number of locks used by a hypertable query is
roughly equal to the number of chunks in the hypertable if you need to access
all chunks in a query, or double that number if the query uses an index.
You can see how many chunks you currently have using the
[`timescaledb_information.hypertables`][timescaledb_information-hypertables] view.
Changing this parameter requires a database restart, so make sure you pick a larger
number to allow for some growth.  For more information about lock management,
see the [PostgreSQL documentation][lock-management].

## TimescaleDB configuration and tuning

Just as you can tune settings in PostgreSQL, TimescaleDB provides a number of
configuration settings that may be useful to your specific installation and
performance needs. These can also be set within the `postgresql.conf` file or as
command-line parameters when starting PostgreSQL.

### Policies

#### `timescaledb.max_background_workers (int)`

Max background worker processes allocated to TimescaleDB. Set to at
least 1 + number of databases in Postgres instance to use background
workers. Default value is 8.

### `timescaledb.bgw_scheduler_restart_time (int)`

Scheduler restart time in seconds. If the scheduler encounters an
error, it exits with an error code and restart after
`timescaledb.bgw_scheduler_restart_time` seconds. Default value is 30
seconds. You can set this to a value between 1 and 3600 seconds.

### Distributed hypertables

#### `timescaledb.hypertable_distributed_default (enum)`

Set default policy to create local or distributed hypertables for
`create_hypertable()` command, when the `distributed` argument is not provided.
Supported values are `auto`, `local` or `distributed`.

#### `timescaledb.hypertable_replication_factor_default (int)`

Global default value for replication factor to use with hypertables
when the `replication_factor` argument is not provided. Defaults to 1.

#### `timescaledb.enable_2pc (bool)`

Enables two-phase commit for distributed hypertables. If disabled, it
uses a one-phase commit instead, which is faster but can result in
inconsistent data. It is by default enabled.

#### `timescaledb.enable_per_data_node_queries (bool)`

If enabled, TimescaleDB combines different chunks belonging to the
same hypertable into a single query per data node. It is by default enabled.

#### `timescaledb.max_insert_batch_size (int)`

When acting as a access node, TimescaleDB splits batches of inserted
tuples across multiple data nodes. It batches up to
`max_insert_batch_size` tuples per data node before flushing. Setting
this to 0 disables batching, reverting to tuple-by-tuple inserts. The
default value is 1000.

#### `timescaledb.enable_connection_binary_data (bool)`

Enables binary format for data exchanged between nodes in the
cluster. It is by default enabled.

#### `timescaledb.enable_client_ddl_on_data_nodes (bool)`

Enables DDL operations on data nodes by a client and do not restrict
execution of DDL operations only by access node. It is by default disabled.

#### `timescaledb.enable_async_append (bool)`

Enables optimization that runs remote queries asynchronously across
data nodes. It is by default enabled.

#### `timescaledb.enable_remote_explain (bool)`

Enable getting and showing `EXPLAIN` output from remote nodes. This
requires sending the query to the data node, so it can be affected
by the network connection and availability of data nodes. It is by default disabled.

#### `timescaledb.remote_data_fetcher (enum)`

Pick data fetcher type based on type of queries you plan to run, which
can be either `rowbyrow` or `cursor`. The default is `rowbyrow`.

#### `timescaledb.ssl_dir (string)`

Specifies the path used to search user certificates and keys when
connecting to data nodes using certificate authentication. Defaults to
`timescaledb/certs` under the PostgreSQL data directory.

#### `timescaledb.passfile (string)`

Specifies the name of the file where passwords are stored and when
connecting to data nodes using password authentication.

### Administration

#### `timescaledb.restoring (bool)`

Set TimescaleDB in restoring mode. It is by default disabled.

#### `timescaledb.license (string)`

TimescaleDB license type. Determines which features are enabled. The
variable can be set to `timescale` or `apache`.  Defaults to `timescale`.

#### `timescaledb.telemetry_level (enum)`

Telemetry settings level. Level used to determine which telemetry to
send. Can be set to `off` or `basic`. Defaults to `basic`.

#### `timescaledb.last_tuned (string)`

Records last time `timescaledb-tune` ran.

#### `timescaledb.last_tuned_version (string)`

Version of `timescaledb-tune` used to tune when it ran.

## Changing configuration with Docker

When running TimescaleDB in a [Docker container][docker], there are
two approaches to modifying your PostgreSQL configuration. In the
following example, we modify the size of the database instance's
write-ahead-log (WAL) from 1&nbsp;GB to 2&nbsp;GB in a Docker container named
`timescaledb`.

#### Modifying postgres.conf inside Docker

1.  Open a shell in Docker to change the configuration on a running
    container.

```bash
docker start timescaledb
docker exec -i -t timescaledb /bin/bash
```

1.  Edit and then save the config file, modifying the setting for the desired
    configuration parameter (for example, `max_wal_size`).

```bash
vi /var/lib/postgresql/data/postgresql.conf
```

1.  Restart the container so the config gets reloaded.

```bash
docker restart timescaledb
```

1.  Test to see if the change worked.

```bash
    docker exec -it timescaledb psql -U postgres

    postgres=# show max_wal_size;
     max_wal_size
    --------------
    2GB
```

#### Specify configuration parameters as boot options

Alternatively, one or more parameters can be passed in to the `docker run`
command via a `-c` option, as in the following.

```bash
docker run -i -t timescale/timescaledb:latest-pg10 postgres -cmax_wal_size=2GB
```

Additional examples of passing in arguments at boot can be found in our
[discussion about using WAL-E][wale] for incremental backup.

[async-commit]: https://www.postgresql.org/docs/current/static/wal-async-commit.html
[chunks_detailed_size]: /api/:currentVersion:/hypertable/chunks_detailed_size
[docker]: /self-hosted/latest/install/installation-docker/
[lock-management]: https://www.postgresql.org/docs/current/static/runtime-config-locks.html
[pgtune]: http://pgtune.leopard.in.ua/
[synchronous-commit]: https://www.postgresql.org/docs/current/static/runtime-config-wal.html#GUC-SYNCHRONOUS-COMMIT
[ts-settings]: /self-hosted/:currentVersion:/configuration/timescaledb-config/
[tstune]: https://github.com/timescale/timescaledb-tune
[wale]: /self-hosted/:currentVersion:/backup-and-restore/docker-and-wale/
