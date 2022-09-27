---
title: About distributed hypertables
excerpt: Learn how distributed hypertables work in multi-node TimescaleDB
keywords: [distributed hypertables, multi-node]
---

# About distributed hypertables

Distributed hypertables are hypertables that span multiple nodes. With
distributed hypertables, you can scale your data storage across multiple
machines. The database can also parallelize some inserts and queries.

A distributed hypertable still acts as if it were a single table. You can work
with one in the same way as working with a regular hypertable. To learn more
about hypertables, see the [hypertables][hypertables] section.

But certain nuances can affect distributed hypertable performance. This section
explains how distributed hypertables work, and what you need to consider before
adopting one.

<highlight type="note">
To create a distributed hypertable, see the [how-to guide on creating
distributed
hypertables](/timescaledb/latest/how-to-guides/distributed-hypertables/create-distributed-hypertables/).
</highlight>

## Architecture of a distributed hypertable

Distributed hypertables are used with multi-node clusters. Each cluster has an
access node and multiple data nodes. You connect to your database via the access
node, but the data is stored on the data nodes. For more information on
multi-node, see the [multi-node][multi-node] section.

You create a distributed hypertable on your access node. Its chunks are stored
on the data nodes. When you insert data or run a query, the access node
communicates with the relevant data nodes and pushes down any processing if it
can.

## Space partitions for distributed hypertables

Distributed hypertables are always partitioned by time, just like regular
hypertables. But unlike non-distributed hypertables, distributed hypertables
should also be partitioned by space. This allows you to balance inserts and
queries between data nodes, similar to traditional sharding. Without space
partitioning, all data in the same time range would write to the same chunk on a
single node. For more information about space partitioning, see the
[space partitioning][space-partitioning] and
[multi-node][multi-node] sections.

By default, TimescaleDB creates as many space partitions as there are data
nodes. You can change this number, but having too many space partitions degrades
performance. It increases planning time for some queries, and leads to poorer
balancing when mapping items to partitions.

Data is assigned to space partitions by hashing. Each hash bucket in the space
dimension corresponds to a data node. One data node may hold many buckets, but
each bucket may belong to only one node for each time interval.

### Repartitioning distributed hypertables

You can expand distributed hypertables by adding additional data nodes. If you
now have fewer space partitions than data nodes, you need to increase the
number of space partitions to make use of your new nodes. The new partitioning
configuration only affects new chunks. In this diagram, an extra data node
was added during the third time interval. The fourth time interval now includes
four chunks, while the previous time intervals still include three:

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/repartitioning.png" alt="Diagram showing repartitioning on a distributed hypertable"/>

This can affect queries that span the two different partitioning configurations.
For more information, see the section on
[limitations of query push down][limitations].

## Replicating distributed hypertables

To replicate distributed hypertables at the chunk level, configure the
hypertables to write each chunk to multiple data nodes. This native replication
ensures that a distributed hypertable is protected against data node failures
and provides an alternative to fully replicating each data node using streaming
replication to provide high availability. Only the data nodes are replicated
using this method. The access node is not replicated.

For more information about replication and high availability, see the
[multi-node HA section][multi-node-ha].

## Performance of distributed hypertables

A distributed hypertable horizontally scales your data storage, so you're not
limited by the storage of any single machine. It also increases performance for
some queries.

Whether, and by how much, your performance increases depends on your query
patterns and data partitioning. Performance increases when the access node can
push down query processing to data nodes. For example, if you query with a
`GROUP BY` clause, and the data is partitioned by the `GROUP BY` column, the
data nodes can perform the processing and send only the final results to the
access node.

If processing can't be done on the data nodes, the access node needs to pull in
raw or partially processed data and do the processing locally. For more
information, see the [limitations of pushing down
queries][limitations-pushing-down].

<highlight type="note">
To learn more and compare performance between distributed and regular
hypertables, see the [blog post on optimizing multi-node query
performance](https://www.timescale.com/blog/achieving-optimal-query-performance-with-a-distributed-time-series-database-on-postgresql/).
For a sample query and set-up, this post shows a 7 times increase in query
performance for an optimized query and a 3 times increase for a less-optimized
query. It also shows a slight decrease in performance for a single-node
distributed hypertable compared to a regular hypertable. This reflects the added
overhead of inter-node communication.
</highlight>

## Query push down

The access node can use 1 of 2 methods to push down queries: full or partial.
Computations that can be pushed down include sorts and groupings. Joins on data
nodes aren't currently supported.

To see how a query is pushed down to a data node, use `EXPLAIN VERBOSE` to
inspect the query plan and the remote SQL statement sent to each data node.

### Full push down

In the full push-down method, the access node offloads all computation to the
data nodes. It receives final results from the data nodes and appends them. To
fully push down an aggregate query, the `GROUP BY` clause must include either:

*   All the partitioning columns _or_
*   Only the first space-partitioning column

For example, say that you want to calculate the `max` temperature for each
location:

```sql
SELECT location, max(temperature)
  FROM conditions
  GROUP BY location;
```

If `location` is your only space partition, each data node can compute the
maximum on its own subset of the data.

### Partial push down

In the partial push-down method, the access node offloads most of the
computation to the data nodes. It receives partial results from the data nodes
and calculates a final aggregate by combining the partials.

For example, say that you want to calculate the `max` temperature across all
locations. Each data node computes a local maximum, and the access node computes
the final result by computing the maximum of all the local maximums:

```sql
SELECT max(temperature) FROM conditions;
```

### Limitations of query push down

Distributed hypertables get improved performance when they can push down queries
to the data nodes. But the query planner might not be able to push down every
query. Or it might only be able to partially push down a query. This can occur
for several reasons:

*   You changed the partitioning configuration. For example, you added new data
 nodes and increased the number of space partitions to match. This can cause
 chunks for the same space value to be stored on different nodes. For
 instance, say you partition by `device_id`. You start with 3 partitions, and
 data for `device_B` is stored on node 3. You later increase to 4 partitions.
 New chunks for `device_B` are now stored on node 4. If you query across the
 repartitioning boundary, a final aggregate for `device_B` cannot be
 calculated on node 3 or node 4 alone. Partially processed data must be sent
 to the access node for final aggregation. The TimescaleDB query planner
 dynamically detects such overlapping chunks and reverts to the appropriate
 partial aggregation plan. This means that you can add data nodes and
 repartition your data to achieve elasticity without worrying about query
 results. In some cases, your query could be slightly less performant, but
 this is rare and the affected chunks usually move quickly out of your
 retention window.
*   The query includes [non-immutable functions][volatility] and expressions.
 The function cannot be pushed down to the data node, because by definition,
 it isn't guaranteed to have a consistent result across each node. An example
 non-immutable function is [`random()`][random-func], which depends on the
 current seed.
*   The query includes a user-defined function. The access node assumes the
 function doesn't exist on the data nodes, and doesn't push it down.

TimescaleDB uses several optimizations to avoid these limitations, and push down
as many queries as possible. For example, `now()` is a non-immutable function.
The database converts it to a constant on the access node and pushes down the
constant timestamp to the data nodes.

## Combine distributed hypertables and regular hypertables

You can use distributed hypertables in the same database as regular hypertables
and regular PostgreSQL tables. This mostly works the same way as having multiple
regular tables, with a few nuances. For example, if you `JOIN` a regular table
and a distributed hypertable, the access node needs to fetch the raw data from
the data nodes and perform the `JOIN` locally.

[limitations]: /timescaledb/:currentVersion:/how-to-guides/distributed-hypertables/about-distributed-hypertables/#query-push-down/
[hypertables]: /timescaledb/:currentVersion:/how-to-guides/hypertables/
[limitations-pushing-down]: #limitations-of-query-push-down
[multi-node-ha]: /timescaledb/:currentVersion:/how-to-guides/multinode-timescaledb/multinode-ha/
[multi-node]: /timescaledb/:currentVersion:/how-to-guides/multinode-timescaledb/
[random-func]: <https://www.postgresql.org/docs/current/functions-math.html#FUNCTIONS-MATH-RANDOM-TABLE>
[space-partitioning]: /timescaledb/:currentVersion:/how-to-guides/hypertables/about-hypertables#space-partitioning
[volatility]: <https://www.postgresql.org/docs/current/xfunc-volatility.html>
