---
api_name: timescaledb_information.jobs
excerpt: Get information about all jobs registered with the automatic scheduler
topics: [information, jobs]
keywords: [jobs, information]
tags: [background jobs, scheduled jobs, user-defined actions, automation framework]
api:
  license: community
  type: view
---

# timescaledb_information.jobs

Shows information about all jobs registered with the automation framework.

### Arguments

|Name|Type|Description|
|-|-|-|
|`job_id`|`INTEGER`|The ID of the background job|
|`application_name`|`TEXT`|Name of the policy or user defined action|
|`schedule_interval`|`INTERVAL`|The interval at which the job runs. Defaults to 24 hours|
|`max_runtime`|`INTERVAL`|The maximum amount of time the job is allowed to run by the background worker scheduler before it is stopped|
|`max_retries`|`INTEGER`|The number of times the job is retried if it fails|
|`retry_period`|`INTERVAL`|The amount of time the scheduler waits between retries of the job on failure|
|`proc_schema`|`TEXT`|Schema name of the function or procedure executed by the job|
|`proc_name`|`TEXT`|Name of the function or procedure executed by the job|
|`owner`|`TEXT`|Owner of the job|
|`scheduled`|`BOOLEAN`|Set to `true` to run the job automatically|
|`fixed_schedule`|BOOLEAN|Set to `true` for jobs executing at fixed times according to a schedule interval and initial start.|
|`config`|`JSONB`|Configuration passed to the function specified by `proc_name` at execution time|
|`next_start`|`TIMESTAMP WITH TIME ZONE`|Next start time for the job, if it is scheduled to run automatically|
|`initial_start`|`TIMESTAMP WITH TIME ZONE`|Time the job is first run and also the time on which execution times are aligned for jobs with fixed schedules.|
|`hypertable_schema`|`TEXT`|Schema name of the hypertable. Set to `NULL` for user-defined action|
|`hypertable_name`|`TEXT`|Table name of the hypertable. Set to `NULL` for user-defined action|
|`check_schema`|`TEXT`|Schema name of the optional configuration validation function, set when the job is created or updated|
|`check_name`|`TEXT`|Name of the optional configuration validation function, set when the job is created or updated|

### Sample use

Shows a job associated with the refresh policy for continuous aggregates:

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

Find all jobs related to compression policies:

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

Find jobs that are run by user defined actions:

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
