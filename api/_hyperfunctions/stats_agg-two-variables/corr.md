---
api_name: corr()
excerpt: Calculate the correlation coefficient from a two-dimensional statistical aggregate
topics: [hyperfunctions]
keywords:
  [
    correlation coefficient,
    statistics,
    statistical aggregate,
    hyperfunctions,
    toolkit,
  ]
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
    Calculate the correlation coefficient from a two-dimensional statistical
    aggregate. The calculation uses the standard least-squares fitting for
    linear regression.
  signatures:
    - language: sql
      code: |
        corr(
          summary StatsSummary2D
        ) RETURNS DOUBLE PRECISION
  parameters:
    required:
      - name: summary
        type: StatsSummary2D
        description: >
          The statistical aggregate produced by a `stats_agg` call
    returns:
      - column: corr
        type: DOUBLE PRECISION
        description: >
          The correlation coefficient of the least-squares fit line
  examples:
    - description: >
        Calculate the correlation coefficient of independent variable `y` and
        dependent variable `x` for each 15-minute time bucket.
      command:
        language: sql
        code: |
          SELECT
            id,
            time_bucket('15 min'::interval, ts) AS bucket,
            corr(stats_agg(y, x)) AS summary
          FROM foo
          GROUP BY id, time_bucket('15 min'::interval, ts)
---

