---
api_name: sum_y() | sum_x()
excerpt: Calculate the sum from a two-dimensional statistical aggregate for the dimension specified
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
    - stats_agg() (two variables)
api_details:
  summary: >
    Calculate the sum from a two-dimensional statistical aggregate for the given
    dimension. For example, `sum_y()` calculates the skewness for all the values
    of the `y` variable, independent of values of the `x` variable.
  signatures:
    - language: sql
      code: |
        sum_y(
          summary StatsSummary2D
        ) RETURNS DOUBLE PRECISION
    - language: sql
      code: |
        sum_x(
          summary StatsSummary2D
        ) RETURNS DOUBLE PRECISION
  parameters:
    required:
      - name: summary
        type: StatsSummary2D
        description: >
            The statistical aggregate produced by a `stats_agg` call
    returns:
      - column: sum
        type: DOUBLE PRECISION
        description: >
            The sum of the values in the statistical aggregate
  examples:
    - description: >
        Calculate the sum of the numbers from 0 to 100.
      command:
        language: sql
        code: |-
            SELECT sum_y(stats_agg(data, data))
              FROM generate_series(0, 100) data;
      return:
        code: |
            sum_y
            -----
            5050
---

