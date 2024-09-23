---
title: About configuration in TimescaleDB
excerpt: About the TimescaleDB configurations
products: [self_hosted]
keywords: [configuration, memory, workers, settings]
---

# About configuration in TimescaleDB

By default, TimescaleDB uses the default PostgreSQL server configuration
settings. However, in some cases, these settings are not appropriate, especially
if you have larger servers that use more hardware resources such as CPU, memory,
and storage. This section explains some of the settings you are most likely to
need to adjust.

Some of these settings are PostgreSQL settings, and some are TimescaleDB
specific settings. For most changes, you can use the [tuning tool][tstune-conf]
to adjust your configuration. For more advanced configuration settings, or to
change settings that aren't included in the `timescaledb-tune` tool, you can
[manually adjust][postgresql-conf] the  `postgresql.conf` configuration file.

## Memory

Settings:

*   `shared_buffers`
*   `effective_cache_size`
*   `work_mem`
*   `maintenance_work_mem`
*   `max_connections`

You can adjust each of these to match the machine's available memory. To make it
easier, you can use the [PgTune][pgtune] site to work out what settings to use:
enter your machine details, and select the `data warehouse` DB type to see the
suggested parameters.

<Highlight type="tip">
You can adjust these settings with `timescaledb-tune`.
</Highlight>

## Workers

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
number of concurrent background workers you want running at any one time. By
default, `timescaledb-tune` sets `timescaledb.max_background_workers` to 16.
You can change this setting directly, use the `--max-bg-workers` flag, or adjust
the `TS_TUNE_MAX_BG_WORKERS`
[Docker environment variable][docker-conf].

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
`timescaledb.max_background_workers` and `max_parallel_workers`.

<Highlight type="tip">
You can adjust these settings with `timescaledb-tune`.
</Highlight>

## Disk writes

Settings:

*   `synchronous_commit`

By default, disk writes are performed synchronously, so each transaction must be
completed and a success message sent, before the next transaction can begin. You
can change this to asynchronous to increase write throughput by setting
`synchronous_commit = 'off'`. Note that disabling synchronous commits could
result in some committed transactions being lost. To help reduce the risk, do
not also change `fsync` setting. For more information about asynchronous commits
and disk write speed, see the [PostgreSQL documentation][async-commit].

<Highlight type="tip">
You can adjust these settings in the `postgresql.conf` configuration
file.
</Highlight>

## Transaction locks

Settings:

*   `max_locks_per_transaction`

TimescaleDB relies on table partitioning to scale time-series workloads. A
hypertable needs to acquire locks on many chunks during queries, which can
exhaust the default limits for the number of allowed locks held. In some cases,
you might see a warning like this:

```sql
psql: FATAL:  out of shared memory
HINT:  You might need to increase max_locks_per_transaction.
```

To avoid this issue, you can increase the `max_locks_per_transaction` setting
from the default value, which is usually 64. This parameter limits the average
number of object locks used by each transaction; individual transactions can lock
more objects as long as the locks of all transactions fit in the lock table.

For most workloads, choose a number equal to double the maximum number of chunks
you expect to have in a hypertable divided by `max_connections`.
This takes into account that the number of locks used by a hypertable query is
roughly equal to the number of chunks in the hypertable if you need to access
all chunks in a query, or double that number if the query uses an index.
You can see how many chunks you currently have using the
[`timescaledb_information.hypertables`][timescaledb_information-hypertables] view.
Changing this parameter requires a database restart, so make sure you pick a larger
number to allow for some growth.  For more information about lock management,
see the [PostgreSQL documentation][lock-management].

<Highlight type="tip">
You can adjust these settings in the `postgresql.conf` configuration
file.
</Highlight>

[async-commit]: https://www.postgresql.org/docs/current/static/wal-async-commit.html
[timescaledb_information-hypertables]: /api/:currentVersion:/informational-views/hypertables
[docker-conf]: /self-hosted/:currentVersion:/configuration/docker-config
[lock-management]: https://www.postgresql.org/docs/current/static/runtime-config-locks.html
[pgtune]: http://pgtune.leopard.in.ua/
[postgresql-conf]: /self-hosted/:currentVersion:/configuration/postgres-config
[tstune-conf]: /self-hosted/:currentVersion:/configuration/timescaledb-tune
