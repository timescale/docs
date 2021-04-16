## alter_job() <tag type="community">Community</tag> 

Actions scheduled via TimescaleDB's automation framework run periodically in a
background worker. You can change the schedule of their execution using `alter_job`.
To alter an existing job, you must refer to it by `job_id`.
The `job_id` which executes a given action and its current schedule can be found
either in the `timescaledb_information.jobs` view, which lists information 
about every scheduled action, as well as in `timescaledb_information.job_stats`.
The `job_stats` view additionally contains information about when each job was
last run and other useful statistics for deciding what the new schedule should be.

### Required Arguments

|Name|Type|Description|
|---|---|---|
| `job_id` | INTEGER | the id of the policy job being modified |

### Optional Arguments

|Name|Type|Description|
|---|---|---|
| `schedule_interval` | INTERVAL |  The interval at which the job runs |
| `max_runtime` | INTERVAL | The maximum amount of time the job will be allowed to run by the background worker scheduler before it is stopped |
| `max_retries` | INTEGER |  The number of times the job will be retried should it fail |
| `retry_period` | INTERVAL | The amount of time the scheduler will wait between retries of the job on failure |
| `scheduled` | BOOLEAN |  Set to `FALSE` to exclude this job from being run as background job. |
| `config` | JSONB | Job-specific configuration (this will be passed to the function when executed)|
| `next_start` | TIMESTAMPTZ | The next time at which to run the job. The job can be paused by setting this value to 'infinity' (and restarted with a value of now()). |
| `if_exists` | BOOLEAN |  Set to true to avoid throwing an error if the job does not exist, a notice will be issued instead. Defaults to false. |

### Returns 

|Column|Type|Description|
|---|---|---|
| `job_id` | INTEGER | the id of the job being modified |
| `schedule_interval` | INTERVAL |  The interval at which the job runs |
| `max_runtime` | INTERVAL | The maximum amount of time the job will be allowed to run by the background worker scheduler before it is stopped |
| `max_retries` | INTEGER |  The number of times the job will be retried should it fail |
| `retry_period` | INTERVAL | The amount of time the scheduler will wait between retries of the job on failure |
| `scheduled` | BOOLEAN |  True if this job will be executed by the TimescaleDB scheduler. |
| `config` | JSONB | Job-specific configuration (this will be passed to the function when executed)|
| `next_start` | TIMESTAMPTZ | The next time at which to run the job. |

### Sample Usage 

```sql
SELECT alter_job(1000, schedule_interval => INTERVAL '2 days');
```
Reschedules the job with id 1000 so that it runs every two days.

```sql
SELECT alter_job(job_id, scheduled => false)
FROM timescaledb_information.jobs
WHERE proc_name = 'policy_compression' AND hypertable_name = 'conditions'
```
Disables scheduling of the compression policy on hypertable `conditions`.

```sql
SELECT alter_job(1015, next_start => '2020-03-15 09:00:00.0+00');
```

Reschedules continuous aggregate job `1015` so that the next execution of the
job starts at the specified time (9:00:00 am on March 15, 2020).
