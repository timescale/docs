## chunks_detailed_size()   

Get size information about the chunks belonging to a hypertable, returning 
size information for each chunk table itself, any indexes on the chunk, any 
toast tables, and the total size associated with the chunk. All sizes are 
reported in bytes.

If this is a distributed hypertable, the function returns size
information as a separate row per node.

Additional metadata associated with a chunk can be accessed 
via the `timescaledb_information.chunks` view.

#### Required Arguments 

|Name|Description|
|---|---|
| `hypertable` | (REGCLASS) Name of the hypertable |

#### Returns 
|Column|Description|
|---|---|
|chunk_schema| (NAME) Schema name of the chunk |
|chunk_name| (NAME) Name of the chunk|
|table_bytes|(BIGINT) Disk space used by the chunk table|
|index_bytes|(BIGINT) Disk space used by indexes|
|toast_bytes|(BIGINT) Disk space of toast tables|
|total_bytes|(BIGINT) Total disk space used by the chunk, including all indexes and TOAST data|
|node_name| (NAME) Node for which size is reported, applicable only to distributed hypertables|

#### Sample Usage 
```sql
SELECT * FROM chunks_detailed_size('dist_table')
  ORDER BY chunk_name, node_name;

     chunk_schema      |      chunk_name       | table_bytes | index_bytes | toast_bytes | total_bytes |       node_name
-----------------------+-----------------------+-------------+-------------+-------------+-------------+-----------------------
 _timescaledb_internal | _dist_hyper_1_1_chunk |        8192 |       32768 |           0 |       40960 | db_node1
 _timescaledb_internal | _dist_hyper_1_2_chunk |        8192 |       32768 |           0 |       40960 | db_node2
 _timescaledb_internal | _dist_hyper_1_3_chunk |        8192 |       32768 |           0 |       40960 | db_node3
```
---

## hypertable_size()  

Get total size of hypertable i.e. the sum of the size for the table itself, 
any indexes on the table, and any toast tables. The size is reported in bytes. 
This is equivalent to computing the sum of `total_bytes` column from the 
output of `hypertable_detailed_size` function.

#### Required Arguments 

|Name|Description|
|---|---|
| `hypertable` | (REGCLASS) Hypertable to show size of. |

#### Returns 
(BIGINT) Total disk space used by the specified table, including all indexes and TOAST data|

#### Sample Usage 
Get size information for a hypertable.
```sql
SELECT hypertable_size('devices') ;

 hypertable_size
-----------------
           73728
```