---
api_name: kurtosis()
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
  type: accessor, 1D
  aggregates:
    - stats_agg()
api_details:
  summary: >-
    Calculate the kurtosis from the values in a statistical aggregate. The
    kurtosis is the fourth statistical moment.
  signatures:
    - language: sql
      code: |-
        kurtosis(summary StatsSummary1D, method TEXT) RETURNS BIGINT
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
          The method used for calculating the kurtosis. The two options are
          `population` and `sample`, which can be abbreviated to `pop` or `samp`.
          Defaults to `sample`.
    returns:
      - column: kurtosis
        type: DOUBLE PRECISION
        description: >-
          The kurtosis of the values in the statistical aggregate
  examples:
    - command:
        language: sql
        code: |-
          SELECT kurtosis(stats_agg(data))
            FROM generate_series(0, 100) data;
      return:
        language: sql
        code: |-
          kurtosis
          ----------
          1.78195
---

