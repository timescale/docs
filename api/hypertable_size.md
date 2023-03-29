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

Get the total disk space used by a hypertable or continuous aggregate,
that is, the sum of the size for the table itself including chunks,
any indexes on the table, and any toast tables. The size is reported
in bytes. This is equivalent to computing the sum of `total_bytes`
column from the output of `hypertable_detailed_size` function.

<Highlight type="note">
When a continuous aggregate name is provided, the function
transparently looks up the backing hypertable and returns its statistics
instead.
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
|hypertable_size|BIGINT|Total disk space used by the specified hypertable, including all indexes and TOAST data|

<Highlight type="note">
`NULL` is returned if the function is executed on a non-hypertable relation.
</Highlight>

### Sample usage

Get the size information for a hypertable.

```sql
SELECT hypertable_size('devices');

 hypertable_size
-----------------
           73728
```

Get the size information for all hypertables.

```sql
SELECT hypertable_name, hypertable_size(format('%I.%I', hypertable_schema, hypertable_name)::regclass)
  FROM timescaledb_information.hypertables;
```

Get the size information for a continuous aggregate.

```sql
SELECT hypertable_size('device_stats_15m');

 hypertable_size
-----------------
           73728
```

[hypertable-docs]: /use-timescale/:currentVersion:/hypertables/
