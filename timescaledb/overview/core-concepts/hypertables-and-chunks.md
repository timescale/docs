# Hypertables
TimescaleDB stores time-series data in hypertables. To the user, these look like
regular PostgreSQL tables. You can perform most of the same operations:
inserting, deleting, and updating data; querying data with `SELECT`s and
`JOIN`s; adding indexes and columns; and more.

Behind the scenes, hypertables speed up time-series workflows through chunking. 

<highlight tip="note"> 
To learn how to work with hypertables, see the [how-to guides on
hypertables](/timescaledb/latest/how-to-guides/hypertables/).
</highlight>

## Hypertables are made up of time chunks
Each hypertable is made up of many regular PostgreSQL tables, called chunks.

When you create a hypertable and insert data into it, TimescaleDB automatically
creates chunks and partitions the data into them. It always partitions data by
the time column.

To each chunk, TimescaleDB assigns a time interval. It then looks at the time
column of each row and inserts it into the corresponding chunk. For example,
assume each chunk contains one day's worth of data. Then all rows with
time values from the same day are inserted into the same chunk. Rows belonging to
different days are inserted into different chunks.

<img class="main-content__illustration"
src="https://s3.amazonaws.com/assets.timescale.com/docs/images/getting-started/hypertables-chunks.png"
alt="Rows are inserted into hypertable chunks based on their time values." />

This happens behind the scenes. As a user, you run a regular `INSERT` command,
and TimescaleDB automatically does the partitioning.

You can control time-partitioning behavior by changing the chunk time interval,
which is the length of time spanned by each chunk. To learn more about best
practices for chunk time intervals, see the documentation on [chunk
sizing][chunk-sizing].

In addition to time, you can also partition a hypertable by a space parameter.
For more information, see the section on [time-and-space
partitioning](#hypertables-can-also-be-partitioned-by-space).

### Chunks improve time-series performance
Chunking helps TimescaleDB achieve its [high time series
performance][performance-benchmark] and improved time series workflows. The
benefits include:

*   Faster inserts and queries because recent data fits in memory
*   Faster index updates because local indexes fit in memory
*   Age-based data compression and reordering to suit data query patterns over
    time
*   Easy data retention and tiering for storage savings
*   Instant multi-node elasticity for quick scaling
*   Data replication for high availability

For more information, see the documentation on the [benefits of
hypertables][hypertable-benefits].

## Hypertables can also be partitioned by space
All TimescaleDB hypertables are partitioned by time. They can also be
partitioned by some other column in addition to time. This is sometimes called
"time-and-space partitioning."

For example, say that you are collecting sensor data from multiple devices and
storing it in a hypertable. You can partition the hypertable by both time and
device ID. Instead of creating one chunk for each time interval, TimescaleDB
creates multiple chunks for each time interval. It decides which chunk each row
belongs in by looking at its time value *and* its device ID. 

<!-- TODO: add the time-and-space partitioning diagram -->

Time-and-space partitioning is most useful for distributed hypertables. These
are hypertables in multi-node databases, where the hypertable data is
distributed among nodes. For each time interval, each node contains a portion of
the data. This allows parallel inserts and queries. For example, TimescaleDB can
write data about device A at time Z to chunk C on node M, at the same time as it
writes data about device B at time Z to chunk D on node N.

For more information, see the documentation on [distributed
hypertables][distributed-hypertables].

## Chunk architecture

Each chunk is a standard PostgreSQL table. The hypertable is an abstraction on
top of the chunks, making the whole entity look and behave like a single table.
In PostgreSQL vocabulary, the hypertable is a "parent table" and the chunks are
its "child tables."

To enforce each chunk's time boundaries, each chunk includes constraints. For
example, a specific chunk can only contain data with timestamps within
`['2020-07-01 00:00:00+00', '2020-07-02 00:00:00+00']`.

The TimescaleDB planner uses knowledge of chunks' constraints to optimize
database operations. When a row is inserted, it routes the insertion into the
right chunk for the row's time value. When a query is made, it pushes the query
down to only the chunks that matter. 

For example, if a query has a `WHERE` clause specifying `time > now() - INTERVAL
'1 week'`, the database only executes the query against chunks covering the past
week. It excludes any chunks from before that time. 

All of this happens in the background, transparently to the user.

### Space-partitioning architecture

Space partitions are also enforced with chunk constraints. Partitions are always
non-overlapping.

To determine how the values of the space-parititioning column map to partitions,
two methods can be used:
*   Hashing, which maps every value into one of several defined hash buckets.
    This is the most common method.
*   Interval-based partitioning. This works the same way as time-based
    partitioning, where all the values in a specified range fall into the same
    partition.

[chunk-sizing]: /how-to-guides/hypertables/best-practices/#time-intervals
[create-hypertable]: /how-to-guides/hypertables/create/
[distributed-hypertables]: /overview/core-concepts/distributed-hypertables/
[hypertable-benefits]: /overview/core-concepts/hypertables-and-chunks-benefits/
[performance-benchmark]: https://www.timescale.com/blog/timescaledb-vs-6a696248104e/