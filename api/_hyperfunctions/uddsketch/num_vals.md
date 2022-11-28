---
api_name: num_vals()
excerpt: Get the number of values contained in a `uddsketch`
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
    Get the number of values contained in a `uddsketch`. This accessor
    allows you to calculate a count alongside percentiles, without needing to
    create two separate aggregates from the same raw data.
  signatures:
    - language: sql
      code: |
        num_vals(
          sketch UddSketch
        ) RETURNS DOUBLE PRECISION
  parameters:
    required:
      - name: sketch
        type: UddSketch
        description: The `uddsketch` to extract the number of values from.
    returns:
      - column: num_vals
        type: DOUBLE PRECISION
        description: The number of values in the `uddsketch`.
  examples:
    - description: >
        Count the number of integers from 0 to 100.
      command:
        code: |
          SELECT num_vals(uddsketch(data))
          FROM generate_series(0, 100) data;
      return:
        code: |
          num_vals
          -----------
              101
---

