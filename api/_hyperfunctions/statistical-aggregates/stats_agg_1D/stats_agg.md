---
api_name: stats_agg() (1D)
excerpt: Aggregate one-dimensional statistical data for further analysis
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
    - stats_agg() (1D)
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
            value DOUBLE PRECISION
        ) RETURNS StatsSummary1D
  parameters:
    required:
      - name: value
        type: DOUBLE PRECISION
        description: >
          The variable to use for the statistical aggregate.
    returns:
      - column: stats_agg
        type: StatsSummary1D
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
                  stats_agg(val1) AS stats1D
              FROM foo
              WHERE id = 'bar'
              GROUP BY time_bucket('1 day'::interval, ts)
          )
          SELECT
              average(stats1D), -- use normal average on 1D summary to get same value
          FROM t;
---

