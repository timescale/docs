---
api_name: add_reorder_policy()
excerpt: Add a policy to reorder rows in hypertable chunks
topics: [hypertables, jobs]
keywords: [hypertables, chunks, policies]
tags: [reorder]
api:
  license: community
  type: function
---

# add_reorder_policy() <Tag type="community">Community</Tag>

Create a policy to reorder chunks on a given hypertable index in the background.
You can have only one reorder policy on each hypertable. Only chunks that are the
third from the most recent are reordered to avoid reordering chunks that are
still being inserted into. For more information about reordering chunks, see the
[reorder_chunk][reorder_chunk] section.

<Highlight type="note">
When a chunk has been reordered by the background worker it is not reordered
again. If you insert significant amounts of data in to older chunks that have
already been reordered, you might need to manually re-run the
[reorder_chunk](/api/latest/hypertable/reorder_chunk)
function on older chunks. Alternatively, you can drop and re-create the policy,
which can work better if you have changed a lot of older chunks.
</Highlight>

## Required arguments

|Name|Type|Description|
|-|-|-|
|`hypertable`|REGCLASS|Hypertable to create the policy for|
|`index_name`|TEXT|Existing index by which to order rows on disk|
|`initial_start`|TIMESTAMPTZ|Time the policy is first run. Defaults to NULL. If omitted, then the schedule interval is the interval between the finish time of the last execution and the next start. If provided, it serves as the origin with respect to which the `next_start` is calculated|
|`timezone`|TEXT|A valid time zone. If `initial_start` is also specified, subsequent executions of the reorder policy are aligned on its initial start. However, daylight savings time (DST) changes might shift this alignment. Set to a valid time zone if this is an issue you want to mitigate. If omitted, UTC bucketing is performed. Defaults to `NULL`.|

## Optional arguments

|Name|Type|Description|
|-|-|-|
|`if_not_exists`|BOOLEAN|Set to true to avoid an error if the `reorder_policy` already exists. A notice is issued instead. Defaults to `false`.|

## Returns

|Column|Type|Description|
|-|-|-|
|`job_id`|INTEGER|TimescaleDB background job ID created to implement this policy|

## Sample usage

```sql
SELECT add_reorder_policy('conditions', 'conditions_device_id_time_idx');
```

Creates a policy to reorder chunks by the existing `(device_id, time)` index.
This applies to chunks that are complete, and are no longer being written to.
For more information about reordering chunks, see the
[reorder_chunk][reorder_chunk] section.

[reorder_chunk]: /api/:currentVersion:/hypertable/reorder_chunk
