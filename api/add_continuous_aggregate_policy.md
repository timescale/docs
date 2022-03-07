## add_continuous_aggregate_policy() <tag type="community">Community</tag>
Create a policy that automatically refreshes a continuous aggregate.

### Required arguments

|Name|Type|Description|
|-|-|-|
|`continuous_aggregate`|REGCLASS|The continuous aggregate to add the policy for|
|`start_offset`|INTERVAL or integer|Start of the refresh window as an interval relative to the time when the policy is executed|
|`end_offset`|INTERVAL or integer|End of the refresh window as an interval relative to the time when the policy is executed|
|`schedule_interval`|INTERVAL|Interval between refresh executions in wall-clock time. Defaults to 24 hours|

The `start_offset` should be greater than `end_offset`.

You must specify the `start_offset` and `end_offset` parameters differently,
depending on the type of the time column of the hypertable:
*   For hypertables with `TIMESTAMP`, `TIMESTAMPTZ`, and `DATE` time columns,
    set the offset as an `INTERVAL` type
*   For hypertables with integer-based timestamps, set the offset as an
    `INTEGER` type.

### Optional arguments

|Name|Type|Description|
|-|-|-|
|`if_not_exists`|BOOLEAN|Set to `true `to issue a notice instead of an error if the job does not exist. Defaults to false.|

### Returns

|Column|Type|Description|
|-|-|-|
|`job_id`|INTEGER|TimescaleDB background job ID created to implement this policy|


### Sample use
Add a policy that refreshes the last month once an hour, excluding the latest
hour from the aggregate. For performance reasons, we recommend that you
exclude buckets that see lots of writes:
```sql
SELECT add_continuous_aggregate_policy('conditions_summary',
	start_offset => INTERVAL '1 month',
	end_offset => INTERVAL '1 hour',
	schedule_interval => INTERVAL '1 hour');
```
