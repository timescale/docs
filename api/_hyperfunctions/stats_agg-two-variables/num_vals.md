---
api_name: num_vals()
excerpt: Calculate the number of values in a two-dimensional statistical aggregate
topics: [hyperfunctions]
keywords: [statistics, hyperfunctions, Toolkit]
tags: [count, number]
api:
  license: community
  type: function
  toolkit: true
hyperfunction:
  family: statistical and regression analysis
  type: accessor
  aggregates:
    - stats_agg() (two variables)
api_details:
  summary: >
    Calculate the number of values contained in a two-dimensional statistical
    aggregate.
  signatures:
    - language: sql
      code: |
        num_vals(
          summary StatsSummary2D
        ) RETURNS BIGINT
  parameters:
    required:
      - name: summary
        type: StatsSummary2D
        description: >
          The statistical aggregate produced by a `stats_agg` call
    returns:
      - column: num_vals
        type: DOUBLE PRECISION
        description: >
          The number of values in the statistical aggregate
  examples:
    - description: >
          Calculate the number of values from 1 to 5, and from 0 to 100, inclusive.
      command:
        language: sql
        code: |
          SELECT num_vals(stats_agg(y, x))
            FROM generate_series(1, 5) y,
                 generate_series(0, 100) x;
      return:
        code: |
          num_vals
          --------
          505
---

