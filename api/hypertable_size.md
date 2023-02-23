---
api_name: hypertable_size()
excerpt: Get the total disk space used by a hypertable
topics: [hypertables]
keywords: [hypertables, information]
tags: [disk space, size]
api:
  license: apache
  type: function
---

# hypertable_size()  

Get the total disk space used by a hypertable, that is, the sum of the
size for the table itself (including chunks), any indexes on the
table, and any toast tables. The size is reported in bytes. This is
equivalent to computing the sum of `total_bytes` column from the
output of `hypertable_detailed_size` function.

### Required arguments

|Name|Type|Description|
|---|---|---|
| `hypertable` | REGCLASS | Hypertable to show size of. |

### Returns

|Name|Type|Description|
|---|---|---|
|hypertable_size| BIGINT | Total disk space used by the specified hypertable, including all indexes and TOAST data. |

<Highlight type="tip">
`NULL` is returned if the function is executed on a non-hypertable relation.
</Highlight>

### Sample usage

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
