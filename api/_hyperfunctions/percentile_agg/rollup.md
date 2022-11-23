---
api_name: rollup()
excerpt: Roll up multiple percentile aggregates
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
    - percentile_agg()
api_details:
  summary: >
    Combine multiple intermediate percentile aggregates, produced by
    `percentile_agg`, into a single intermediate aggregate. For example, you can
    use `rollup` to combine percentile aggregates from 15-minute buckets into
    daily buckets.
  signatures:
    - language: sql
      code: |
        rollup(
          sketch UddSketch
        ) RETURNS UddSketch
  parameters:
    required:
      - name: sketch
        type: UddSketch
        description: The percentile aggregates to roll up.
    returns:
      - column: rollup
        type: UddSketch
        description: >
          A new percentile aggregate created by combining the input percentile
          aggregates.
---

