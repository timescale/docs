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


## Hypertable partitioning

Each $HYPERTABLE is partitioned into child $HYPERTABLEs called chunks. Each chunk is assigned
a range of time, and only contains data from that range. If the $HYPERTABLE is
also partitioned by space, each chunk is also assigned a subset of the space
values.

When $TIMESCALE_DB creates a chunk, the creation time is stored in the catalog metadata. This chunk creation 
time is not the same as the partition ranges for the data contained in the chunk. Certain
functionality can use this chunk creation time metadata in cases where it makes sense.

<Highlight type="note">

Inheritance is not supported for $HYPERTABLEs and may lead to unexpected behavior.

</Highlight>

Each $HYPERTABLE chunk holds data for a specific time range only. When you
insert data from a time range that doesn't yet have a chunk, $TIMESCALE_DB
automatically creates a chunk to store it.

By default, each chunk covers 7 days. You can change this to better suit your
needs. For example, if you set `chunk_interval` to 1 day, each chunk stores
data from the same day. Data from different days is stored in different chunks.

The following figure shows the difference in structure between a relational table and a hypertable:

![Compare a relational table to a hypertable](https://assets.timescale.com/docs/images/getting-started/hypertables-chunks.webp)

$TIMESCALE_DB divides time into potential chunk ranges, based on the
`chunk_interval`. If data exists for a potential chunk range, that chunk is
created.

In practice, this means that the start time of your earliest chunk does not
necessarily equal the earliest timestamp in your $HYPERTABLE. Instead, there
might be a time gap between the start time and the earliest timestamp. This
doesn't affect your usual interactions with your $HYPERTABLE, but might affect
the number of chunks you see when inspecting it.

## Best practices for scaling and partitioning

Best practices for maintaining a high performance when scaling include:

- Having a limited number of hypertables in your $SERVICE_SHORT; having tens of thousands of hypertables is not recommended. 
- Choosing a strategic chunk size. 

Chunk size affects insert and query performance. You want a chunk small enough
to fit into memory so you can insert and query recent data without
reading from disk. However, having too many small and sparsely filled chunks can
affect query planning time and compression. The more chunks in the system, the slower that process becomes, even more so 
when all those chunks are part of a single hypertable. 

<ChunkInterval />

For a detailed analysis of how to optimize your chunk sizes, see the
[blog post on chunk time intervals][blog-chunk-time]. To learn how
to view and set your chunk time intervals, see how to 
[Optimize $HYPERTABLE chunk intervals][change-chunk-intervals].

## $HYPERTABLE_CAP indexes

By default, indexes are automatically created when you create a $HYPERTABLE.

The default indexes are:

*   On all $HYPERTABLEs, an index on time, descending
*   On $HYPERTABLEs with space partitions, an index on the space parameter and
    time

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
