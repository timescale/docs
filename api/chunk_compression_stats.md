---
api_name: chunk_compression_stats()
excerpt: Get compression-related statistics for chunks
license: community
---

## chunk_compression_stats() <tag type="community">Community</tag> 

Get chunk-specific statistics related to hypertable compression.
All sizes are in bytes.

This view shows the cached size of chunks. The cached sizes are computed 
when `compress_chunk` is executed, or when a compression policy touches 
the chunk. An insert into a compressed chunk does not update the cached 
sizes. For more information about how to compute exact sizes, rather than 
cached sizes, see the `chunks_detailed_size` section.

### Required arguments

|Name|Type|Description|
|---|---|---|
| `hypertable` | REGCLASS | Name of the hypertable |

### Returns 
|Column|Type|Description|
|---|---|---|
|`chunk_schema` | TEXT | Schema name of the chunk |
|`chunk_name` | TEXT | Name of the chunk |
|`number_compressed_chunks` | INTEGER | the number of chunks used by the hypertable that are currently compressed |
|`before_compression_table_bytes` | BIGINT | Size of the heap before compression (NULL if currently uncompressed) |
|`before_compression_index_bytes` | BIGINT | Size of all the indexes before compression (NULL if currently uncompressed) |
|`before_compression_toast_bytes` | BIGINT | Size the TOAST table before compression (NULL if currently uncompressed) |
|`before_compression_total_bytes` | BIGINT | Size of the entire chunk table (table+indexes+toast) before compression (NULL if currently uncompressed) |
|`after_compression_table_bytes` | BIGINT | Size of the heap after compression (NULL if currently uncompressed) |
|`after_compression_index_bytes` | BIGINT | Size of all the indexes after compression (NULL if currently uncompressed) |
|`after_compression_toast_bytes` | BIGINT | Size the TOAST table after compression (NULL if currently uncompressed) |
|`after_compression_total_bytes` | BIGINT | Size of the entire chunk table (table+indexes+toast) after compression (NULL if currently uncompressed) |
|`node_name` | TEXT | nodes on which the chunk is located, applicable only to distributed hypertables |

### Sample usage 
```sql
SELECT * FROM chunk_compression_stats('conditions')
  ORDER BY chunk_name LIMIT 2;

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

Use `pg_size_pretty` get the output in a more human friendly format.
```sql
SELECT pg_size_pretty(after_compression_total_bytes) AS total
  FROM chunk_compression_stats('conditions')
  WHERE compression_status = 'Compressed';

-[ RECORD 1 ]--+------
total | 48 kB

```
