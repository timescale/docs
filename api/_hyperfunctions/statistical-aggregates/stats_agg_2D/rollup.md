---
api_name: rollup()
excerpt: Roll up multiple statistical aggregates
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
  family: statistical aggregates
  type: rollup
  aggregates:
    - stats_agg() (2D)
api_details:
  summary: |-
    Combine multiple statistical aggregates into a single statistical aggregate.
    For example, you can use `rollup` to combine statistical aggregates from
    15-minute buckets into daily buckets.
    This function work with both one- and two-dimensional statistical aggregates.
  details:
    - type: note
      content: |-
        For use in [window
        functions](https://www.postgresql.org/docs/current/tutorial-window.html),
        see [`rolling`](#rollup). `rollup` also works in window functions, but
        `rolling` can be more efficient.
  signatures:
    - language: sql
      code: |-
        rolling(
            ss StatsSummary2D
        ) RETURNS StatsSummary2D
  parameters:
    required:
      - name: summary
        type: StatsSummary2D
        description: >-
          The statistical aggregate produced by a `stats_agg` call
    returns:
      - column: rollup
        type: StatsSummary2D
        description: >-
          A new statistical aggregate produced by combining the input statistical
          aggregates
---

