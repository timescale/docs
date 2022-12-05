---
api_name: distinct_count()
excerpt: Estimate the number of distinct values from a hyperloglog
topics: [hyperfunctions]
api:
  license: community
  type: function
  toolkit: true
  version:
    experimental: 0.1.0
    stable: 1.3.0
hyperfunction:
  family: approximate count distinct
  type: accessor
  aggregates:
    - hyperloglog()
api_details:
  summary: >
    Estimate the number of distinct values from a hyperloglog
  signatures:
    - language: sql
      code: |
        distinct_count(
            hyperloglog Hyperloglog
        ) RETURNS BIGINT
  parameters:
    required:
      - name: hyperloglog
        type: Hyperloglog
        description: >
          The hyperloglog to extract the count from.
    returns:
      - column: distinct_count
        type: BIGINT
        description: >
          The number of distinct elements counted by the hyperloglog.
  examples:
    - description: >
        Estimate the number of distinct values from a hyperloglog named
        `hyperloglog`. The expected output is 98,814.
      command:
        code: |
          SELECT distinct_count(hyperloglog(8192, data))
            FROM generate_series(1, 100000) data
      return:
        code: |
          distinct_count
          ----------------
                  98814
---

