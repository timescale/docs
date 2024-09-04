{/* vale off */}
# Troubleshooting widgetsg
This section contains some ideas for troubleshooting common problems experienced
with widgets.

{/*
* Keep this section in alphabetical order
* Use this format for writing troubleshooting sections:
 - Cause: What causes the problem?
 - Consequence: What does the user see when they hit this problem?
 - Fix/Workaround: What can the user do to fix or work around the problem?
   Provide a "Resolving" Procedure if required.
 - Result: When the user applies the fix, what is the result when the same action
   is applied?
* Copy this comment at the top of every troubleshooting page
*/}

For example:

```txt
## Retention policies
If you have hypertables that use a different retention policy to your continuous
aggregates, the retention policies are applied separately.  The retention policy
on a hypertable determines how long the raw data is kept for. The retention
policy on a continuous aggregate determines how long the continuous aggregate is
kept for. For  example, if you have a hypertable with a retention policy of a
week and a continuous aggregate with a retention policy of a month, the raw
data is kept for a week, and the continuous aggregate is kept for a month.
```

Or:

```txt
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
continuous aggregates since they cannot be parallelized with
PostgreSQL. TimescaleDB does not support `FILTER` or `JOIN` clauses,
or window functions in continuous aggregates.
```
