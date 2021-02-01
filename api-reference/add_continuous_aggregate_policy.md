## add_continuous_aggregate_policy() <tag type="community">Community</tag> 

Create a policy that automatically refreshes a continuous aggregate.

#### Required Arguments 

|Name|Description|
|---|---|
| `continuous_aggregate` | (REGCLASS) The continuous aggregate to add the policy for. |
| `start_offset` | (INTERVAL or integer) Start of the refresh window as an interval relative to the time when the policy is executed |
| `end_offset` | (INTERVAL or integer) End of the refresh window as an interval relative to the time when the policy is executed |
| `schedule_interval` | (INTERVAL) Interval between refresh executions in wall-clock time. |

The `start_offset` should be greater than `end_offset`.
The `start_offset` and `end_offset` parameters should be specified differently depending on the type of the time column of the hypertable:
- For hypertables with TIMESTAMP, TIMESTAMPTZ, and DATE time columns: the offset should be an INTERVAL type
- For hypertables with integer-based timestamps: the offset should be an integer type.

#### Optional Arguments 

|Name|Description|
|---|---|
| `if_not_exists` | (BOOLEAN) Set to true to avoid throwing an error if the continuous aggregate policy already exists. A notice is issued instead. Defaults to false. |

#### Returns 

|Column|Description|
|---|---|
|`job_id`| (INTEGER)  TimescaleDB background job id created to implement this policy|


#### Sample Usage 

Add a policy that refreshes the last month once an hour, excluding the latest hour from the aggregate (for performance reasons, it is recommended to exclude buckets that still see lots of writes):
```sql
SELECT add_continuous_aggregate_policy('conditions_summary',
	start_offset => INTERVAL '1 month',
	end_offset => INTERVAL '1 hour',
	schedule_interval => INTERVAL '1 hour');
```