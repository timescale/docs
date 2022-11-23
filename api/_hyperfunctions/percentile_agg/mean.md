---
api_name: mean()
excerpt: Calculate the mean from values in a percentile aggregate
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
    Calculate the exact mean of the values in a percentile aggregate. Unlike
    percentile calculations, the mean calculation is exact. This accessor
    allows you to calculate the mean alongside percentiles, without needing to
    create two separate aggregates from the same raw data.
  signatures:
    - language: sql
      code: |
        mean(
          sketch UddSketch
        ) RETURNS DOUBLE PRECISION
  parameters:
    required:
      - name: sketch
        type: UddSketch
        description: The percentile aggregate to extract the mean from.
    returns:
      - column: mean
        type: DOUBLE PRECISION
        description: The mean of the values in the percentile aggregate.
  examples:
    - description: >
        Calculate the mean of the integers from 0 to 100.
      command:
        code: |
          SELECT mean(percentile_agg(data))
          FROM generate_series(0, 100) data;
      return:
        code: |
          mean
          ------
          50
---

