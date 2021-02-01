## hypertable_index_size()  

Get size of an index on a hypertable. The size is reported in bytes.

#### Required Arguments 

|Name|Description|
|---|---|
| `index_name` | (REGCLASS) Name of the index on a  hypertable |

#### Returns 
(BIGINT) Returns disk space used by the index. 

#### Sample Usage 

Get size of a specific index on a hypertable.

```sql
\d conditions_table
                     Table "public.test_table"
 Column |           Type           | Collation | Nullable | Default 
--------+--------------------------+-----------+----------+---------
 time   | timestamp with time zone |           | not null | 
 device | integer                  |           |          | 
 volume | integer                  |           |          | 
Indexes:
    "second_index" btree ("time")
    "test_table_time_idx" btree ("time" DESC)
    "third_index" btree ("time")

SELECT hypertable_index_size('second_index');

 hypertable_index_size 
-----------------------
                163840

SELECT pg_size_pretty(hypertable_index_size('second_index'));

 pg_size_pretty 
----------------
 160 kB

```