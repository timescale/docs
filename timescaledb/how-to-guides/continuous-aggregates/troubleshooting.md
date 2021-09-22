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
