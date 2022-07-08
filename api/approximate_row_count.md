---
api_name: approximate_row_count()
excerpt: Estimate the number of rows in a table
license: apache
topic: hyperfunctions
tags: [approximate, count, hyperfunctions, rows]
---

## approximate_row_count()

Get approximate row count for hypertable, distributed hypertable, or regular PostgreSQL table based on catalog estimates.
This function supports tables with nested inheritance and declarative partitioning.

The accuracy of `approximate_row_count` depends on the database having up-to-date statistics about the table or hypertable, which are updated by `VACUUM`, `ANALYZE`, and a few DDL commands. If you have auto-vacuum configured on your table or hypertable, or changes to the table are relatively infrequent, you might not need to explicitly `ANALYZE` your table as shown below. Otherwise, if your table statistics are too out-of-date, running this command updates your statistics and yields more accurate approximation results.

### Required arguments

|Name|Type|Description|
|---|---|---|
| `relation` | REGCLASS | Hypertable or regular PostgreSQL table to get row count for. |

### Sample usage

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
