# Benefits of hypertables
Hypertables help TimescaleDB achieve [better performance for time-series data,
compared to regular PostgreSQL][performance-benchmark].

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
for keys. It enforces one important constraint: any key that requires
uniqueness, such as a `PRIMARY KEY`, must include all columns that are used for
data partitioning.

In other words, because data is partitioned between chunks based on timestamp,
the unique key must include the timestamp. When data is inserted, TimescaleDB
identifies the corresponding time chunk and checks for uniqueness within that
chunk. Because no other chunk can contain that timestamp, uniqueness within the
chunk implies global uniqueness.

If another column is used for partitioning, the same logic applies. The column
must be included in the unique key, so that uniqueness within the corresponding
partition implies global uniqueness.

These checks happen in the background. As a user, you run a regular `INSERT`
command, and the correct index is automatially updated.

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
TimescaleDB inserts recent data ordered by timestamp. While this is efficient
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

Because TimescaleDB stores data in time-based chunks, deleting and moving older
data is fast. You can delete or move an entire chunk based on its time range.
For example, you can delete chunks containing data with timestamps more than 6
months old. Because deleting a chunk means deleting an entire file from disk,
it's faster than deleting individual rows. Deleting rows requires expensive
`VACUUM` operations to garbage collect and defragment the tables.

You can also automate data deletion by setting data retention policies.

To learn more, see the documentation on [data retention][data-retention] and
[data tiering][data-tiering].

- **Data migration**.  Chunks can be individually migrated transactionally.
  This migration can be across tablespaces (disks) residing on a single
  server, often as a form of data tiering; e.g., moving older data from
  faster, more expensive disks to slower, cheaper storage. 

## Data replication and rebalancing

- **Data replication**.  Chunks can be individually replicated across
  nodes transactionally, either by configuring a replication factor on a
  distributed hypertable (which occurs as part of a 2PC transaction at
  insert time) or by copying an older chunk from one node to another
  to increase its replication factor, e.g., after a node failure (coming soon).

  This migration
  can also occur across nodes in a distributed hypertable, e.g., in order to
  asynchronous rebalance a cluster after adding a server or to prepare for
  retiring a server (coming soon).

## Instant multi-node elasticity

- **Instant multi-node elasticity**.  TimescaleDB supports horizontally
  scaling across multiple nodes. Unlike traditional one-dimensional
  database sharding, where shards must be migrated to a newly-added
  server as part of the process of expanding the cluster, TimescaleDB
  supports the elastic addition (or removal) of new servers without
  requiring any immediate rebalancing. When a new server is added,
  existing chunks can remain at their current location, while chunks
  created for future time intervals are partitioned across the new set
  of servers.  The TimescaleDB planner can then handle queries
  across these reconfigurations, always knowing which nodes are
  storing which chunks.  Server load subsequently can be rebalanced
  either by asynchronously migrating chunks or handled via data
  retention policies if desired.

[chunk-sizing]: /how-to-guides/hypertables/best-practices/#time-intervals
[data-retention]: FIXME
[data-tiering]: FIXME
[performance-benchmark]: FIXME