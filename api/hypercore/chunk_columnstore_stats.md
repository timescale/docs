---
api_name: chunk_columnstore_stats()
excerpt: Get statistics about chunks in the columnstore
topics: [hypercore, columnstore]
keywords: [columnstore, hypercore, statistics, chunks, information]
tags: [disk space, schemas, size]
api:
  license: community
  type: procedure
products: [cloud, self_hosted]
---
import Since2180 from "versionContent/_partials/_since_2_18_0.mdx";

# chunk_columnstore_stats() <Tag type="community">Community</Tag>

Retrieve statistics about the chunks in the $COLUMNSTORE

`chunk_columnstore_stats` returns the size of chunks in the $COLUMNSTORE, these values are computed when you call either:
- [add_columnstore_policy][add_columnstore_policy]: create a [job][job] that automatically moves chunks in a hypertable to the $COLUMNSTORE at a
  specific time interval.
- [convert_to_columnstore][convert_to_columnstore]: manually add a specific chunk in a hypertable to the $COLUMNSTORE.


Inserting into a chunk in the $COLUMNSTORE does not change the chunk size. For more information about how to compute 
chunk sizes, see [chunks_detailed_size][chunks_detailed_size].

<Since2180 />

## Samples

To retrieve statistics about chunks:

- **Show the status of the first two chunks in the `conditions` hypertable**:
   ```sql
   SELECT * FROM chunk_columnstore_stats('conditions')
     ORDER BY chunk_name LIMIT 2;
   ```
  Returns:
   ```sql
   -[ RECORD 1 ]------------------+----------------------
   chunk_schema                   | _timescaledb_internal
   chunk_name                     | _hyper_1_1_chunk
   compression_status             | Uncompressed
   before_compression_table_bytes |
   before_compression_index_bytes |
   before_compression_toast_bytes |
   before_compression_total_bytes |
   after_compression_table_bytes  |
   after_compression_index_bytes  |
   after_compression_toast_bytes  |
   after_compression_total_bytes  |
   node_name                      |
   -[ RECORD 2 ]------------------+----------------------
   chunk_schema                   | _timescaledb_internal
   chunk_name                     | _hyper_1_2_chunk
   compression_status             | Compressed
   before_compression_table_bytes | 8192
   before_compression_index_bytes | 32768
   before_compression_toast_bytes | 0
   before_compression_total_bytes | 40960
   after_compression_table_bytes  | 8192
   after_compression_index_bytes  | 32768
   after_compression_toast_bytes  | 8192
   after_compression_total_bytes  | 49152
   node_name                      |
   ```

- **Use `pg_size_pretty` to return a more human friendly format**:

   ```sql
   SELECT pg_size_pretty(after_compression_total_bytes) AS total
     FROM chunk_columnstore_stats('conditions')
     WHERE compression_status = 'Compressed';
   ```
  Returns:
   ```sql   
   -[ RECORD 1 ]--+------
   total | 48 kB
   ```


## Arguments

| Name | Type | Default | Required | Description |
|--|--|--|--|--|
|`hypertable`|`REGCLASS`|-|✖| The name of a hypertable |


## Returns

|Column|Type| Description                                                                                                                                                                                                      |
|-|-|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|`chunk_schema`|TEXT| Schema name of the chunk.                                                                                                                                                                                        |
|`chunk_name`|TEXT| Name of the chunk.                                                                                                                                                                                               |
|`compression_status`|TEXT| Current compression status of the chunk.                                                                                                                                                                         |
|`before_compression_table_bytes`|BIGINT| Size of the heap before compression. Returns `NULL` if `compression_status` == `Uncompressed`.                                                                                                                   |
|`before_compression_index_bytes`|BIGINT| Size of all the indexes before compression. Returns `NULL` if `compression_status` == `Uncompressed`.                                                                                                            |
|`before_compression_toast_bytes`|BIGINT| Size the TOAST table before compression. Returns `NULL` if `compression_status` == `Uncompressed`.                                                                                                               |
|`before_compression_total_bytes`|BIGINT| Size of the entire chunk table (`before_compression_table_bytes` + `before_compression_index_bytes` + `before_compression_toast_bytes`) before compression. Returns `NULL` if `compression_status` == `Uncompressed`.|
|`after_compression_table_bytes`|BIGINT| Size of the heap after compression. Returns `NULL` if `compression_status` == `Uncompressed`.                                                                                                                    |
|`after_compression_index_bytes`|BIGINT| Size of all the indexes after compression. Returns `NULL` if `compression_status` == `Uncompressed`.                                                                                                             |
|`after_compression_toast_bytes`|BIGINT| Size the TOAST table after compression. Returns `NULL` if `compression_status` == `Uncompressed`.                                                                                                                |
|`after_compression_total_bytes`|BIGINT| Size of the entire chunk table (`after_compression_table_bytes` + `after_compression_index_bytes `+ `after_compression_toast_bytes`) after compression. Returns `NULL` if `compression_status` == `Uncompressed`. |
|`node_name`|TEXT| **DEPRECATED**: nodes the chunk is located on, applicable only to distributed hypertables.                                                                                                                       |


[add_columnstore_policy]: /api/:currentVersion:/hypercore/add_columnstore_policy/
[convert_to_columnstore]: /api/:currentVersion:/hypercore/convert_to_columnstore/
[job]: /api/:currentVersion:/jobs-automation/add_job/
[chunks_detailed_size]: /api/:currentVersion:/hypertable/chunks_detailed_size/
