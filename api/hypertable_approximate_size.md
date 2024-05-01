---
api_name: hypertable_approximate_size()
excerpt: Get the approximate total disk space used by a hypertable
topics: [hypertables]
keywords: [hypertables, information]
tags: [disk space, size]
api:
  license: apache
  type: function
---

# hypertable_approximate_size()

Get the approximate total disk space used by a hypertable or continuous aggregate,
that is, the sum of the size for the table itself including chunks,
any indexes on the table, and any toast tables. The size is reported
in bytes. This is equivalent to computing the sum of `total_bytes`
column from the output of `hypertable_approximate_detailed_size` function.

When a continuous aggregate name is provided, the function
transparently looks up the backing hypertable and returns its statistics
instead.

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
|-|-|-|
|`hypertable`|REGCLASS|Hypertable or continuous aggregate to show size of.|

### Returns

|Name|Type|Description|
|-|-|-|
|hypertable_approximate_size|BIGINT|Total approximate disk space used by the specified hypertable, including all indexes and TOAST data|

<Highlight type="note">
`NULL` is returned if the function is executed on a non-hypertable relation.
</Highlight>

### Sample usage

Get the approximate size information for a hypertable.

```sql
SELECT * FROM hypertable_approximate_size('devices');
 hypertable_approximate_size
-----------------------------
                        8192
```

Get the approximate size information for all hypertables.

```sql
SELECT hypertable_name, hypertable_approximate_size(format('%I.%I', hypertable_schema, hypertable_name)::regclass)
  FROM timescaledb_information.hypertables;
```

Get the approximate size information for a continuous aggregate.

```sql
SELECT hypertable_approximate_size('device_stats_15m');

 hypertable_approximate_size
-----------------------------
                        8192
```

[hypertable-docs]: /use-timescale/:currentVersion:/hypertables/
