## approximate_row_count() 

Get approximate row count for hypertable, distributed hypertable, or regular PostgreSQL table based on catalog estimates.
This function support tables with nested inheritance and declarative partitioning.

The accuracy of approximate_row_count depends on the database having up-to-date statistics about the table or hypertable, which are updated by VACUUM, ANALYZE, and a few DDL commands. If you have auto-vacuum configured on your table or hypertable, or changes to the table are relatively infrequent, you might not need to explicitly ANALYZE your table as shown below. Otherwise, if your table statistics are too out-of-date, running this command will update your statistics and yield more accurate approximation results.

#### Required Arguments 

|Name|Description|
|---|---|
| `relation` | Hypertable or regular PostgreSQL table to get row count for. |

#### Sample Usage 

Get the approximate row count for a single hypertable.
```sql
ANALYZE conditions;

SELECT * FROM approximate_row_count('conditions');
```

The expected output:
```
approximate_row_count
----------------------
               240000
```