---
api_name: stats_agg() (2D)
excerpt: Aggregate statistical data into a statistical aggregate for further analysis
topics: [hyperfunctions]
keywords: [statistics, statistical aggregate, hyperfunctions, toolkit]
api:
  license: community
  type: function
  toolkit: true
  version:
    experimental: 1.0.0
    stable: 1.3.0
hyperfunction:
  family: statistical analysis
  type: aggregate
  aggregates:
    - stats_agg() (2D)
api_details:
  summary: >
    This is the first step for performing any statistical aggregate calculations.
    Use `stats_agg` to create an intermediate aggregate from your data. This
    intermediate form can then be used by any accessor on this page to compute a
    final result.
  signatures:
    - language: sql
      code: |
        stats_agg(
            y DOUBLE PRECISION,
            x DOUBLE PRECISION
        ) RETURNS StatsSummary2D
  parameters:
    required:
      - name: y, x
        type: DOUBLE PRECISION
        description: >
          The variables to use for the statistical aggregate.
    returns:
      - column: stats_agg
        type: StatsSummary2D
        description: >
          The statistical aggregate, containing data about the variables in an
          intermediate form. Pass the aggregate to accessor functions in the
          statistical aggregates API to perform final calculations. Or, pass the
          aggregate to rollup functions to combine multiple statistical aggregates
          into larger aggregates.
---

import TwoStepAggregation from 'versionContent/_partials/_2-step-aggregation.mdx';

Perform common statistical analyses, such as averaging and linear regression,
using this group of functions. These functions are similar to the [PostgreSQL
statistical aggregates][pg-stats-aggs], but they include more features and are
easier to use in [continuous aggregates][caggs] and window functions.

They work with both one-dimensional (1D) and two-dimensional (2D) data. For
example, you can calculate the average of a single variable (1D), or the slope
of two related variables (2D).

<TwoStepAggregation />

[caggs]: /timescaledb/:currentVersion:/how-to-guides/continuous-aggregates/
[pg-stats-aggs]: https://www.postgresql.org/docs/current/functions-aggregate.html#FUNCTIONS-AGGREGATE-STATISTICS-TABLE
