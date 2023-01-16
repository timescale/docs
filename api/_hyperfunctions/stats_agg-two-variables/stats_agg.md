---
api_name: stats_agg() (two variables)
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
    - stats_agg() (two variables)
api_details:
  summary: >
    This is the first step for performing any statistical aggregate calculations
    on two-dimensional data. Use `stats_agg` to create an intermediate aggregate
    (`StatsSummary2D`) from your data. This intermediate form can then be used
    by one or more accessors in this group to compute the final results.
    Optionally, multiple such intermediate aggregate objects can be combined
    using [`rollup()`](#rollup) or [`rolling()`](#rolling) before an accessor is
    applied. 
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

