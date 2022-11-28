---
api_name: skewness()
excerpt: Calculate the skewness from a one-dimensional statistical aggregate
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
    - stats_agg() (one variable)
api_details:
  summary: >
    Calculate the skewness from the values in a statistical aggregate. The
    skewness is the third statistical moment. It is a measure of asymmetry in a
    data distribution.
  signatures:
    - language: sql
      code: |
        skewness(
          summary StatsSummary1D,
          [ method TEXT ]
        ) RETURNS DOUBLE PRECISION
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
          The method used for calculating the skewness. The two options are
          `population` and `sample`, which can be abbreviated to `pop` or `samp`.
          Defaults to `sample`.
    returns:
      - column: skewness
        type: DOUBLE PRECISION
        description: >
          The skewness of the values in the statistical aggregate
  examples:
    - description: >
          Calculate the skewness of a sample containing the integers from 0 to 100.
      command:  
        language: sql
        code: |
          SELECT skewness(stats_agg(data))
            FROM generate_series(0, 100) data;
      return:
        language: sql
        code: |
          skewness_x
          ----------
          0
---

