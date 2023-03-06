---
api_name: count_min_sketch()
excerpt: Aggregate data into a `CountMinSketch` for approximate counting
topics: [hyperfunctions]
api:
  license: community
  type: function
  toolkit: true
  experimental: true
  version:
    experimental: 1.8.0
hyperfunction:
  family: frequency analysis
  type: aggregate
  aggregates:
    - count_min_sketch()
api_details:
  summary: |
    Aggregate data into a `CountMinSketch` object, which you can use to estimate the number of times a given item appears in a column.
    The sketch produces a biased estimator of frequency.
    It might overestimate the item count, but it can't underestimate.

    You can control the relative error and the probability that the estimate falls outside the error bounds.
  signatures:
    - language: sql
      code: |
        count_min_sketch(
            values TEXT,
            error DOUBLE PRECISION,
            probability DOUBLE PRECISION,
        ) RETURNS CountMinSketch
  parameters:
    required:
      - name: values
        type: TEXT
        description: The column of values to count
      - name: error
        type: DOUBLE PRECISION
        description: Error tolerance in estimate, calculated relative to the number of values added to the sketch
      - name: probability
        type: DOUBLE PRECISION
        description: Probability that an estimate falls outside the error bounds
    returns:
      - column: count_min_sketch
        type: CountMinSketch
        description: An object storing a table of counters
---

