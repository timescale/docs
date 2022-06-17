# Scaling TimescaleDB
[//]: # (Comment: Add image comparing single node, physical replication, multi-node)

TimescaleDB supports three main deployment options:  as a single database server,
in a traditional primary/replica deployment, or in a multi-node deployment with horizontal
scalability.

## Single instance (node)
A single instance of PostgreSQL with TimescaleDB installed can often support
the needs of very large datasets and application querying. In a regular PostgreSQL
instance without TimescaleDB, a common problem with scaling database performance
on a single machine is the significant cost/performance trade-off between memory
and disk. Eventually, the entire dataset does not fit in memory, and you need
to write your data and indexes to disk.

Once the data is sufficiently large that we can't fit all pages of our indexes
(for example, B-trees) in memory, then updating a random part of the tree can involve
swapping in data from disk. And databases like PostgreSQL keep a B-tree (or
other data structure) for each table index, in order for values in that
index to be found efficiently. So, the problem compounds as you index more
columns.

But because each of the chunks created by TimescaleDB is itself stored as a
separate database table, all of its indexes are built only across these much
smaller tables rather than a single table representing the entire
dataset. So if we size these chunks properly, we can fit the latest tables
(and their B-trees) completely in memory, and avoid this swap-to-disk problem,
while maintaining support for multiple indexes.

For more on the motivation and design of TimescaleDB, please see our
[technical blog post][chunking].

## Primary and backup replication

[//]: # (Comment: Update this image: https://blog.timescale.com/content/images/2018/12/image-12.png )

TimescaleDB supports streaming replication from a "primary" database server
to separate "replica" servers, using the standard PostgreSQL physical
replication protocol. The protocol works by streaming records of database
modifications from the primary server to one or more replicas, which can then
be used as read-only nodes (to scale queries) or as failover servers (for high availability).

PostgreSQL streaming replication leverages the write-ahead log (WAL), which is
an append-only series of instructions that captures every atomic database change.
The replication works by continuously shipping segments of the WAL from the primary
to any connected replicas. Each replica then applies the WAL changes and makes them
available for querying, ensuring that operations to the primary are applied atomically
and in an identical order to each replica.

TimescaleDB (from underlying PostgreSQL functionality) supports various
options for physical replication that trade off performance and consistency.

Replication can occur synchronously. When an insert or schema modification
operation is executed on the primary, the operation is replicated (or even
applied) to replicas before the primary returns any result. This ensures that
replicas always stay perfectly up-to-date.

Replication can also occur asynchronously. Operations to the primary return
to a client as soon as they are executed, but any changes are queued for
asynchronous transmission to any replicas. Asynchronous replicas are
often used for ad-hoc data exploration, to avoid heavy query load on replicas
from interfering with a production primary server.

In fact, a single TimescaleDB primary can have both synchronous and
asynchronous replicas, for a mix of HA failover and read scaling. The main
limitation of primary/backup replication is that each server stores a *full copy*
of the database.

## Multi-node TimescaleDB and distributed hypertables [](multi-node)

TimescaleDB 2.0 also supports horizontally scaling across many servers.
Instead of a primary node (and each replica) which stores the full copy
of the data, a *[distributed hypertable][distributed-hypertables]* can be spread across multiple
nodes, such that each node only stores a portion of the distributed
hypertable (namely, a subset of the chunks). This allows TimescaleDB
to scale storage, inserts, and queries beyond the capabilities of a single
TimescaleDB instance. Distributed hypertables and regular hypertables
look very similar, with the main difference being that distributed chunks
are not stored locally (and some other [current limitations][distributed-hypertable-limitations]).

In a multi-node deployment of TimescaleDB, a database can assume the
role of either an **access node** or a **data node**; both run the identical
TimescaleDB software for operational simplicity.

[//]: # (Comment: Picture of access nodes and data nodes )

A client connects to an access node database. The client can
create a distributed hypertable on the access node, which stores
cluster-wide information about the different data nodes as well as
how chunks belonging to distributed hypertables are spread
across those data nodes. Access nodes can also store non-distributed
hypertables, as well as regular PostgreSQL tables.

Data nodes do not store cluster-wide information, and otherwise look
just as if they were stand-alone TimescaleDB instances.

Clients interact with the distributed hypertable all through the access
node, performing schema operations, inserting data, or querying the
data as if it's a standard table. When receiving a query, the access
node uses local information about chunks to determine to which data
nodes to push down queries. Query optimizations across the cluster
attempt to minimize data transferred between data nodes and the
access node, such that aggregates are performed on data nodes
whenever possible, and only aggregated or filtered results are passed
back to the access node for merging and returning to a client.


[data model]: /overview/data-model-flexibility/
[chunking]: https://www.timescale.com/blog/time-series-data-why-and-how-to-use-a-relational-database-instead-of-nosql-d0cd6975e87c
[Compression Operational Overview]: /how-to-guides/compression/
[compression blog post]: https://blog.timescale.com/blog/building-columnar-compression-in-a-row-oriented-database
[contact]: https://www.timescale.com/contact
[slack]: https://slack.timescale.com/
[distributed-hypertables]: /overview/core-concepts/distributed-hypertables
[distributed-hypertable-limitations]: /overview/limitations/#distributed-hypertable-limitations
[multi-node-basic]: /how-to-guides/multi-node-setup/
