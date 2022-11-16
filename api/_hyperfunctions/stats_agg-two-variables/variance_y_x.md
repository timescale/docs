---
api_name: variance_y() | variance_x()
excerpt: Calculate the variance from a two-dimensional statistical aggregate for the dimension specified
topics: [hyperfunctions]
keywords: [statistics, statistical aggregate, hyperfunctions, toolkit]
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
    Calculate the variance from a two-dimensional statistical aggregate for the
    given dimension. For example, `variance_y()` calculates the skewness for all
    the values of the `y` variable, independent of values of the `x` variable.
  signatures:
    - language: sql
      code: |
        variance_y(
          summary StatsSummary2D,
          [ method TEXT ]
        ) RETURNS DOUBLE PRECISION
    - language: sql
      code: |
        variance_x(summary
            StatsSummary2D,
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
            The method used for calculating the standard deviation. The two options
            are `population` and `sample`, which can be abbreviated to `pop` or
            `samp`. Defaults to `sample`.
    returns:
      - column: variance
        type: DOUBLE PRECISION
        description: >
            The variance of the values in the statistical aggregate
  examples:
    - description: >
          Calculate the variance of a sample containing the integers from 0 to 100.
      command:
        language: sql
        code: |
            SELECT variance_y(stats_agg(data, data))
            FROM generate_series(0, 100) data;
      return:
        code: |
            variance_y
            ----------
            858.5
---

