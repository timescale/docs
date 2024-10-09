---
api_name: rollup()
excerpt: Combine multiple two-dimensional statistical aggregates
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
  summary: >
    Combine multiple intermediate two-dimensional statistical aggregate
    (`StatsSummary2D`) objects into a single `StatsSummary2D` object. For
    example, you can use `rollup` to combine statistical aggregates from
    15-minute buckets into daily buckets.

    For use in window function, see [`rolling()`](#rolling).
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
      - column: rollup
        type: StatsSummary2D
        description: >
          A new statistical aggregate produced by combining the input statistical
          aggregates
---

