# Hypertables
TimescaleDB stores time-series data in hypertables. When you interact with your
database, hypertables look just like regular PostgreSQL tables. You can perform
most of the same operations: inserting, deleting, and updating data; querying
data with `SELECT`s and `JOIN`s; adding indexes and columns; and more.

Behind the scenes, hypertables speed up time-series workflows by using chunks. 

<highlight tip="note"> 
To learn how to work with hypertables, see the [how-to guides on
hypertables](/timescaledb/latest/how-to-guides/hypertables/).
</highlight>

## Hypertables are made up of time chunks
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
For more information, see the section on [time-and-space
partitioning](#hypertables-can-also-be-partitioned-by-space).

<highlight type="note">
This section uses the example of 1-day chunks to explain how hypertables work.
The default chunk time interval is actually 7 days, and you can change it to
optimize partitioning for your data. To learn about best practices for chunk 
time intervals, see the documentation on [chunk sizing](FIXME).
</highlight>

### Chunks improve time-series performance
Chunks help TimescaleDB achieve [high time-series
performance][performance-benchmark] and offer improved time-series workflows.
Benefits include:

*   Faster inserts and queries because recent data fits in memory
*   Faster index updates because local indexes fit in memory
*   Age-based data compression and reordering to suit data query patterns over
    time
*   Easy data retention and tiering for storage savings
*   Instant multi-node elasticity for quick scaling
*   Data replication for high availability

For more information, see the section on the [benefits of
hypertables][hypertable-benefits].

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

For more information, see the documentation on [distributed
hypertables][distributed-hypertables].

[chunk-sizing]: /how-to-guides/hypertables/best-practices/#time-intervals
[create-hypertable]: /how-to-guides/hypertables/create/
[distributed-hypertables]: /overview/core-concepts/distributed-hypertables/
[hypertable-benefits]: /overview/core-concepts/hypertables-and-chunks-benefits/
[performance-benchmark]: https://www.timescale.com/blog/timescaledb-vs-6a696248104e/