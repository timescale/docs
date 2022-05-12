# Distributed hypertables


Distributed hypertables are created on access nodes in
[multi-node][multi-node] clusters and allow spreading data across
multiple physical machines, while still acting like a single
continuous table across all time. In most cases, distributed
hypertables work the same way as regular hypertables, including
inserting, querying, and altering them. However, certain limitations
exist so it is important to study the documentation before deciding on
whether this is the right solution for you.

<highlight type="important">
You must set up your multi-node cluster before creating a distributed
hypertable. See [multi-node](/timescaledb/latest/how-to-guides/multinode-timescaledb/) for
instructions on setting up your multi-node cluster, and creating a distributed
hypertable.
</highlight>

For certain analytical workloads, a distributed hypertable can give
much better performance than a regular hypertable, but not always. The
key to good performance is the ability to distribute and push down
query processing to data nodes, which in turn depends on how data is
partitioned across the nodes. When query processing cannot be
distributed optimally, the access node might need to pull in a lot of
unprocessed data from data nodes and do the processing locally, which
will degrade performance.

<highlight type="important">
In some cases, your processing speeds could be slower in a multi-node
cluster, because distributed hypertables need to push operations down
to the various data nodes. In operations like UPDATEs and DELETEs,
some data needs to be pulled from data nodes to the access node first,
before sending further instructions down to the data nodes. Make sure
you understand multi-node architecture before you begin, and plan your
database according to your specific environment.
</highlight>

You can use distributed hypertables in the same database as regular
hypertables and other objects, which are not distributed. However,
some interactions between distributed hypertables and non-distributed
objects might not work as expected. For example, when you set
permissions on a distributed hypertable, they work only if the roles
are identical on all the data nodes. Additionally, if you `JOIN` a
local table and a distributed hypertable, you need to fetch the raw
data from data nodes and perform the `JOIN` locally.

## Inserting data into a distributed hypertable
Inserting data into a distributed hypertable works in much the same way as
inserting data into a regular hypertable, except that distributed hypertables
come with a higher network load, as they push inserted data down to the data
nodes. Try to amortize your `INSERT` statements over many rows of data, rather
than have each insertion as its own transaction. This can help you avoid
additional costs caused by coordination across data nodes (for example, a
two-phase commit protocol).

A single `INSERT` transaction to the access node that contains many rows of data
is processed by the access node. The access node splits the input set into
several smaller batches of rows, with each batch including the rows that belong
to a specific data node based on the distributed hypertable's partitioning. The
access node then writes each batch of rows to the correct data node.

### Using the INSERT statement on distributed hypertables
When you use the [`INSERT`][insert] statement on a distributed
hypertable, the access node tries to convert that into a more
efficient [`COPY`][copy] between the access node and the data nodes.
However, this optimized plan won't work if the `INSERT`
statement has a `RETURNING` clause, and the distributed hypertable has
triggers that could alter the returned data. In that case, the planner
falls back to a less efficient plan that uses a multi-row prepared
statement on each data node and then splits the original insert
statement across these sub-statements. You can run an
[`EXPLAIN`][explain] on the `INSERT` to view the plan that the access
node chooses.

For the non-optimized plan, the access node can buffer up to
`timescaledb.max_insert_batch_size` number of rows (default 1000) per
data node before a prepared statement's limit is reached and gets
flushed to the data node. For example, if there are 10,000 rows in the
original `INSERT` statement and three data nodes with the default
insert batch size, the `INSERT` requires around three full
batches per data node and a partial final batch.

You can optimize the throughput by tuning the insert batch size. The maximum
insert batch size is limited by the maximum number of parameters allowed in a
prepared statement, currently 32,767, and the number of columns in each row. For
example, if a distributed hypertable has 10 columns, the maximum insert batch
size is capped at 3,276 rows.

### Using the COPY statement on distributed hypertables
When you use the [`COPY`][copy] statement on a distributed hypertable, the access
node switches each data node to copy mode and then routes each row to the
correct data node in a stream. `COPY` can deliver better performance than
`INSERT`, although it doesn't support features like conflict handling (`ON
CONFLICT` clause) that are used for [upserts][upserts].

## Using triggers on distributed hypertables
Triggers on distributed hypertables work in a similar way to triggers on
regular hypertables, including having the same limitations. However,
due to data and tables being distributed across many data nodes, there
are some notable differences compared to regular hypertables:

* Row-level triggers fire on the data node where a row is inserted
* Statement-level triggers fire once on each affected node,
  including the access node
* A replication factor greater than 1 further increases the number of
  nodes that a trigger fires on. This is because each replica node fires the
  trigger.

### Creating triggers
A trigger is created on distributed hypertables with [`CREATE
TRIGGER`][create-trigger] as normal. The trigger is automatically
created on each data node, including the function that the trigger
executes. However, any other functions or objects referenced in the
trigger function need to be present on all nodes prior to creating the
trigger. To create a referenced function or other object on all data
nodes, use the [`distributed_exec`][dist_exec] procedure. Once all
dependencies are in place, a trigger function can be created on the
access node:
```sql
CREATE OR REPLACE FUNCTION my_trigger_func()
	RETURNS TRIGGER LANGUAGE PLPGSQL AS
$BODY$
BEGIN
	RAISE NOTICE 'trigger fired';
	RETURN NEW;
END
$BODY$;
```
followed by the trigger itself:
```sql
CREATE TRIGGER my_trigger
	AFTER INSERT ON hyper
	FOR EACH ROW
	EXECUTE FUNCTION my_trigger_func();
```

### Row-level triggers
Row-level triggers are executed on the data node where the data is
stored, because `BEFORE` and `AFTER` row triggers need access to the
stored data. The chunks on the access node do not contain any data and
therefore also have no triggers.

### Statement-level triggers
Statement-level triggers execute once on each node affected by
the statement. This includes the access node and any affected data
nodes. For instance, if a distributed hypertable includes three data
nodes, an `INSERT` of two rows of data executes a statement-level
insert trigger on the access node and at most two of the data nodes
(if the two rows go to different data nodes).

To avoid processing the trigger multiple times, we recommend that
you set the trigger function to check which node it is executing on, to ensure
that the trigger action only affects the desired node. For example,
to have a statement-level trigger do something different on the access
node compared to a data node, you can define a statement-level trigger
function like this:
```sql
CREATE OR REPLACE FUNCTION my_trigger_func()
	RETURNS TRIGGER LANGUAGE PLPGSQL AS
$BODY$
DECLARE
	is_access_node boolean;
BEGIN
	SELECT is_distributed INTO is_access_node
	FROM timescaledb_information.hypertables
	WHERE hypertable_name = TG_TABLE_NAME
	AND hypertable_schema = TG_TABLE_SCHEMA;

	IF is_access_node THEN
	   RAISE NOTICE 'trigger fired on the access node';
	ELSE
	   RAISE NOTICE 'trigger fired on a data node';
	END IF;

	RETURN NEW;
END
$BODY$;
```

## Querying a distributed hypertable
The query performance of a distributed hypertable depends heavily on the ability
of the access node to push computations down to the data nodes. Without a way to
push down computations, the access node needs to fetch the raw data from each
data node and then perform any necessary computations locally. Therefore,
queries that can be pushed down and involve many data nodes are more likely to
see better performance. In particular, an aggregate computation that
down-samples data is a good candidate to push down since it distributes the
computational workload across data nodes, and reduces the amount of data that
needs to be transferred in the result set.

<highlight type="important">
To make sure that the access node can attempt to push down transactions to the
data nodes, check that the settings variable
[`enable_partitionwise_aggregate`](https://www.postgresql.org/docs/current/runtime-config-query.html#RUNTIME-CONFIG-QUERY-ENABLE)
is set to `on` on the access node. This setting is `off` by default.
</highlight>

There are two methods that the access node can use to push down aggregates:
full, and partial.

In the full push down method, the aggregate offloads all the computation to data
nodes and the access node only appends the individual results. To fully push
down an aggregate computation, the `GROUP BY` clause must include either all the
partition keys (dimension columns), or only the first space partition key. For
example, to calculate the `max` temperature for each location:
```sql
SELECT location, max(temperature) FROM conditions
GROUP BY location;
```

Because `location` is used as a space partition in this example, each data node
can compute the max on its own distinct subset of the data.

You can use the partial push down method if it is not possible to fully push
down the aggregate. In this method, the access node offloads most of the
computation to data nodes, yielding a partial result that is sent back and
finalized on the access node by combining all the partials from each data node.
For example, to compute the `max` temperature, each data node computes a local
max and then the access node finalizes the result by computing the `max` over
all the data nodes' `max` results:
```sql
SELECT max(temperature) FROM conditions;
```

Other types of computations that can be pushed down include sorting operations,
groupings, and joins. Joins on data nodes are currently unsupported, however. To
see how a query is pushed down to a data node, use `EXPLAIN VERBOSE` on the
query and inspect the query plan and the remote SQL statement sent to each data
node.

If you intend to use continuous aggregates in your multi-node environment, check
the additional considerations in the [continuous aggregates][caggs] section.

### Limitations of pushing down queries
The query planner might not always be able to push down queries, or can only push down parts of it. There are several reasons why this might happen.

If the query involves a region that saw a change in the partitioning
configuration then it might not be possible to fully push down aggregates. For
example, if the number of space partitions increased because the system was
elastically expanded to include additional data nodes, and the number of space
partitions was correspondingly increased. The change in partitioning could lead
to the same data existing in two chunks that are stored on different data
nodes. The access node must therefore avoid full aggregation on data nodes if
the query covers the repartitioning boundary. It is still possible to do
partial aggregation on data nodes in this case.

If the query includes [non-immutable functions][volatility] and expressions,
the access node cannot push down those parts of the query. This is because they
can't be guaranteed to generate a consistent result across each data node. For
example, the [`random()`][random-func] function depends on the current seed,
and the state of the pseudo-random sequence. If the function is pushed down to
each data node, it would not generate a valid pseudo-random sequence from the
point of view of the access node that runs the query. Another example is
the [`now()`][current_time] function to get the current transaction time. This
function depends on the current timezone setting on each node.

If the query includes a user-defined function (UDF) the access node assumes
that the function does not exist on the data nodes and therefore does not push
it down.

TimescaleDB employs several optimizations to increase the likelihood of being
able to push down queries and getting around some of these limitations. For
example, to get around the limitation of not pushing down the `now()` function,
the function is constified on the access node so that the resulting timestamp is
instead pushed down to the data nodes.

## Alter and set privileges on a distributed hypertable
When altering a distributed hypertable, or granting privileges on it,
the commands are applied across all its data nodes. See the section on
[multi-node administration][multi-node-admin] for more information.

## Replicating distributed hypertables
A distributed hypertable can be configured to write each chunk to multiple
data nodes in order to replicate data at the chunk level. This native
replication ensures that a distributed hypertable is protected against data
node failures and provides an alternative to fully replicating each data node
using streaming replication in order to provide high availability.

For more information about replication, high availability, and handling node
failures in distributed hypertables, see the
[multi-node HA section][multi-node-ha].

## Partitioning distributed hypertables
Like regular hypertables, distributed hypertables need to be partitioned along a
`time` dimension, such as a `timestamptz` column. However, for best performance
with most distributed workloads, we recommend multi-dimensional partitioning
with an additional `space` dimension. This allows you to consistently partition
the data over the data nodes, similar to traditional sharding.

For more information about partitioning distributed hypertables, see the
[About multi-node section][about-multinode].

## Repartitioning distributed hypertables
You can expand distributed hypertables by adding additional data nodes. If you 
now have fewer space partitions than data nodes, you need to increase the
number of space partitions to make use of your new nodes. The new partitioning
configuration only affects new chunks. In this diagram, an extra data node 
was added during the third time interval. The fourth time interval now includes 
four chunks, while the previous time intervals still include three:

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/repartitioning.png" alt="Diagram showing repartitioning on a distributed hypertable"/>

This can affect queries that span the two different partitioning configurations.
In the diagram, the highlighted area, marked as `chunks queried`, represents
such a query. In the older configuration, the query requires data from four
chunks, but in the newer configuration, it requires data from two. For
example, the query might include data for a particular hostname that now exists
on more than one data node. Because the data spans data nodes, it cannot be
fully aggregated on the data node. Some operations need to be performed on the
access node instead.

The TimescaleDB query planner dynamically detects such overlapping chunks and
reverts to the appropriate partial aggregation plan. This means that you can add
data nodes and repartition your data to achieve elasticity without worrying
about query results. In some cases, your query could be slightly less
performant, but this is rare and the affected chunks usually move quickly out of your
retention window. 

## Foreign key handling in distributed hypertables
Tables referenced by foreign key constraints in a distributed
hypertable must be present on the access node and all data
nodes. This applies also to referenced values.

You can use `distributed_exec` to create a table on all data
nodes and insert data into the table. Ensure that the table
exists on the access node first, and then update all the data
nodes with the correct data. You can then use a foreign key
in the distributed hypertable to that table.


[multi-node]: /how-to-guides/multinode-timescaledb/
[multi-node-ha]: /how-to-guides/multinode-timescaledb/multinode-ha/
[volatility]: https://www.postgresql.org/docs/current/xfunc-volatility.html
[current_time]: https://www.postgresql.org/docs/current/functions-datetime.html#FUNCTIONS-DATETIME-CURRENT
[random-func]: https://www.postgresql.org/docs/current/functions-math.html#FUNCTIONS-MATH-RANDOM-TABLE
[upserts]: /how-to-guides/write-data/upsert/
[insert]: https://www.postgresql.org/docs/current/sql-insert.html
[copy]: https://www.postgresql.org/docs/current/sql-copy.html
[create-trigger]: https://www.postgresql.org/docs/current/sql-createtrigger.html
[about-multinode]: /how-to-guides/multinode-timescaledb/about-multinode/
[explain]: https://www.postgresql.org/docs/current/sql-explain.html
[dist_exec]:  /api/:currentVersion:/distributed-hypertables/distributed_exec
[caggs]: timescaledb/latest/how-to-guides/continuous-aggregates/about-continuous-aggregates#using-continuous-aggregates-in-multi-node-environment/
[multi-node-admin]: /how-to-guides/multinode-timescaledb/multinode-administration/
