---
api_name: add_continuous_aggregate_policy()
excerpt: Add policy to schedule automatic refresh of a continuous aggregate
license: community
topic: continuous aggregates
keywords: [continuous aggregates, policies]
tags: [scheduled jobs, refresh]
---

## add_continuous_aggregate_policy() <tag type="community">Community</tag>
Create a policy that automatically refreshes a continuous aggregate. To view the
policies that you set or the policies that already exist, see 
[informational views][informational-views].

### Required arguments

|Name|Type|Description|
|-|-|-|
|`continuous_aggregate`|REGCLASS|The continuous aggregate to add the policy for|
|`start_offset`|INTERVAL or integer|Start of the refresh window as an interval relative to the time when the policy is executed. `NULL` is eqivalent to `MIN(timestamp)` of the hypertable.|
|`end_offset`|INTERVAL or integer|End of the refresh window as an interval relative to the time when the policy is executed. `NULL` is eqivalent to `MAX(timestamp)` of the hypertable.|
|`schedule_interval`|INTERVAL|Interval between refresh executions in wall-clock time. Defaults to 24 hours|

The `start_offset` should be greater than `end_offset`.

You must specify the `start_offset` and `end_offset` parameters differently,
depending on the type of the time column of the hypertable:
*   For hypertables with `TIMESTAMP`, `TIMESTAMPTZ`, and `DATE` time columns,
    set the offset as an `INTERVAL` type
*   For hypertables with integer-based timestamps, set the offset as an
    `INTEGER` type.

<highlight type="warning">
While setting `end_offset` to `NULL` is possible, it is not recommended. To 
include the most recent data in your aggregates, use 
[real-time aggregation](/timescaledb/latest/how-to-guides/continuous-aggregates/real-time-aggregates/)
instead.
</highlight>

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
[informational-views]: /api/:currentVersion:/informational-views/jobs/