---
api_name: rollup()
excerpt: Roll up multiple `tdigest`s
topics: [hyperfunctions]
api:
  license: community
  type: function
  toolkit: true
  version:
    experimental: 0.3.0
    stable: 1.0.0
hyperfunction:
  family: percentile approximation
  type: rollup
  aggregates:
    - tdigest()
api_details:
  summary: >
    Combine multiple intermediate `tdigest` aggregates, produced by `tdigest`,
    into a single intermediate `tdigest` aggregate. For example, you can use
    `rollup` to combine `tdigest`s from 15-minute buckets into daily buckets.
  signatures:
    - language: sql
      code: |
        rollup(
          digest TDigest
        ) RETURNS TDigest
  parameters:
    required:
      - name: digest
        type: TDigest
        description: The `tdigest`s to roll up.
    returns:
      - column: rollup
        type: TDigest
        description: >
          A new `tdigest` created by combining the input `tdigests`.
---

