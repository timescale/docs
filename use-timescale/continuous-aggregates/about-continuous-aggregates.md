---
title: About continuous aggregates
excerpt: Learn how continuous aggregates can speed up your Timescale queries
products: [cloud, mst, self_hosted]
keywords: [continuous aggregates]
---

import CaggsFunctionSupport from "versionContent/_partials/_caggs-function-support.mdx";
import CaggsIntro from "versionContent/_partials/_caggs-intro.mdx";
import CaggsTypes from "versionContent/_partials/_caggs-types.mdx";

# About continuous aggregates

<CaggsIntro />

## Types of aggregation

<CaggsTypes />

## Continuous aggregates on continuous aggregates

You can create a continuous aggregate on top of another continuous aggregate.
This allows you to summarize data at different granularities. For example, you
might have a raw hypertable that contains second-by-second data. Create a
continuous aggregate on the hypertable to calculate hourly data. To calculate
daily data, create a continuous aggregate on top of your hourly continuous
aggregate.

For more information, see the documentation about
[continuous aggregates on continuous aggregates][caggs-on-caggs].

## Continuous aggregates with a `JOIN` clause

In TimescaleDB 2.10.0 and later, continuous aggregates support JOINS, as long as
they meet these conditions:

*   Joins must be between one hypertable and one standard PostgreSQL table. The
    order of tables in the JOIN clause does not matter.
*   Only changes to the hypertable are tracked, and are updated in the
    continuous aggregate when it is refreshed. Changes to the standard
    PostgreSQL table are not tracked.
*   You must use an `INNER JOIN`, no other join type is supported.
*   The `JOIN` conditions must be equality conditions, and there can only be ONE
    `JOIN` condition. Further conditions can be added in the `WHERE` clause as
    long as the `JOIN` condition is given in an `ON/USING` clause.
*   You should use an `ON` or `USING` clauses to specify the `JOIN` condition
    because, if `JOIN` conditions are specified in the `WHERE` clause, no
    further conditions are allowed.
*   The `USING` clause is only supported for PostgreSQL 13 and later.
*   Joins on the materialized hypertable of a continuous aggregate are not supported.
*   Hierarchical continuous aggregates can be created on top of a continuous
    aggregate with a `JOIN` clause, but cannot themselves have a `JOIN` clauses.

This section includes some examples of `JOIN` conditions that work with
continuous aggregates. For these to work, either `table_1` or `table_2` must be
a hypertable. It does not matter which is the hypertable and which is a standard
PostgreSQL table.

`INNER JOIN` on a single equality condition, using the `ON` clause:

```sql
CREATE MATERIALIZED VIEW my_view WITH (timescaledb.continuous) AS
SELECT ...
FROM table_1 t1
JOIN table_2 t2 ON t1.t2_id = t2.id
GROUP BY ...
```

`INNER JOIN` on a single equality condition, using the `ON` clause, with a further
condition added in the `WHERE` clause:

```sql
CREATE MATERIALIZED VIEW my_view WITH (timescaledb.continuous) AS
SELECT ...
FROM table_1 t1
JOIN table_2 t2 ON t1.t2_id = t2.id
WHERE t1.id IN (1, 2, 3, 4)
GROUP BY ...
```

`INNER JOIN` on a single equality condition specified in `WHERE` clause, this is
allowed but not recommended:

```sql
CREATE MATERIALIZED VIEW my_view WITH (timescaledb.continuous) AS
SELECT ...
FROM table_1 t1, table_2 t2
WHERE t1.t2_id = t2.id
GROUP BY ...
```

These are examples of `JOIN` conditions won't work with continuous aggregates:
An `INNER JOIN` on multiple equality conditions is not allowed.

```sql
CREATE MATERIALIZED VIEW my_view WITH (timescaledb.continuous) AS
SELECT ...
FROM table_1 t1
JOIN table_2 t2 ON t1.t2_id = t2.id AND t1.t2_id_2 = t2.id
GROUP BY ...
```

A `JOIN` with a single equality condition specified in `WHERE` clause cannot be
combined with further conditions in the `WHERE` clause.

```sql
CREATE MATERIALIZED VIEW my_view WITH (timescaledb.continuous) AS
SELECT ...
FROM table_1 t1, table_2 t2
WHERE t1.t2_id = t2.id
AND t1.id IN (1, 2, 3, 4)
GROUP BY ...
```

## Function support

In TimescaleDB 2.7 and later, continuous aggregates support all PostgreSQL
aggregate functions. This includes both parallelizable aggregates, such as `SUM`
and `AVG`, and non-parallelizable aggregates, such as `RANK`.

In TimescaleDB&nbsp;2.10.0 and later, the `FROM` clause supports `JOINS`, with
some restrictions. For more information, see the [`JOIN` support section][caggs-joins].

In older versions of Timescale, continuous aggregates only support
[aggregate functions that can be parallelized by PostgreSQL][postgres-parallel-agg].
You can work around this by aggregating the other parts of your query in the
continuous aggregate, then
[using the window function to query the aggregate][cagg-window-functions].

<CaggsFunctionSupport />

If you want the old behavior in later versions of TimescaleDB, set the
`timescaledb.finalized` parameter to `false` when you create your continuous
aggregate.

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

The materialization table is stored as a Timescale hypertable, to take
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

The materialization engine performs two transactions. The first transaction
blocks all INSERTs, UPDATEs, and DELETEs, determines the time range to
materialize, and updates the invalidation threshold. The second transaction
unblocks other transactions, and materializes the aggregates. The first
transaction is very quick, and most of the work happens during the second
transaction, to ensure that the work does not interfere with other operations.

When you query the continuous aggregate view, the materialization engine
combines the aggregate partials into a single partial for each time range, and
calculates the value that is returned. For example, to compute an average, each
partial sum is added up to a total sum, and each partial count is added up to a
total count, then the average is computed as the total sum divided by the total
count.

### Invalidation engine

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

[cagg-mat-hypertables]: /use-timescale/:currentVersion:/continuous-aggregates/materialized-hypertables
[cagg-window-functions]: /use-timescale/:currentVersion:/continuous-aggregates/create-a-continuous-aggregate/#use-continuous-aggregates-with-window-functions
[caggs-on-caggs]: /use-timescale/:currentVersion:/continuous-aggregates/hierarchical-continuous-aggregates/
[postgres-parallel-agg]: https://www.postgresql.org/docs/current/parallel-plans.html#PARALLEL-AGGREGATION
[caggs-joins]: /use-timescale/:currentVersion:/continuous-aggregates/about-continuous-aggregates/#continuous-aggregates-with-a-join-clause
