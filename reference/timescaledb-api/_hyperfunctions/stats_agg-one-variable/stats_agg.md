---
api_name: stats_agg() (one variable)
excerpt: Aggregate data into an intermediate statistical aggregate form for further calculation
topics: [hyperfunctions]
keywords: [statistics, hyperfunctions, Toolkit]
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
    - stats_agg() (one variable)
api_details:
  summary: |
    This is the first step for performing any statistical aggregate calculations
    on one-dimensional data. Use `stats_agg` to create an intermediate aggregate
    (`StatsSummary1D`) from your data. This intermediate form can then be used
    by one or more accessors in this group to compute final results. Optionally,
    multiple such intermediate aggregate objects can be combined using
    [`rollup()`](#rollup) or [`rolling()`](#rolling) before an accessor is
    applied.

    `stats_agg` is well suited for creating a continuous aggregate that can
    serve multiple purposes later. For example, you can create a continuous
    aggregate using `stats_agg` to calculate average and sum. Later, you can
    reuse the same `StatsSummary1D` objects to calculate standard deviation from
    the same continuous aggregate.
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

