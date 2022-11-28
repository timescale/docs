---
api_name: intercept()
excerpt: Calculate the intercept from a two-dimensional statistical aggregate
topics: [hyperfunctions]
keywords: [statistics, hyperfunctions, Toolkit]
tags: [intercept, least squares, linear regression]
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
    Calculate the y intercept from a two-dimensional statistical aggregate. The
    calculation uses the standard least-squares fitting for linear regression.
  signatures:
    - language: sql
      code: |
        intercept(
            summary StatsSummary2D
        ) RETURNS DOUBLE PRECISION
  parameters:
    required:
      - name: summary
        type: StatsSummary2D
        description: >
          The statistical aggregate produced by a `stats_agg` call
    returns:
      - column: intercept
        type: DOUBLE PRECISION
        description: >
          The y intercept of the least-squares fit line
  examples:
    - description: >
        Calculate the y intercept from independent variable `y` and dependent
        variable `x` for each 15-minute time bucket.
      command:
        language: sql
        code: |
          SELECT
              id,
              time_bucket('15 min'::interval, ts) AS bucket,
              intercept(stats_agg(y, x)) AS summary
          FROM foo
          GROUP BY id, time_bucket('15 min'::interval, ts)
---

