---
api_name: kurtosis_y() | kurtosis_x()
excerpt: Calculate the kurtosis from a two-dimensional statistical aggregate for the dimension specified
topics: [hyperfunctions]
keywords: [statistics, hyperfunctions, Toolkit]
tags: [skew]
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
    Calculate the kurtosis from a two-dimensional statistical aggregate for the
    given dimension. For example, `kurtosis_y()` calculates the kurtosis for all
    the values of the `y` variable, independent of values of the `x` variable.
    The kurtosis is the fourth statistical moment. It is a measure of
    “tailedness” of a data distribution compared to a normal distribution.
  signatures:
    - language: sql
      code: |
        kurtosis_y(
          summary StatsSummary2D,
          [ method TEXT ]
        ) RETURNS DOUBLE PRECISION
    - language: sql
      code: |
        kurtosis_x(
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
          The method used for calculating the kurtosis. The two options are
          `population` and `sample`, which can be abbreviated to `pop` or `samp`.
          Defaults to `sample`.
    returns:
      - column: kurtosis_y | kurtosis_x
        type: DOUBLE PRECISION
        description: >
          The kurtosis of the values in the statistical aggregate
  examples:
    - description: >
          Calculate the kurtosis of a sample containing the integers from 0 to 100.
      command:
        language: sql
        code: |
          SELECT kurtosis_y(stats_agg(data, data))
            FROM generate_series(0, 100) data;
      return:
        language: sql
        code: |
          kurtosis_y
          ----------
          1.78195
---

