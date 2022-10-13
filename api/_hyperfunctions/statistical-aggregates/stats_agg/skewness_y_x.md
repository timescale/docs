---
api_name: skewness_y() | skewness_x()
excerpt: Calculate the skewness from values in a statistical aggregate
topics: [hyperfunctions]
keywords: [statistics, statistical aggregate, hyperfunctions, toolkit]
api:
  license: community
  type: function
  toolkit: true
  version:
    experimental: 1.0.0
    stable: 1.3.0
hyperfunction:
  family: statistical aggregates
  type: accessor, 2D
  aggregates:
    - stats_agg()
api_details:
  summary: >-
    Calculate the skewness from the values in a statistical aggregate. The
    kurtosis is the third statistical moment.
  signatures:
    - language: sql
      code: |-
        skewness_y(summary StatsSummary2D, method TEXT) RETURNS BIGINT
    - language: sql
      code: |-
        skewness_x(summary StatsSummary2D, method TEXT) RETURNS BIGINT
  parameters:
    required:
      - name: summary
        type: StatsSummary2D
        description: >-
            The statistical aggregate produced by a `stats_agg` call
    optional:
      - name: method
        type: TEXT
        description: >-
            The method used for calculating the skewness. The two options are
            `population` and `sample`, which can be abbreviated to `pop` or `samp`.
            Defaults to `sample`.
    returns:
      - column: skewness_y | skewness_x
        type: DOUBLE PRECISION
        description: >-
            The skewness of the values in the statistical aggregate
  examples:
    - command:
        language: sql
        code: |-
            SELECT skewness_x(stats_agg(data, data))
            FROM generate_series(0, 100) data;
      return:
        language: sql
        code: |-
            skewness_x
            ----------
            0
---

