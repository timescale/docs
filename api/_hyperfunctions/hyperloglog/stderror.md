---
api_name: stderror()
excerpt: Estimate the relative standard error of a hyperloglog
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
    Estimate the relative standard error of a `Hyperloglog`. For approximate
    relative errors by number of buckets, see the
    [relative errors section](#approximate-relative-errors).
  signatures:
    - language: sql
      code: |
        stderror(
            hyperloglog Hyperloglog
        ) RETURNS DOUBLE PRECISION
  parameters:
    required:
      - name: hyperloglog
        type: Hyperloglog
        description: >
          The hyperloglog to estimate the error of.
    returns:
      - column: stderror
        type: DOUBLE PRECISION
        description: >
          The approximate relative standard error of the hyperloglog.
  examples:
    - description: >
        Estimate the relative standard error of a hyperloglog named
        `hyperloglog`. The expected output is 0.011490485194281396.
      command:
        code: |
          SELECT stderror(hyperloglog(8192, data))
            FROM generate_series(1, 100000) data
      return:
        code: |
          stderror       
          ----------------------
          0.011490485194281396
---

