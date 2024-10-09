---
api_name: high()
excerpt: Get the high price from a candlestick aggregate
topics: [hyperfunctions]
tags: [hyperfunctions, finance, candlestick, high]
api:
  license: community
  type: function
  experimental: false
  toolkit: true
  version:
    experimental: 1.12.0
    stable: 1.14.0
hyperfunction:
  family: financial analysis
  type: accessor
  aggregates:
    - candlestick_agg()
api_details:
  summary: Get the high price from a candlestick aggregate.
  signatures:
    - language: sql
      code: |
        high(
            candlestick Candlestick
        ) RETURNS DOUBLE PRECISION
  parameters:
    required:
      - name: candlestick
        type: Candlestick
        description: Candlestick aggregate
    returns:
      - column: high
        type: DOUBLE PRECISION
        description: The high price
---

