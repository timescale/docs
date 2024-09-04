---
api_name: timescaledb_information.job_stats
excerpt: Get information and statistics about automatically run jobs
topics: [information, jobs]
keywords: [jobs, information]
tags: [background jobs, scheduled jobs, automation framework, scheduled views, statistics]
api:
  license: community
  type: view
---

# timescaledb_information.job_stats

Shows information and statistics about jobs run by the automation framework.
This includes jobs set up for user defined actions and jobs run by policies
created to manage data retention, continuous aggregates, compression, and
other automation policies.  (See [policies][actions]).
The statistics include information useful for administering jobs and determining
whether they ought be rescheduled, such as: when and whether the background job
used to implement the policy succeeded and when it is scheduled to run next.

### Available columns

{/* vale Google.Acronyms = NO */}
|Name|Type|Description|
|---|---|---|
|`hypertable_schema` | TEXT | Schema name of the hypertable |
|`hypertable_name` | TEXT | Table name of the hypertable |
|`job_id` | INTEGER | The id of the background job created to implement the policy |
|`last_run_started_at`| TIMESTAMP WITH TIME ZONE | Start time of the last job|
|`last_successful_finish`| TIMESTAMP WITH TIME ZONE | Time when the job completed successfully|
|`last_run_status` | TEXT | Whether the last run succeeded or failed |
|`job_status`| TEXT | Status of the job. Valid values are 'Running', 'Scheduled' and 'Paused'|
|`last_run_duration`| INTERVAL | Duration of last run of the job|
|`next_start` | TIMESTAMP WITH TIME ZONE | Start time of the next run |
|`total_runs` | BIGINT | The total number of runs of this job|
|`total_successes` | BIGINT | The total number of times this job succeeded |
|`total_failures` | BIGINT | The total number of times this job failed |
{/* vale Google.Acronyms = YES */}

### Sample usage

Get job success/failure information for a specific hypertable.

```sql
SELECT job_id, total_runs, total_failures, total_successes
  FROM timescaledb_information.job_stats
  WHERE hypertable_name = 'test_table';

 job_id | total_runs | total_failures | total_successes
--------+------------+----------------+-----------------
   1001 |          1 |              0 |               1
   1004 |          1 |              0 |               1
(2 rows)

```

Get information about continuous aggregate policy related statistics

``` sql
SELECT  js.* FROM
  timescaledb_information.job_stats js, timescaledb_information.continuous_aggregates cagg
  WHERE cagg.view_name = 'max_mat_view_timestamp'
  and cagg.materialization_hypertable_name = js.hypertable_name;

-[ RECORD 1 ]----------+------------------------------
hypertable_schema      | _timescaledb_internal
hypertable_name        | _materialized_hypertable_2
job_id                 | 1001
last_run_started_at    | 2020-10-02 09:38:06.871953-04
last_successful_finish | 2020-10-02 09:38:06.932675-04
last_run_status        | Success
job_status             | Scheduled
last_run_duration      | 00:00:00.060722
next_start             | 2020-10-02 10:38:06.932675-04
total_runs             | 1
total_successes        | 1
total_failures         | 0

```

[actions]: /api/:currentVersion:/actions/
