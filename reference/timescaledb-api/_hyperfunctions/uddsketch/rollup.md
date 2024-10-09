---
api_name: rollup()
excerpt: Roll up multiple `uddsketch`es
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
    - uddsketch()
api_details:
  summary: >
    Combine multiple intermediate `uddsketch` aggregates, produced by
    `uddsketch`, into a single intermediate `uddsketch` aggregate. For example,
    you can use `rollup` to combine `uddsketch`es from 15-minute buckets into
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
        description: The `uddsketch` aggregates to roll up.
    returns:
      - column: rollup
        type: UddSketch
        description: >
          A new `uddsketch` aggregate created by combining the input `uddsketch`
          aggregates.
---

