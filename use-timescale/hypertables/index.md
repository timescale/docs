---
title: Hypertables
excerpt: Hypertables are Postgres tables with special features that power real-time analytics on time-series and event data
products: [cloud, mst, self_hosted]
keywords: [hypertables]
---

import HypertableOverview from 'versionContent/_partials/_hypertable-intro.mdx';
import ChunkInterval from "versionContent/_partials/_chunk-interval.mdx";

# Hypertables

<HypertableOverview />

## Partition by time

Each $HYPERTABLE is partitioned into child $HYPERTABLEs called chunks. Each chunk is assigned
a range of time, and only contains data from that range.


### Time partitioning

Typically, you partition $HYPERTABLEs on columns that hold time values.
[Best practice is to use `timestamptz`][postgresql-timestamp] column type. However, you can also partition on
`date`, `integer`, `timestamp` and [UUIDv7][uuidv7_functions] types.

By default, each $HYPERTABLE chunk holds data for 7 days. You can change this to better suit your
needs. For example, if you set `chunk_interval` to 1 day, each chunk stores data for a single day.

$TIMESCALE_DB divides time into potential chunk ranges, based on the `chunk_interval`. Each $HYPERTABLE chunk holds 
data for a specific time range only. When you insert data from a time range that doesn't yet have a chunk, $TIMESCALE_DB
automatically creates a chunk to store it.

In practice, this means that the start time of your earliest chunk does not
necessarily equal the earliest timestamp in your $HYPERTABLE. Instead, there
might be a time gap between the start time and the earliest timestamp. This
doesn't affect your usual interactions with your $HYPERTABLE, but might affect
the number of chunks you see when inspecting it.

## Best practices for scaling and partitioning

Best practices for maintaining a high performance when scaling include:

- Limit the number of $HYPERTABLEs in your $SERVICE_SHORT; having tens of thousands of $HYPERTABLEs is not recommended.
- Choose a strategic chunk size.

Chunk size affects insert and query performance. You want a chunk small enough
to fit into memory so you can insert and query recent data without
reading from disk. However, having too many small and sparsely filled chunks can
affect query planning time and compression. The more chunks in the system, the slower that process becomes, even more so
when all those chunks are part of a single hypertable.

<ChunkInterval />

For a detailed analysis of how to optimize your chunk sizes, see the
[blog post on chunk time intervals][blog-chunk-time]. To learn how
to view and set your chunk time intervals, see 
[Optimize $HYPERTABLE chunk intervals][change-chunk-intervals].

## $HYPERTABLE_CAP indexes

By default, indexes are automatically created when you create a $HYPERTABLE. The default index is on time, descending.
You can prevent index creation by setting the `create_default_indexes` option to `false`.

$HYPERTABLE_CAPs have some restrictions on unique constraints and indexes. If you
want a unique index on a $HYPERTABLE, it must include all the partitioning
columns for the table. To learn more, see 
[Enforce constraints with unique indexes on $HYPERTABLEs][hypertables-and-unique-indexes].

You can prevent index creation by setting the `create_default_indexes` option to `false`.

## Partition by dimension

Partitioning on time is the most common use case for $HYPERTABLE, but it may not be enough for your needs. For example,
you may need to scan for the latest readings that match a certain condition without locking a critical $HYPERTABLE.

<Highlight type="note">

The use case for a partitioning dimension is a multi-tenant setup. You isolate the tenants using the `tenant_id` space
partition. However, you must perform extensive testing to ensure this works as expected, and there is a strong risk of
partition explosion.

</Highlight>

You add a partitioning dimension at the same time as you create the hypertable, when the table is empty. The good news
is that although you select the number of partitions at creation time, as your data grows you can change the number of
partitions later and improve query performance. Changing the number of partitions only affects chunks created after the
change, not existing chunks. To set the number of partitions for a partitioning dimension, call `set_number_partitions`.
For example:

<Procedure>

1. **Create the $HYPERTABLE with the 1-day interval chunk interval**

   ```sql
   CREATE TABLE conditions(
      "time"      timestamptz not null,
      device_id   integer,
      temperature float
   )
   WITH(
      timescaledb.hypertable,
      timescaledb.chunk_interval='1 day'
   );
   ```

1. **Add a hash partition on a non-time column**

   ```sql
   select * from add_dimension('conditions', by_hash('device_id', 3));
   ``` 
   Now use your $HYPERTABLE as usual, but you can also ingest and query efficiently by the `device_id` column.

1. **Change the number of partitions as you data grows**

   ```sql
   select set_number_partitions('conditions', 5, 'device_id');
   ```

</Procedure>

[blog-chunk-time]: https://www.tigerdata.com/blog/timescale-cloud-tips-testing-your-chunk-size
[change-chunk-intervals]: /use-timescale/:currentVersion:/hypertables/improve-query-performance/#optimize-hypertable-chunk-intervals
[hypertables-and-unique-indexes]: /use-timescale/:currentVersion:/hypertables/hypertables-and-unique-indexes/
[postgresql-timestamp]: https://wiki.postgresql.org/wiki/Don't_Do_This#Don.27t_use_timestamp_.28without_time_zone.29
[uuidv7_functions]: /api/:currentVersion:/uuid-functions/
