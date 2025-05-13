---
api_name: split_chunk()
excerpt: Split a large chunk at a specific point in time.
topics: [hypertables]
keywords: [chunks, hypertables, split]
api:
  license: community
  type: function
---

# split_chunk() <Tag type="community">Community</Tag>

Split a large chunk at a specific point in time.

## Required arguments

|Name|Type| Description                      |
|---|---|----------------------------------|
| `chunk` | REGCLASS | Name of the chunk to split.      |
| `split_at` | `TIMESTAMPTZ`| Timestamp to split the chunk at. |


## Returns

This function returns void.

## Sample usage

Split a chunk at a specific time:

```sql
CALL split_chunk('chunk_1', split_at => '2025-03-01 00:00');
```

