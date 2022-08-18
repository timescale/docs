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

## add_reorder_policy() <tag type="community">Community</tag>

Create a policy to reorder chunks on a given hypertable index in the
background. (See [reorder_chunk][reorder_chunk]). Only one reorder policy may
exist per hypertable. Only chunks that are the third from the most recent are
reordered to avoid reordering chunks that are still being inserted into.

<highlight type="tip">
 Once a chunk has been reordered by the background worker it is not
reordered again. So if one were to insert significant amounts of data in to
older chunks that have already been reordered, it might be necessary to manually
re-run the [reorder_chunk](/api/latest/hypertable/reorder_chunk) function on older chunks, or to drop
and re-create the policy if many older chunks have been affected.
</highlight>

### Required arguments

|Name|Type|Description|
|---|---|---|
| `hypertable` | REGCLASS | Hypertable to create the policy for. |
| `index_name` | TEXT | Existing index by which to order rows on disk. |

### Optional arguments

|Name|Type|Description|
|---|---|---|
| `if_not_exists` | BOOLEAN |  Set to true to avoid throwing an error if the reorder_policy already exists. A notice is issued instead. Defaults to false. |

### Returns

|Column|Type|Description|
|---|---|---|
|`job_id`| INTEGER | TimescaleDB background job id created to implement this policy|

### Sample usage

```sql
SELECT add_reorder_policy('conditions', 'conditions_device_id_time_idx');
```

Creates a policy to reorder completed chunks by the existing `(device_id, time)` index. (See [reorder_chunk][reorder_chunk]).

[reorder_chunk]: /api/:currentVersion:/hypertable/reorder_chunk
