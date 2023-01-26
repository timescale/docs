---
api_name: error()
excerpt: Get the maximum relative error for a `uddsketch`
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
  type: accessor
  aggregates:
    - uddsketch()
api_details:
  summary: >
    Get the maximum relative error of a `uddsketch`. The correct
    (non-estimated) percentile falls within the range defined by
    `approx_percentile(sketch) +/- (approx_percentile(sketch) * error(sketch))`.
  signatures:
    - language: sql
      code: |
        error(
          sketch UddSketch
        ) RETURNS DOUBLE PRECISION
  parameters:
    required:
      - name: sketch
        type: UddSketch
        description: The `uddsketch` to determine the error of.
    returns:
      - column: error
        type: DOUBLE PRECISION
        description: The maximum relative error of any percentile estimate.
  examples:
    - description: >
        Calculate the maximum relative error when estimating percentiles using
        `uddsketch`.
      command:
        code: |
          SELECT error(uddsketch(data))
          FROM generate_series(0, 100) data;
      return:
        code: |
          error
          -------
          0.001
---

