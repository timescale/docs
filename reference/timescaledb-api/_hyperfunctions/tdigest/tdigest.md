---
api_name: tdigest()
excerpt: Aggregate data in a `tdigest` for further calculation of percentile estimates
topics: [hyperfunctions]
api:
  license: community
  type: function
  toolkit: true
  version:
    experimental: 0.1.0
    stable: 1.0.0
hyperfunction:
  family: percentile approximation
  type: aggregate
  aggregates:
    - tdigest()
api_details:
  summary: |
    This is the first step for calculating approximate percentiles with the
    `tdigest` algorithm. Use `tdigest` to create an intermediate aggregate from 
    your raw data. This intermediate form can then be used by one or more
    accessors in this group to compute final results. 
    
    Optionally, multiple such intermediate aggregate objects can be combined
    using [`rollup()`](#rollup) before an accessor is applied.
  signatures:
    - language: sql
      code: |
        tdigest(
          buckets INTEGER,
          value DOUBLE PRECISION
        ) RETURNS TDigest
  parameters:
    required:
      - name: buckets
        type: INTEGER
        description: >
          Number of buckets in the digest. Increasing this provides more accurate quantile estimates, but requires more memory.
      - name: value
        type: DOUBLE PRECISION
        description: Column of values to aggregate for the `tdigest` object.
    returns:
      - column: tdigest
        type: TDigest
        description: >
          A percentile estimator object created to calculate percentiles using
          the `tdigest` algorithm
  examples:
    - description: >
        Given a table called `samples`, with a column called `data`, build a
        `tdigest` using the `data` column. Use 100 buckets for the approximation.
      command:
        code: SELECT tdigest(100, data) FROM samples;
---

