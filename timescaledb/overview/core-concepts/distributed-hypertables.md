---
title: Distributed hypertables
excerpt: Learn how distributed hypertables work on multi-node TimescaleDB
keywords: [distributed hypertables, multi-node]
tags: [scaling]
---

# Distributed hypertables

TimescaleDB supports distributing hypertables across multiple nodes
(that is, a cluster) by leveraging the same hypertable and chunk
primitives as described above. This allows TimescaleDB to scale
inserts and queries beyond the capabilities of a single TimescaleDB
instance.

Distributed hypertables and regular hypertables look very similar, with
the main difference being that distributed chunks are not stored locally. There
are also some features of regular hypertables that distributed
hypertables do not support (see section on [current limitations][distributed-hypertable-limitations]).

## Distributed databases and nodes

A distributed hypertable exists in a *distributed database* that
consists of multiple databases stored across one or more TimescaleDB
instances. A database that is part of a distributed database can
assume the role of either an **access node** or a **data node** (but not both).

A client connects to an access node database. The access node then
distributes the requests and queries appropriately to data nodes, and
aggregates the results received from the data nodes. Access nodes
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

## Configuring distributed hypertables

To ensure best performance, you should partition a distributed
hypertable by both time and space. If you only partition data by
time, that chunk has to fill up before the access node chooses
another data node to store the next chunk, so during that
chunk's time interval, all writes to the latest interval is
handled by a single data node, rather than load balanced across all
available data nodes. On the other hand, if you specify a space
partition, the access node distributes chunks across multiple data
nodes based on the space partition so that multiple chunks are created
for a given chunk time interval, and both reads and writes to that
recent time interval are load balanced across the cluster.

By default, we automatically set the number of space partitions equal to the
number of data nodes if a value is not specified. The system also increases
the number of space partitions, if necessary, when adding new data nodes. If
setting manually, we recommend that the number of space partitions are
equal or a multiple of the number of data nodes associated with the distributed
hypertable for optimal data distribution across data nodes. In case of multiple
space partitions, only the first space partition is used to determine
how chunks are distributed across servers.

## Scaling distributed hypertables

As time-series data grows, a common use case is to add data nodes to expand the
storage and compute capacity of distributed hypertables. Thus, TimescaleDB can
be elastically scaled out by simply adding data nodes to a distributed database.

As mentioned earlier, TimescaleDB adjusts the number of space
partitions as new data nodes are added. Although existing chunks do not have
their space partitions updated, the new settings are applied to newly
created chunks. Because of this behavior, we do not need to move data between
data nodes when the cluster size is increased, and simply update how data is
distributed for the next time interval. Writes for new incoming data 
leverage the new partitioning settings, while the access node can still support
queries across all chunks (even those that were created using the old
partitioning settings). Do note that although the number of space partitions
can be changed, the column on which the data is partitioned can not be changed.

[distributed-hypertable-limitations]: /timescaledb/:currentVersion:/overview/limitations/#distributed-hypertable-limitations
