---
api_name: sum()
excerpt: Calculate the sum from values in a statistical aggregate
topics: [hyperfunctions]
keywords: [statistics, statistical aggregate, hyperfunctions, toolkit]
tags: [sum]
api:
  license: community
  type: function
  toolkit: true
  version:
    experimental: 1.0.0
    stable: 1.3.0
hyperfunction:
  family: statistical aggregates
  type: accessor
  aggregates:
    - stats_agg() (1D)
api_details:
  summary: >
    Calculate the sum of the values contained in a statistical aggregate.
  signatures:
    - language: sql
      code: |
        sum(
          summary StatsSummary1D
        ) RETURNS BIGINT
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
        Calculate the sum of the numbers from 0 to 100.
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

