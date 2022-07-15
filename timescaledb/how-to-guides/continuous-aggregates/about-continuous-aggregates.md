---
title: About continuous aggregates
excerpt: Learn how continuous aggregates speed up your TimescaleDB queries
keywords: [continuous aggregates]
---

import CaggsFunctionSupport from 'versionContent/_partials/_caggs-function-support.mdx';

# About continuous aggregates
Time-series data usually grows very quickly. Large data volumes can become slow
when aggregating the data into useful summaries. To make aggregating data
faster, TimescaleDB uses continuous aggregates. For example, if you have a table
of temperature readings over time in a number of locations, and you want to find
the average temperature in each location, you can calculate the average as a
one-off, with a query like this:

```sql
SELECT time_bucket('1 day', time) as day,
       location,
       avg(temperature)
FROM temperatures
GROUP BY day, location;
```

If you want to run this query more than once, the database needs to scan the
entire table and recalculate the average every time. In most cases, though, the
data in the table has not changed significantly, so there is no need to scan the
entire dataset. Continuous aggregates automatically, and in the background,
maintain the results from the query, and allow you to retrieve them in the same
way as any other data.

Using the same temperature example, you can create the same query as a
continuous aggregate view like this:

```sql
CREATE MATERIALIZED VIEW daily_average WITH (timescaledb.continuous)
    AS SELECT time_bucket('1 day', time) as Day,
              location,
              avg(temperature)
       FROM temperatures
       GROUP BY day, location;
```

Then, you can query the view whenever you need to, like this:

```sql
SELECT * FROM daily_average;
```

Continuous aggregate views are refreshed automatically in the background as new
data is added, or old data is modified. TimescaleDB tracks these changes to the
dataset, and automatically updates the view in the background. This does not add
any maintenance burden to your database, and does not slow down `INSERT`
operations.

By default, querying continuous aggregates provides you with real-time data.
Pre-aggregated data from the materialized view is combined with recent data that
hasn't been aggregated yet. This gives you up-to-date results on every query. If
you prefer not to see recent data, you can turn this setting off. For more
information, see the section on [real-time aggregates][real-time-aggs]. 

## Function support
In TimescaleDB 2.7 and above, continuous aggregates support all PostgreSQL
aggregate functions. This includes both parallelizable aggregates, such as `SUM`
and `AVG`, and non-parallelizable aggregates, such as `RANK`.

In older versions of TimescaleDB, continuous aggregates only support
[aggregate functions that can be parallelized by PostgreSQL][postgres-parallel-agg].
They also don't support `FILTER` and `ORDER BY` clauses, and the `DISTINCT` keyword. You can
work around this by aggregating the other parts of your query in the continuous
aggregate, then
[using the window function to query the aggregate][cagg-window-functions].

<CaggsFunctionSupport />

If you want the old behavior in TimescaleDB 2.7 and above, set the parameter
`timescaledb.finalized` to `false` when creating your continuous aggregate.

## Components of a continuous aggregate
Continuous aggregates consist of:
*   Materialization hypertable to store the aggregated data in
*   Materialization engine to aggregate data from the raw, underlying, table to
    the materialization hypertable
*   Invalidation engine to determine when data needs to be re-materialized, due
    to changes in the data
*   Query engine to access the aggregated data

### Materialization hypertable
Continuous aggregates take raw data from the original hypertable, aggregate it,
and store the intermediate state in a materialization hypertable. When you query
the continuous aggregate view, the state is returned to you as needed.

Using the same temperature example, the materialization table looks like this:

|day|location|chunk|avg temperature partial|
|-|-|-|-|
|2021/01/01|New York|1|{3, 219}|
|2021/01/01|Stockholm|1|{4, 280}|
|2021/01/02|New York|2||
|2021/01/02|Stockholm|2|{5, 345}|

The materialization table is stored as a TimescaleDB hypertable, to take
advantage of the scaling and query optimizations that hypertables offer.
Materialization tables contain a column for each group-by clause in the query,
a `chunk` column identifying which chunk in the raw data this entry came from,
and a `partial aggregate` column for each aggregate in the query.

The partial column is used internally to calculate the output. In this example,
because the query looks for an average, the partial column contains the number
of rows seen, and the sum of all their values. The most important thing to know
about partials is that they can be combined to create new partials spanning all
of the old partials' rows. This is important if you combine groups that span
multiple chunks.

For more information, see [materialization hypertables][cagg-mat-hypertables].

### Materialization engine
When you query the continuous aggregate view, the materialization engine
combines the aggregate partials into a single partial for each time range, and
calculates the value that is returned. For example, to compute an average, each
partial sum is added up to a total sum, and each partial count is added up to a
total count, then the average is computed as the total sum divided by the total
count.

### Invalidation Engine
Any change to the data in a hypertable could potentially invalidate some
materialized rows. The invalidation engine checks to ensure that the system does
not become swamped with invalidations.

Fortunately, time-series data means that nearly all INSERTs and UPDATEs have a
recent timestamp, so the invalidation engine does not materialize all the data,
but to a set point in time called the materialization threshold. This threshold
is set so that the vast majority of INSERTs contain more recent timestamps.
These data points have never been materialized by the continuous aggregate, so
there is no additional work needed to notify the continuous aggregate that they
have been added. When the materializer next runs, it is responsible for
determining how much new data can be materialized without invalidating the
continuous aggregate. It then materializes the more recent data and moves the
materialization threshold forward in time. This ensures that the threshold lags
behind the point-in-time where data changes are common, and that most INSERTs do
not require any extra writes.

When data older than the invalidation threshold is changed, the maximum and
minimum timestamps of the changed rows is logged, and the values are used to
determine which rows in the aggregation table need to be recalculated. This
logging does cause some write load, but because the threshold lags behind the
area of data that is currently changing, the writes are small and rare.

### Materialization engine
The materialization engine performs two transactions. The first transaction
blocks all INSERTs, UPDATEs, and DELETEs, determines the time range to
materialize, and updates the invalidation threshold. The second transaction
unblocks other transactions, and materializes the aggregates. The first
transaction is very quick, and most of the work happens during the second
transaction, to ensure that the work does not interfere with other operations.

## Using continuous aggregates in a multi-node environment
If you are using Timescale in a multi-node environment, there are some
additional considerations for continuous aggregates.

When you create a continuous aggregate within a multi-node environment, the
continuous aggregate should be created on the access node. While it is possible
to create a continuous aggregate on data nodes, it interferes with the
continuous aggregates on the access node and can cause problems.

When you refresh a continuous aggregate on an access node, it computes a single
window to update the time buckets. This could slow down your query if the actual
number of rows that were updated is small, but widely spread apart. This is
aggravated if the network latency is high if, for example, you have remote data
nodes.

Invalidation logs are on kept on the data nodes, which is designed to limit the
amount of data that needs to be transferred. However, some statements send
invalidations directly to the log, for example, when dropping a chunk or
truncate a hypertable. This action could slow down performance, in comparison to
a local update. Additionally, if you have infrequent refreshes but a lot of changes to the hypertable, the
invalidation logs could get very large, which could cause performance issues.
Make sure you are maintaining your invalidation log size to avoid this, for example, by refreshing the continuous aggregate frequently.

For more information about setting up multi-node, see the
[multi-node section][multi-node]

[cagg-mat-hypertables]: /timescaledb/:currentVersion:/how-to-guides/continuous-aggregates/materialized-hypertables
[cagg-window-functions]: /timescaledb/:currentVersion:/how-to-guides/continuous-aggregates/create-a-continuous-aggregate/#use-continuous-aggregates-with-window-functions
[multi-node]: /timescaledb/:currentVersion:/how-to-guides/multinode-timescaledb/
[postgres-parallel-agg]: https://www.postgresql.org/docs/current/parallel-plans.html#PARALLEL-AGGREGATION
[real-time-aggs]: /timescaledb/:currentVersion:/how-to-guides/continuous-aggregates/real-time-aggregates/
