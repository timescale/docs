---
section: hyperfunction
subsection: stats_agg() (2D)
---

Perform common statistical analyses on two-dimensional data, such as fitting a
linear regression model. These functions are similar to the [PostgreSQL
statistical aggregates][pg-stats-aggs], but they include more features and are
easier to use in [continuous aggregates][caggs] and window functions.

These functions work on two-dimensional data. To work with one-dimensional data,
for example to perform linear regression, see [the one-dimensional `stats_agg`
functions][stats_agg-1d].

[caggs]: /timescaledb/:currentVersion:/how-to-guides/continuous-aggregates/
[pg-stats-aggs]:
    https://www.postgresql.org/docs/current/functions-aggregate.html#FUNCTIONS-AGGREGATE-STATISTICS-TABLE
[stats_agg-1d]: /api/:currentVersion:/hyperfunctions/statistical-analysis/stats_agg-1d/
