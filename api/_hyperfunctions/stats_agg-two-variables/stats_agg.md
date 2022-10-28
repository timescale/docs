---
api_name: stats_agg() (two variables)
excerpt: Aggregate data into an intermediate statistical aggregate form for further calculation
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
  family: statistical and regression analysis
  type: aggregate
  aggregates:
    - stats_agg() (two variables)
api_details:
  summary: >
    This is the first step for performing any statistical aggregate calculations
    on two-dimensional data. Use stats_agg to create an intermediate aggregate
    (`StatsSummary2D`) from your data. This intermediate form can then be used
    by one or more accessors in this group to compute the final results.
    Optionally, multiple such intermediate aggregate objects can be combined
    using [`rollup()`](#rollup) or [`rolling()`](#rolling) before an accessor is
    applied. 
  details:
    - type: note
      content: >
        This is especially useful for computing tumbling window aggregates from
        a continuous aggregate. It can be orders of magnitude faster because it
        uses inverse transition and combine functions, with the possibility that
        bigger floating point errors can occur in unusual scenarios.
        
        For re-aggregation in a non-window function context, such as combining
        hourly buckets into daily buckets, see [`rollup()`](#rollup).
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
