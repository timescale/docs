# Distributed Hypertables

Distributed hypertables extend regular hypertables with the ability to
store data chunks across multiple data nodes for better scale-out
performance. Prior to creating a distributed hypertable, however,
TimescaleDB must be [set up for multi-node
usage][getting-started-multi-node].

In most cases, using a distributed hypertable is similar to using a
regular hypertable, including inserting, querying, and altering
it. Thus, for basic usage, please review the [documentation for regular
hypertables][using-hypertables].

For inserts and queries, however, a distributed hypertable has unique
performance characteristics and there are also additional limitations
due to its distributed nature. For instance, query performance is
heavily dependent on the ability to *push down* work to data nodes,
which in turn ties into how data is partitioned across the nodes. If
it is not possible to push down computations, or the query does not
involve many data nodes, the query performance of a distributed
hypertable will likely be worse than that of a regular hypertable due
to the additional network overhead.

Note, also, that distributed hypertables can live alongside
non-distributed tables and other objects; in fact, no objects are
distributed by default. Interactions between distributed hypertables
and non-distributed objects might not have the expected behavior. For
instance, setting permissions on a distributed hypertable only works
if the roles involved exist identically on all data nodes. Further,
joins between a local table and a distributed hypertable requires
fetching the raw data from data nodes and performing the join locally.

>:WARNING: Distributed hypertables currently have some limitations
when compared to non-distributed hypertables. Before creating a
distributed hypertable for production workloads, please review our
[limitations][distributed-hypertable-limitations] document to ensure
that your use case will work as expected. You can also [contact
us][contact] or join the #multinode channel in our [community Slack][slack].

## Creating a Distributed Hypertable [](create)

Creating a distributed hypertable is very similar to creating a
regular hypertable. The main difference is that you must use the
function
[`create_distributed_hypertable`][create_distributed_hypertable]
instead of the regular [`create_hypertable`][create_hypertable].

```sql
CREATE TABLE conditions (
  time        TIMESTAMPTZ       NOT NULL,
  location    TEXT              NOT NULL,
  temperature DOUBLE PRECISION  NULL,
  humidity    DOUBLE PRECISION  NULL
);

SELECT create_distributed_hypertable('conditions', 'time', 'location');
```

>:WARNING: If there are no data nodes configured for the database, you
>will get an error when executing `create_distributed_hypertable` and
>the distributed hypertable will not be created. Please review the
>section on [setting up multi-node][getting-started-multi-node]
>for information on how to add data nodes.

This creates a multi-dimensional distributed hypertable across all
data nodes, partitioned along `time` and `location`. With the given
partitioning configuration, each data node will be responsible for a
specific subset of the data based on the value of `location`, allowing
concurrent and parallel execution of a query across the data nodes.

You can now insert data into the distributed hypertable and the data
will automatically be routed to the correct data node.

### Best Practices for Partitioning [](partitioning-best-practices)

Like a regular hypertable, a distributed hypertable needs to be
partitioned along a "time" dimension (e.g., a `timestamptz`
column). However, for best performance with most distributed
workloads, we recommend multi-dimensional partitioning with an
additional "space" dimension that consistently partitions the data
over the data nodes, similar to traditional [sharding][sharding].

If your data set has a column called something similar to
`customerID`, `deviceID`, or `location` (as in the example above), and
it figures frequently in the `GROUP BY` clause of queries, then it is
likely a good candidate column for space partitioning. For instance, a
query like the following one would work well on the example
distributed hypertable above:

```sql
SELECT time_bucket('1 hour', time) AS hour, location, avg(temperature)
FROM conditions
GROUP BY hour, location
ORDER BY hour, location
LIMIT 100;
```

as this query would execute in parallel on all data nodes. A query
that would not make the best use of space partitioning, however, would
be:

```sql
SELECT time_bucket('1 hour', time) AS hour, avg(temperature)
FROM conditions
WHERE location = 'office_1'
GROUP BY hour
ORDER BY hour
LIMIT 100;
```

as this query would only involve a single data node. Still, there are
other factors to consider as well. For instance, if the latter example
query is executed concurrently by many different client sessions, each
filtering on a different location, then that would also spread the
load evenly across the distributed hypertable.

Inserts also benefit from space partitioning; the additional space
dimension makes it more likely that a multi-row insert uniformly
spreads across the data nodes, leading to increased insert
performance. In contrast, with a single time dimension it is likely
that in-order inserts write to only one data node and chunk at a
time. Chunks would then be created on data nodes in round-robin
fashion.


## Inserting into a Distributed Hypertable [](insert)

Just like a regular hypertable, it is important to batch data when
inserting into a distributed hypertable. Each insert statement is
often its own transaction, and the overhead and cost of this
transaction is good to amortize over many rows of data. With a
distributed hypertable, the transaction has additional costs due to
the coordination that needs to happen across data nodes (e.g.,
two-phase commit protocol). In such cases, a single insert transaction
to the access node involving many rows of data is processed by the
access node, such that the access node (a) splits the input set into
several smaller batches of rows (with each batch having those rows
that belong to a specific data node based on the distributed
hypertable's partitioning), and then (b) writes each batch of rows to
its corresponding data node.

There are two ways to insert data to the access node (which similarly
uses corresponding methods when interacting with its data nodes):

- [`INSERT`][insert]: the access node sets up a multi-row prepared
  statement on each data node and then splits the original insert
  statement across these sub-statements. The access node can buffer up
  to `timescaledb.max_insert_batch_size` number of rows (default 1000)
  per data node before a prepared statement's limit is reached and
  gets flushed to the data node. Thus, if there are 10000 rows in the
  original insert statement and three data nodes with the default
  insert batch size, the insert would roughly require three full
  batches per data node and a partial final batch.

  By tuning the insert batch size, throughput can be optimized. The
  maximum insert batch size is, however, limited by the maximum number
  of parameters allowed in a prepared statement (32767), and the
  number of columns in each row. For example, if a distributed
  hypertable has 10 columns, the max insert batch size is capped at
  3276 rows.
- [`COPY`][copy]: the access node switches each data node to "copy
  mode" and then routes each row to the correct data node in a
  stream. `COPY` typically delivers better performance than insert
  statements, although it doesn't support features like conflict
  handling (`ON CONFLICT` clause) that are used for
  [upserts][upserts].

## Querying a Distributed Hypertable [](select)

The query performance of a distribute hypertable depends heavily on
the ability of the planner to _push down_ computations to data
nodes. Without a way to push down computations, the access node will
fetch the raw data from each data node and then perform any necessary
computations locally. Therefore, queries that can be pushed down and
involve many data nodes are more likely to see better performance on a
distributed hypertable compared to a regular hypertable. In
particular, an aggregate computation that down-samples data is a good
candidate to push down since it both distributes the computational
workload across data nodes and reduces the amount of data that needs
to be transferred in the result set.

The planner can consider two methods to push down aggregates:

1. **FULL**: fully pushing down an aggregate offloads all the
   computation to data nodes and the access node only appends the
   individual results. To fully push down an aggregate computation,
   the `GROUP BY` clause must include *all* the partition keys
   (dimension columns) or *only* the first space partition key. An
   example is computing the `max` temperature for each location
   (`office_1`, `office_2`, etc.):

   ```sql
   SELECT location, max(temperature) FROM conditions
   GROUP BY location;
   ```

   Given that we use `location` as a space partition, each data node
   can compute the max on its own distinct subset of the data.

1. **PARTIAL**: if it is not possible to fully push down the
   aggregate, the planner can instead consider a partial aggregation
   on data nodes. In this case, the access node offloads most of the
   computation to data nodes, yielding a partial result that is sent
   back and finalized on the access node by combining all the partials
   from each data node. An example is computing the `max` temperature;
   each data node computes a local max and then the access node
   finalizes the result by computing the `max` over all the data
   nodes' `max` results:

   ```sql
   SELECT max(temperature) FROM conditions;
   ```

>:TIP: The settings variable
>[`enable_partitionwise_aggregate`][partitionwise_agg_guc] must be set
>to `on` on the access node to make sure that the planner considers
>pushing down computations to data nodes (the default is `off`).

Other types of computations that can be pushed down include sorting
operations, groupings, and joins. Joins on data nodes are currently
unsupported, however. To see how the a query is pushed down to a data
node, use `EXPLAIN VERBOSE` on the query and inspect the query plan
and the remote SQL statement sent to each data node.

### Limitations of Pushing Down Queries [](push-down-limitations)

The query planner might not always be able to push down queries,
however, or it can only push down parts of it:

- If the query involves a region that saw a change in the partitioning
  configuration (e.g., the number of space partitions increased
  because the system was elastically expanded to include additional
  data nodes, and the number of space partitions was correspondingly
  increased), then it might not be possible to fully push down
  aggregates. In our example distributed hypertable, the change in
  partitioning might lead to data for the same location existing in
  two chunks that are stored on different data nodes. The planner must
  therefore avoid *full* aggregation on data nodes whenever the query
  covers the repartitioning boundary. It is still possible to do
  *partial* aggregation on data nodes, however.
- If the query includes [non-immutable functions][volatility] and
  expressions, the planner cannot push down those parts of the query
  since they cannot be guaranteed to generate a consistent result
  across each data node. For instance, the [`random()`][random-func]
  function depends on the current seed and the state of the
  pseudo-random sequence. If the function was to be pushed down to
  each data node, it would not generate a valid pseudo-random sequence
  from the point of view of the access node that executes the
  query. Another example is the [`now()`][current_time] function to
  get the current transaction time. This function depends on the
  current time zone setting on each node.
- If the query includes a user-defined function (UDF) the planner
  assumes that the function does not exist on the data nodes and
  therefore will not push it down.

TimescaleDB employs several optimizations to increase the likelihood
of being able to push down queries and getting around some of the
above limitations. For instance, to get around the limitation of not
pushing down the `now()` function, the function is constified on the
access node so that the resulting timestamp is instead pushed down to
the data nodes.

### Settings for improving query performance

There are a number of configuration parameters that are important for
good query performance on a distributed hypertable. The following
settings apply to the access node.

* `enable_partitionwise_aggregate` should be set to `on`.
* `jit` should be set to `off` as JIT compilation currently doesn't
  work well with distributed hypertables.
* `timescaledb.remote_data_fetcher` defaults to `cursor`, which is the
  recommended setting for most use cases. However, the `cursor`
  fetcher doesn't support parallel query execution on data nodes,
  which might prevent faster query execution. It is possible to change
  this value to `rowbyrow` for better query performance, although this
  might not work with some queries that include sub-queries or common
  table expressions (CTEs).

## Data Node Management [](data-node-management)

When a distributed hypertable is created, it will use all the
available data nodes by default. It is possible, however, to use only
a subset of data nodes with a particular distributed hypertable. This
is useful to, e.g., tie a distributed hypertable to data nodes that
have a specific performance profile.

To view the data nodes used by a distributed hypertable, use the
following query:

```sql
SELECT hypertable_name, data_nodes
FROM timescaledb_information.hypertables
WHERE hypertable_name = 'conditions';

 hypertable_name |              data_nodes
-----------------+---------------------------------------
 conditions      | {data_node_1,data_node_2,data_node_3}
```

If additional data nodes are added to a distributed database, the data
nodes are not automatically associated with existing distributed
hypertables. Instead, you need to explicitly *attach* a data node
using [`attach_data_node`][attach_data_node]:

```sql
SELECT add_data_node('node3', host => 'dn3.example.com');
SELECT attach_data_node('node3', hypertable => 'conditions');
```

When attaching a data node, the partitioning configuration of the
distributed hypertable is also updated to account for the additional
data node (i.e., the number of space partitions is automatically increased to
match), unless the function parameter `repartition` is set to
`FALSE`. The updated partitioning configuration ensures that the data
node will be able to take on newly created chunks.

In a similar way, if you want to remove a data node from a distributed
hypertable, you can use [`detach_data_node`][detach_data_node].

```sql
SELECT detach_data_node('node1', hypertable => 'conditions');
```

Note that you cannot detach a data node that still holds data for the
hypertable. To be able to detach a data node, ensure that either (1)
all its data is deleted first, or (2) the data is replicated on other
data nodes (see the next section on native replication).

## Native Replication [](native-replication)

A distributed hypertable can be configured to write each chunk to
multiple data nodes in order to replicate data at the chunk
level. This *native replication* ensures that a distributed hypertable
is protected against data node failures and provides an alternative to
fully replicating each data node using streaming replication.

While data nodes require no additional setup to use native
replication, the access node continues to rely on streaming
replication, however. In this regard, the access node has similar
requirements for high availability as any regular PostgreSQL instance.

The number of data nodes a chunk is written to is determined by a
distributed hypertable's `replication_factor` (the default value is 1,
i.e., no native replication), and it can be set when calling
[`create_distributed_hypertable`][create_distributed_hypertable]:


```sql
SELECT create_distributed_hypertable('conditions', 'time', 'location',
	replication_factor => 3);
```
Alternatively, the function
[`set_replication_factor`][set_replication_factor] can be used to
enable native replication on an existing distributed hypertable.

>:WARNING: Native replication is currently under development and lacks
>functionality for a complete high-availability solution. Some
>functionality described in this section is not yet implemented or
>might have only a partial feature set. For instance, there is
>currently no implementation for (re-)replicating existing chunks in
>the background after a data node failure or increase in replication
>factor. We therefore recommend keeping the replication factor set at
>the default value of 1, and instead use streaming replication on each
>data node.

Once enabled, native replication happens as part of normal inserts, by
writing each row to multiple data nodes, and therefore requires no
additional mechanism for replicating newly inserted data. Existing
chunks, which are not replicated according to the configured
replication factor, needs to be re-replicated by a background job in
order to achieve the set replication factor.

To view the data nodes each chunk is replicated to, the following
query can be used:

```sql
SELECT chunk_name, data_nodes
FROM timescaledb_information.chunks
WHERE hypertable_name = 'conditions';

	   chunk_name       |              data_nodes
------------------------+---------------------------------------
 _dist_hyper_1_1_chunk  | {data_node_1,data_node_2,data_node_3}
 _dist_hyper_1_2_chunk  | {data_node_1,data_node_2,data_node_3}
 _dist_hyper_1_3_chunk  | {data_node_1,data_node_2,data_node_3}
```

When querying a distributed hypertable using native replication, the
query planner knows how to include only one replica of each chunk in
the query plan. The planner can employ different strategies to pick
the set of chunk replicas in order to, e.g., evenly spread the query
load across the data nodes.

Compared to streaming replication, native replication provides several
advantages:

- **Built in**: Native replication is built in and requires no
  additional configuration to use. TimescaleDB instances that serve as
  data nodes need not be configured with standby instances using
  streaming replication.
- **Elasticity**: As long all chunks on a data node have at least one
  replica on another data node, it is possible to delete that
  node. The chunks that are under-replicated after deleting the data
  node would be re-replicated to new data nodes as long as there is
  still capacity (i.e., there remains at least as many data nodes as
  the configured replication factor). This flexibility allows not only
  scaling up a multi-node cluster during peek hours, but also allows
  scaling it down when the extra capacity is no longer needed.
- **Efficient**: While streaming replication needs to replicate every
  mutation at the level of the write-ahead log (WAL), native
  replication only replicates distinct chunks. This makes features
  like, e.g., compression more efficient since only the original
  chunk's data need to be replicated. When a chunk is compressed or
  decompressed, no additional replication is needed since it is a
  local operation on a data node that can be applied to each
  replica. With streaming replication, however, compressing or
  decompressing a chunk would require writing all the data changes to
  one or more standby replica nodes.
- **Query optimizations**: Native replication enables a number of
  interesting optimizations and features that go beyond just providing
  high availability (HA). For instance, when a chunk exists on
  multiple data nodes, the planner could balance queries across
  different chunk replicas for better resource utilization. Similarly,
  if the planner detects a non-responsive or slow data node, it could
  ensure that only responsive nodes are included in the query plan.

There are also disadvantages with native replication. For instance, if
a data node holds data that is not part of a distributed hypertable,
this data won't be replicated. In such situations, streaming
replication is recommended.

## Transactions and Consistency Model [](consistency-model)

Transactions that involve distributed hypertables are atomic, just
like those involving regular hypertables. In other words, a
distributed transaction that involves multiple data nodes is
guaranteed to either succeed on all nodes or none of them. This
guarantee is provided by the [two-phase commit protocol][2pc], which
is used to implement distributed transactions in TimescaleDB.

The read consistency of a distributed hypertable is a bit different
from a regular hypertable, however. Since a distributed transaction is
essentially a set of individual transactions across multiple nodes,
each node might commit its local transaction at a slightly different
time (due to network transmission delays, etc.). As a consequence, the
access node will not be able to guarantee a fully consistent snapshot
of the data across all data nodes. For example, a distributed read
transaction might start when another concurrent write transaction is
in its commit phase and has committed on some data nodes but not
others. The read transaction can therefore use a snapshot on one node
that includes the other transaction's modifications, while the
snapshots used on other data nodes might not include them.

Stronger read consistency can be achieved by ensuring that a
distributed transaction is tied to consistent snapshots across all
data nodes. However, since this requires a lot of coordination and
bookkeeping, it is also slower and is therefore not implemented for
distributed hypertables.

[getting-started-multi-node]: /getting-started/setup-multi-node-basic
[using-hypertables]: /using-timescaledb/hypertables
[add_data_node]: /api#add_data_node
[architecture]: /introduction/architecture#single-node-vs-clustering
[upserts]: /using-timescaledb/writing-data#upsert
[2pc]: https://en.wikipedia.org/wiki/Two-phase_commit_protocol
[insert]: https://www.postgresql.org/docs/current/sql-insert.html
[copy]: https://www.postgresql.org/docs/current/sql-copy.html
[attach_data_node]: /api#attach_data_node
[create_distributed_hypertable]: /api#create_distributed_hypertable
[create_hypertable]: /api#create_hypertable
[creating-hypertables]: /getting-started/creating-hypertables
[volatility]: https://www.postgresql.org/docs/current/xfunc-volatility.html
[current_time]: https://www.postgresql.org/docs/current/functions-datetime.html#FUNCTIONS-DATETIME-CURRENT
[delete_data_node]: /api#delete_data_node
[detach_data_node]: /api#detach_data_node
[partitionwise_agg_guc]: https://www.postgresql.org/docs/current/runtime-config-query.html#RUNTIME-CONFIG-QUERY-ENABLE
[random-func]: https://www.postgresql.org/docs/current/functions-math.html#FUNCTIONS-MATH-RANDOM-TABLE
[set_replication_factor]:  /api#set_replication_factor
[distributed-hypertable-limitations]: /using-timescaledb/limitations#distributed-hypertable-limitations
[sharding]: https://en.wikipedia.org/wiki/Shard_(database_architecture)
[contact]: https://www.timescale.com/contact
[slack]: https://slack.timescale.com/
