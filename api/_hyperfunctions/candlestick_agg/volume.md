---
api_name: volume()
excerpt: Get the total volume from a candlestick aggregate
topics: [hyperfunctions]
tags: [hyperfunctions, finance, candlestick, volume]
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
  summary: Get the total volume from a candlestick aggregate.
  signatures:
    - language: sql
      code: |
        volume(
            candlestick Candlestick
        ) RETURNS DOUBLE PRECISION
  parameters:
    required:
      - name: candlestick
        type: Candlestick
        description: Candlestick aggregate
    returns:
      - column: volume
        type: DOUBLE PRECISION
        description: Total volume of trades within the period
---

