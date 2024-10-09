---
api_name: skewness_y() | skewness_x()
excerpt: Calculate the skewness from a two-dimensional statistical aggregate for the dimension specified
topics: [hyperfunctions]
keywords: [statistics, hyperfunctions, Toolkit]
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
    Calculate the skewness from a two-dimensional statistical aggregate for the
    given dimension. For example, `skewness_y()` calculates the skewness for all
    the values of the `y` variable, independent of values of the `x` variable.
    The skewness is the third statistical moment. It is a measure of asymmetry
    in a data distribution.
  signatures:
    - language: sql
      code: |
        skewness_y(
          summary StatsSummary2D,
          [ method TEXT ]
        ) RETURNS DOUBLE PRECISION
    - language: sql
      code: |
        skewness_x(
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
            The method used for calculating the skewness. The two options are
            `population` and `sample`, which can be abbreviated to `pop` or `samp`.
            Defaults to `sample`.
    returns:
      - column: skewness_y | skewness_x
        type: DOUBLE PRECISION
        description: >
            The skewness of the values in the statistical aggregate
  examples:
    - description: >
          Calculate the skewness of a sample containing the integers from 0 to 100.
      command:
        language: sql
        code: |
            SELECT skewness_x(stats_agg(data, data))
              FROM generate_series(0, 100) data;
      return:
        language: sql
        code: |
            skewness_x
            ----------
            0
---

