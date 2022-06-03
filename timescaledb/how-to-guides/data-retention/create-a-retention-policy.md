# Create a data retention policy
Automatically drop data once its time value ages past a certain interval. When
you create a data retention policy, TimescaleDB automatically schedules a
background job to drop old chunks.

## Add a data retention policy
Add a data retention policy by using the
[`add_retention_policy`][add_retention_policy] function.

<procedure>

### Adding a data retention policy
1.  Choose which hypertable you want to add the policy to. Decide how long want
    you want to keep data before dropping it. In this example, the hypertable
    name is `conditions`, and data is kept for 24 hours.
1.  Call `add_retention_policy`:
    ```sql
    SELECT add_retention_policy('conditions', INTERVAL '24 hours');
    ```

</procedure>

<highlight type="note">
A data retention poilcy only allows you to drop chunks based on how far they are
in the past. To drop chunks based on how far they are in the future,
[manually drop chunks](/timescaledb/latest/how-to-guides/data-retention/manually-drop-chunks).
</highlight>

## Remove a data retention policy
Remove an existing data retention policy by using the
[`remove_retention_policy`][remove_retention_policy] function. Pass it the name
of the hypertable to remove the policy from.
```sql
SELECT remove_retention_policy('conditions');
```

## See scheduled data retention jobs
To see your scheduled data retention jobs and their job statistics, query the
[`timescaledb_information.jobs`][timescaledb_information.jobs] and
[`timescaledb_information.job_stats`][timescaledb_information.job_stats] tables.
For example:
```sql
SELECT j.hypertable_name,
       j.job_id,
       config,
       schedule_interval,
       job_status,
       last_run_status,
       last_run_started_at,
       js.next_start,
       total_runs,
       total_successes,
       total_failures
  FROM timescaledb_information.jobs j
  JOIN timescaledb_information.job_stats js
    ON j.job_id = js.job_id
  WHERE j.proc_name = 'policy_retention';
```

The results look like this:
```sql
-[ RECORD 1 ]-------+-----------------------------------------------
hypertable_name     | conditions
job_id              | 1000
config              | {"drop_after": "5 years", "hypertable_id": 14}
schedule_interval   | 1 day
job_status          | Scheduled
last_run_status     | Success
last_run_started_at | 2022-05-19 16:15:11.200109+00
next_start          | 2022-05-20 16:15:11.243531+00
total_runs          | 1
total_successes     | 1
total_failures      | 0
```

[add_retention_policy]: /api/:currentVersion:/data-retention/add_retention_policy
[remove_retention_policy]: /api/:currentVersion:/data-retention/remove_retention_policy 
[timescaledb_information.jobs]: /api/:currentVersion:/informational-views/jobs/
[timescaledb_information.job_stats]: /api/:currentVersion:/informational-views/job_stats/
