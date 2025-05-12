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

Create a policy to reorder the rows of a hypertable's chunks on a specified index. The policy reorders the rows for all chunks except the two most recent ones, because these are still getting writes. By default, the policy runs every 24 hours. To change the schedule, call [alter_job][alter_job] and adjust `schedule_interval`.

You can have only one reorder policy on each hypertable.

For manual reordering of individual chunks, see [reorder_chunk][reorder_chunk].

<Highlight type="note">

When a chunk's rows have been reordered by a policy, they are not reordered
by subsequent runs of the same policy. If you write significant amounts of data into older chunks that have
already been reordered, re-run [reorder_chunk][reorder_chunk] on them. If you have changed a lot of older chunks, it is better to drop and recreate the policy.

</Highlight>

## Required arguments

|Name|Type| Description                                                  |
|-|-|--------------------------------------------------------------|
|`hypertable`|REGCLASS| Hypertable to create the policy for                          |
|`index_name`|TEXT| Existing hypertable index by which to order the rows on disk |


## Optional arguments

|Name|Type| Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
|-|-|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|`if_not_exists`|BOOLEAN| Set to true to avoid an error if the `reorder_policy` already exists. A notice is issued instead. Defaults to `false`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
|`initial_start`|TIMESTAMPTZ| Controls when the policy first runs and how its future run schedule is calculated. <ul><li>If omitted or set to <code>NULL</code> (default): <ul><li>The first run is scheduled at <code>now()</code> + <code>schedule_interval</code> (defaults to 24 hours).</li><li>The next run is scheduled at one full <code>schedule_interval</code> after the end of the previous run.</li></ul></li><li>If set: <ul><li>The first run is at the specified time.</li><li>The next run is scheduled as <code>initial_start</code> + <code>schedule_interval</code> regardless of when the previous run ends.</li></ul></li></ul> |
|`timezone`|TEXT| A valid time zone. If `initial_start` is also specified, subsequent runs of the reorder policy are aligned on its initial start. However, daylight savings time (DST) changes might shift this alignment. Set to a valid time zone if this is an issue you want to mitigate. If omitted, UTC bucketing is performed. Defaults to `NULL`.                                                                                                                                                                                                                                                                                |

## Returns

|Column|Type|Description|
|-|-|-|
|`job_id`|INTEGER|TimescaleDB background job ID created to implement this policy|

## Sample usage

```sql
SELECT add_reorder_policy('conditions', 'conditions_device_id_time_idx');
```

Creates a policy to reorder chunks by the existing `(device_id, time)` index every 24 hours.
This applies to all chunks except the two most recent ones. 

[reorder_chunk]: /api/:currentVersion:/hypertable/reorder_chunk
[alter_job]: /api/:currentVersion:/jobs-automation/alter_job/
