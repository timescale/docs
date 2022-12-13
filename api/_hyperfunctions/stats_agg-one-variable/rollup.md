---
api_name: rollup()
excerpt: Combine multiple one-dimensional statistical aggregates
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
    - stats_agg() (one variable)
api_details:
  summary: >
    Combine multiple intermediate statistical aggregate (`StatsSummary1D`)
    objects produced by `stats_agg` (one variable) into a single intermediate
    `StatsSummary1D` object. For example, you can use `rollup` to combine
    statistical aggregates from 15-minute buckets into daily buckets.

    For use in window functions, see [`rolling()`](#rolling).
  signatures:
    - language: sql
      code: |
        rollup(
            ss StatsSummary1D
        ) RETURNS StatsSummary1D
  parameters:
    required:
      - name: summary
        type: StatsSummary1D
        description: >
          The statistical aggregate produced by a `stats_agg` call
    returns:
      - column: rollup
        type: StatsSummary1D
        description: >
          A new statistical aggregate produced by combining the input statistical
          aggregates
---

