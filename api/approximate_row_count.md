---
api_name: approximate_row_count()
excerpt: Estimate the number of rows in a table
topics: [hyperfunctions]
keywords: [count, hyperfunctions]
tags: [approximate, rows]
api:
  license: apache
  type: function
  version:
    stable: 0.10.0
hyperfunction:
  type: one-step aggregate
---

# approximate_row_count()

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
