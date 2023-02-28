---
title: Distributed hypertables
excerpt: Learn how distributed hypertables work on multi-node TimescaleDB
products: [cloud, mst, self_hosted]
keywords: [distributed hypertables, multi-node]
tags: [scaling]
---

# Distributed hypertables

You can have hypertables distributed across multiple nodes in the form of a
cluster, using the same hypertable and chunk mechanism used in single
hypertables. This allows you to scale inserts and queries beyond the
capabilities of a single TimescaleDB instance.

Distributed hypertables and regular hypertables look very similar, with
the main difference being that distributed chunks are not stored locally. There
are also some features of regular hypertables that distributed
hypertables do not support. For more information, see the section on
[current limitations][distributed-hypertable-limitations].

## Distributed databases and nodes

A distributed hypertable exists in a *distributed database* that
consists of multiple databases stored across one or more TimescaleDB
instances. A database that is part of a distributed database can
assume the role of either an access node or a data node, but not both.

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

It is important to note that access nodes and data nodes both run TimescaleDB,
and from an operational perspective, they act just like a single instance of
TimescaleDB.

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

By default, if a value is not specified, the number of space partitions is set
to be equal to the number of data nodes. The system also increases the number of
space partitions, if necessary, when adding new data nodes. If you are setting
this manually, create an equal number of space partitions, or create a multiple
of the number of data nodes associated with the distributed hypertable. This
provides optimal data distribution across your data nodes. In case of multiple
space partitions, only the first space partition is used to determine how chunks
are distributed across servers.

## Scaling distributed hypertables

As time-series data grows, a common use case is to add data nodes to expand the
storage and compute capacity of distributed hypertables. Thus, TimescaleDB can
be elastically scaled out by simply adding data nodes to a distributed database.

TimescaleDB adjusts the number of space partitions as new data nodes are added.
Although existing chunks do not have their space partitions updated, the new
settings are applied to newly created chunks. Because of this behavior, you do
not need to move data between data nodes when the cluster size is increased, and
can simply update how data is distributed for the next time interval. Writes for
new incoming data leverage the new partitioning settings, while the access node
can still support queries across all chunks, even if they were created using
the old partitioning settings.

<Highlight type="note">
You can change the number of space partitions, but you can't change the column
on which the data is partitioned.
</Highlight>

[distributed-hypertable-limitations]: /timescaledb/:currentVersion:/overview/limitations/#distributed-hypertable-limitations
