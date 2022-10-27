---
api_name: stats_agg() (one variable)
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
  family: statistical analysis
  type: aggregate
  aggregates:
    - stats_agg() (one variable)
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
---

