---
api_name: add_retention_policy()
excerpt: Add a policy to drop older chunks
topics: [data retention, jobs]
keywords: [data retention, policies, delete]
tags: [hypertables, drop]
api:
  license: community
  type: function
products: [cloud, self_hosted, mst]
---

# add_retention_policy() <Tag type="community">Community</Tag>

Create a policy to drop chunks older than a given interval of a particular
hypertable or continuous aggregate on a schedule in the background. For more
information, see the [drop_chunks][drop_chunks] section. This implements a data
retention policy and removes data on a schedule. Only one retention policy may
exist per hypertable.

When you create a retention policy on a hypertable with an integer based time column, you must set the 
[integer_now_func][set_integer_now_func] to match your data. If you are seeing `invalid value` issues when you 
call `add_retention_policy`, set `VERBOSITY verbose` to see the full context.

## Samples

- **Create a data retention policy to discard chunks greater than 6 months old**:

    ```sql
    SELECT add_retention_policy('conditions', drop_after => INTERVAL '6 months');
    ```
    When you call `drop_after`, the time data range present in the partitioning time column is used to select the target
    chunks.
 
- **Create a data retention policy with an integer-based time column**:

    ```sql
    SELECT add_retention_policy('conditions', drop_after => BIGINT '600000');
    ```

- **Create a data retention policy to discard chunks created before 6 months**:

    ```sql
    SELECT add_retention_policy('conditions', drop_created_before => INTERVAL '6 months');
    ```
    When you call `drop_created_before`, chunks created 3 months ago are selected.

## Arguments

| Name | Type | Default | Required | Description                                                                                                                                                                                                                                                                                                                                                                                                                            |
|-|-|-|-|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|`relation`|REGCLASS|-|✔| Name of the hypertable or continuous aggregate to create the policy for                                                                                                                                                                                                                                                                                                                                                                |
|`drop_after`|INTERVAL or INTEGER|-|✔| Chunks fully older than this interval when the policy is run are dropped. <BR/> You specify `drop_after` differently depending on the hypertable time column type: <ul><li>TIMESTAMP, TIMESTAMPTZ, and DATE: use INTERVAL type</li><li>Integer-based timestamps: use INTEGER type. You must set <a href="https://www.tigerdata.com/docs/api/latest/hypertable/set_integer_now_func/">integer_now_func</a> to match your data</li></ul> |
|`schedule_interval`|INTERVAL|`NULL`|✖| The interval between the finish time of the last execution and the next start.                                                                                                                                                                                                                                                                                                                                                         |
|`initial_start`|TIMESTAMPTZ|`NULL`|✖| Time the policy is first run. If omitted, then the schedule interval is the interval between the finish time of the last execution and the next start. If provided, it serves as the origin with respect to which the next_start is calculated.                                                                                                                                                                                        |
|`timezone`|TEXT|`NULL`|✖| A valid time zone. If `initial_start` is also specified, subsequent executions of the retention policy are aligned on its initial start. However, daylight savings time (DST) changes may shift this alignment. Set to a valid time zone if this is an issue you want to mitigate. If omitted, UTC bucketing is performed.                                                                                                             |
|`if_not_exists`|BOOLEAN|`false`|✖| Set to `true` to avoid an error if the `drop_chunks_policy` already exists. A notice is issued instead.                                                                                                                                                                                                                                                                                                                                |
|`drop_created_before`|INTERVAL|`NULL`|✖| Chunks with creation time older than this cut-off point are dropped. The cut-off point is computed as `now() - drop_created_before`. Not supported for continuous aggregates yet.                                                                                                                                                                                                                                                      |

You specify `drop_after` differently depending on the hypertable time column type:

*  TIMESTAMP, TIMESTAMPTZ, and DATE time columns: the time interval should be an INTERVAL type.
*  Integer-based timestamps: the time interval should be an integer type. You must set the [integer_now_func][set_integer_now_func].

## Returns

|Column|Type|Description|
|-|-|-|
|`job_id`|INTEGER|TimescaleDB background job ID created to implement this policy|

[drop_chunks]: /api/:currentVersion:/hypertable/drop_chunks/
[set_integer_now_func]: /api/:currentVersion:/hypertable/set_integer_now_func/
