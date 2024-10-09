---
section: hyperfunction
subsection: stats_agg() (one variable)
---

Perform common statistical analyses, such as calculating averages and standard
deviations, using this group of functions. These functions are similar to the
[PostgreSQL statistical aggregates][pg-stats-aggs], but they include more
features and are easier to use in [continuous aggregates][caggs] and window
functions.

These functions work on one-dimensional data. To work with two-dimensional data,
for example to perform linear regression, see [the two-dimensional `stats_agg`
functions][stats_agg-2d].

[caggs]: /use-timescale/:currentVersion:/continuous-aggregates/
[pg-stats-aggs]:
    https://www.postgresql.org/docs/current/functions-aggregate.html#FUNCTIONS-AGGREGATE-STATISTICS-TABLE
[stats_agg-2d]: /api/:currentVersion:/hyperfunctions/statistical-and-regression-analysis/stats_agg-two-variables/
