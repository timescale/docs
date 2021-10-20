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
To create a multinode cluster, you need an access node that stores metadata for the distributed hypertable and performs query planning across the cluster, and any number of data nodes that store subsets of the distributed hypertable dataset and execute queries locally.

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/multinode_arch.png" alt="Diagram showing how multinode access and data nodes interact"/>

<!-- Lana, you're up to here! --LKB 2021-10-20-->

You create these nodes by assiging roles these roles as described are established by executing database commands within TimescaleDB (e.g., on a server that should act as an access node, you run `add_data_node` pointing to the hostnames of the data nodes, and then `create_distributed_hypertable`.)



CAPTION: A multi-dimensional distributed hypertable covering one access node (AN) and three data nodes (DN1, DN2, DN3). The "space" dimension (e.g., hostname in this image) determines the data node to place a chunk on.

Once multi-node TimescaleDB is set up, creating a distributed hypertable is as simple as creating a regular hypertable:

-- Create a distributed hypertable partitioned on time and hostname
SELECT create_distributed_hypertable('conditions', 'time', 'hostname');

-- Insert some data
INSERT INTO conditions VALUES ('2020-12-14 13:45', 1, '1.2.3.4');


The distributed hypertable will then spread data across the data nodes according to the “hostname” key and then the data will be further partitioned by time on each data node.

Today multi-node TimescaleDB supports several capabilities which make it suited for large-volume time-series workloads, such as JOIN optimizations, data rebalancing, distributed object management (e.g., keeping roles, UDFs and other objects consistent across nodes), improved elasticity and high-availability, all while striving to provide the same experience and functionality as single-node TimescaleDB, with support for compression and automated compression policies and TimescaleDB SkipScan, which makes DISTINCT queries up to 8000x faster on PostgreSQL.

Performance wise, distributed hypertables scale to ingest 10+ million metrics per second and store petabytes of data. Distributed hypertables also take advantage of query parallelization, employing full/partial aggregates and push-downs, to achieve much faster queries. For more on the design of multi-node TimescaleDB, see our announcement blog: TimescaleDB 2.0: A multi-node, petabyte-scale, completely free relational database for time-series.


[hypertables]: /how-to-guides/hypertables/

[multinode-cloud]: /cloud/:currentVersion:/cloud-multi-node/
[multinode-mst]: /mst/:currentVersion:/mst-multi-node/
