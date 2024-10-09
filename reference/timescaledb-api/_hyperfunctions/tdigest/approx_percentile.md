---
api_name: approx_percentile()
excerpt: Estimate the value at a given percentile from a `tdigest`
topics: [hyperfunctions]
api:
  license: community
  type: function
  toolkit: true
  version:
    experimental: 0.2.0
    stable: 1.0.0
hyperfunction:
  family: percentile approximation
  type: accessor
  aggregates:
    - tdigest()
api_details:
  summary: Estimate the approximate value at a percentile from a `tdigest` aggregate.
  signatures:
    - language: sql
      code: |
        approx_percentile(
          percentile DOUBLE PRECISION,
          tdigest  TDigest
        ) RETURNS DOUBLE PRECISION
  parameters:
    required:
      - name: percentile
        type: DOUBLE PRECISION
        description: The percentile to compute. Must be within the range `[0.0, 1.0]`.
      - name: tdigest
        type: TDigest
        description: The `tdigest` aggregate.
    returns:
      - column: approx_percentile
        type: DOUBLE PRECISION
        description: The estimated value at the requested percentile.
  examples:
    - description: >
        Estimate the value at the first percentile, given a sample containing the
        numbers from 0 to 100.
      command:
        code: |
          SELECT
            approx_percentile(0.01, tdigest(data))
          FROM generate_series(0, 100) data;
      return:
        code: |
          approx_percentile
          -------------------
                      0.999
---

