---
api_name: add_retention_policy()
excerpt: Add a policy to drop older chunks
topics: [data retention, jobs]
keywords: [data retention, policies, delete]
tags: [hypertables, drop]
api:
  license: community
  type: function
---

# add_retention_policy() <Tag type="community">Community</Tag>

Create a policy to drop chunks older than a given interval of a particular
hypertable or continuous aggregate on a schedule in the background. (See [drop_chunks][drop_chunks]).
This implements a data retention policy and removes data on a schedule. Only
one retention policy may exist per hypertable.

### Required arguments

|Name|Type|Description|
|---|---|---|
| `relation` | REGCLASS | Name of the hypertable or continuous aggregate to create the policy for. |
| `drop_after` | INTERVAL or INTEGER | Chunks fully older than this interval when the policy is run are dropped|

The `drop_after` parameter should be specified differently depending on the
type of the time column of the hypertable:

*   For hypertables with TIMESTAMP, TIMESTAMPTZ, and DATE time columns: the time
interval should be an INTERVAL type.
*   For hypertables with integer-based timestamps: the time interval should be an
integer type (this requires the [integer_now_func][set_integer_now_func] to be set).

### Optional arguments

|Name|Type|Description|
|---|---|---|
| `if_not_exists` | BOOLEAN | Set to true to avoid throwing an error if the drop_chunks_policy already exists. A notice is issued instead. Defaults to false. |
|`schedule_interval`|INTERVAL|How long to wait after a job finishes to start it again. Defaults to NULL. If omitted, then the schedule interval is set to 1 day|
|`initial_start`|TIMESTAMPTZ|Time the policy is first run. Defaults to NULL. If omitted, then the schedule interval is the interval between the finish time of the last execution and the next start. If provided, it serves as the origin with respect to which the next_start is calculated |
|`timezone`|TEXT|A valid time zone. If `initial_start` is also specified, subsequent executions of the retention policy are aligned on its initial start. However, daylight savings time (DST) changes may shift this alignment. Set to a valid time zone if this is an issue you want to mitigate. If omitted, UTC bucketing is performed. Defaults to `NULL`.|

### Returns

|Column|Type|Description|
|---|---|---|
|`job_id`| INTEGER |  TimescaleDB background job id created to implement this policy|

### Sample usage

Create a data retention policy to discard chunks greater than 6 months old:

```sql
SELECT add_retention_policy('conditions', INTERVAL '6 months');
```

Create a data retention policy with an integer-based time column:

```sql
SELECT add_retention_policy('conditions', BIGINT '600000');
```

[drop_chunks]: /api/:currentVersion:/hypertable/drop_chunks/
[set_integer_now_func]: /api/:currentVersion:/hypertable/set_integer_now_func/
