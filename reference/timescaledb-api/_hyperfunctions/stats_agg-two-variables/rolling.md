---
api_name: rolling()
excerpt: Combine multiple two-dimensional statistical aggregates to calculate rolling window aggregates
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
  type: rollup
  aggregates:
    - stats_agg() (two variables)
api_details:
  summary: |
    Combine multiple intermediate two-dimensional statistical aggregate
    (`StatsSummary2D`) objects into a single `StatsSummary2D` object. It is
    optimized for use in a window function context for computing tumbling window
    statistical aggregates.
  
    This is especially useful for computing tumbling window aggregates from a
    continuous aggregate. It can be orders of magnitude faster because it uses
    inverse transition and combine functions, with the possibility that bigger
    floating point errors can occur in unusual scenarios.
  
    For re-aggregation in a non-window function context, such as combining
    hourly buckets into daily buckets, see [`rollup()`](#rollup).
  signatures:
    - language: sql
      code: |
        rolling(
            ss StatsSummary2D
        ) RETURNS StatsSummary2D
  parameters:
    required:
      - name: summary
        type: StatsSummary2D
        description: >
          The statistical aggregate produced by a `stats_agg` call
    returns:
      - column: rolling
        type: StatsSummary2D
        description: >
          A new statistical aggregate produced by combining the input statistical
          aggregates
---

