---
api_name: hypertable_columnstore_stats()
excerpt: Get columnstore statistics related to the columnstore
topics: [hypercore, columnstore]
keywords: [hypercore, columnstore, hypertables, information]
tags: [statistics, size]
api:
  license: community
  type: procedure
products: [cloud, mst, self_hosted]
---
import Since2180 from "versionContent/_partials/_since_2_18_0.mdx";

# hypertable_columnstore_stats() <Tag type="community">Community</Tag>

Retrieve compression statistics for the $COLUMNSTORE.

For more information about using hypertables, including chunk size partitioning,
see [hypertables][hypertable-docs].

<Since2180 />

## Samples

To retrieve compression statistics:

- **Show the compression status of the `conditions` hypertable**:

   ```sql
   SELECT * FROM hypertable_columnstore_stats('conditions');
   ```
   Returns:
   ```sql   
   -[ RECORD 1 ]------------------+------
   total_chunks                   | 4
   number_compressed_chunks       | 1
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

- **Use `pg_size_pretty` get the output in a more human friendly format**:

   ```sql
   SELECT pg_size_pretty(after_compression_total_bytes) as total
     FROM hypertable_columnstore_stats('conditions');
   ```
   Returns:
   ```sql      
   -[ RECORD 1 ]--+------
   total | 48 kB
   ```

## Arguments

|Name|Type|Description|
|-|-|-|
|`hypertable`|REGCLASS|Hypertable to show statistics for|

## Returns

|Column|Type|Description|
|-|-|-|
|`total_chunks`|BIGINT|The number of chunks used by the hypertable. Returns `NULL` if `compression_status` == `Uncompressed`. |
|`number_compressed_chunks`|INTEGER|The number of chunks used by the hypertable that are currently compressed. Returns `NULL` if `compression_status` == `Uncompressed`. |
|`before_compression_table_bytes`|BIGINT|Size of the heap before compression. Returns `NULL` if `compression_status` == `Uncompressed`. |
|`before_compression_index_bytes`|BIGINT|Size of all the indexes before compression. Returns `NULL` if `compression_status` == `Uncompressed`. |
|`before_compression_toast_bytes`|BIGINT|Size the TOAST table before compression. Returns `NULL` if `compression_status` == `Uncompressed`. |
|`before_compression_total_bytes`|BIGINT|Size of the entire table (`before_compression_table_bytes` + `before_compression_index_bytes` + `before_compression_toast_bytes`) before compression. Returns `NULL` if `compression_status` == `Uncompressed`.|
|`after_compression_table_bytes`|BIGINT|Size of the heap after compression. Returns `NULL` if `compression_status` == `Uncompressed`. |
|`after_compression_index_bytes`|BIGINT|Size of all the indexes after compression. Returns `NULL` if `compression_status` == `Uncompressed`. |
|`after_compression_toast_bytes`|BIGINT|Size the TOAST table after compression. Returns `NULL` if `compression_status` == `Uncompressed`. |
|`after_compression_total_bytes`|BIGINT|Size of the entire table (`after_compression_table_bytes` + `after_compression_index_bytes `+ `after_compression_toast_bytes`) after compression. Returns `NULL` if `compression_status` == `Uncompressed`. |
|`node_name`|TEXT|nodes on which the hypertable is located, applicable only to distributed hypertables. Returns `NULL` if `compression_status` == `Uncompressed`. |

[hypertable-docs]: /use-timescale/:currentVersion:/hypertables/

