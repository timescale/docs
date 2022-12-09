
---
api_name: approx_percentile_array()
excerpt: Estimate the value for given percentiles from a `uddsketch`
topics: [hyperfunctions]
api:
  license: community
  type: function
  toolkit: true
hyperfunction:
  family: percentile approximation
  type: accessor
  aggregates:
    - uddsketch()
api_details:
  summary: Estimate the approximate values of an array of percentiles from a `uddsketch` aggregate.
  signatures:
    - language: sql
      code: |
        approx_percentile_array(
          percentiles DOUBLE PRECISION[],
          uddsketch  UddSketch
        ) RETURNS DOUBLE PRECISION[]
  parameters:
    required:
      - name: percentiles
        type: DOUBLE PRECISION[]
        description: Array of percentiles to compute. Must be within the range `[0.0, 1.0]`.
      - name: sketch
        type: UddSketch
        description: The `uddsketch` aggregate.
    returns:
      - column: approx_percentile_array
        type: DOUBLE PRECISION[]
        description: The estimated values at the requested percentiles.
  examples:
    - description: >
        Estimate the value at the first percentile, given a sample containing the
        numbers from 0 to 100.
      command:
        code: |
          SELECT
            approx_percentile_array(array[0.9,0.5,0.2], uddsketch(data))
          FROM generate_series(0, 100) data;
      return:
        code: |
          approx_percentile
          -------------------
           {9.0,5.0,2.0}
---
