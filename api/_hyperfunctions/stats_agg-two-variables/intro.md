---
section: hyperfunction
subsection: stats_agg() (two variables)
---

Perform linear regression analysis, for example to calculate correlation
coefficient and covariance, on two-dimensional data. You can also calculate
common statistics, such as average and standard deviation, on each dimension
separately. These functions are similar to the [PostgreSQL statistical
aggregates][pg-stats-aggs], but they include more features and are easier to use
in [continuous aggregates][caggs] and window functions. The linear regressions
are based on the standard least-squares fitting method.

These functions work on two-dimensional data. To work with one-dimensional data,
for example to calculate the average and standard deviation of a single
variable, see [the one-dimensional `stats_agg` functions][stats_agg-1d].

[caggs]: /use-timescale/:currentVersion:/continuous-aggregates/
[pg-stats-aggs]:
    https://www.postgresql.org/docs/current/functions-aggregate.html#FUNCTIONS-AGGREGATE-STATISTICS-TABLE
[stats_agg-1d]: /api/:currentVersion:/hyperfunctions/statistical-and-regression-analysis/stats_agg-one-variable/
