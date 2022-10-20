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
  family: statistical aggregates
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
        type: StatsSummary1D | StatsSummary2D
        description: >
          The statistical aggregate, containing data about the variables in an
          intermediate form. Pass the aggregate to accessor functions in the
          statistical aggregates API to perform final calculations. Or, pass the
          aggregate to rollup functions to combine multiple statistical aggregates
          into larger aggregates.
  examples:
    - description: >
        Create statistical aggregates that summarize daily statistical data
        about two variables. Use the statistical aggregates to calculate the
        average of the dependent variable and the slope of the linear-regression
        fit.
      command:
        language: sql
        code: |
          WITH t as (
              SELECT
                  time_bucket('1 day'::interval, ts) as dt,
                  stats_agg(val2, val1) AS stats2D,
                  stats_agg(val1) AS stats1D
              FROM foo
              WHERE id = 'bar'
              GROUP BY time_bucket('1 day'::interval, ts)
          )
          SELECT
              average_x(stats2D), -- use average_x on 2D summary
              average(stats1D), -- use normal average on 1D summary to get same value
              slope(stats2D) -- slope and other regression functions only work on 2D aggregates
          FROM t;
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
