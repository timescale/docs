---
title: Hypertable and chunk architecture
excerpt: Learn how hypertables and chunks and structured in TimescaleDB
products: [cloud, mst, self_hosted]
keywords: [hypertables, architecture]
---

# Hypertable and chunk architecture

A hypertable looks and acts like a regular table. But it's actually a parent
table made of many regular PostgreSQL tables, called chunks.

## Hypertables partition data

Hypertables partition data into chunks by time, and optionally by space.

### Time-based partitioning

A hypertable is composed from many child tables, called chunks. Each chunk has a
time constraint, and only contains data from that time range. When you insert
data into a hypertable, TimescaleDB automatically creates chunks based on the time values of your data.

For example, assume each chunk contains 1 day's worth of data. For each day for
which you have data, TimescaleDB creates a chunk. For each row of data, it looks
at the time column and inserts the data into the right chunk. All rows with time
values from the same day are inserted into the same chunk. Rows belonging to
different days are inserted into different chunks.

<img class="main-content__illustration"
src="https://s3.amazonaws.com/assets.timescale.com/docs/images/getting-started/hypertables-chunks.png"
alt="Rows are inserted into hypertable chunks based on their time values." />

This happens behind the scenes. You run regular inserts and queries to your
database, and TimescaleDB automatically handles the partitioning.

<Highlight type="note">
This section uses the example of 1-day chunks to explain how hypertables work.
The default chunk time interval is actually 7 days, and you can change it to
suit your data ingest patterns. To learn about best practices for chunk time
intervals, see the documentation on
[chunk sizing](timescaledb/latest/how-to-guides/hypertables/about-hypertables/#best-practices-for-time-partitioning).
</Highlight>

## Time-and-space partitioning

All TimescaleDB hypertables are partitioned by time. In addition, they might
also be partitioned by other columns. This is called time-and-space
partitioning.

For example, say that you are collecting sensor data from multiple devices and
storing it in a hypertable. You can choose to partition the data by both time
and device ID. For each time interval, TimescaleDB creates multiple chunks. Each
chunk stores data for a subset of device IDs. To decide which chunk a row
belongs in, TimescaleDB looks at both its time value and its device ID.

Time-and-space partitioning is most useful for distributed hypertables. These
are hypertables in multi-node databases, where the hypertable data is
distributed among nodes. Space partitions aren't usually recommended for
single-node databases, where they don't offer much benefit and may even degrade
performance.

In distributed hypertables, time-and-space partitioning allows for parallel
inserts and queries. For example, say that one node stores data from device A
and another stores data for device B. At a certain time, you get new data for
both device A and device B. You can write device A's data to the first node, and
write device B's data to the second node, at the same time.

For more information, see the section on
[distributed hypertables][distributed-hypertables].

## Chunk architecture

Hypertables are made of chunks. Each chunk is itself a standard PostgreSQL
table. In PostgreSQL terminology, the hypertable is a parent table and the
chunks are its child tables.

To enforce each chunk's time boundaries, the chunk includes time constraints.
For example, a specific chunk might only contain data with time values within
`['2020-07-01 00:00:00+00', '2020-07-02 00:00:00+00']`.

TimescaleDB catalogs the chunk constraints and uses them to optimize database
operations. When a row is inserted, the planner looks at its time value, finds
the correct chunk, and routes the insertion there. When a query is made, the
planner pushes the query down to only affected chunks. For example, if a query
has a `WHERE` clause specifying `time > now() - INTERVAL '1 week'`, the database
only executes the query against chunks covering the past week. It excludes older
chunks.

All of this happens in the background. From your perspective, the hypertable
should look just like a regular PostgreSQL table.

### Space-partitioning architecture

Space partitions are also enforced with chunk constraints.

To choose how the space values map to partitions, TimescaleDB uses one of two
methods:

*   Hashing, which maps each value into one of several defined hash buckets.
    This is the most common method.
*   Interval-based partitioning. This works the same way as time-based
    partitioning. All the values in a specified range fall into the same
    partition.

Like time partitions, space partitions never overlap.

### Chunk local indexes

Rather than building a global index over an entire hypertable, TimescaleDB
builds local indexes on each chunk. In other words, each chunk has its own index
that only indexes data within that chunk. This optimization improves insert
speed for recent data. For more information, see the section on the
[benefits of local indexes][hypertable-benefits-indexes].

<!-- TODO: insert local indexes diagram -->

Even with multiple local indexes, TimescaleDB can still ensure global uniqueness
for keys. It enforces an important constraint: any key that requires uniqueness,
such as a `PRIMARY KEY`, must include all columns that are used for data
partitioning.

In other words, because data is partitioned between chunks based on time value,
the unique key must include the time value. When data is inserted, TimescaleDB
identifies the corresponding time chunk. Using that chunk's unique index, it
checks for uniqueness within the chunk. Because no other chunk can contain that
time value, uniqueness within the chunk implies global uniqueness.

<!-- TODO: insert local indexes and time partitioning diagram -->

If another column is used for partitioning, the same logic applies. TimescaleDB
identifies the correct chunk using the time-and-space partitions and checks for
uniqueness using the chunk's unique index. If the unique index contains both
the time and space partitioning parameters, then those values can appear in no
other partition. Uniqueness within the partition implies global uniqueness.

These checks happen in the background. As a user, you run a regular `INSERT`
command, and the correct index is automatically updated.

<Highlight type="note">
To see examples of the partitioning column and unique index constraint in
practice, see the section on
[hypertables and unique indexes](/timescaledb/latest/how-to-guides/hypertables/hypertables-and-unique-indexes/).
</Highlight>

[distributed-hypertables]: /timescaledb/:currentVersion:/overview/core-concepts/distributed-hypertables/
[hypertable-benefits-indexes]: /timescaledb/:currentVersion:/overview/core-concepts/hypertables-and-chunks/hypertables-and-chunks-benefits/#faster-index-updates
