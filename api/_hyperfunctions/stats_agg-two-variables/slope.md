---
api_name: slope()
excerpt: Calculate the slope from a two-dimensional statistical aggregate
topics: [hyperfunctions]
keywords: [statistics, hyperfunctions, Toolkit]
tags: [least squares, linear regression]
api:
  license: community
  type: function
  toolkit: true
  version:
    experimental: 1.0.0
    stable: 1.3.0
hyperfunction:
  family: statistical and regression analysis
  type: accessor
  aggregates:
    - stats_agg() (two variables)
api_details:
  summary: >
    Calculate the slope of the linear fitting line from a two-dimensional
    statistical aggregate. The calculation uses the standard least-squares
    fitting for linear regression.
  signatures:
    - language: sql
      code: |
        slope(
            summary StatsSummary2D
        ) RETURNS DOUBLE PRECISION
  parameters:
    required:
      - name: summary
        type: StatsSummary2D
        description: >
          The statistical aggregate produced by a `stats_agg` call
    returns:
      - column: slope
        type: DOUBLE PRECISION
        description: >
          The slope of the least-squares fit line
  examples:
    - description: >
        Calculate the slope from independent variable `y` and dependent
        variable `x` for each 15-minute time bucket.
      command:
        language: sql
        code: |
          SELECT
              id,
              time_bucket('15 min'::interval, ts) AS bucket,
              slope(stats_agg(y, x)) AS summary
          FROM foo
          GROUP BY id, time_bucket('15 min'::interval, ts)
---

