---
section: hyperfunction
subsection: stats_agg() (1D)
---

import TwoStepAggregation from 'versionContent/_partials/_2-step-aggregation.mdx';

Perform common statistical analyses, such as calculating averages and standard
deviations, using this group of functions. These functions are similar to the
[PostgreSQL statistical aggregates][pg-stats-aggs], but they include more
features and are easier to use in [continuous aggregates][caggs] and window
functions.

They work on one-dimensional data. To work with two-dimensional data, for
example to perform linear regression, see [the two-dimensional `stats_agg`
functions][stats_agg-2d].

<TwoStepAggregation />

[caggs]: /timescaledb/:currentVersion:/how-to-guides/continuous-aggregates/
[pg-stats-aggs]:
    https://www.postgresql.org/docs/current/functions-aggregate.html#FUNCTIONS-AGGREGATE-STATISTICS-TABLE
[stats_agg-2d]: /api/:currentVersion:/hyperfunctions/statistical-aggregates/stats_agg-2d/
