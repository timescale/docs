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
the time column. This column may be a timestamp, a date, or an integer. 

To each chunk, TimescaleDB assigns a time interval. It then looks at the time
column of each row and inserts it into the corresponding chunk. For example,
assume each chunk contains one day's worth of data. Then all rows with
timestamps from the same day are inserted into the same chunk. Rows belonging to
different days are inserted into different chunks.

<img class="main-content__illustration"
src="https://s3.amazonaws.com/assets.timescale.com/docs/images/getting-started/hypertables-chunks.png"
alt="Rows are inserted into hypertable chunks based on their timestamps." />

This happens behind the scenes. As a user, you run a regular `INSERT` command,
and TimescaleDB automatically does the partitioning.

You can control time-partitioning behavior by changing the chunk time interval,
which is the length of time spanned by each chunk. To learn more about best
practices for chunk time intervals, see the documentation on [chunk
sizing][chunk-sizing].

In addition to time, you can also partition a hypertable by a space parameter.
For more information, see the section on [time-and-space
partitioning](#hypertables-can-also-be-partitioned-by-space).

## Chunks improve time-series performance
Chunking helps TimescaleDB achieve its [high time-series
performance][performance-benchmark] and improved time-series workflows. The
benefits include:

*   Faster inserts and queries because recent data fits in memory
*   Faster index updates because local indexes fit in memory
*   Age-based data compression and reordering to suit data query patterns over
    time
*   Easy data retention and tiering

For more information, see the documentation on the [benefits of
hypertables][hypertable-benefits].

## Hypertables can also be partitioned by space

Hypertables must be partitioned by time, but they may also be partitioned by
another column. This is sometimes called "time-and-space" partitioning. 

A hypertable can be partitioned by additional columns as well -- such as a device
identifier, server or container id, user or customer id, location, stock ticker
symbol, and so forth.  Such partitioning on this additional column typically
employs hashing (mapping all devices or servers into a specific number of hash
buckets), although interval-based partitioning can be employed here as well.
We sometimes refer to hypertables partitioned by both time and this additional
dimension as "time and space" partitions.

This time-and-space partitioning is primarily used for *[distributed-hypertables]*.
With such two-dimensional partitioning, each time interval is also
partitioned across multiple nodes comprising the distributed hypertables.
In such cases, for the same hour, information about some portion of the
devices are stored on each node.  This allows multi-node TimescaleDB
to parallelize inserts and queries for data during that time interval.

## Chunk architecture

Each chunk is implemented using a standard database table.  (In PostgreSQL
internals, the chunk is actually a "child table" of the "parent" hypertable.)
A chunk includes constraints that specify and enforce its partitioning ranges,
e.g., that the time interval of the chunk covers
['2020-07-01 00:00:00+00', '2020-07-02 00:00:00+00'),
and all rows included in the chunk must have a time value within that
range. Any space partitions are reflected as chunk constraints as well.
As these ranges and partitions are non-overlapping, all chunks in a
hypertable are disjoint in their partitioning dimensional space.

Knowledge of chunks' constraints are used heavily in internal database
operations.  Rows inserted into a hypertable are "routed" to the right chunk
based on the chunks' dimensions.  And queries to a hypertable use knowledge
of these chunks' constraints to only "push down" a query to the proper
chunks: If a query specifies that `time > now() - interval '1 week'`, for
example, the database only executes the query against chunks covering
the past week, and excludes any chunks before that time.  This happens
transparently to the user, however, who simply queries the hypertable with
a standard SQL statement.

[chunk-sizing]: /how-to-guides/hypertables/best-practices/#time-intervals
[create-hypertable]: /how-to-guides/hypertables/create/
[distributed-hypertables]: /overview/core-concepts/distributed-hypertables/
[hypertable-benefits]: /overview/core-concepts/hypertables-and-chunks-benefits/
[performance-benchmark]: FIXME