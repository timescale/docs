# Core Concepts
## Overview [](overview)

TimescaleDB is implemented as an extension on PostgreSQL, which means that it
runs within an overall PostgreSQL instance.  The extension
model allows the database to take advantage of many of the attributes of
PostgreSQL such as reliability, security, and connectivity to a wide range of
third-party tools.  At the same time, TimescaleDB leverages the high degree of
customization available to extensions by adding hooks deep into PostgreSQL's
query planner, data model, and execution engine.

From a user perspective, TimescaleDB exposes what look like singular tables,
called **hypertables**, that are actually an abstraction or a virtual view of
many individual tables holding the data, called **chunks**.

<img class="main-content__illustration" src="https://assets.iobeam.com/images/docs/illustration-hypertable-chunk.svg" alt="hypertable and chunks"/>

Chunks are created by partitioning the hypertable's data into
one or multiple dimensions: All hypertables are partitioned by a time interval,
and can additionally be partitioned by a key such as device ID, location,
user id, etc. We sometimes refer to this as partitioning across "time and space".

## Terminology [](terminology)

### Hypertables [](hypertables)
The primary point of interaction with your data is a hypertable,
the abstraction of a single continuous table across all space and time
intervals, such that one can query it via standard SQL.

Virtually all user interactions with TimescaleDB are with hypertables. Creating
tables and indexes, altering tables, inserting data, selecting data, etc. can
(and should) all be executed on the hypertable. [[Jump to basic SQL operations][jumpSQL]]

A hypertable is defined by a standard schema with column names and
types, with at least one column specifying a time value, and
one (optional) column specifying an additional partitioning key.

>:TIP: See our [data model][] for a further discussion of various
ways to organize data, depending on your use cases;
the simplest and most natural is in a "wide-table" like many
relational databases.

A single TimescaleDB deployment can store multiple hypertables, each
with different schemas.

Creating a hypertable in TimescaleDB takes two simple SQL
commands: `CREATE TABLE` (with standard SQL syntax),
followed by `SELECT create_hypertable()`.

Indexes on time and the partitioning key are automatically created on hypertables,
although additional indexes can also be created (and TimescaleDB supports the
full range of PostgreSQL index types).

### Chunks [](chunks)

Internally, TimescaleDB automatically splits each
hypertable into **chunks**, with each chunk corresponding to a specific time
interval and a region of the partition key’s space (using hashing).
These partitions are disjoint (non-overlapping), which helps the query planner
to minimize the set of chunks it must touch to resolve a query.

Each chunk is implemented using a standard database table.  (In PostgreSQL
internals, the chunk is actually a "child table" of the "parent" hypertable.)

Chunks are right-sized, ensuring that all of the B-trees for a table’s
indexes can reside in memory during inserts.  This avoids thrashing when
modifying arbitrary locations in those trees.

Further, by avoiding overly large chunks, we can avoid expensive "vacuuming"
operations when removing deleted data according to automated retention policies.
The runtime can perform such operations by simply dropping chunks (internal
tables), rather than deleting individual rows.

## Native Compression [](native-compression)

Compression is powered by TimescaleDB’s built-in job scheduler framework. We
leverage it to asynchronously convert individual chunks from an uncompressed
row-based form to a compressed columnar form across a hypertable: Once a chunk
is old enough, the chunk will be transactionally converted from the row to columnar form.

With native compression, even though a single hypertable in TimescaleDB will
store data in both row and columnar forms, users don’t need to worry about
this: they will continue to see a standard row-based schema when querying data.
This is similar to building a view on the decompressed columnar data.

TimescaleDB enables this capability by both (1) transparently appending data
stored in the standard row format with decompressed data from the columnar format,
and (2) transparently decompressing individual columns from selected rows at query time.

During a query, uncompressed chunks will be processed normally, while data from
compressed chunks will first be decompressed and converted to a standard row
format at query time, before being appended or merged into other data. This
approach is compatible with everything you expect from TimescaleDB, such as
relational JOINs and analytical queries, as well as aggressive constraint exclusion
to avoid processing chunks.

For more information on using compression, please see our [Compression Operational Overview].
For a deep dive on the design motivations and architecture supporting
compression, read our [compression blog post].


## Single Node vs. Multi-Node [](single-node-vs-clustering)

TimescaleDB performs extensive partitioning both
on **single-node** deployments as well as **multi-node** deployments.
While
partitioning is traditionally only used for scaling out across multiple
machines, it also allows us to scale up to high write rates (and improved
parallelized queries) even on single machines.

The current open-source release of TimescaleDB only supports single-node
deployments. Of note is that the single-node version of TimescaleDB has been
benchmarked to over 10-billion-row hypertables on commodity machines without
a loss in insert performance.

## Benefits of Single-node Partitioning [](benefits-chunking)

A common problem with scaling database performance on a single machine
is the significant cost/performance trade-off between memory and disk.
Eventually, our entire dataset will not fit in memory, and we’ll need
to write our data and indexes to disk.

Once the data is sufficiently large that we can’t fit all pages of our indexes
(e.g., B-trees) in memory, then updating a random part of the tree can involve
swapping in data from disk.  And databases like PostgreSQL keep a B-tree (or
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

## Distributed Hypertables [](distributed-hypertables)

>:WARNING: Distributed hypertables and [multi-node capabilities][multi-node-basic]
are currently in BETA. This feature is not meant for production use. For more information,
please [contact us][contact] or join the #multinode channel in our 
[community Slack][slack].

TimescaleDB supports distributing hypertables across multiple nodes
(i.e., a cluster) by leveraging the same hypertable and chunk
primitives as described above. This allows TimescaleDB to scale
inserts and queries beyond the capabilities of a single TimescaleDB
instance.

Distributed hypertables and regular hypertables look very similar, with
the main difference being that distributed chunks are not stored locally. There
are also some features of regular hypertables that distributed
hypertables do not support (see section on [current limitations][distributed-hypertable-limitations]).

### Distributed Databases and Nodes

A distributed hypertable exists in a *distributed database* that
consists of multiple databases stored across one or more TimescaleDB
instances. A database that is part of a distributed database can
assume the role of either an **access node** or a **data node** (but not both).

A client connects to an access node database. The access node then
distributes the requests and queries appropriately to data nodes, and
aggregates the results received from the data nodes.  Access nodes
store cluster-wide information about the different data nodes as well
as how chunks are distributed across those data nodes. Access nodes
can also store non-distributed hypertables, as well as regular
PostgreSQL tables.

Data nodes do not store cluster-wide information, and otherwise look
just as if they were stand-alone TimescaleDB instances. You should not
directly access hypertables or chunks on data nodes. Doing so might
lead to inconsistent distributed hypertables.

It is important to note that access nodes and data nodes both run TimescaleDB, and for all intents and
purposes, act just like a single instance of TimescaleDB from an operational perspective.

### Configuring Distributed Hypertables

To ensure best performance, you should partition a distributed
hypertable by both time and space. If you only partition data by
time, that chunk will have to fill up before the access node chooses
another data node to store the next chunk, so during that
chunk's time interval, all writes to the latest interval will be
handled by a single data node, rather than load balanced across all
available data nodes. On the other hand, if you specify a space
partition, the access node will distribute chunks across multiple data
nodes based on the space partition so that multiple chunks are created
for a given chunk time interval, and both reads and writes to that
recent time interval will be load balanced across the cluster.

By default, we automatically set the number of space partitions equal to the number of data nodes
if a value is not specified. The system will also increase the number of space partitions, if necessary,
when adding new data nodes. If setting manually, we recommend that the number of space partitions are
equal or a multiple of the number of data nodes associated with the distributed hypertable for optimal data distribution
across data nodes. In case of multiple space partitions, only the first space partition will be used to determine
how chunks are distributed across servers.

### Scaling distributed hypertables

As time-series data grows, a common use case is to add data nodes to expand the storage and compute
capacity of distributed hypertables. Thus, TimescaleDB can be elastically scaled out by simply adding data nodes to
a distributed database.

As mentioned earlier, TimescaleDB can (and will) adjust the number of space partitions as new data nodes are
added. Although existing chunks will not have their space partitions updated, the new settings will be applied to
newly created chunks. Because of this behavior, we do not need to move data between data nodes when the cluster size is
increased, and simply update how data is distributed for the next time interval. Writes for new incoming data will
leverage the new partitioning settings, while the access node can still support queries across all chunks (even those
that were created using the old partitioning settings). Do note that although the number of space partitions
can be changed, the column on which the data is partitioned can not be changed.

<!--- Picture of blog post -->

**Next:** Benefits of this architecture design? [TimescaleDB vs. PostgreSQL][TvsP]

[data model]: /introduction/data-model
[chunking]: https://www.timescale.com/blog/time-series-data-why-and-how-to-use-a-relational-database-instead-of-nosql-d0cd6975e87c#2362
[jumpSQL]: /using-timescaledb/hypertables
[TvsP]: /introduction/timescaledb-vs-postgres
[Compression Operational Overview]: /using-timescaledb/compression
[compression blog post]: https://blog.timescale.com/blog/building-columnar-compression-in-a-row-oriented-database
[contact]: https://www.timescale.com/contact
[slack]: https://slack.timescale.com/
[distributed-hypertable-limitations]: /using-timescaledb/limitations#distributed-hypertable-limitations
[multi-node-basic]: /getting-started/setup-multi-node-basic
