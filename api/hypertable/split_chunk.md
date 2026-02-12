---
api_name: split_chunk()
excerpt: Split a large chunk at a specific point in time.
topics: [hypertables]
keywords: [chunks, hypertables, split]
api:
  license: community
  type: function
products: [cloud, mst, self_hosted]
---

# split_chunk() <Tag type="community">Community</Tag>

Split a large chunk at a specific point in time. If you do not specify the timestamp to split at, `chunk` 
is split equally. 

## Samples

* Split a chunk at a specific time:

    ```sql
    CALL split_chunk('chunk_1', split_at => '2025-03-01 00:00');
    ```

* Split a chunk in two:

  For example, If the chunk duration is, 24 hours, the following command splits `chunk_1` into 
  two chunks of 12 hours each.
    ```sql
    CALL split_chunk('chunk_1');
    ```
  
## Required arguments

|Name|Type| Required | Description                      |
|---|---|---|----------------------------------|
| `chunk` | REGCLASS | ✔ | Name of the chunk to split.      |
| `split_at` | `TIMESTAMPTZ`| ✖ |Timestamp to split the chunk at. |


## Returns

This function returns void.

