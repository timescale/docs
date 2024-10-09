---
api_name: rollup()
excerpt: Roll up multiple hyperloglogs
topics: [hyperfunctions]
api:
  license: community
  type: function
  toolkit: true
  version:
    experimental: 0.1.0
    stable: 1.3.0
hyperfunction:
  family: approximate count distinct
  type: rollup
  aggregates:
    - hyperloglog()
api_details:
  summary: >
    Combine multiple intermediate hyperloglog aggregates, produced by
    hyperloglog, into a single intermediate hyperloglog aggregate. For example,
    you can use `rollup` to combine hyperloglog from 15-minute buckets into
    daily buckets.
  signatures:
    - language: sql
      code: |
        rollup(
          hyperloglog Hyperloglog
        ) RETURNS Hyperloglog
  parameters:
    required:
      - name: hyperloglog
        type: Hyperloglog
        description: The hyperloglog aggregates to roll up.
    returns:
      - column: rollup
        type: Hyperloglog
        description: >
          A new hyperloglog aggregate created by combining the input hyperloglog
          aggregates.
---

