---
api_name: stddev()
excerpt: Calculate the standard deviation from values in a statistical aggregate
topics: [hyperfunctions]
keywords: [statistics, statistical aggregate, hyperfunctions, toolkit]
tags: [standard deviation]
api:
  license: community
  type: function
  toolkit: true
hyperfunction:
  family: statistical aggregates
  type: accessor, 1D
  aggregates:
    - stats_agg()
api_details:
  summary: >-
    Calculate the standard deviation from the values in a statistical aggregate.
  signatures:
    - language: sql
      code: |-
        stddev(summary
          StatsSummary1D,
          method TEXT
        ) RETURNS BIGINT
  parameters:
    required:
      - name: summary
        type: StatsSummary1D
        description: >-
          The statistical aggregate produced by a `stats_agg` call
    optional:
      - name: method
        type: TEXT
        description: >-
          The method used for calculating the standard deviation. The two options
          are `population` and `sample`, which can be abbreviated to `pop` or
          `samp`. Defaults to `sample`.
    returns:
      - column: stddev
        type: DOUBLE PRECISION
        description: >-
          The standard deviation of the values in the statistical aggregate
  examples:
    - command:
        language: sql
        code: |-
          SELECT stddev(stats_agg(data))
            FROM generate_series(0, 100) data;
      return:
        code: |-
          stddev_y
          --------
          29.3002
---

