# About multi-node
If you have a larger workload, you might need more than one TimescaleDB
instance. TimescaleDB multi-node allows you to run and manage multiple instances,
giving you faster data ingest, and more responsive and efficient queries.

You can use multi-node on a self-managed TimescaleDB instance, or you can use it
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

## Multi-node architecture
To create a multi-node cluster, you need an access node that stores metadata
for the distributed hypertable and performs query planning across the cluster,
and any number of data nodes that store subsets of the distributed hypertable
dataset and run queries locally.

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/multinode_arch.png" alt="Diagram showing how multi-node access and data nodes interact"/>

You create these nodes by assigning roles to them within TimescaleDB. On your
hosted or self-hosted installation, you create a server that can act as an
access node, then use that access node to create data nodes. Finally, you create
the distributed hypertable in the same way as you create a regular hypertable.

Data that is ingested into a distributed hypertable is spread across the data
nodes according to the space partition key. The data is then further partitioned by
time on each data node.

TimescaleDB multi-node currently supports capabilities that make it suited
for large-volume time-series workloads. This includes `JOIN` optimizations,
data rebalancing, distributed object management, improved elasticity, and
high-availability. The experience and functionality is equivalent to single-node
TimescaleDB, with support for automated compression policies, and TimescaleDB
SkipScan.

Distributed hypertables scale to ingest more than 10 million metrics per second,
and can store petabytes of data. Distributed hypertables also take advantage
of query parallelization, employing full/partial aggregates and push-downs, to
achieve much faster queries.

If your dataset has a column called something like `customerID`, `deviceID`, or
`location`, and that column is frequently used in the `GROUP BY` clause of your
queries, then it is a good candidate column for space partitioning. For example,
if we partition on `<time, location>`, then this query would work well on a distributed hypertable, because it runs on all
the data nodes in parallel:
```sql
SELECT time_bucket('1 hour', time) AS hour, location, avg(temperature)
FROM conditions
GROUP BY hour, location
ORDER BY hour, location
LIMIT 100;
```

However, this query would not work as well, because it involves only a single data node:
```sql
SELECT time_bucket('1 hour', time) AS hour, avg(temperature)
FROM conditions
WHERE location = 'office_1'
GROUP BY hour
ORDER BY hour
LIMIT 100;
```

There are other factors that you also need to consider when
partitioning your distributed hypertables. For example, if a query can be run
concurrently by many different client sessions, each filtering on a different
location, then that would also spread the load evenly across the distributed
hypertable.

Inserts also benefit from space partitioning. The additional space dimension
makes it more likely that a multi-row insert uniformly spreads across the data
nodes, leading to increased insert performance. In contrast, with a single time
dimension it is likely that in-order inserts write to only one data node and
chunk at a time. In this case, chunks are created on the data nodes in
round-robin fashion.



[hypertables]: /how-to-guides/hypertables/
[multinode-cloud]: /cloud/:currentVersion:/cloud-multi-node/
[multinode-mst]: /mst/:currentVersion:/mst-multi-node/
