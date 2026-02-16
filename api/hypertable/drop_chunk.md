---
api_name: drop_chunk()
excerpt: Drop a single chunk
topics: [hypertables, data retention]
keywords: [chunks, hypertables, drop, delete]
api:
  license: community
  type: function
products: [cloud, mst, self_hosted]
---

# drop_chunk()

Drop a single $CHUNK from a [$HYPERTABLE][hypertable-docs].

`drop_chunk()` first validates the $CHUNK status, then if it is safe to remove, it removes both the $CHUNK
table and its entry from the $CHUNK catalog.

You cannot drop compressed $CHUNKs directly. 

## Samples

- **Drop a specific $CHUNK by name**:

  ```sql
  SELECT _timescaledb_functions.drop_chunk('_timescaledb_internal._hyper_1_2_chunk');
  ```

- **Drop a $CHUNK using a variable**:

  ```sql
  DO $$
  DECLARE
    chunk_name regclass;
  BEGIN
    SELECT show_chunks('conditions', older_than => INTERVAL '6 months')
    INTO chunk_name
    LIMIT 1;

    PERFORM _timescaledb_functions.drop_chunk(chunk_name);
  END $$;
  ```

## Arguments

|Name|Type|Default|Required| Description                                                                                                                                                                                 |
|-|-|-|-|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|`chunk`|REGCLASS||✔| The name of the $CHUNK to drop. You can use a schema-qualified name, such as `_timescaledb_internal._hyper_1_2_chunk`. If the $CHUNK is in the search path, you can use the unqualified name. |

## Returns

Returns `true` when the $CHUNK is successfully dropped.

[hypertable-docs]: /use-timescale/:currentVersion:/hypertables/
[drop_chunks]: /api/:currentVersion:/hypertable/drop_chunks/
