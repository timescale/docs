---
api_name: timescaledb_information.job_errors
excerpt: Get information about background job errors
keywords: [jobs, information]
tags: [background jobs, scheduled jobs, automation framework, scheduled views]
api:
  license: community
  type: view
---

## timescaledb_information.job_errors

Shows information about runtime errors encountered by jobs run by the automation framework.
This includes jobs set up for user-defined actions and jobs run by policies
created to manage data retention, continuous aggregates, compression, and
other automation policies. For more information about automation policies,
see the [policies][actions] section.

### Available columns

|Name|Type|Description|
|-|-|-|
|`job_id`|INTEGER|The ID of the background job created to implement the policy|
|`proc_schema`|TEXT|Schema name of the function or procedure executed by the job|
|`proc_name`|TEXT|Name of the function or procedure executed by the job|
|`pid`|INTEGER|The process ID of the background worker executing the job. This is `NULL` in the case of a job crash|
|`start_time`|TIMESTAMP WITH TIME ZONE|Start time of the job|
|`finish_time`|TIMESTAMP WITH TIME ZONE|Time when error was reported|
|`sqlerrcode`|TEXT|The error code associated with this error, if any. See the [official PostgreSQL documentation](https://www.postgresql.org/docs/current/errcodes-appendix.html) for a full list of error codes|
|`err_message`|TEXT|The detailed error message|

### Sample usage

See information about recent job failures:

```sql
SELECT job_id, proc_schema, proc_name, pid, sqlerrcode, err_message from timescaledb_information.job_errors ;

 job_id | proc_schema |  proc_name   |  pid  | sqlerrcode |                     err_message
--------+-------------+--------------+-------+------------+-----------------------------------------------------
   1001 | public      | custom_proc2 | 83111 | 40001      | could not serialize access due to concurrent update
   1003 | public      | job_fail     | 83134 | 57014      | canceling statement due to user request
   1005 | public      | job_fail     |       |            | job crash detected, see server logs
(3 rows)

```

### Error retention policy

The informational view `timescaledb_information.job_errors` is defined on top
of the table `_timescaledb_internal.job_errors` in the internal schema. To
prevent this table from growing too large, a system background job
`Error Log Retention Policy [2]` is enabled by default,
with this configuration:

```sql
id                | 2
application_name  | Error Log Retention Policy [2]
schedule_interval | 1 mon
max_runtime       | 01:00:00
max_retries       | -1
retry_period      | 01:00:00
proc_schema       | _timescaledb_internal
proc_name         | policy_job_error_retention
owner             | owner must be a user with WRITE privilege on the table `_timescaledb_internal.job_errors`
scheduled         | t
fixed_schedule    | t
initial_start     | 2000-01-01 02:00:00+02
hypertable_id     |
config            | {"drop_after": "1 month"}
check_schema      | _timescaledb_internal
check_name        | policy_job_error_retention_check
timezone          |

```

On Timescale and Managed Service for TimescaleDB, the owner of the error
retention job is `tsdbadmin`. In an on-premise installation, the owner of the
job is the same as the extension owner.
The owner of the retention job can alter it and delete it.
For example, the owner can change the retention interval like this:

```sql
SELECT alter_job(id,config:=jsonb_set(config,'{drop_after}', '"2 weeks"')) FROM _timescaledb_config.bgw_job WHERE id = 2;
```

[actions]: /api/:currentVersion:/actions/
