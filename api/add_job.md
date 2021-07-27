## add_job() <tag type="community">Community</tag>

Register an action to be scheduled by our automation framework.
Please read the [instructions][using-actions] for more details including
multiple example actions.

### Required Arguments

|Name|Type|Description|
|---|---|---|
| `proc` | REGPROC | Name of the function or procedure to register as job|
| `schedule_interval` | INTERVAL | Interval between executions of this job|

### Optional Arguments

|Name|Type|Description|
|---|---|---|
| `config` | JSONB | Job-specific configuration (this will be passed to the function when executed) |
| `initial_start` | TIMESTAMPTZ | Time of first execution of job |
| `scheduled` | BOOLEAN | Set to `FALSE` to exclude this job from scheduling. Defaults to `TRUE`. |

### Returns

|Column|Type|Description|
|---|---|---|
|`job_id`| INTEGER  | TimescaleDB background job id |

### Sample Usage

```sql
CREATE OR REPLACE PROCEDURE user_defined_action(job_id int, config jsonb) LANGUAGE PLPGSQL AS
$$
BEGIN
  RAISE NOTICE 'Executing action % with config %', job_id, config;
END
$$;

SELECT add_job('user_defined_action','1h');
```

Register the procedure `user_defined_action` to be run every hour.


[using-actions]: /overview/core-concepts/user-defined-actions/
