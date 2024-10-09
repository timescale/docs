---
api_name: rollup()
excerpt: Roll up multiple Candlestick aggregates
topics: [hyperfunctions]
tags: [hyperfunctions, finance, candlestick]
api:
  license: community
  type: function
  experimental: false
  toolkit: true
  version:
    experimental: 1.12.0
hyperfunction:
  family: financial analysis
  type: rollup
  aggregates:
    - candlestick_agg()
api_details:
  summary: >
    Combine multiple intermediate candlestick aggregates, produced by
    `candlestick_agg` or `candlestick`, into a single intermediate candlestick
    aggregate. For example, you can use `rollup` to combine candlestick
    aggregates from 15-minute buckets into daily buckets.
  signatures:
    - language: sql
      code: |
        rollup(
          candlestick Candlestick
        ) RETURNS Candlestick
  parameters:
    required:
      - name: candlestick
        type: Candlestick
        description: The aggregate produced by a `candlestick` or `candlestick_agg` call
    returns:
      - column: candlestick
        type: Candlestick
        description: >
          A new candlestick aggregate produced by combining the input candlestick aggregates
---