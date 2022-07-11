---
api_name: hypertable_compression_stats()
excerpt: Get hypertable statistics related to compression
license: community
topic: compression
keywords: [compression, hypertables, information]
tags: [statistics, size]
---

## hypertable_compression_stats() <tag type="community">Community</tag> 

Get statistics related to hypertable compression.
All sizes are in bytes.

### Required arguments

|Name|Type|Description|
|---|---|---|
| `hypertable` | REGCLASS | Hypertable to show stats for. |

### Returns 
|Column|Type|Description|
|---|---|---|
|`total_chunks` | BIGINT | the number of chunks used by the hypertable |
|`number_compressed_chunks` | INTEGER | the number of chunks used by the hypertable that are currently compressed |
|`before_compression_table_bytes` | BIGINT | Size of the heap before compression (NULL if currently uncompressed) |
|`before_compression_index_bytes` | BIGINT | Size of all the indexes before compression (NULL if currently uncompressed) |
|`before_compression_toast_bytes` | BIGINT | Size the TOAST table before compression (NULL if currently uncompressed) |
|`before_compression_total_bytes` | BIGINT | Size of the entire table (table+indexes+toast) before compression (NULL if currently uncompressed) |
|`after_compression_table_bytes` | BIGINT | Size of the heap after compression (NULL if currently uncompressed) |
|`after_compression_index_bytes` | BIGINT | Size of all the indexes after compression (NULL if currently uncompressed) |
|`after_compression_toast_bytes` | BIGINT | Size the TOAST table after compression (NULL if currently uncompressed) |
|`after_compression_total_bytes` | BIGINT | Size of the entire table (table+indexes+toast) after compression (NULL if currently uncompressed) |
|`node_name` | TEXT | nodes on which the hypertable is located, applicable only to distributed hypertables |

### Sample usage 
```sql
SELECT * FROM hypertable_compression_stats('conditions');

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

Use `pg_size_pretty` get the output in a more human friendly format.
```sql
SELECT pg_size_pretty(after_compression_total_bytes) as total
  FROM hypertable_compression_stats('conditions');

-[ RECORD 1 ]--+------
total | 48 kB

```
