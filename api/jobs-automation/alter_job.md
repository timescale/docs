---
api_name: alter_job()
excerpt: Alter a job that is scheduled to run automatically
topics: [jobs]
keywords: [jobs]
tags: [scheduled jobs, automation framework, background jobs, alter, change]
api:
  license: community
  type: function
products: [cloud, mst, self_hosted]
---

import EarlyAccess from "versionContent/_partials/_early_access.mdx";

# alter_job() <Tag type="community">Community</Tag>

$JOB_CAPs scheduled using the TimescaleDB automation framework run periodically in
a background worker. You can change the schedule of these $JOBs with the
`alter_job` function. To alter an existing $JOB, refer to it by `job_id`. The
`job_id` runs a given $JOB, and its current schedule can be found in the
`timescaledb_information.jobs` view, which lists information about every
scheduled $JOBs, as well as in `timescaledb_information.job_stats`. The
`job_stats` view also gives information about when each $JOB was last run and
other useful statistics for deciding what the new schedule should be.

### Calculate the next start on failure

When a $JOB run results in a runtime failure, the next start of the $JOB is calculated taking into account both its `retry_period` and `schedule_interval`.
The `next_start` time is calculated using the following formula:
```
next_start = finish_time + consecutive_failures * retry_period ± jitter
```
where jitter (± 13%) is added to avoid the "thundering herds" effect.

To ensure that the `next_start` time is not put off indefinitely or produce timestamps so large they end up out of range, it is capped at 5*`schedule_interval`.
Also, more than 20 consecutive failures are not considered, so if the number of consecutive failures is higher, then it multiplies by 20.

Additionally, for $JOBs with fixed schedules, the system ensures that if the next start ( calculated as specified), surpasses the next scheduled execution, the $JOB is executed again at the next scheduled slot and not after that. This ensures that the $JOB does not miss scheduled executions.

There is a distinction between runtime failures that do not cause the $JOB to crash and $JOB crashes.
In the event of a $JOB crash, the next start calculation follows the same formula,
but it is always at least 5 minutes after the $JOB's last finish, to give an operator enough time to disable it before another crash.



## Samples

- **Reschedule $JOB ID `1000` so that it runs every two days**:

    ```sql
    SELECT alter_job(1000, schedule_interval => INTERVAL '2 days');
    ```

- **Disable scheduling of the compression policy on the `conditions` hypertable**:

    ```sql
    SELECT alter_job(job_id, scheduled => false)
    FROM timescaledb_information.jobs
    WHERE proc_name = 'policy_compression' AND hypertable_name = 'conditions'
    ```

- **Reschedule continuous aggregate $JOB ID `1000` so that it next runs at 9:00:00 on 15 March, 2020**:

    ```sql
    SELECT alter_job(1000, next_start => '2020-03-15 09:00:00.0+00');
    ```
  
- **Alter a columnstore_policy**:

  You can pause and restart a columnstore policy, change how often the policy runs and the job scheduling.
  To do this:
  
  1. Find the job ID for the columnstore policy:
     ```sql
     SELECT job_id, hypertable_name, config
     FROM timescaledb_information.jobs
     WHERE proc_name = 'policy_compression';
     ```
  1. Update the policy:
  
     For example, to change the compression interval after 30 days instead of 7:
     ```sql
     SELECT alter_job(1000, config => '{"compress_after": "30 days"}');
     ```
  However, to change the `after` or `created_before`, the compression settings, or the $HYPERTABLE
  the policy is acting on, you must [remove the columnstore policy][remove_columnstore_policy] and 
  [add a new one][add_columnstore_policy].



## Arguments

| Name                           | Type             | Default                                                                                                                                                                                                                           | Required                                                    | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
|--------------------------------|------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `job_id`                       |INTEGER| -                                                                                                                                                                                                                            | ✔                                                           | The ID of the policy $JOB being modified.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `schedule_interval`            |INTERVAL| 24 hours                                                                                                                                                                                                                          | ✖                                                           | The interval at which the job runs.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `max_runtime`                  |INTERVAL| -                                                                                                                                                                                                                            | ✖                                                           | The maximum amount of time the job is allowed to run by the background worker scheduler before it is stopped.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `max_retries`                  | INTEGER | -                                                                                                                                                                                                                            | ✖                                                           | The number of times the job is retried if it fails.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `retry_period`                 |INTERVAL| -                                                                                                                                                                                                                           |  ✖  | The amount of time the scheduler waits between retries of the job on failure.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `scheduled`                    |BOOLEAN| `true`                                                                                                                                                                                                                          | ✖  | Set to `false` to exclude this job from being run as a background job.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `config`                       |JSONB| -                                                                                                                                                                                                              | ✖| $JOB_CAP-specific configuration, passed to the function when it runs. This includes: <ul><li>`verbose_log`: boolean, defaults to `false`. Enable verbose logging output when running the compression policy.</li><li>`maxchunks_to_compress`: integer, defaults to `0` (no limit). The maximum number of chunks to compress during a policy run.</li><li>`recompress`: boolean, defaults to `true`. Recompress partially compressed chunks.</li><li>`compress_after`: see [`add_compression_policy`][add-policy].</li><li>`compress_created_before`: see [`add_compression_policy`][add-policy].</li></ul>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `next_start`               |TIMESTAMPTZ| -                                                         | ✖ | The next time at which to run the job. The job can be paused by setting this value to `infinity`, and restarted with a value of `now()`. |
| `if_exists`              |BOOLEAN| `false`                                                                                                                         | ✖        | Set to `true` to issue a notice instead of an error if the job does not exist.                                                                                                                                                                                                                                                                                                                                                                                  |
| `check_config`                  | REGPROC | -                                                         | ✖ | A function that takes a single argument, the `JSONB` `config` structure. The function is expected to raise an error if the configuration is not valid, and return nothing otherwise. Can be used to validate the configuration when updating a job. Only functions, not procedures, are allowed as values for `check_config`. |
| `fixed_schedule`               |BOOLEAN| `false` | ✖| To enable fixed scheduled job runs, set to `true`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
|`initial_start`| TIMESTAMPTZ | -                                                         | ✖ | Set the time when the `fixed_schedule` job run starts. For example, `19:10:25-07`. |
| `timezone`                  |TEXT| `UTC`                                                                                                                         | ✖        | Address the 1-hour shift in start time when clocks change from [Daylight Saving Time to Standard Time][daylight-saving-time-to-standard-time]. For example, `America/Sao_Paulo`.                                                                                                                                                                                                                                                                  |

When a $JOB begins, the `next_start` parameter is set to `infinity`. This
prevents the $JOB from attempting to be started again while it is running. When
the $JOB completes, whether or not the job is successful, the parameter is
automatically updated to the next computed start time.

Note that altering the `next_start` value is only effective for the next
execution of the $JOB in case of fixed schedules. On the next execution, it will
automatically return to the schedule.

## Returns

| Column                         | Type             | Description                                                                                                   |
|--------------------------------|------------------|---------------------------------------------------------------------------------------------------------------|
|`job_id`                        |INTEGER           | The ID of the $JOB being modified                                                                             |
|`schedule_interval`             |INTERVAL          | The interval at which the $JOB runs. Defaults to 24 hours                                                     |
|`max_runtime`                   |INTERVAL          | The maximum amount of time the $JOB is allowed to run by the background worker scheduler before it is stopped |
|`max_retries`                   |INTEGER           | The number of times the $JOB is retried if it fails                                                           |
|`retry_period`                  |INTERVAL          | The amount of time the scheduler waits between retries of the $JOB on failure                                 |
|`scheduled`                     |BOOLEAN           | Returns `true` if the $JOB is executed by the TimescaleDB scheduler                                           |
|`config`                        |JSONB             | $JOB_CAP-specific configuration, passed to the function when it runs                                         |
|`next_start`                    |TIMESTAMPTZ       | The next time to run the $JOB                                                                                  |
|`check_config`                  |TEXT              | The function used to validate updated $JOB configurations                                                      |

[add-policy]: /api/:currentVersion:/compression/add_compression_policy/#required-arguments
[add_columnstore_policy]: /api/:currentVersion:/hypercore/add_columnstore_policy/
[daylight-saving-time-to-standard-time]: https://en.wikipedia.org/wiki/Daylight_saving_time
[remove_columnstore_policy]: /api/:currentVersion:/hypercore/remove_columnstore_policy/
