---
title: About hypertables
excerpt: Learn how hypertables work for time-series data
keywords: [hypertables, partitions]
---

# About hypertables

Hypertables are PostgreSQL tables with special features that make it easy to
work with time-series data. You interact with them just as you would with
regular PostgreSQL tables. But behind the scenes, hypertables automatically
partition your data into chunks by time.

In TimescaleDB, hypertables exist alongside regular PostgreSQL tables. Use
hypertables to store time-series data. This gives you improved insert and query
performance, and access to useful time-series features. Use regular PostgreSQL
tables for other relational data.

## Hypertable partitioning

When you create and use a hypertable, it automatically partitions data by time,
and optionally by space.

Each hypertable is made up of child tables called chunks. Each chunk is assigned
a range of time, and only contains data from that range. If the hypertable is
also partitioned by space, each chunk is also assigned a subset of the space
values.

### Time partitioning

Each chunk of a hypertable only holds data from a specific time range. When you
insert data from a time range that doesn't yet have a chunk, TimescaleDB
automatically creates a chunk to store it.

By default, each chunk covers 7 days. You can change this to better suit your
needs. For example, if you set `chunk_time_interval` to 1 day, each chunk stores
data from the same day. Data from different days is stored in different chunks.

<img class="main-content__illustration"
src="https://s3.amazonaws.com/assets.timescale.com/docs/images/getting-started/hypertables-chunks.png"
alt="A normal table compared to a hypertable. The normal table holds data for 3 different days in one container. The hypertable contains 3 containers, called chunks, each of which holds data for a separate day." />

<Highlight type="note">
TimescaleDB divides time into potential chunk ranges, based on the
`chunk_time_interval`. If data exists for a potential chunk range, that chunk is
created.

In practice, this means that the start time of your earliest chunk doesn't
necessarily equal the earliest timestamp in your hypertable. Instead, there
might be a time gap between the start time and the earliest timestamp. This
doesn't affect your usual interactions with your hypertable, but might affect
the number of chunks you see when inspecting it.
</Highlight>

### Best practices for time partitioning

Chunk size affects insert and query performance. You want a chunk small enough
to fit into memory. This allows you to insert and query recent data without
reading from disk. But you don't want too many small and sparsely filled chunks.
This can affect query planning time and compression.

We recommend setting the `chunk_time_interval` so that 25% of main memory can
store one chunk, including its indexes, from each active hypertable. You can
estimate the required interval from your data rate. For example, if you write
approximately 2&nbsp;GB of data per day and have 64&nbsp;GB of memory, set the
interval to 1 week. If you write approximately 10&nbsp;GB of data per day on the
same machine, set the time interval to 1 day.

<Highlight type="note">
If you use expensive index types, such as some PostGIS geospatial indexes, take
care to check the total size of the chunk and its index. You can do so using the
[`chunks_detailed_size`](/api/latest/hypertable/chunks_detailed_size) function.
</Highlight>

For a detailed analysis of how to optimize your chunk sizes, see the
[blog post on chunk time intervals][blog-chunk-time]. To learn how
to view and set your chunk time intervals, see the section on
[changing hypertable chunk intervals][change-chunk-intervals].

### Space partitioning

Space partitioning is optional. It is not usually recommended for regular
hypertables, except in very particular circumstances. It is recommended for
distributed hypertables, to balance inserts between nodes. For more information,
see the sections on
[best practices for space partitioning][best-practices-space] and
[distributed hypertables][about-distributed-hypertables].

When space partitioning is on, 2 dimensions are used to divide data into chunks:
the time dimension and the space dimension. You can specify the number of
partitions along the space dimension. Data is assigned to a partition by hashing
its value on that dimension.

For example, say you use `device_id` as a space partitioning column. For each
row, the value of the `device_id` column is hashed. Then the row is inserted
into the correct partition for that hash value.

<img class="main-content__illustration"
src="https://s3.amazonaws.com/assets.timescale.com/docs/images/hypertable-time-space-partition.png"
alt="A hypertable visualized as a rectangular plane carved into smaller rectangles, which are chunks. One dimension of the rectangular plane is time and the other is space. Data enters the hypertable and flows to a chunk based on its time and space values." />

### Closed and open dimensions for space partitioning

Space partitioning dimensions can be open or closed. A closed dimension has a
fixed number of partitions, and usually uses some hashing to match values to
partitions. An open dimension does not have a fixed number of partitions, and
usually has each chunk cover a certain range. In most cases the time dimension
is open and the space dimension is closed.

If you use the `create_hypertable` command to create your hypertable, then the
space dimension is open, and there is no way to adjust this. To create a
hypertable with a closed space dimension, create the hypertable with only the
time dimension first. Then use the `add_dimension` command to explicitly add an
open device. If you set the range to `1`, each device has its own chunks. This
can help you work around some limitations of normal space dimensions, and is
especially useful if you want to make some chunks readily available for
exclusion.

### Best practices for space partitioning

Space partitioning is not usually recommended for non-distributed hypertables.
It's only useful if you have multiple physical disks, each corresponding to a
separate tablespace. Each disk can then store some of the space partitions. If
you partition by space without this setup, you increase query planning
complexity without increasing I/O performance.

<Highlight type="note">
A more recommended way to increase I/O performance is to use RAID (redundant
array of inexpensive disks). RAID virtualizes multiple physical disks into a
single logical disk. You can then use this single logical disk to store your
hypertable, without any space partitioning.
</Highlight>

## Hypertable indexes

By default, indexes are automatically created when you create a hypertable. You
can prevent index creation by setting the `create_default_indexes` option to
`false`.

The default indexes are:

*   On all hypertables, an index on time, descending
*   On hypertables with space partitions, an index on the space parameter and
    time

Hypertables have some restrictions on unique constraints and indexes. If you
want a unique index on a hypertable, it must include all the partitioning
columns for the table. To learn more, see the section on [creating unique
indexes on a hypertable][hypertables-and-unique-indexes].

## Analyze a hypertable

You can use the PostgreSQL `ANALYZE` command to query all chunks in your
hypertable. The statistics collected by the `ANALYZE` command are used by the
PostgreSQL planner to create the best query plan. For more information about the
`ANALYZE` command, see the [PostgreSQL documentation][pg-analyze].

## Learn more

*   [Create a hypertable][create-hypertables]
*   Read about the
    [benefits and architecture of hypertables][hypertable-concepts]

[about-distributed-hypertables]: /timescaledb/:currentVersion:/how-to-guides/distributed-hypertables/about-distributed-hypertables/
[best-practices-space]: #best-practices-for-space-partitioning
[blog-chunk-time]: https://www.timescale.com/blog/timescale-cloud-tips-testing-your-chunk-size/
[change-chunk-intervals]: /timescaledb/:currentVersion:/how-to-guides/hypertables/change-chunk-intervals/
[create-hypertables]: /timescaledb/:currentVersion:/how-to-guides/hypertables/create/
[hypertable-concepts]: /timescaledb/:currentVersion:/overview/core-concepts/hypertables-and-chunks/
[hypertables-and-unique-indexes]: /timescaledb/:currentVersion:/how-to-guides/hypertables/hypertables-and-unique-indexes/
[pg-analyze]: https://www.postgresql.org/docs/current/sql-analyze.html
