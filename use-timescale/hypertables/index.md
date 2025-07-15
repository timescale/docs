---
title: Hypertables
excerpt: Hypertables are Postgres tables with special features that power real-time analytics on time-series and event data
products: [cloud, mst, self_hosted]
keywords: [hypertables]
---

import HypertableIntro from 'versionContent/_partials/_hypertable-intro.mdx';
import ChunkInterval from "versionContent/_partials/_chunk-interval.mdx";

# Hypertables

<HypertableIntro />

![Hypertable structure](https://assets.timescale.com/docs/images/hypertable-structure.png)


## Partition by time

Each $HYPERTABLE is partitioned into child $HYPERTABLEs called chunks. Each chunk is assigned
a range of time, and only contains data from that range.

### Time partitioning

By default, each $HYPERTABLE chunk holds data for 7 days. You can change this to better suit your
needs. For example, if you set `chunk_interval` to 1 day, each chunk stores data for a single day.

The following figure shows the difference in structure between a relational table and a hypertable:

![Compare a relational table to a hypertable](https://assets.timescale.com/docs/images/getting-started/hypertables-chunks.webp)

$TIMESCALE_DB divides time into potential chunk ranges, based on the `chunk_interval`. Each $HYPERTABLE chunk holds 
data for a specific time range only. When you insert data from a time range that doesn't yet have a chunk, $TIMESCALE_DB
automatically creates a chunk to store it.

In practice, this means that the start time of your earliest chunk does not
necessarily equal the earliest timestamp in your $HYPERTABLE. Instead, there
might be a time gap between the start time and the earliest timestamp. This
doesn't affect your usual interactions with your $HYPERTABLE, but might affect
the number of chunks you see when inspecting it.


### Best practices for time partitioning

Chunk size affects insert and query performance. You want a chunk small enough
to fit into memory so you can insert and query recent data without
reading from disk. However, having too many small and sparsely filled chunks can
affect query planning time and compression.

<ChunkInterval />

For a detailed analysis of how to optimize your chunk sizes, see the
[blog post on chunk time intervals][blog-chunk-time]. To learn how
to view and set your chunk time intervals, see how to 
[Optimize $HYPERTABLE chunk intervals][change-chunk-intervals].

## Partition by dimension

Partitioning on time is the most common use case for a $HYPERTABLE, but it may not be enough for your needs. For example,
you may need to scan for the latest readings that match a certain condition without locking a critical $HYPERTABLE.
Best practice to optimize ingest and query performance is to add a partitioning dimension on a non-time column such as
location or device UUID, and specify a number of partitions.

You add a partitioning dimension at the same time as you create the hypertable, when the table is empty. The good news 
is that although you select the number of partitions at creation time, as your data grows you can change the number of 
partitions later and improve query performance. Changing the number of partitions only effects chunks created after the 
change, not existing chunks.

You can always set the number of partitions for a hash dimension using `set_number_partitions`.

For example:

<Procedure>

1. **Create a relational table**

   ```sql
   create table conditions(
       time timestamptz not null,
       device_id integer,
       temperature float
   );
   ```

1. **Create a $HYPERTABLE with an optimized chunk size**

   ```sql
   select * from create_hypertable('conditions', by_range('time', '1 day'::interval));
   ``` 

1. **Add a partition on a non-time column**

   ```sql
   select * from add_dimension('conditions', by_hash('device_id', 3));
   ``` 
   Now use your $HYPERTABLE as usual, but you can also ingest and query efficiently by the `device_id` column.

1. **Change the number of partitions as your data grows**

   ```sql
   select set_number_partitions('conditions', 5, 'device_id');
   ```

</Procedure>


## $HYPERTABLE_CAP indexes

By default, indexes are automatically created when you create a $HYPERTABLE. The default index is on time, descending.
You can prevent index creation by setting the `create_default_indexes` option to `false`.

$HYPERTABLE_CAPs have some restrictions on unique constraints and indexes. If you
want a unique index on a $HYPERTABLE, it must include all the partitioning
columns for the table. To learn more, see 
[Enforce constraints with unique indexes on $HYPERTABLEs][hypertables-and-unique-indexes].

You can prevent index creation by setting the `create_default_indexes` option to `false`.

This section shows you:

* [Optimize time-series data in hypertables][create-hypertables]
* [Improve hypertable and query performance][change-chunk-intervals]
* [Enforce constraints with unique indexes][hypertables-and-unique-indexes]
* [Troubleshooting][troubleshooting]

[about-distributed-hypertables]: /self-hosted/:currentVersion:/distributed-hypertables/about-distributed-hypertables/
[best-practices-space]: #best-practices-for-space-partitioning
[blog-chunk-time]: https://www.timescale.com/blog/timescale-cloud-tips-testing-your-chunk-size
[change-chunk-intervals]: /use-timescale/:currentVersion:/hypertables/improve-query-performance/#optimize-hypertable-chunk-intervals/
[create-hypertables]: /use-timescale/:currentVersion:/hypertables/hypertable-crud/#create-a-hypertable
[hypertable-concepts]: /use-timescale/:currentVersion:/hypertables/
[hypertables-and-unique-indexes]: /use-timescale/:currentVersion:/hypertables/hypertables-and-unique-indexes/
[pg-analyze]: https://www.postgresql.org/docs/current/sql-analyze.html
[chunks_detailed_size]: /api/:currentVersion:/hypertable/chunks_detailed_size

[troubleshooting]: /use-timescale/:currentVersion:/hypertables/troubleshooting/
