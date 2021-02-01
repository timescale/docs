## hypertable_detailed_size()  

Get size of hypertable like `pg_relation_size(hypertable)`, returning 
size information for the table itself, any indexes on the table, any 
toast tables, and the total size of all. All sizes are reported in bytes.
If this is a distributed hypertable, the function returns size
information as a separate row per node. 

#### Required Arguments 

|Name|Description|
|---|---|
| `hypertable` | (REGCLASS) Hypertable to show detailed size of. |

#### Returns 
|Column|Description|
|---|---|
|table_bytes|(BIGINT) Disk space used by main_table (like pg_relation_size(main_table))|
|index_bytes|(BIGINT) Disk space used by indexes|
|toast_bytes|(BIGINT) Disk space of toast tables|
|total_bytes|(BIGINT) Total disk space used by the specified table, including all indexes and TOAST data|
|node_name| (NAME) Node for which size is reported, applicable only to distributed hypertables|

#### Sample Usage 
Get size information for a hypertable.
```sql
-- disttable is a distributed hypertable --
SELECT * FROM hypertable_detailed_size('disttable') ORDER BY node_name;

 table_bytes | index_bytes | toast_bytes | total_bytes |  node_name
-------------+-------------+-------------+-------------+-------------
       16384 |       32768 |           0 |       49152 | data_node_1
        8192 |       16384 |           0 |       24576 | data_node_2

```