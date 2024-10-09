---
api_name: rollup()
excerpt: Combine multiple `TimeWeightSummaries`
topics: [hyperfunctions]
api:
  license: community
  type: function
  toolkit: true
  version:
    experimental: 0.3.0
    stable: 1.0.0
hyperfunction:
  family: time-weighted calculations
  type: rollup
  aggregates:
    - time_weight()
api_details:
  summary: >
    Combine multiple intermediate time-weighted aggregate (`TimeWeightSummary`)
    objects produced by `time_weight()` into a single intermediate
    `TimeWeightSummary` object. For example, you can use `rollup` to combine
    time-weighted aggregates from 15-minute buckets into daily buckets.
  signatures:
    - language: sql
      code: |
        rollup(
            tws TimeWeightSummary
        ) RETURNS TimeWeightSummary
  parameters:
    required:
      - name: time_weight
        type: TimeWeightSummary
        description: >
          The `TimeWeightSummary` aggregate produced by a `time_weight` call
    returns:
      - column: rollup
        type: StatsSummary1D
        description: >
          A new `TimeWeightSummary` aggregate produced by combining the input `TimeWeightSummary`
          aggregates
---

