## chunks_detailed_size()   

Get size information about the chunks belonging to a hypertable, returning 
size information for each chunk table itself, any indexes on the chunk, any 
toast tables, and the total size associated with the chunk. All sizes are 
reported in bytes.

If this is a distributed hypertable, the function returns size
information as a separate row per node.

Additional metadata associated with a chunk can be accessed 
via the `timescaledb_information.chunks` view.

### Required Arguments

|Name|Type|Description|
|---|---|---|
| `hypertable` | REGCLASS | Name of the hypertable |

### Returns 
|Column|Type|Description|
|---|---|---|
|chunk_schema| TEXT | Schema name of the chunk |
|chunk_name| TEXT | Name of the chunk|
|table_bytes|(BIGINT) Disk space used by the chunk table|
|index_bytes|(BIGINT) Disk space used by indexes|
|toast_bytes|(BIGINT) Disk space of toast tables|
|total_bytes|(BIGINT) Total disk space used by the chunk, including all indexes and TOAST data|
|node_name| TEXT | Node for which size is reported, applicable only to distributed hypertables|

### Sample Usage 
```sql
SELECT * FROM chunks_detailed_size('dist_table')
  ORDER BY chunk_name, node_name;

     chunk_schema      |      chunk_name       | table_bytes | index_bytes | toast_bytes | total_bytes |       node_name
-----------------------+-----------------------+-------------+-------------+-------------+-------------+-----------------------
 _timescaledb_internal | _dist_hyper_1_1_chunk |        8192 |       32768 |           0 |       40960 | db_node1
 _timescaledb_internal | _dist_hyper_1_2_chunk |        8192 |       32768 |           0 |       40960 | db_node2
 _timescaledb_internal | _dist_hyper_1_3_chunk |        8192 |       32768 |           0 |       40960 | db_node3
```

