---
api_name: rolling()
excerpt: Roll up multiple statistical aggregates to calculate rolling window aggregates
topics: [hyperfunctions]
keywords: [rollup, statistics, statistical aggregates, hyperfunctions, toolkit]
api:
  license: community
  type: function
  toolkit: true
  version:
    experimental: 1.0.0
    stable: 1.3.0
hyperfunction:
  family: statistical analysis
  type: rollup
  aggregates:
    - stats_agg() (2D)
api_details:
  summary: >
    Combine multiple statistical aggregates into a single statistical aggregate.
    For example, you can use `rolling` to combine statistical aggregates from
    15-minute buckets into daily buckets.
  details:
    - type: note
      content: >
        Compared to [`rollup`](#rollup), `rolling` is more efficient for computing
        [tumbling window
        aggregates](https://www.postgresql.org/docs/current/tutorial-window.html).
        Though `rollup` also works for windowed aggregates, it is less efficient.

        In certain unusual scenarios, `rolling` might introduce more floating point
        errors. `rollup` doesn't have this risk of extra errors.
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

