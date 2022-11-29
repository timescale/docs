---
api_name: stddev()
excerpt: Calculate the standard deviation from a one-dimensional statistical aggregate
topics: [hyperfunctions]
keywords: [statistics, hyperfunctions, Toolkit]
tags: [standard deviation]
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
    Calculate the standard deviation from the values in a statistical aggregate.
  signatures:
    - language: sql
      code: |
        stddev(
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
          The method used for calculating the standard deviation. The two options
          are `population` and `sample`, which can be abbreviated to `pop` or
          `samp`. Defaults to `sample`.
    returns:
      - column: stddev
        type: DOUBLE PRECISION
        description: >
          The standard deviation of the values in the statistical aggregate
  examples:
    - description: >
          Calculate the standard deviation of a sample containing the integers from 0 to 100.
      command:  
        language: sql
        code: |
          SELECT stddev(stats_agg(data))
            FROM generate_series(0, 100) data;
      return:
        code: |
          stddev_y
          --------
          29.3002
---

