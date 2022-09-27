---
api_name: kurtosis_y() | kurtosis_x()
excerpt: Calculate the kurtosis from values in a statistical aggregate
topics: [hyperfunctions]
keywords: [statistics, statistical aggregate, hyperfunctions, toolkit]
tags: [skew]
api:
  license: community
  type: function
  toolkit: true
hyperfunction:
  family: statistical aggregates
  type: accessor, 2D
  aggregates:
    - stats_agg()
api_details:
  summary: >-
    Calculate the kurtosis from the values in a statistical aggregate. The
    kurtosis is the fourth statistical moment.
  signatures:
    - language: sql
      code: |-
        kurtosis_y(summary StatsSummary2D, method TEXT) RETURNS BIGINT
    - language: sql
      code: |-
        kurtosis_x(summary StatsSummary2D, method TEXT) RETURNS BIGINT
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
          The method used for calculating the kurtosis. The two options are
          `population` and `sample`, which can be abbreviated to `pop` or `samp`.
          Defaults to `sample`.
    returns:
      - column: kurtosis_y | kurtosis_x
        type: DOUBLE PRECISION
        description: >-
          The kurtosis of the values in the statistical aggregate
  examples:
    - command:
        language: sql
        code: |-
          SELECT kurtosis_y(stats_agg(data, data))
            FROM generate_series(0, 100) data;
      return:
        language: sql
        code: |-
          kurtosis_y
          ----------
          1.78195
---

