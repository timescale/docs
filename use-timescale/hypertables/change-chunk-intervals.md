---
title: Change hypertable chunk intervals
excerpt: Adjust your hypertable chunk interval to improve query performance
products: [cloud, mst, self_hosted]
keywords: [hypertables, chunks]
tags: [performance]
---

# Change hypertable chunk intervals

Adjusting your hypertable chunk interval can improve performance in your database.
This applies to both regular and distributed hypertables. For more information,
see [best practices for time partitioning][best-practices].

## Check current setting for chunk intervals

Check the current setting for chunk intervals by querying the Timescale
catalog. For example:

```sql
SELECT * 
  FROM timescaledb_information.dimensions 
  WHERE hypertable_name = 'metrics';

```

The result looks like:

```sql
hypertable_schema | hypertable_name | dimension_number | column_name |       column_type        | dimension_type | time_interval | integer_interval | integer_now_func | num_partitions
-------------------+-----------------+------------------+-------------+--------------------------+----------------+---------------+------------------+------------------+----------------
 public           | metrics          |                1 | recorded    | timestamp with time zone | Time           | 1 day         |                  |                  |
```

<Highlight type="note">
Time-based interval lengths are reported in microseconds.
</Highlight>

## Change the chunk interval length when creating a hypertable

The default chunk interval is 7 days. To change this when creating a hypertable,
specify a different `chunk_time_interval` when you create the hypertable. In
this example, the table to convert is named `conditions`, and it stores time
values in a column named `time`:

```sql
SELECT create_hypertable(
  'conditions',
  by_range('time', INTERVAL '1 day')
);
```

## Change the chunk interval length on an existing hypertable

To change the chunk interval on an already existing hypertable or distributed
hypertable, use the function `set_chunk_time_interval`. In this example, the
hypertable is named `conditions`:

```sql
SELECT set_chunk_time_interval('conditions', INTERVAL '24 hours');
```

When you change the `chunk_time_interval`, the new setting only applies to new
chunks, not to existing chunks. In practice, this means setting an overly long
interval might take a long time to correct. For example, if you set
`chunk_time_interval` to 1 year and start inserting data, you can no longer
shorten the chunk for that year. If you need to correct this situation, create a
new hypertable and migrate your data.

While chunk turnover does not degrade performance, chunk creation
does take longer lock time than a normal `INSERT` operation into a chunk that has
already been created. This means that if multiple chunks are being created at
the same time, the transactions block each other until the first transaction is
completed.

[best-practices]: /use-timescale/:currentVersion:/hypertables/about-hypertables#best-practices-for-time-partitioning
