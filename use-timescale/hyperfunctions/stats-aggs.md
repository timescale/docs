---
title: Statistical aggregation
excerpt: Aggregate data to perform common statistical calculations in continuous aggregates and window functions
products: [cloud, mst, self_hosted]
keywords: [hyperfunctions, Toolkit, statistics]
---

# Statistical aggregation

To make common statistical aggregates easier to work with in window functions
and continuous aggregates, Timescale provides common statistical aggregates in
a slightly different form than otherwise available in PostgreSQL.

This example calculates the average, standard deviation, and kurtosis of
a value in the `measurements` table:

```sql
SELECT 
    time_bucket('10 min'::interval, ts), 
    average(stats_agg(val)), 
    stddev(stats_agg(val), 'pop'),
    kurtosis(stats_agg(val), 'pop')
FROM measurements
GROUP BY 1;
```

This uses a two-step aggregation process. The first step is an aggregation step (`stats_agg(val)`),
which creates a machine-readable form of the aggregate. The second step is an accessor.
The available accessors are `average`, `stddev`, and `kurtosis`. The accessors
run final calculations and output the calculated value in a human-readable way.
This makes it easier to construct your queries, because it distinguishes the
parameters, and makes it clear which aggregates are being re-aggregated or
rolled up. Additionally, because this query syntax is used in all Timescale
Toolkit queries, when you are used to it, you can use it to construct more and
more complicated queries.

A more complex example uses window functions to calculate tumbling window
statistical aggregates. The statistical aggregate is first calculated over each
minute in the subquery and then the `rolling` aggregate is used to re-aggregate
it over each 15 minute period preceding. The accessors remain the same as the
previous example:

```sql
SELECT 
    bucket, 
    average(rolling(stats_agg) OVER fifteen_min), 
    stddev(rolling(stats_agg) OVER fifteen_min, 'pop'),
    kurtosis(rolling(stats_agg) OVER fifteen_min, 'pop')
FROM (SELECT 
        time_bucket('1 min'::interval, ts) AS bucket, 
        stats_agg(val)
     FROM measurements
     GROUP BY 1) AS stats
WINDOW fifteen_min as (ORDER BY bucket ASC RANGE '15 minutes' PRECEDING);
```

For some more technical details and usage examples of the two-step aggregation
method, see the [blog post on aggregates][blog-aggregates] or the
[developer documentation][gh-two-step-agg].

# 1D and 2D linear regression with statistical aggregates

The `stats_agg` aggregate is available in two forms, a one-dimensional
aggregate shown earlier in this section, and a two-dimensional aggregate.
The two-dimensional aggregate takes in two variables `(Y, X)`, which are
dependent and independent variables respectively. The two-dimensional
aggregate performs all the same calculations on each individual variable
as performing separate one-dimensional aggregates would, and
additionally performs linear regression on the two variables. Accessors
for one-dimensional values append a `_y` or `_x` to the name. For
example:

```sql
SELECT 
    average_y(stats_agg(val2, val1)), -- equivalent to average(stats_agg(val2))
    stddev_x(stats_agg(val2, val1)), -- equivalent to stddev(stats_agg(val1))
    slope(stats_agg(val2, val1)) -- the slope of the least squares fit line of the values in val2 & val1
FROM measurements_multival;
```

For more information about statistical aggregation API calls, see the
[hyperfunction API documentation][hyperfunctions-api-stats-agg].

[blog-aggregates]: https://blog.timescale.com/blog/how-postgresql-aggregation-works-and-how-it-inspired-our-hyperfunctions-design-2/
[gh-two-step-agg]: https://github.com/timescale/timescaledb-toolkit/blob/main/docs/two-step_aggregation.md
[hyperfunctions-api-stats-agg]: /api/:currentVersion:/hyperfunctions/statistical-and-regression-analysis/stats_agg-one-variable/
