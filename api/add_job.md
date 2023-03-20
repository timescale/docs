---
api_name: add_job()
excerpt: Add a job to run a user-defined action automatically
topics: [jobs]
keywords: [jobs]
tags: [user-defined actions, scheduled jobs, background jobs, automation framework]
api:
  license: community
  type: function
---

# add_job() <Tag type="community">Community</Tag>

Register an action for scheduling by the automation framework. For more information about scheduling, including example actions, see the [actions section][using-actions].

### Required arguments

|Name|Type|Description|
|-|-|-|
|`proc`|REGPROC|Name of the function or procedure to register as job|
|`schedule_interval`|INTERVAL|Interval between executions of this job. Defaults to 24 hours|

### Optional arguments

|Name|Type|Description|
|-|-|-|
|`config`|JSONB|Job-specific configuration, passed to the function when it runs|
|`initial_start`|TIMESTAMPTZ|Time the job is first run. In the case of fixed schedules, this also serves as the origin on which job executions are aligned. If omitted, the current time is used as origin in the case of fixed schedules.|
|`scheduled`|BOOLEAN|Set to `FALSE` to exclude this job from scheduling. Defaults to `TRUE`. |
|`check_config`|`REGPROC`|A function that takes a single argument, the `JSONB` `config` structure. The function is expected to raise an error if the configuration is not valid, and return nothing otherwise. Can be used to validate the configuration when adding a job. Only functions, not procedures, are allowed as values for `check_config`.|
|`fixed_schedule`|BOOLEAN|Set to `FALSE` if you want the next start of a job to be determined as its last finish time plus the schedule interval. Set to `TRUE` if you want the next start of a job to begin `schedule_interval` after the last start. Defaults to `TRUE`|
|`timezone`|TEXT|A valid time zone. If fixed_schedule is `TRUE`, subsequent executions of the job are aligned on its initial start. However, daylight savings time (DST) changes may shift this alignment. Set to a valid time zone if you want to mitigate this issue. Defaults to `NULL`.|

### Returns

|Column|Type|Description|
|-|-|-|
|`job_id`|INTEGER|TimescaleDB background job ID|

### Sample use

Register the `user_defined_action` procedure to run every hour:

```sql
CREATE OR REPLACE PROCEDURE user_defined_action(job_id int, config jsonb) LANGUAGE PLPGSQL AS
$$
BEGIN
  RAISE NOTICE 'Executing action % with config %', job_id, config;
END
$$;

SELECT add_job('user_defined_action','1h');
SELECT add_job('user_defined_action','1h', fixed_schedule => false);
```

Register the `user_defined_action` procedure to run at midnight every Sunday.
The `initial_start` provided must satisfy these requirements, so it must be a Sunday midnight:

```sql
-- December 4, 2022 is a Sunday
SELECT add_job('user_defined_action','1 week', initial_start => '2022-12-04 00:00:00+00'::timestamptz);
-- if subject to DST
SELECT add_job('user_defined_action','1 week', initial_start => '2022-12-04 00:00:00+00'::timestamptz, timezone => 'Europe/Berlin');
```

[using-actions]: /use-timescale/:currentVersion:/user-defined-actions
