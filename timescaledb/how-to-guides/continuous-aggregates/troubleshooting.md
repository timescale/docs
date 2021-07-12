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
Continuous aggregates are supported for most aggregate functions that can
be [parallelized by PostgreSQL][postgres-parallel-agg], including the standard
aggregates like `SUM` and `AVG`. However, aggregates using `ORDER BY` and
`DISTINCT` cannot be used with continuous aggregates since they are not possible
to parallelize by PostgreSQL. TimescaleDB does not currently support the
`FILTER` clause.

[postgres-parallel-agg]: https://www.postgresql.org/docs/current/parallel-plans.html#PARALLEL-AGGREGATION
