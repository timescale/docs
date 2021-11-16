# Troubleshooting continuous aggregates
This section contains some ideas for troubleshooting common problems experienced
with continuous aggregates.

<!---
* Keep this section in alphabetical order
* Use this format for writing troubleshooting sections:
 - Cause: What causes the problem?
 - Consequence: What does the user see when they hit this problem?
 - Fix/Workaround: What can the user do to fix or work around the problem? Provide a "Resolving" Procedure if required.
 - Result: When the user applies the fix, what is the result when the same action is applied?
* Copy this comment at the top of every troubleshooting page
-->

## Insert irregular data into a continuous aggregate
Materialized views are generally used with ordered data. If you insert historic
data, or data that is not related to the current time, you need to refresh
policies and reevaluate the values that are dragging from past to present.

You can set up an after insert rule for your hypertable or upsert to trigger
something that can validate what needs to be refreshed as the data is merged.

Let's say you inserted ordered timeframes named A, B, D, and F, and you already
have a continuous aggregation looking for this data. If you now insert E, you
need to refresh E and F.  However, if you insert C we'll need to refresh C, D, E
and F.

For example:
1.  A, B, D, and F are already materialized in a view with all data.
1.  To insert C, split the data into `AB` and `DEF` subsets.
1.  `AB` are consistent and the materialized data is too; you only need to
    reuse it.
1.  Insert C, `DEF`, and refresh policies after C.

This can use a lot of resources to process, especially if you have any important
data in the past that also needs to be brought to the present.

Consider an example where you have 300 columns on a single hypertable and use,
for example, five of them in a continuous aggregation.  In this case, it could
be hard to refresh and would make more sense to isolate these columns in another
hypertable. Alternatively, you might create one hypertable per metric and
refresh them independently.

## Queries that work on regular tables, fail on continuous aggregates
Continuous aggregates don't work on all queries. If you are using a function
that continuous aggregates do not support, you see an error like this:
```sql
ERROR:  invalid continuous aggregate view
SQL state: 0A000
```
Continuous aggregates are supported for most aggregate functions that can be
[parallelized by PostgreSQL][postgres-parallel-agg], including the standard
aggregates like `SUM` and `AVG`. You can also use more complex expressions on
top of the aggregate functions, for example `max(temperature)-min(temperature)`.

However, aggregates using `ORDER BY` and `DISTINCT` cannot be used with
continuous aggregates since they are not possible to parallelize with
PostgreSQL. TimescaleDB does not currently support `FILTER` or `JOIN` clauses,
or window functions in continuous aggregates.

[postgres-parallel-agg]: https://www.postgresql.org/docs/current/parallel-plans.html#PARALLEL-AGGREGATION

## Queries using locf() do not return NULL values
When you have a query that uses a last observation carried forward (locf)
function, the query carries forward NULL values by default. If you want the
function to ignore NULL values instead, you can set `treat_null_as_missing=TRUE`
as the second parameter in the query. For example:
```sql
dev=# select * FROM (select time_bucket_gapfill(4, time,-5,13), locf(avg(v)::int,treat_null_as_missing:=true) FROM (VALUES (0,0),(8,NULL)) v(time, v) WHERE time BETWEEN 0 AND 10 GROUP BY 1) i ORDER BY 1 DESC;
 time_bucket_gapfill | locf
---------------------+------
                  12 |    0
                   8 |    0
                   4 |    0
                   0 |    0
                  -4 |
                  -8 |
(6 rows)
```

## Compression policies


If I have a hypertable with a retention policy of a week, but have the continuous
aggregations retention policy being a month. Is that going to be OK?

Yes. It means the raw data will be around for a week while continuous
aggregates will be around for a month.
