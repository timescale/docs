# About distributed hypertables
Distributed hypertables are hypertables that span multiple nodes. With
distributed hypertables, you can scale your data storage across multiple
machines. The database can also parallelize some inserts and queries.

A distributed hypertable still acts as if it were a single table. You can work
with one in the same way as working with a regular hypertable. But certain
nuances can affect their performance. This section explains how distributed
hypertables work, and what you need to consider before adopting one.

<highlight type="note">
To create a distributed hypertable, see the [how-to guide on creating
hypertables](/timescaledb/latest/how-to-guides/hypertables/create#create-a-distributed-hypertable/).
</highlight>

## Architecture of a distributed hypertable
Distributed hypertables are used with clusters. Each cluster has an access node
and multiple data nodes. You connect to your database via the access node, but
the data is stored on the data nodes. For more information on multi-node, see the
[multi-node][multi-node] section.

You create a distributed hypertable on your access node. Its chunks are stored
on the data nodes. When you insert data or run a query, the access node
communicates with the relevant data nodes and pushes down any processing if it
can.

## Space partitions for distributed hypertables
Distributed hypertables are always partitioned by time, just like regular
hypertables. But unlike non-distributed hypertables, distributed hypertables
should also be partitioned by space. This allows you to balance inserts and
queries between data nodes, similar to traditional sharding.

For more information about space partitioning, see the [space
partitioning][space-partitioning] and [multi-node][multi-node] sections.

## Performance of distributed hypertables
A distributed hypertable horizontally scales your data storage, so you're not
limited by the storage of any single machine. It also increases performance for
some queries.

The size of your performance increase depends on your query patterns and data
partitioning. Performance increases when the access node can push down query
processing to data nodes. For example, if you use a `GROUP BY` clause, and the
data is partitioned by the `GROUP BY` column, the data nodes can perform the
processing and send only the final results to the access node.

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

### Pushing down queries
The access node can use 1 of 2 methods to push down queries: full or partial.
Computations that can be pushed down include sorts and groupings. Joins on data
nodes aren't currently supported.

To see how a query is pushed down to a data node, use `EXPLAIN VERBOSE` to
inspect the query plan and the remote SQL statement sent to each data node.

#### Full push down
In the full push-down method, the access node offloads all computation to the
data nodes. It receives final results from the data nodes and appends them. To
fully push down an aggregate query, the `GROUP BY` clause must include either:
*	All the partitioning columns _or_
*	Only the first space-partitioning column

For example, say that you want to calculate the `max` temperature for each
location:
```sql
SELECT location, max(temperature)
  FROM conditions
  GROUP BY location;
```

If `location` is your only space partition, each data node can compute the
maximum on its own subset of the data.

#### Partial push down
In the partial push-down method, the access node offloads most of the
computation to the data nodes. It receives partial results from the data nodes
and calculates a final aggregate by combining the partials.

For example, say that you want to calculate the `max` temperature across all
locations. Each data node computes a local maximum, and the access node computes
the final result by computing the maximum of all the local maximums:
```sql
SELECT max(temperature) FROM conditions;
```

#### Limitations of pushing down queries
Distributed hypertables get improved performance when they can push down queries
to the data nodes. But the query planner might not be able to push down every
query. Or it might only be able to partially push down a query. This can occur
for several reasons:

*	You changed the partitioning configuration. For example, you added new data
	nodes and increased the number of space partitions to match. This can cause
	chunks for the same space value to be stored on different nodes. For
	instance, say you partition by `device_id`. You start with 3 partitions, and
	data for `device_B` is stored on node 3. You later increase to 4 partitions.
	New chunks for `device_B` are now stored on node 4. If you query across the
	repartitioning boundary, a final aggregate for `device_B` cannot be
	calculated on node 3 or node 4 alone. Partially processed data must be sent
	to the access node for final aggregation. 

*	The query includes [non-immutable functions][volatility] and expressions.
	The function cannot be pushed down to the data node, because by definition,
	it isn't guaranteed to have a consistent result across each node. An example
	non-immutable function is [`random()`][random-func], which depends on the
	current seed.

*	The query includes a user-defined function. The access node assumes the
	function doesn't exist on the data nodes, and doesn't push it down.

TimescaleDB uses several optimizations to avoid these limitations, and push down
as many queries as possible. For example, `now()` is a non-immutable function.
So the database converts it to a constant on the access node and pushes down
the constant timestamp to the data nodes.

## Combine distributed hypertables and regular hypertables
You can use distributed hypertables in the same database as regular hypertables
and regular PostgreSQL tables. This mostly works the same way as having multiple
regular tables, with a few nuances. For example, if you `JOIN` a regular table
and a distributed hypertable, the access node needs to fetch the raw data from
the data nodes and perform the `JOIN` locally.

## Operations on a distributed hypertable
You can insert and query data on distributed hypertables as you do on
regular hypertables. There are some performance nuances, because of the push
down from the access node to the data nodes. To learn more, see:
*	[Insert data to a distibuted hypertable][insert]
*	[Query data in a distributed hypertable][query]

[copy]: /how-to-guides/hypertables/work-with-distributed-hypertables#copy-data
[current_time]: https://www.postgresql.org/docs/current/functions-datetime.html#FUNCTIONS-DATETIME-CURRENT
[insert]: /how-to-guides/hypertables/work-with-distributed-hypertables#insert-data-into-a-distributed-hypertable
[limitations-pushing-down]: #limitations-of-pushing-down-queries
[multi-node]: /how-to-guides/multinode-timescaledb/
[random-func]: https://www.postgresql.org/docs/current/functions-math.html#FUNCTIONS-MATH-RANDOM-TABLE
[space-partitioning]: /how-to-guides/hypertables/about-hypertables#space-partitioning
[query]: /how-to-guides/hypertables/work-with-distributed-hypertables#query-a-distributed-hypertable
[volatility]: https://www.postgresql.org/docs/current/xfunc-volatility.html
