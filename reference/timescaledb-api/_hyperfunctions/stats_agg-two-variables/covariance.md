---
api_name: covariance()
excerpt: Calculate the covariance from a two-dimensional statistical aggregate
topics: [hyperfunctions]
keywords:
  [covariance, statistics, statistical aggregate, hyperfunctions, toolkit]
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
    Calculate the covariance from a two-dimensional statistical aggregate. The
    calculation uses the standard least-squares fitting for linear regression.
  signatures:
    - language: sql
      code: |
        covariance(
            summary StatsSummary2D,
            [ method TEXT ]
        ) RETURNS DOUBLE PRECISION
  parameters:
    required:
      - name: summary
        type: StatsSummary2D
        description: >
          The statistical aggregate produced by a `stats_agg` call
    optional:
      - name: method
        type: TEXT
        description: >
          The method used for calculating the covariance. The two options are
          `population` and `sample`, which can be abbreviated to `pop` or `samp`.
          Defaults to `sample`.
    returns:
      - column: covariance
        type: DOUBLE PRECISION
        description: >
          The covariance of the least-squares fit line
  examples:
    - description: >
        Calculate the covariance of independent variable `y` and
        dependent variable `x` for each 15-minute time bucket.
      command:
        language: sql
        code: |
          SELECT
              id,
              time_bucket('15 min'::interval, ts) AS bucket,
              covariance(stats_agg(y, x)) AS summary
          FROM foo
          GROUP BY id, time_bucket('15 min'::interval, ts)
---

