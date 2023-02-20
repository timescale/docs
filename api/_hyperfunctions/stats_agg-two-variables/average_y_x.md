---
api_name: average_y() | average_x()
excerpt: Calculate the average from a two-dimensional statistical aggregate for the dimension specified
topics: [hyperfunctions]
keywords: [average, statistics, hyperfunctions, Toolkit]
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
    Calculate the average from a two-dimensional aggregate for the given
    dimension. For example, `average_y()` calculates the average for all the
    values of the `y` variable, independent of the values of the `x` variable.
  signatures:
    - language: sql
      code: |
        average_y(
          summary StatsSummary 2D
        ) RETURNS DOUBLE PRECISION
    - language: sql
      code: |
        average_x(
          summary StatsSummary 2D
        ) RETURNS DOUBLE PRECISION
  parameters:
    required:
      - name: summary
        type: StatsSummary2D
        description: >
          The statistical aggregate produced by a `stats_agg` call
    returns:
      - column: average_y | average_x
        type: DOUBLE PRECISION
        description: >
          The average of the values in the statistical aggregate
  examples:
    - description: >
        Calculate the average of the integers from 0 to 100.
      command:
        language: sql
        code: |
          SELECT average_x(stats_agg(y, x))
            FROM generate_series(1, 5) y,
                 generate_series(0, 100) x;
      return:
        code: |
          average
          -----------
          50
---

