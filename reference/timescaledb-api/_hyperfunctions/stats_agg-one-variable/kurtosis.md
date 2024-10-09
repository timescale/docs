---
api_name: kurtosis()
excerpt: Calculate the kurtosis from a one-dimensional statistical aggregate
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
    - stats_agg() (one variable)
api_details:
  summary: >
    Calculate the kurtosis from the values in a statistical aggregate. The
    kurtosis is the fourth statistical moment. It is a measure of “tailedness”
    of a data distribution compared to a normal distribution.
  signatures:
    - language: sql
      code: |
        kurtosis(
          summary StatsSummary1D,
          [ method TEXT ]
        ) DOUBLE PRECISION
  parameters:
    required:
      - name: summary
        type: StatsSummary1D
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
      - column: kurtosis
        type: DOUBLE PRECISION
        description: >
          The kurtosis of the values in the statistical aggregate
  examples:
    - description: >
        Calculate the kurtosis of a sample containing the integers from 0 to 100.
      command:
        language: sql
        code: |
          SELECT kurtosis(stats_agg(data))
            FROM generate_series(0, 100) data;
      return:
        language: sql
        code: |
          kurtosis
          ----------
          1.78195
---

