# Benefits of hypertables
Hypertables help TimescaleDB achieve
[high time-series performance][performance-benchmark] and improved time-series
workflows.

## Faster inserts and queries
In time-series workflows, many inserts and queries are performed on recent data.
That is, you're more likely to insert data from the past day than from 300 days
ago. The exact timescales depend on your application.

Because hypertables are partitioned into time-based chunks, the most recent data
is all stored in the same chunk. If properly sized, this chunk fits into memory.
So, when you insert and query recent data, these operations access data from
memory. This improves operation speed, since data doesn't need to be loaded from
disk.

<highlight type="note">
For more information about chunk sizing for improved performance, see the
section on
[chunk sizing](timescaledb/latest/how-to-guides/hypertables/about-hypertables/#best-practices-for-time-partitioning)
</highlight>

Though fitting chunks in memory gives the best performance, TimescaleDB doesn't
require it, and works well with larger chunks. TimescaleDB uses least recently
used (LRU) caching to choose which indexes and data to keep in memory.

## Faster index updates
TimescaleDB builds local indexes on each chunk, rather than global indexes
across all data. This ensures that recent data and its indexes both reside in
memory. When inserting recent data, index updates remain fast even on large
databases.

To learn more, see the section on [chunk local indexes][local-indexes].

## Age-based data compression and reordering
To save on storage, TimescaleDB can compress chunks as they age. Its native
compression feature converts chunks from a row-oriented form to a more
column-oriented form. This allows:
*   Type-specific compression for each column. Type-specific algorithms can
    compress more efficiently than generic compression algorithms.
*   Efficient "deep and narrow" queries. Compared to "wide and shallow" queries,
    "deep and narrow" queries query data from fewer columns over longer time
    ranges. Such queries are more common with historical time series data than
    with recent data. Thus, compression serves best for older chunks.

TimescaleDB can also speed up "deep and narrow" queries by reordering data
within a chunk. Most time-series data is inserted in approximate time order.
This makes time-based chunks very efficient for insertion of recent data. But
this order might be less efficient for some analytical queries of older data.
You can reorder chunks to better match your application query patterns.

For example, if you often query older data for a specific device, you can
reorder the data by `(device_id, timestamp)`. Each device's data is written
contiguously, making "deep and narrow" scans faster.

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
more, see the section on [data retention][data-retention].

If you don't want to delete your older data outright, you might consider data
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
immediate data migration.

The TimescaleDB planner handles queries seamlessly as partitions change. Behind
the scenes, it keeps track of where each chunk is stored.

To fine-tune server rebalancing, you can asynchronously migrate chunks. Or, you
can delete older data by using data retention policies. Older data is
partitioned according to the older server setup, while newer data is partitioned
according to the newer setup. So data retention eventually rebalances data
across your servers.

For more information, see the [chunk migration][chunk-migration] and
[data retention][data-retention] sections.

## Data replication
In addition to migrating chunks, you can also replicate chunks across nodes.
This allows you to:
*   Increase availability with multiple replicas
*   Recover from node failure or primary server outage
*   Horizontally scale reads by spreading query volume across multiple nodes

For more information, see the [replication][replication] section.

[chunk-migration]: /api/:currentVersion:/distributed-hypertables/move_chunk_experimental/
[data-retention]: /timescaledb/:currentVersion:/how-to-guides/data-retention/
[local-indexes]: /timescaledb/:currentVersion:/overview/core-concepts/hypertables-and-chunks/hypertable-architecture/#chunk-local-indexes
[performance-benchmark]: https://www.timescale.com/blog/timescaledb-vs-6a696248104e/
[replication]: /timescaledb/:currentVersion:/how-to-guides/replication-and-ha/
