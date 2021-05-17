# Querying a distributed hypertable

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

<highlight type="tip">
The settings variable
[`enable_partitionwise_aggregate`][partitionwise_agg_guc] must be set
to `on` on the access node to make sure that the planner considers
pushing down computations to data nodes (the default is `off`).
</highlight>

Other types of computations that can be pushed down include sorting
operations, groupings, and joins. Joins on data nodes are currently
unsupported, however. To see how the a query is pushed down to a data
node, use `EXPLAIN VERBOSE` on the query and inspect the query plan
and the remote SQL statement sent to each data node.

## Limitations of pushing down queries

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


[volatility]: https://www.postgresql.org/docs/current/xfunc-volatility.html
[current_time]: https://www.postgresql.org/docs/current/functions-datetime.html#FUNCTIONS-DATETIME-CURRENT
[partitionwise_agg_guc]: https://www.postgresql.org/docs/current/runtime-config-query.html#RUNTIME-CONFIG-QUERY-ENABLE
[random-func]: https://www.postgresql.org/docs/current/functions-math.html#FUNCTIONS-MATH-RANDOM-TABLE
