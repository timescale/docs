---
api_name: hypertable_compression_stats()
excerpt: Get hypertable statistics related to compression
topics: [compression]
keywords: [compression, hypertables, information]
tags: [statistics, size]
api:
  license: community
  type: function
---

# hypertable_compression_stats() <Tag type="community">Community</Tag>

Get statistics related to hypertable compression. All sizes are in bytes.

For more information about using hypertables, including chunk size partitioning,
see the [hypertable section][hypertable-docs].

For more information about compression, see the
[compression sction][compression-docs].

### Required arguments

|Name|Type|Description|
|-|-|-|
|`hypertable`|REGCLASS|Hypertable to show statistics for|

### Returns

|Column|Type|Description|
|-|-|-|
|`total_chunks`|BIGINT|The number of chunks used by the hypertable|
|`number_compressed_chunks`|INTEGER|The number of chunks used by the hypertable that are currently compressed|
|`before_compression_table_bytes`|BIGINT|Size of the heap before compression|
|`before_compression_index_bytes`|BIGINT|Size of all the indexes before compression|
|`before_compression_toast_bytes`|BIGINT|Size the TOAST table before compression|
|`before_compression_total_bytes`|BIGINT|Size of the entire table (table+indexes+toast) before compression|
|`after_compression_table_bytes`|BIGINT|Size of the heap after compression|
|`after_compression_index_bytes`|BIGINT|Size of all the indexes after compression|
|`after_compression_toast_bytes`|BIGINT|Size the TOAST table after compression|
|`after_compression_total_bytes`|BIGINT|Size of the entire table (table+indexes+toast) after compression|
|`node_name`|TEXT|nodes on which the hypertable is located, applicable only to distributed hypertables|

<Highlight type="note">
Returns show `NULL` if the data is currently uncompressed.
</Highlight>

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

[hypertable-docs]: /use-timescale/:currentVersion:/hypertables/
[compression-docs]: /use-timescale/:currentVersion:/compression/
