---
api_name: chunks_detailed_size()
excerpt: Get detailed information about disk space used by chunks
topics: [hypertables]
keywords: [chunks, hypertables, size, information]
tags: [disk space, schemas]
api:
  license: community
  type: function
---

# chunks_detailed_size()

Get information about the disk space used by the chunks belonging to a
hypertable, returning size information for each chunk table, any
indexes on the chunk, any toast tables, and the total size associated
with the chunk. All sizes are reported in bytes.

If the function is executed on a distributed hypertable, it returns
disk space usage information as a separate row per node. The access
node is not included since it doesn't have any local chunk data.

Additional metadata associated with a chunk can be accessed
via the `timescaledb_information.chunks` view.

### Required arguments

|Name|Type|Description|
|---|---|---|
| `hypertable` | REGCLASS | Name of the hypertable |

### Returns

|Column|Type|Description|
|---|---|---|
|chunk_schema| TEXT | Schema name of the chunk |
|chunk_name| TEXT | Name of the chunk|
|table_bytes|BIGINT | Disk space used by the chunk table|
|index_bytes|BIGINT | Disk space used by indexes|
|toast_bytes|BIGINT | Disk space of toast tables|
|total_bytes|BIGINT | Total disk space used by the chunk, including all indexes and TOAST data|
|node_name| TEXT | Node for which size is reported, applicable only to distributed hypertables|

<Highlight type="tip">
If executed on a relation that is not a hypertable, the function
returns `NULL`.
</Highlight>

### Sample usage

```sql
SELECT * FROM chunks_detailed_size('dist_table')
  ORDER BY chunk_name, node_name;

     chunk_schema      |      chunk_name       | table_bytes | index_bytes | toast_bytes | total_bytes |       node_name
-----------------------+-----------------------+-------------+-------------+-------------+-------------+-----------------------
 _timescaledb_internal | _dist_hyper_1_1_chunk |        8192 |       32768 |           0 |       40960 | data_node_1
 _timescaledb_internal | _dist_hyper_1_2_chunk |        8192 |       32768 |           0 |       40960 | data_node_2
 _timescaledb_internal | _dist_hyper_1_3_chunk |        8192 |       32768 |           0 |       40960 | data_node_3
```
