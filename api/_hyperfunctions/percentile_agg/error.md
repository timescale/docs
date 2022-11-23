---
api_name: error()
excerpt: Get the maximum relative error for a percentile estimate
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
    - percentile_agg()
api_details:
  summary: >
    Calculate the maximum relative error of a percentile estimate. The correct
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
        description: The percentile aggregate to determine the error of.
    returns:
      - column: error
        type: DOUBLE PRECISION
        description: The maximum relative error of any percentile estimate.
  examples:
    - description: >
        Calculate the maximum relative error when estimating percentiles from a
        percentile aggregate.
      command:
        code: |
          SELECT error(percentile_agg(data))
          FROM generate_series(0, 100) data;
      return:
        code: |
          error
          -------
          0.001
---

