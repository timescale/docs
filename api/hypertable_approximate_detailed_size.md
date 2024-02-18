---
api_name: hypertable_approximate_detailed_size()
excerpt: Get detailed information about approximate disk space used by a hypertable
topics: [hypertables]
keywords: [hypertables, information]
tags: [statistics, size, disk space]
api:
  license: apache
  type: function
---

# hypertable_approximate_detailed_size()

Get detailed information about approximate disk space used by a hypertable or
continuous aggregate, returning size information for the table
itself, any indexes on the table, any toast tables, and the total
size of all. All sizes are reported in bytes.

When a continuous aggregate name is provided, the function
transparently looks up the backing hypertable and returns its approximate
size statistics instead.

<Highlight type="note">
This function relies on the per backend caching using the in-built
PostgreSQL storage manager layer to compute the approximate size
cheaply. The PG cache invalidation clears off the cached size for a
chunk when DML happens into it. That size cache is thus able to get
the latest size in a matter of minutes. Also, due to the backend
caching, any long running session will only fetch latest data for new
or modified chunks and can use the cached data (which is calculated
afresh the first time around) effectively for older chunks. Thus it
is recommended to use a single connected postgres backend session to
compute the approximate sizes of hypertables to get faster results.
</Highlight>

For more information about using hypertables, including chunk size partitioning,
see the [hypertable section][hypertable-docs].

### Required arguments

|Name|Type|Description|
|---|---|---|
| `hypertable` | REGCLASS | Hypertable or continuous aggregate to show detailed approximate size of. |

### Returns

|Column|Type|Description|
|-|-|-|
|table_bytes|BIGINT|Approximate disk space used by main_table (like `pg_relation_size(main_table)`)|
|index_bytes|BIGINT|Approximate disk space used by indexes|
|toast_bytes|BIGINT|Approximate disk space of toast tables|
|total_bytes|BIGINT|Approximate total disk space used by the specified table, including all indexes and TOAST data|

<Highlight type="note">
If executed on a relation that is not a hypertable, the function
returns `NULL`.
</Highlight>

### Sample usage

Get the approximate size information for a hypertable.

```sql
SELECT * FROM hypertable_approximate_detailed_size('hyper_table');
 table_bytes | index_bytes | toast_bytes | total_bytes
-------------+-------------+-------------+-------------
        8192 |       24576 |       32768 |       65536
```

[hypertable-docs]: /use-timescale/:currentVersion:/hypertables/
