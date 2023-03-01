---
title: Maintenance jobs
excerpt: Understand and manage maintenance jobs
products: [promscale]
keywords: [maintenance, data]
---

import PromscaleDeprecation from "versionContent/_partials/_deprecated-promscale.mdx";

# Maintenance jobs

<PromscaleDeprecation />

Promscale implements [retention][retention] and [compression][compression]
through maintenance jobs. These jobs are automatically created when you install
Promscale and meet the basic requirements, but may require tuning.

## Inspect the maintenance jobs

The Promscale maintenance jobs leverage the [user-defined
actions][user-defined-actions] in the TimescaleDB framework so that you can use
the TimescaleDB interfaces to inspect the maintenance jobs.

*   The [`timescaledb_information.jobs`][timescaledb_information.jobs]
informational view provides information about the maintenance jobs, their
schedule, and count.
*   The [`timescaledb_information.job_stats`][timescaledb_information.job_stats]
informational view provides additional information about when the job last ran.

### Inspecting the maintenance

To view the maintenance jobs:

```sql
SELECT * FROM timescaledb_information.jobs
WHERE proc_schema IN ('_prom_catalog', '_ps_trace');
```

The output is simialr to:

```sql

 job_id |      application_name      | schedule_interval | max_runtime | max_retries | retry_period |  proc_schema  |            proc_name            |  owner   | scheduled |                       config                       |          next_start           | hypertable_schema | hypertable_name
--------+----------------------------+-------------------+-------------+-------------+--------------+---------------+---------------------------------+----------+-----------+----------------------------------------------------+-------------------------------+-------------------+-----------------
   1004 | User-Defined Action [1004] | 01:00:00          | 00:00:00    |          -1 | 00:05:00     | _ps_trace     | execute_tracing_compression_job | postgres | t         | {"log_verbose": false, "hypertable_name": "link"}  | 2022-06-03 12:09:10.370909+00 |                   |
   1003 | User-Defined Action [1003] | 01:00:00          | 00:00:00    |          -1 | 00:05:00     | _ps_trace     | execute_tracing_compression_job | postgres | t         | {"log_verbose": false, "hypertable_name": "event"} | 2022-06-03 12:09:16.336568+00 |                   |
   1002 | User-Defined Action [1002] | 01:00:00          | 00:00:00    |          -1 | 00:05:00     | _ps_trace     | execute_tracing_compression_job | postgres | t         | {"log_verbose": false, "hypertable_name": "span"}  | 2022-06-03 12:09:23.121163+00 |                   |
   1001 | User-Defined Action [1001] | 00:30:00          | 00:00:00    |          -1 | 00:05:00     | _prom_catalog | execute_maintenance_job         | postgres | t         |                                                    | 2022-06-03 12:00:39.737209+00 |                   |
   1000 | User-Defined Action [1000] | 00:30:00          | 00:00:00    |          -1 | 00:05:00     | _prom_catalog | execute_maintenance_job         | postgres | t         |                                                    | 2022-06-03 12:00:39.782075+00 |                   |
(5 rows)
```

In the sample output there are five maintenance jobs, two instances of
`_prom_catalog.execute_maintenance_job`, and three instances of
`_ps_trace.execute_tracing_compression_job`.

*   The `execute_maintenance_job` performs metric retention, metric compression,
   and trace retention.

*   The `execute_tracing_compression_job` performs compression on one of the
   trace hypertables `span`, `event`, and `link`.

*   When a job is currently running, the value in the `next_start` column is
   `-infinity`.

To view additional information about the jobs:

```sql
SELECT js.* FROM timescaledb_information.jobs j
JOIN timescaledb_information.job_stats js USING (job_id)
WHERE j.proc_schema IN ('_prom_catalog', '_ps_trace');

```

The output is simialr to:

```sql
 hypertable_schema | hypertable_name | job_id |      last_run_started_at      |    last_successful_finish     | last_run_status | job_status | last_run_duration |          next_start           | total_runs | total_successes | total_failures
-------------------+-----------------+--------+-------------------------------+-------------------------------+-----------------+------------+-------------------+-------------------------------+------------+-----------------+----------------
                   |                 |   1000 | 2022-06-03 11:30:32.981935+00 | 2022-06-03 11:30:39.782075+00 | Success         | Scheduled  | 00:00:06.80014    | 2022-06-03 12:00:39.782075+00 |         74 |              74 |              0
                   |                 |   1001 | 2022-06-03 11:30:33.02772+00  | 2022-06-03 11:30:39.737209+00 | Success         | Scheduled  | 00:00:06.709489   | 2022-06-03 12:00:39.737209+00 |         74 |              74 |              0
                   |                 |   1002 | 2022-06-03 11:09:17.345948+00 | 2022-06-03 11:09:23.121163+00 | Success         | Scheduled  | 00:00:05.775215   | 2022-06-03 12:09:23.121163+00 |         41 |              41 |              0
                   |                 |   1003 | 2022-06-03 11:09:12.887644+00 | 2022-06-03 11:09:16.336568+00 | Success         | Scheduled  | 00:00:03.448924   | 2022-06-03 12:09:16.336568+00 |         41 |              41 |              0
                   |                 |   1004 | 2022-06-03 11:09:08.806099+00 | 2022-06-03 11:09:10.370909+00 | Success         | Scheduled  | 00:00:01.56481    | 2022-06-03 12:09:10.370909+00 |         41 |              41 |              0
(5 rows)
```

## Tuning the number of jobs

As `execute_maintenance_job` is single-threaded, and runs in a single process,
one maintenance job uses a maximum of one CPU. On systems with high throughput,
it's possible that the default of two maintenance jobs is not sufficient to keep
up with the amount of data being ingested.

To determine if the maintenance jobs are lagging behind, compare the duration of
the last run with the interval. If the most recent run is larger than the
interval, then the job is lagging behind.

To compare the duration of the last run with the interval:

```sql
SELECT job_id, schedule_interval, last_run_duration
FROM timescaledb_information.jobs
JOIN timescaledb_information.job_stats USING (job_id)
WHERE proc_schema IN ('_ps_trace', '_prom_catalog')
AND last_run_duration > schedule_interval;
```

To increase the number of maintenance jobs use the
`prom_api.config_maintenance_jobs(number_jobs integer, new_schedule_interval
interval, new_config jsonb)` function. You can provide the number of jobs, the
scheduled interval, and optionally a new configuration for the job in this
function.

For example, to increase the number of jobs to four, but retain the default
interval use:

```sql
SELECT config_maintenance_jobs(4, '30 minutes'::INTERVAL);
```

[compression]: /promscale/:currentVersion:/manage-data/compression/
[retention]: /promscale/:currentVersion:/manage-data/retention/
[timescaledb_information.job_stats]: /api/:currentVersion:/informational-views/job_stats/
[timescaledb_information.jobs]: /api/:currentVersion:/informational-views/jobs/
[user-defined-actions]: /timescaledb/:currentVersion:/overview/core-concepts/user-defined-actions/
