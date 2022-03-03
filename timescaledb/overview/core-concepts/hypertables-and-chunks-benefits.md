# Benefits of hypertables
Hypertables help TimescaleDB achieve [high time series performance
][performance-benchmark] and improved time series workflows.

## Faster inserts and queries
In time series workflows, many inserts and queries are performed on recent data.
That is, you're more likely to insert data from the past day than from 300 days
ago. The exact timescales depend on your application.

Because hypertables are partitioned into time-based chunks, the most recent data
is all stored in the same chunk. If properly sized, this chunk fits into memory.
So, when you insert and query recent data, these operations access data from
memory, which is faster than loading data from disk.

To get the best performance, the most recent chunk, including indexes, should be
no larger than 25% of your system's main memory. For more information, see the
documentation on [chunk sizing][chunk-sizing].

Though fitting chunks in memory gives the best performance, TimescaleDB doesn't
*require* this setup. It still works with larger chunks. It uses Least Recently
Used (LRU) caching on disk pages to choose which indexes and data to keep in
memory.

## Faster index updates
TimescaleDB builds local indexes on each chunk, rather than global indexes
across all data. This ensures that recent data and its indexes both reside in
memory. When inserting recent data, index updates remain fast even on large
databases.

<!-- TODO: insert index and chunks diagram -->

Even with multiple local indexes, TimescaleDB can still ensure global uniqueness
for keys. It enforces an important constraint: any key that requires uniqueness,
such as a `PRIMARY KEY`, must include all columns that are used for data
partitioning.

In other words, because data is partitioned between chunks based on time value,
the unique key must include the time value. When data is inserted, TimescaleDB
identifies the corresponding time chunk and checks for uniqueness within that
chunk. Because no other chunk can contain that time value, uniqueness within the
chunk implies global uniqueness.

If another column is used for partitioning, the same logic applies. The column
must be included in the unique key, so that uniqueness within the corresponding
partition implies global uniqueness.

These checks happen in the background. As a user, you run a regular `INSERT`
command, and the correct index is automatically updated.

## Age-based data compression and reordering 
As data ages, you can compress it to save on storage. TimescaleDB's native
compression converts chunks from a row-oriented form to a more column-oriented
form. This allows:
*   Type-specific compression for each column. Type-specific algorithms can
    compress more efficiently than generic compression algorithms.
*   Efficient "deep and narrow" queries. Compared to "wide and shallow" queries,
    "deep and narrow" queries query data from fewer columns over longer time
    ranges. Such queries are more common with historical time series data than
    with recent data. Thus, compression serves best for older data.

To further speed up "deep and narrow" queries, you can also reorder data.
TimescaleDB inserts recent data ordered by time value. While this is efficient
for rapid inserts of real-time data, it can be less efficient for some
analytical queries of older data. 

For example, if you frequently query older data for a specific device, you can
reorder the data by `(device_id, timestamp)`. For each device, all the device's
data is written together, making "deep and narrow" scans faster.

## Easy data retention and tiering
In many time series applications, you only want to store raw data for a period
of time. After that, you might delete the data to save on storage, to comply
with data retention regulations, or for other reasons. You might also want to
move older data to less expensive storage.

In TimescaleDB, you can delete entire chunks of data based on time values. For
example, you can delete chunks containing data with time values more than 6
months old. 

Because deleting a chunk means deleting an entire file from disk, it's faster
than deleting individual rows. Deleting rows requires expensive `VACUUM`
operations to garbage collect and defragment the tables.

You can also automate data deletion by setting data retention policies. To learn
more, see the documentation on [data retention][data-retention].

If you don't want to delete your older data outright, you might considering data
tiering. With data tiering, you migrate your older data to slower, cheaper
storage. Just like with deleting data, you can move an entire chunk at once from
disk to disk.

## Instant multi-node elasticity
TimescaleDB supports multi-node architecture for horizontal scaling. Because
TimescaleDB uses time chunks, it can add and remove servers without immediately
rebalancing data. This differs from traditional database sharding, where some
data must be migrated to the new server when you expand a cluster.

Instead, TimescaleDB keeps existing chunks at their current locations. When it
adds new chunks for new time intervals, it partitions them across the new set of
servers. This eventually balances out inserts without incurring the costs of
immediate data migration. The TimescaleDB planner handles queries seamlessly as
partitions change. Behind the scenes, it keeps track of where each chunk is
stored.

To fine-tune server rebalancing, you can asynchronously migrate chunks. Or, you
can delete older data by using data retention policies. Since older data is
partitioned according to the older server setup, while newer data is partitioned
according to the newer setup, data retention eventually rebalances data across
your servers. 

To learn more, see the documentation on [chunk migration][chunk-migration] and
[data retention][data-retention].

## Data replication
In addition to migrating chunks, you can also replicate chunks across nodes.
This allows you to:
*   Increase availability with multiple replicas
*   Recover from node failure or primary server outage
*   Horizontally scale reads by spreading query volume across multiple nodes

To learn more, see the documentation on [replication][replication].

[chunk-migration]: /api/:currentVersion:/distributed-hypertables/move_chunk_experimental/
[chunk-sizing]: /how-to-guides/hypertables/best-practices/#time-intervals
[data-retention]: /how-to-guides/data-retention/
[data-tiering]: /how-to-guides/data-tiering/
[performance-benchmark]: https://www.timescale.com/blog/timescaledb-vs-6a696248104e/
[replication]: /how-to-guides/replication-and-ha/