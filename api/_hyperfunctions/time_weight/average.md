---
api_name: average()
excerpt: Calculate the time-weighted average of values in a `TimeWeightSummary`
topics: [hyperfunctions]
api:
  license: community
  type: function
  toolkit: true
  version:
    experimental: 0.1.0
    stable: 1.0.0
hyperfunction:
  family: time-weighted calculations
  type: accessor
  aggregates:
    - time_weight()
api_details:
  summary: >
    Calculate the time-weighted average. Equal to [`integral`](#integral)
    divided by the elapsed time.
  signatures:
    - language: sql
      code: |
        average(
            tws TimeWeightSummary
        ) RETURNS DOUBLE PRECISION
  parameters:
    required:
      - name: tws
        type: TimeWeightSummary
        description: >
          The input `TimeWeightSummary` from a `time_weight()` call.
    returns:
      - column: average
        type: DOUBLE PRECISION
        description: The time-weighted average.
  examples:
    - description: >
        Calculate the time-weighted average of the column `val`, using the
        'last observation carried forward' interpolation method.
      command:
        code: |
          SELECT
              id,
              average(tws)
          FROM (
              SELECT
                  id,
                  time_weight('LOCF', ts, val) AS tws
              FROM foo
              GROUP BY id
          ) t
---

