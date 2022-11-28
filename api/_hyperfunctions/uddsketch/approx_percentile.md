---
api_name: approx_percentile()
excerpt: Estimate the value at a given percentile from a `uddsketch`
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
    - uddsketch()
api_details:
  summary: Estimate the approximate value at a percentile from a `uddsketch` aggregate.
  signatures:
    - language: sql
      code: |
        approx_percentile(
          percentile DOUBLE PRECISION,
          uddsketch  UddSketch
        ) RETURNS DOUBLE PRECISION
  parameters:
    required:
      - name: percentile
        type: DOUBLE PRECISION
        description: The percentile to compute. Must be within the range `[0.0, 1.0]`.
      - name: sketch
        type: UddSketch
        description: The `uddsketch` aggregate.
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
            approx_percentile(0.01, uddsketch(data))
          FROM generate_series(0, 100) data;
      return:
        code: |
          approx_percentile
          -------------------
                      0.999
---

