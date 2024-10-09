---
api_name: mean()
excerpt: Calculate the exact mean from values in a `uddsketch`
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
    Calculate the exact mean of the values in a `uddsketch`. Unlike
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
        description: The `uddsketch` to extract the mean from.
    returns:
      - column: mean
        type: DOUBLE PRECISION
        description: The mean of the values in the `uddsketch`.
  examples:
    - description: >
        Calculate the mean of the integers from 0 to 100.
      command:
        code: |
          SELECT mean(uddsketch(data))
          FROM generate_series(0, 100) data;
      return:
        code: |
          mean
          ------
          50
---

