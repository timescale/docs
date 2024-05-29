---
api_name: timescaledb_information.history
excerpt: Get information about background job execution
keywords: [jobs, information]
tags: [background jobs, scheduled jobs, automation framework, scheduled views]
api:
  license: community
  type: view
---

## timescaledb_information.job_history

Shows information about the jobs run by the automation framework.
This includes jobs set up for user-defined actions, and jobs run by policies
created to manage data retention, continuous aggregates, compression, and
other automation policies. For more information about automation policies,
see [User-Defined Actions][actions].

### Available columns

|Name|Type|Description|
|-|-|-|
|`id`|INTEGER|The sequencial ID to identify the job execution|
|`job_id`|INTEGER|The ID of the background job created to implement the policy|
|`succeeded`|BOOLEAN|`TRUE` when the job ran successfully, `FALSE` for failed executions|
|`proc_schema`|TEXT|Schema name of the function or procedure executed by the job|
|`proc_name`|TEXT|Name of the function or procedure executed by the job|
|`pid`|INTEGER|The process ID of the background worker executing the job. This is `NULL` in the case of a job crash|
|`start_time`|TIMESTAMP WITH TIME ZONE|Start time of the job|
|`finish_time`|TIMESTAMP WITH TIME ZONE|Time when error was reported|
|`config`|JSONB|Job configuration at the moment of the execution|
|`sqlerrcode`|TEXT|The error code associated with this error, if any. See the [official PostgreSQL documentation](https://www.postgresql.org/docs/current/errcodes-appendix.html) for a full list of error codes|
|`err_message`|TEXT|The detailed error message|

### Sample usage

See information about recent job executions:

```sql
SELECT job_id, pid, proc_schema, proc_name, succeeded, config, sqlerrcode, err_message
FROM timescaledb_information.job_history
ORDER BY id, job_id;
 job_id |   pid   | proc_schema |    proc_name     | succeeded |   config   | sqlerrcode |   err_message    
--------+---------+-------------+------------------+-----------+------------+------------+------------------
   1001 | 1779278 | public      | custom_job_error | f         |            | 22012      | division by zero
   1000 | 1779407 | public      | custom_job_ok    | t         |            |            | 
   1001 | 1779408 | public      | custom_job_error | f         |            | 22012      | division by zero
   1000 | 1779467 | public      | custom_job_ok    | t         | {"foo": 1} |            | 
   1001 | 1779468 | public      | custom_job_error | f         | {"bar": 1} | 22012      | division by zero
(5 rows)
```

### Error retention policy

The informational view `timescaledb_information.job_history` is defined on top
of the table `_timescaledb_internal.bgw_job_stat_history` in the internal schema. To
prevent this table from growing too large, a system background job
`Job History Log Retention Policy [3]` is enabled by default,
with this configuration:

```sql
job_id            | 3
application_name  | Job History Log Retention Policy [3]
schedule_interval | 1 mon
max_runtime       | 01:00:00
max_retries       | -1
retry_period      | 01:00:00
proc_schema       | _timescaledb_functions
proc_name         | policy_job_stat_history_retention
owner             | owner must be a user with WRITE privilege on the table `_timescaledb_internal.bgw_job_stat_history`
scheduled         | t
fixed_schedule    | t
config            | {"drop_after": "1 month"}
next_start        | 2024-06-01 01:00:00+00
initial_start     | 2000-01-01 00:00:00+00
hypertable_schema | 
hypertable_name   | 
check_schema      | _timescaledb_functions
check_name        | policy_job_stat_history_retention_check
```

On Timescale and Managed Service for TimescaleDB, the owner of the job history
retention job is `tsdbadmin`. In an on-premise installation, the owner of the
job is the same as the extension owner.
The owner of the retention job can alter it and delete it.
For example, the owner can change the retention interval like this:

```sql
SELECT alter_job(id,config:=jsonb_set(config,'{drop_after}', '"2 weeks"')) FROM _timescaledb_config.bgw_job WHERE id = 3;
```

[actions]: /api/:currentVersion:/actions/
