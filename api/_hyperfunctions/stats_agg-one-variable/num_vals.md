---
api_name: num_vals()
excerpt: Calculate the number of values in a one-dimensional statistical aggregate
topics: [hyperfunctions]
keywords: [statistics, hyperfunctions, Toolkit]
tags: [count, number]
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
    Calculate the number of values contained in a statistical aggregate.
  signatures:
    - language: sql
      code: |
        num_vals(
          summary StatsSummary1D
        ) RETURNS BIGINT
  parameters:
    required:
      - name: summary
        type: StatsSummary1D
        description: >
          The statistical aggregate produced by a `stats_agg` call
    returns:
      - column: num_vals
        type: DOUBLE PRECISION
        description: >
          The number of values in the statistical aggregate
  examples:
    - description: >
          Calculate the number of values from 0 to 100, inclusive.
      command:  
        language: sql
        code: |
          SELECT num_vals(stats_agg(data))
            FROM generate_series(0, 100) data;
      return:
        code: |
          num_vals
          --------
          101
---

