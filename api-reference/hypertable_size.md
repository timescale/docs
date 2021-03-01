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

Get size information for all hypertables.
```sql
SELECT hypertable_name, hypertable_size(format('%I.%I', hypertable_schema, hypertable_name)::regclass)
  FROM timescaledb_information.hypertables;
```