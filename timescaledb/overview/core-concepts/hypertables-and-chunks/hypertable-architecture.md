# Hypertable architecture

### Hypertables partition data into chunks of time
Each hypertable is made up of many regular PostgreSQL tables, called chunks.

When you create a hypertable and insert data into it, TimescaleDB automatically
creates chunks. It assigns a time range to each chunk and partitions your data
into chunks depending on the data's time value.

For example, assume each chunk contains 1 day's worth of data. For each day
for which you have data, TimescaleDB creates a chunk. For each row of data, it
looks at the time column and inserts the data into the corresponding chunk. All
rows with time values from the same day are inserted into the same chunk. Rows
belonging to different days are inserted into different chunks.

<img class="main-content__illustration"
src="https://s3.amazonaws.com/assets.timescale.com/docs/images/getting-started/hypertables-chunks.png"
alt="Rows are inserted into hypertable chunks based on their time values." />

This happens behind the scenes. You run regular inserts and queries to your
database, and TimescaleDB automatically handles the partitioning.

In addition to time, you can also partition a hypertable by space parameters.
For more information, see the section on 
[time-and-space partitioning](#hypertables-can-also-be-partitioned-by-space).

<highlight type="note">
This section uses the example of 1-day chunks to explain how hypertables work.
The default chunk time interval is actually 7 days, and you can change it to
optimize partitioning for your data. To learn about best practices for chunk 
time intervals, see the documentation on [chunk sizing](timescaledb/latest/how-to-guides/hypertables/best-practices/#time-intervals).
</highlight>

### Chunks improve time-series performance
Chunks help TimescaleDB achieve 
[high time-series performance][performance-benchmark] and offer improved 
time-series workflows.
Benefits include:

*   Faster inserts and queries because recent data fits in memory
*   Faster index updates because local indexes fit in memory
*   Age-based data compression and reordering to suit data query patterns over
    time
*   Easy data retention and tiering for storage savings
*   Instant multi-node elasticity for quick scaling
*   Data replication for high availability

For more information, see the section on the 
[benefits of hypertables][hypertable-benefits].

## Hypertables can also be partitioned by space
All TimescaleDB hypertables are partitioned by time. They can also be
partitioned by other columns in addition to time. This is sometimes called
"time-and-space partitioning."

For example, say that you are collecting sensor data from multiple devices and
storing it in a hypertable. You can partition the hypertable by both time and
device ID. Instead of creating one chunk for each time interval, TimescaleDB
creates multiple chunks for each time interval. It decides which chunk each row
belongs in by looking at both its time value and its device ID. 

<img class="main-content__illustration"
src="https://www.timescale.com/static/manage-06d649b43604e5fb4e4c3f7d3f08b7b6.svg"
alt="Data is partitioned into chunks by time and by a space hash." />

Time-and-space partitioning is most useful for distributed hypertables. These
are hypertables in multi-node databases, where the hypertable data is
distributed among nodes. For each time interval, each node contains a portion of
the data. This allows parallel inserts and queries. For example, TimescaleDB can
write data about device A at time Z to chunk C on node M, at the same time as it
writes data about device B at time Z to chunk D on node N.

For more information, see the section on [distributed
hypertables][distributed-hypertables].

# Chunk architecture
Each chunk in a hypertable is a standard PostgreSQL table. The hypertable is an
abstraction on top of the chunks, making the whole entity look and behave like a
single table. In PostgreSQL terminology, the hypertable is a "parent table" and
the chunks are its "child tables."

To enforce each chunk's time boundaries, the chunk includes time constraints.
For example, a specific chunk can only contain data with time values within
`['2020-07-01 00:00:00+00', '2020-07-02 00:00:00+00']`.

The TimescaleDB planner uses knowledge of chunks' constraints to optimize
database operations. When a row is inserted, it routes the insertion into the
right chunk for the row's time value. When a query is made, it pushes the query
down to only the chunks that matter. For example, if a query has a `WHERE`
clause specifying `time > now() - INTERVAL '1 week'`, the database only executes
the query against chunks covering the past week. It excludes any chunks from
before that time. 

All of this happens in the background. From your perspective, the hypertable
should look just like a regular PostgreSQL table.

## Space-partitioning architecture
Space partitions are also enforced with chunk constraints.

To determine how the values of the space-partitioning column map to partitions,
choose from one of these two methods:
*   Hashing, which maps each value into one of several defined hash buckets.
    This is the most common method.
*   Interval-based partitioning. This works the same way as time-based
    partitioning, where all the values in a specified range fall into the same
    partition.

Like time partitions, space partitions never overlap.

## Chunk local indexes
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
identifies the right chunk using the time-and-space partitions and checks for
uniqueness using the chunk's unique index. If the unique index contains both
the time and space partitioning parameters, then those values can appear in no
other partition. Uniqueness within the partition implies global uniqueness.

These checks happen in the background. As a user, you run a regular `INSERT`
command, and the correct index is automatically updated.

<highlight type="note">
To see examples of the partitioning column and unique index constraint in
practice, see the section on
[hypertables and unique indexes](/timescaledb/latest/how-to-guides/hypertables/hypertables-and-unique-indexes/).
</highlight>

[chunk-sizing]: /how-to-guides/hypertables/best-practices/#time-intervals
[create-hypertable]: /how-to-guides/hypertables/create/
[distributed-hypertables]: /overview/core-concepts/distributed-hypertables/
[hypertable-benefits-indexes]: /overview/core-concepts/hypertables-and-chunks/hypertables-and-chunks-benefits/#faster-index-updates