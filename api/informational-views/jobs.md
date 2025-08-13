---
api_name: timescaledb_information.jobs
excerpt: Get information about all jobs registered with the automatic scheduler
topics: [information, jobs]
keywords: [jobs, information]
tags: [background jobs, scheduled jobs, automation framework]
api:
  license: community
  type: view
products: [cloud, mst, self_hosted]
---

# timescaledb_information.jobs

Shows information about all $JOBs registered with the automation framework.

## Samples

Shows a $JOB associated with the refresh policy for continuous aggregates:

```sql
SELECT * FROM timescaledb_information.jobs;
job_id            | 1001
application_name  | Refresh Continuous Aggregate Policy [1001]
schedule_interval | 01:00:00
max_runtime       | 00:00:00
max_retries       | -1
retry_period      | 01:00:00
proc_schema       | _timescaledb_internal
proc_name         | policy_refresh_continuous_aggregate
owner             | postgres
scheduled         | t
config            | {"start_offset": "20 days", "end_offset": "10
days", "mat_hypertable_id": 2}
next_start        | 2020-10-02 12:38:07.014042-04
hypertable_schema | _timescaledb_internal
hypertable_name   | _materialized_hypertable_2
check_schema      | _timescaledb_internal
check_name       | policy_refresh_continuous_aggregate_check
```

Find all $JOBs related to compression policies (before $TIMESCALE_DB v2.20):

```sql
SELECT * FROM timescaledb_information.jobs where application_name like 'Compression%';
-[ RECORD 1 ]-----+--------------------------------------------------
job_id            | 1002
application_name  | Compression Policy [1002]
schedule_interval | 15 days 12:00:00
max_runtime       | 00:00:00
max_retries       | -1
retry_period      | 01:00:00
proc_schema       | _timescaledb_internal
proc_name         | policy_compression
owner             | postgres
scheduled         | t
config            | {"hypertable_id": 3, "compress_after": "60 days"}
next_start        | 2020-10-18 01:31:40.493764-04
hypertable_schema | public
hypertable_name   | conditions
check_schema      | _timescaledb_internal
check_name        | policy_compression_check
```

Find all $JOBs related to columnstore policies ($TIMESCALE_DB v2.20 and later):

```sql
SELECT * FROM timescaledb_information.jobs where application_name like 'Columnstore%';
-[ RECORD 1 ]-----+--------------------------------------------------
job_id            | 1002
application_name  | Columnstore Policy [1002]
schedule_interval | 15 days 12:00:00
max_runtime       | 00:00:00
max_retries       | -1
retry_period      | 01:00:00
proc_schema       | _timescaledb_internal
proc_name         | policy_compression
owner             | postgres
scheduled         | t
config            | {"hypertable_id": 3, "compress_after": "60 days"}
next_start        | 2025-10-18 01:31:40.493764-04
hypertable_schema | public
hypertable_name   | conditions
check_schema      | _timescaledb_internal
check_name        | policy_compression_check
```

Find custom $JOBs:

```sql
SELECT * FROM timescaledb_information.jobs where application_name like 'User-Define%';
-[ RECORD 1 ]-----+------------------------------
job_id            | 1003
application_name  | User-Defined Action [1003]
schedule_interval | 01:00:00
max_runtime       | 00:00:00
max_retries       | -1
retry_period      | 00:05:00
proc_schema       | public
proc_name         | custom_aggregation_func
owner             | postgres
scheduled         | t
config            | {"type": "function"}
next_start        | 2020-10-02 14:45:33.339885-04
hypertable_schema |
hypertable_name   |
check_schema      | NULL
check_name        | NULL
-[ RECORD 2 ]-----+------------------------------
job_id            | 1004
application_name  | User-Defined Action [1004]
schedule_interval | 01:00:00
max_runtime       | 00:00:00
max_retries       | -1
retry_period      | 00:05:00
proc_schema       | public
proc_name         | custom_retention_func
owner             | postgres
scheduled         | t
config            | {"type": "function"}
next_start        | 2020-10-02 14:45:33.353733-04
hypertable_schema |
hypertable_name   |
check_schema      | NULL
check_name        | NULL
```

## Arguments

|Name|Type| Description                                                                                                  |
|-|-|--------------------------------------------------------------------------------------------------------------|
|`job_id`|`INTEGER`| The ID of the background $JOB                                                                                |
|`application_name`|`TEXT`| Name of the policy or $JOB                                                                        |
|`schedule_interval`|`INTERVAL`| The interval at which the $JOB runs. Defaults to 24 hours                                                    |
|`max_runtime`|`INTERVAL`| The maximum amount of time the $JOB is allowed to run by the background worker scheduler before it is stopped |
|`max_retries`|`INTEGER`| The number of times the $JOB is retried if it fails                                                          |
|`retry_period`|`INTERVAL`| The amount of time the scheduler waits between retries of the $JOB on failure                                |
|`proc_schema`|`TEXT`| Schema name of the function or procedure executed by the $JOB                                                |
|`proc_name`|`TEXT`| Name of the function or procedure executed by the $JOB                                                       |
|`owner`|`TEXT`| Owner of the $JOB                                                                                            |
|`scheduled`|`BOOLEAN`| Set to `true` to run the $JOB automatically                                                                  |
|`fixed_schedule`|BOOLEAN| Set to `true` for $JOBs executing at fixed times according to a schedule interval and initial start          |
|`config`|`JSONB`| Configuration passed to the function specified by `proc_name` at execution time                              |
|`next_start`|`TIMESTAMP WITH TIME ZONE`| Next start time for the $JOB, if it is scheduled to run automatically                                        |
|`initial_start`|`TIMESTAMP WITH TIME ZONE`| Time the $JOB is first run and also the time on which execution times are aligned for $JOBs with fixed schedules |
|`hypertable_schema`|`TEXT`| Schema name of the hypertable. Set to `NULL` for a $JOB                                                      |
|`hypertable_name`|`TEXT`| Table name of the hypertable. Set to `NULL` for a $JOB                                                       |
|`check_schema`|`TEXT`| Schema name of the optional configuration validation function, set when the $JOB is created or updated       |
|`check_name`|`TEXT`| Name of the optional configuration validation function, set when the $JOB is created or updated              |


