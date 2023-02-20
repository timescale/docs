---
api_name: determination_coeff()
excerpt: Calculate the determination coefficient from a two-dimensional statistical aggregate
topics: [hyperfunctions]
keywords:
  [
    determination coefficient,
    statistics,
    statistical aggregate,
    hyperfunctions,
    toolkit,
  ]
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
    Calculate the determination coefficient from a two-dimensional statistical
    aggregate. The calculation uses the standard least-squares fitting for
    linear regression.
  signatures:
    - language: sql
      code: |
        determination_coeff(
            summary StatsSummary2D
        ) RETURNS DOUBLE PRECISION
  parameters:
    required:
      - name: summary
        type: StatsSummary2D
        description: >
          The statistical aggregate produced by a `stats_agg` call
    returns:
      - column: determination_coeff
        type: DOUBLE PRECISION
        description: >
          The determination coefficient of the least-squares fit line
  examples:
    - description: >
        Calculate the determination coefficient of independent variable `y` and
        dependent variable `x` for each 15-minute time bucket.
      command:
        language: sql
        code: |
          SELECT
              id,
              time_bucket('15 min'::interval, ts) AS bucket,
              determination_coeff(stats_agg(y, x)) AS summary
          FROM foo
          GROUP BY id, time_bucket('15 min'::interval, ts)
---

