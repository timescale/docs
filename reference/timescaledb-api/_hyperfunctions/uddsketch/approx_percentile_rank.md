---
api_name: approx_percentile_rank()
excerpt: Estimate the percentile of a given value from a `uddsketch`
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
  summary: Estimate the percentile at which a given value would be located.
  signatures:
    - language: sql
      code: |
        approx_percentile_rank(
          value DOUBLE PRECISION,
          sketch UddSketch
        ) RETURNS DOUBLE PRECISION
  parameters:
    required:
      - name: value
        type: DOUBLE PRECISION
        description: The value to estimate the percentile of.
      - name: sketch
        type: UddSketch
        description: The `uddsketch` aggregate.
    returns:
      - column: approx_percentile_rank
        type: DOUBLE PRECISION
        description: The estimated percentile associated with the provided value.
  examples:
    - description: >
        Estimate the percentile rank of the value `99`, given a sample containing
        the numbers from 0 to 100.
      command:
        code: |
          SELECT
            approx_percentile_rank(99, uddsketch(data))
          FROM generate_series(0, 100) data;
      return:
        code: |
          approx_percentile_rank
          ----------------------------
                  0.9851485148514851
---

