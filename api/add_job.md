---
api_name: add_job()
excerpt: Add a job to run a user-defined action automatically
license: community
topic: jobs
tags: [user-defined actions, scheduled jobs, automation framework, background jobs]
---

## add_job() <tag type="community">Community</tag>
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
|`initial_start`|TIMESTAMPTZ|Time the job is first run|
|`scheduled`|BOOLEAN|Set to `FALSE` to exclude this job from scheduling. Defaults to `TRUE`. |

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
```


[using-actions]: /timescaledb/:currentVersion:/overview/core-concepts/user-defined-actions
