---
title: Troubleshooting TimescaleDB
excerpt: Troubleshoot common problems that occur when using TimescaleDB
products: [self_hosted]
keywords: [troubleshooting]
---

import CloudMSTRestartWorkers from 'versionContent/_partials/_cloud-mst-restart-workers.mdx';

# Troubleshooting

If you run into problems when using TimescaleDB, there are a few things that you
can do. There are some solutions to common errors in this section as well as ways to
output diagnostic information about your setup. If you need more guidance, you
can join the community [Slack group][slack] or post an issue on the TimescaleDB
[GitHub][github].

## Common errors

### Error updating TimescaleDB when using a third-party PostgreSQL administration tool

The `ALTER EXTENSION timescaledb UPDATE` command must be the first
command executed upon connection to a database. Some administration tools
execute commands before this, which can disrupt the process. You might
need to manually update the database with `psql`.  See the
[update docs][update-db] for details.

### Log error: could not access file "timescaledb"

If your PostgreSQL logs have this error preventing it from starting up, you
should double check that the TimescaleDB files have been installed to the
correct location. The installation methods use `pg_config` to get PostgreSQL's
location. However if you have multiple versions of PostgreSQL installed on the
same machine, the location `pg_config` points to may not be for the version you
expect. To check which version TimescaleDB used:

```bash
$ pg_config --version
PostgreSQL 12.3
```

If that is the correct version, double check that the installation path is
the one you'd expect. For example, for PostgreSQL 11.0 installed via
Homebrew on macOS it should be `/usr/local/Cellar/postgresql/11.0/bin`:

```bash
$ pg_config --bindir
/usr/local/Cellar/postgresql/11.0/bin
```

If either of those steps is not the version you are expecting, you need to
either uninstall the incorrect version of PostgreSQL if you can, or update your
`PATH` environmental variable to have the correct path of `pg_config` listed
first, that is, by prepending the full path:

```bash
export PATH = /usr/local/Cellar/postgresql/11.0/bin:$PATH
```

Then, reinstall TimescaleDB and it should find the correct installation
path.

### ERROR: could not access file "timescaledb-\<version\>": No such file or directory

If the error occurs immediately after updating your version of TimescaleDB and
the file mentioned is from the previous version, it is probably due to an
incomplete update process. Within the greater PostgreSQL server instance, each
database that has TimescaleDB installed needs to be updated with the SQL command
`ALTER EXTENSION timescaledb UPDATE;` while connected to that database.
Otherwise, the database looks for the previous version of the `timescaledb` files.

See [our update docs][update-db] for more info.

### Scheduled jobs stop running

Your scheduled jobs might stop running for various reasons. On self-hosted
TimescaleDB, you can fix this by restarting background workers:

```sql
SELECT _timescaledb_internal.restart_background_workers();
```

<CloudMSTRestartWorkers />

### Failed to start a background worker

You might see this error message in the logs if background workers aren't
properly configured:

```bash
"<TYPE_OF_BACKGROUND_JOB>": failed to start a background worker
```

To fix this error, make sure that `max_worker_processes`,
`max_parallel_workers`, and `timescaledb.max_background_workers` are properly
set. `timescaledb.max_background_workers` should equal the number of databases
plus the number of concurrent background workers. `max_worker_processes` should
equal the sum of `timescaledb.max_background_workers` and
`max_parallel_workers`.

For more information, see the [worker configuration docs][worker-config].

### Cannot compress chunk

You might see this error message when trying to compress a chunk if
the permissions for the compressed hypertable is corrupt.

```sql
tsdb=> SELECT compress_chunk('_timescaledb_internal._hyper_65_587239_chunk');
ERROR: role 149910 was concurrently dropped
```

This can be caused if you dropped a user for the hypertable before
TimescaleDB 2.5. For this case, the user would be removed from
`pg_authid` but not revoked from the compressed table.

As a result, the compressed table contains permission items that
refers to numerical values rather than existing users (see below for
how to find the compressed hypertable from a normal hypertable):

```sql
tsdb=> \dp _timescaledb_internal._compressed_hypertable_2
                                 Access privileges
 Schema |     Name     | Type  |  Access privileges  | Column privileges | Policies
--------+--------------+-------+---------------------+-------------------+----------
 public | transactions | table | mats=arwdDxt/mats  +|                   |
        |              |       | wizard=arwdDxt/mats+|                   |
        |              |       | 149910=r/mats       |                   |
(1 row)
```

This means that the `relacl` column of `pg_class` needs to be updated
and the offending user removed, but it is not possible to drop a user
by numerical value. Instead, you can use the internal function
`repair_relation_acls` in `_timescaledb_function` schema:

```sql
tsdb=> CALL _timescaledb_functions.repair_relation_acls();
```

> **WARNING:** Note that this requires superuser privileges (since
> you're modifying the `pg_class` table) and that it removes any user
> not present in `pg_authid` from *all* tables, so use with caution.

The permissions are usually corrupted for the hypertable as well, but
not always, so it is better to look at the compressed hypertable to
see if the problem is present. To find the compressed hypertable for
an associated hypertable (`readings` in this case):

```sql
tsdb=> select ht.table_name,
tsdb->        (select format('%I.%I', schema_name, table_name)::regclass
tsdb->           from _timescaledb_catalog.hypertable
tsdb->			where ht.compressed_hypertable_id = id) as compressed_table
tsdb->   from _timescaledb_catalog.hypertable ht
tsdb->  where table_name = 'readings';
  format  |                     format
----------+------------------------------------------------
 readings | _timescaledb_internal._compressed_hypertable_2
(1 row)
```

## Getting more information

### EXPLAINing query performance

PostgreSQL's EXPLAIN feature allows users to understand the underlying query
plan that PostgreSQL uses to execute a query. There are multiple ways that
PostgreSQL can execute a query: for example, a query might be fulfilled using a
slow sequence scan or a much more efficient index scan. The choice of plan
depends on what indexes are created on the table, the statistics that PostgreSQL
has about your data, and various planner settings. The EXPLAIN output let's you
know which plan PostgreSQL is choosing for a particular query. PostgreSQL has a
[in-depth explanation][using explain] of this feature.

To understand the query performance on a hypertable, we suggest first
making sure that the planner statistics and table maintenance is up-to-date on the hypertable
by running `VACUUM ANALYZE <your-hypertable>;`. Then, we suggest running the
following version of EXPLAIN:

```sql
EXPLAIN (ANALYZE on, BUFFERS on) <original query>;
```

If you suspect that your performance issues are due to slow IOs from disk, you
can get even more information by enabling the
[track\_io\_timing][track_io_timing] variable with `SET track_io_timing = 'on';`
before running the above EXPLAIN.

## Dump TimescaleDB meta data

To help when asking for support and reporting bugs,
TimescaleDB includes a SQL script that outputs metadata
from the internal TimescaleDB tables as well as version information.
The script is available in the source distribution in `scripts/`
but can also be [downloaded separately][].
To use it, run:

```bash
psql [your connect flags] -d your_timescale_db < dump_meta_data.sql > dumpfile.txt
```

and then inspect `dump_file.txt` before sending it together with a bug report or support question.

## Debugging background jobs

By default, background workers do not print a lot of information about
execution. The reason for this is to avoid writing a lot of debug
information to the PostgreSQL log unless necessary.

To aid in debugging the background jobs, it is possible to increase
the log level of the background workers without having to restart the
server by setting the `timescaledb.bgw_log_level` GUC and reloading
the configuration.

```sql
ALTER SYSTEM SET timescaledb.bgw_log_level TO 'DEBUG1';
SELECT pg_reload_conf();
```

This variable is set to the value of
[`log_min_messages`][log_min_messages] by default, which typically is
`WARNING`. If the value of [`log_min_messages`][log_min_messages] is
changed in the configuration file, it is used for
`timescaledb.bgw_log_level` when starting the workers.

### Debug level 1

The amount of information printed at each level varies between jobs,
but the information printed at `DEBUG1` is currently shown below.

| Source            | Event                                                |
|-------------------|------------------------------------------------------|
| All jobs          | Job exit with runtime information                    |
| All jobs          | Job scheduled for fast restart                       |
| Custom job        | Execution started                                    |
| Recompression job | Recompression job completed                          |
| Reorder job       | Chunk reorder completed                              |
| Reorder job       | Chunk reorder started                                |
| Scheduler         | New jobs discovered and added to scheduled jobs list |
| Scheduler         | Scheduling job for launch                            |

### Debug level 2

The amount of information printed at each level varies between jobs,
but the information printed at `DEBUG2` is currently shown below.

Note that all messages at level `DEBUG1` are also printed when you set
the log level to `DEBUG2`, which is [normal PostgreSQL
behaviour][log_min_messages].

| Source    | Event                              |
|-----------|------------------------------------|
| All jobs  | Job found in jobs table            |
| All jobs  | Job starting execution             |
| Scheduler | Scheduled jobs list update started |

[downloaded separately]: https://raw.githubusercontent.com/timescale/timescaledb/master/scripts/dump_meta_data.sql
[github]: https://github.com/timescale/timescaledb/issues
[slack]: https://slack.timescale.com/
[track_io_timing]: https://www.postgresql.org/docs/current/static/runtime-config-statistics.html#GUC-TRACK-IO-TIMING
[update-db]: /self-hosted/:currentVersion:/upgrades/
[using explain]: https://www.postgresql.org/docs/current/static/using-explain.html
[worker-config]: /self-hosted/latest/configuration/about-configuration/#workers
[log_min_messages]: https://www.postgresql.org/docs/current/runtime-config-logging.html#GUC-LOG-MIN-MESSAGES
