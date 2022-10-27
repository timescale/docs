---
api_name: average()
excerpt: Calculate the average of values in a statistical aggregate
topics: [hyperfunctions]
keywords: [average, statistics, statistical aggregate, hyperfunctions, toolkit]
api:
  license: community
  type: function
  toolkit: true
  version:
    experimental: 1.0.0
    stable: 1.3.0
hyperfunction:
  family: statistical analysis
  type: accessor
  aggregates:
    - stats_agg() (1D)
api_details:
  summary: >
    Calculate an average from the values in a statistical aggregate.
  signatures:
    - language: sql
      code: |
        average(
          summary StatsSummary1D
        ) RETURNS DOUBLE PRECISION
  parameters:
    required:
      - name: summary
        type: StatsSummary1D
        description: >
          The statistical aggregate produced by a `stats_agg` call
    returns:
      - column: average
        type: DOUBLE PRECISION
        description: >
          The average of the values in the statistical aggregate
  examples:
    - description: >
        Calculate the average of the integers from 0 to 100.
      command:
        language: sql
        code: |
          SELECT average(stats_agg(data))
            FROM generate_series(0, 100) data;
      return:
        code: |
          average
          -----------
          50
---

