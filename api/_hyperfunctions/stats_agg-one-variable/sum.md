---
api_name: sum()
excerpt: Calculate the sum from a one-dimensional statistical aggregate
topics: [hyperfunctions]
keywords: [statistics, hyperfunctions, Toolkit]
tags: [sum]
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
    Calculate the sum of the values contained in a statistical aggregate.
  signatures:
    - language: sql
      code: |
        sum(
          summary StatsSummary1D
        ) RETURNS DOUBLE PRECISION
  parameters:
    required:
      - name: summary
        type: StatsSummary1D
        description: >
          The statistical aggregate produced by a `stats_agg` call
    returns:
      - column: sum
        type: DOUBLE PRECISION
        description: >
          The sum of the values in the statistical aggregate
  examples:
    - description: >
        Calculate the sum of the integers from 0 to 100.
      command:
        language: sql
        code: |
          SELECT sum(stats_agg(data))
            FROM generate_series(0, 100) data;
      return:
        code: |
          sum
          -----
          5050
---

