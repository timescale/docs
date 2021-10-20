# About multinode
If you have a larger workload, you might need more than one TimescaleDB
instance. TimescaleDB multinode allows you to run and manage multiple instances,
giving you faster data ingest, and more responsive and efficient queries.

You can use multinode on a self-managed TimescaleDB instance, or you can use it
on [Timescale Cloud][multinode-cloud] or
[Managed Service for TimescaleDB][multinode-mst].

## Distributed hypertables
Multi-node TimescaleDB allows you to run petabyte-scale workloads across
multiple physical TimescaleDB instances, called data nodes. To do this, we use
distributed hypertables.

A [hypertable][hypertables] is a virtual table in TimescaleDB that automatically
partitions data into chunks on a single machine, continuously creating new ones
as necessary, while acting like a single continuous table across all time. A
distributed hypertable is a hypertable that automatically partitions data into
chunks across multiple machines, while still like a single continuous table
across all time.

## Multinode architecture
To create a multinode cluster, you need an access node that stores metadata
for the distributed hypertable and performs query planning across the cluster,
and any number of data nodes that store subsets of the distributed hypertable
dataset and execute queries locally.

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/multinode_arch.png" alt="Diagram showing how multinode access and data nodes interact"/>

You create these nodes by assigning roles to them within TimescaleDB. On your
hosted or self-hosted installation, you create a server that can act as an
access node, then use that access node to create data nodes. Finally, you create
the distributed hypertable in the same way as you create a regular hypertable.

Data that is ingested into a distributed hypertables is spread across the data
nodes according to the `hostname` key. The data is then further partitioned by
time on each data node.

TimescaleDB multinode currently supports capabilities that make it suited
for large-volume time-series workloads. This includes `JOIN` optimizations,
data rebalancing, distributed object management, improved elasticity, and
high-availability. The experience and functionality is equivalent to single-node
TimescaleDB, with support for automated compression policies, and TimescaleDB
SkipScan.

Distributed hypertables scale to ingest more than 10 million metrics per second,
and can store petabytes of data. Distributed hypertables also take advantage
of query parallelization, employing full/partial aggregates and push-downs, to
achieve much faster queries.


[hypertables]: /how-to-guides/hypertables/
[multinode-cloud]: /cloud/:currentVersion:/cloud-multi-node/
[multinode-mst]: /mst/:currentVersion:/mst-multi-node/
