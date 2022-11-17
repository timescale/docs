---
title: Partitioning in hypertables with chunks
excerpt: Learn how hypertables are partitioned into chunks
keywords: [hypertables, chunks, partitions]
---

### Partitioning in hypertables with chunks

Chunks are created by partitioning a hypertable's data into one
(or potentially multiple) dimensions. All hypertables are partitioned
by the values belonging to a time column, which may be in timestamp,
date, or various integer forms. If the time partitioning interval is one
day, for example, then rows with timestamps that belong to the same
day are colocated within the same chunk, while rows belonging to
different days belong to different chunks.

TimescaleDB creates these chunks automatically as rows are inserted into the
database. If the timestamp of a newly inserted row belongs to a day not yet
present in the database, TimescaleDB creates a new chunk corresponding to
that day as part of the INSERT process. Otherwise, TimescaleDB
determines the existing chunks to which the new rows belong, and
insert the rows into the corresponding chunks. The interval of a hypertable's
partitioning can also be changed over time (for example, to adapt to changing workload
conditions, so in one example, a hypertable could initially create a new chunk
per day and then change to a chunk every 6 hours as the workload increases).

A hypertable can be partitioned by additional columns as well -- such as a device
identifier, server or container id, user or customer id, location, stock ticker
symbol, and so forth. Such partitioning on this additional column typically
employs hashing (mapping all devices or servers into a specific number of hash
buckets), although interval-based partitioning can be employed here as well.
We sometimes refer to hypertables partitioned by both time and this additional
dimension as "time and space" partitions.

This time-and-space partitioning is primarily used for *distributed hypertables*.
With such two-dimensional partitioning, each time interval is also
partitioned across multiple nodes comprising the distributed hypertables.
In such cases, for the same hour, information about some portion of the
devices are stored on each node. This allows multi-node TimescaleDB
to parallelize inserts and queries for data during that time interval.

[//]: # (Comment: We should include an image that shows a chunk picture of a
[//]: # partition pointing at multiple chunks, each chunk have some range of
[//]: # data, and an index (binary tree-like data structure) associated with it

Each chunk is implemented using a standard database table.  (In PostgreSQL
internals, the chunk is actually a "child table" of the "parent" hypertable.)
A chunk includes constraints that specify and enforce its partitioning ranges,
for example, that the time interval of the chunk covers
['2020-07-01 00:00:00+00', '2020-07-02 00:00:00+00'),
and all rows included in the chunk must have a time value within that
range. Any space partitions are reflected as chunk constraints as well.
As these ranges and partitions are non-overlapping, all chunks in a
hypertable are disjoint in their partitioning dimensional space.

Knowledge of chunks' constraints are used heavily in internal database
operations. Rows inserted into a hypertable are "routed" to the right chunk
based on the chunks' dimensions. And queries to a hypertable use knowledge
of these chunks' constraints to only "push down" a query to the proper
chunks: If a query specifies that `time > now() - interval '1 week'`, for
example, the database only executes the query against chunks covering
the past week, and excludes any chunks before that time. This happens
transparently to the user, however, who simply queries the hypertable with
a standard SQL statement.

### Benefits of hypertables and chunks

This chunk-based architecture benefits many aspects of time-series data
management. These includes:

*   **In-memory data**. Chunks can be configured (based on their time intervals)
  so that the recent chunks (and their indexes) fit in memory. This helps ensure that inserts to
  recent time intervals, as well as queries to recent data, typically accesses
  data already stored in memory, rather than from disk. But TimescaleDB
  doesn't *require* that chunks fit solely in memory (and otherwise error);
  rather, the database follows LRU caching rules on disk pages to maintain
  in-memory data and index caching.

*   **Local indexes**. Indexes are built on each chunk independently, rather than
  a global index across all data. This similarly ensures that *both* data and
  indexes from the latest chunks typically reside in memory, so that updating
  indexes when inserting data remains fast. And TimescaleDB can still ensure
  global uniqueness on keys that include any partitioning keys, given the
  disjoint nature of its chunks, that is, given a unique (device_id, timestamp)
  primary key, first identify the corresponding chunk given constraints, then
  use one of that chunk's index to ensure uniqueness. But this remains simple
  to use with TimecaleDB's hypertable abstraction: Users simply create an index
  on the hypertable, and these operations (and configurations) are pushed down
  to both existing and new chunks.

*   **Easy data retention**.  In many time-series applications, whether based on
  cost, storage, compliance, or other reasons, users often only want to retain
  data only for a certain amount of time. With TimescaleDB, users can quickly
  delete chunks based on their time ranges (for example, all chunks whose data has
  timestamps more than 6 months old). Even easier, useres can create a data
  retention policy within TimescaleDB to make this automatic, which employs its
  internal job-scheduling framework. Chunk-based deletion is fast -- it's simply
  deleting a file from disk -- as opposed to deleting individual rows, which
  requires more expensive "vacuum" operations to later garbage collect and
  defragment these deleted rows.

*   **Age-based compression, data reordering, and more**.  Many other data
  management features can also take advantage of this chunk-based architecture,
  which allows users to execute specific commands on chunks or employ
  hypertable policies to automate these actions. These include TimescaleDB's
  native compression, which convert chunks from their traditional row-major
  form into a layout that is more columnar in nature, while employing
  type-specific compression on each column. Or data reordering, which
  asynchronously rewrites data stored on disk from the order it was inserted
  into an order specified by the user based on a specified index. By reordering
  data based on (device_id, timestap), for example, all data associated with a
  specific device becomes written contiguously on disk, making "deep and
  narrow" scans for a particular device's data much faster.

*   **Instant multi-node elasticity**.  TimescaleDB supports horizontally
  scaling across multiple nodes. Unlike traditional one-dimensional
  database sharding, where shards must be migrated to a newly added
  server as part of the process of expanding the cluster, TimescaleDB
  supports the elastic addition (or removal) of new servers without
  requiring any immediate rebalancing. When a new server is added,
  existing chunks can remain at their current location, while chunks
  created for future time intervals are partitioned across the new set
  of servers. The TimescaleDB planner can then handle queries
  across these reconfigurations, always knowing which nodes are
  storing which chunks. Server load subsequently can be rebalanced
  either by asynchronously migrating chunks or handled via data
  retention policies if desired.

*   **Data replication**.  Chunks can be individually replicated across
  nodes transactionally, either by configuring a replication factor on a
  distributed hypertable (which occurs as part of a 2PC transaction at
  insert time) or by copying an older chunk from one node to another
  to increase its replication factor, for example, after a node failure (coming soon).

*   **Data migration**.  Chunks can be individually migrated transactionally. This
  migration can be across tablespaces (disks) residing on a single server, often
  as a form of storage cost management; for example, moving older data from a
  faster, more expensive disks to slower, cheaper storage. This migration can
  also occur across nodes in a distributed hypertable, for example, in order to
  asynchronous rebalance a cluster after adding a server or to prepare for
  retiring a server (coming soon).
