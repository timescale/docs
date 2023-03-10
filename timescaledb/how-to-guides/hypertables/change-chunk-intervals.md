---
title: Change hypertable chunk intervals
excerpt: Adjust your hypertable chunk interval to improve query performance
keywords: [hypertables, chunks]
tags: [performance]
---

# Change hypertable chunk intervals

Adjusting your hypertable chunk interval can improve TimescaleDB performance.
This applies to both regular and distributed hypertables. For more information,
see [best practices for time partitioning][best-practices].

## Check current setting for chunk intervals

Check the current setting for chunk intervals by querying the TimescaleDB
catalog.

```sql
SELECT h.table_name, c.interval_length
  FROM _timescaledb_catalog.dimension c
  JOIN _timescaledb_catalog.hypertable h
    ON h.id = c.hypertable_id;
```

The result looks like this:

```sql
table_name | interval_length
-----------+-----------------
metrics    |    604800000000
(1 row)
```

<Highlight type="note">
Time-based interval lengths are reported in microseconds.
</Highlight>

## Change the chunk interval length when creating a hypertable

The default chunk interval is 7 days. To change this when creating a hypertable,
specify a different `chunk_time_interval` when calling `create_hypertable` or
`create_distributed_hypertable`.

```sql
SELECT create_hypertable(
  'conditions',
  'time',
  chunk_time_interval => INTERVAL '1 day'
);
```

In this example, the table to convert is named `conditions`, and it stores time
values in a column named `time`.

## Change the chunk interval length on an existing hypertable

To change the chunk interval on an already existing hypertable or distributed
hypertable, use the function `set_chunk_time_interval`:

```sql
SELECT set_chunk_time_interval('conditions', INTERVAL '24 hours');
```

In this example, the hypertable is named `conditions`.

<Highlight type="important">
When you change the `chunk_time_interval`, the new setting only applies to new
chunks, not to existing chunks. In practice, this means setting an overly long
interval might take a long time to correct. For example, if you set
`chunk_time_interval` to 1 year and start inserting data, you can no longer
shorten the chunk for that year. In this situation, you can create a new
hypertable and migrate your data.
</Highlight>

[best-practices]: /timescaledb/:currentVersion:/how-to-guides/hypertables/about-hypertables#best-practices-for-time-partitioning
