---
api_name: low_time()
excerpt: Get the timestamp corresponding to the low time from a candlestick aggregate
topics: [hyperfunctions]
tags: [hyperfunctions, finance, candlestick, low]
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
  summary: Get the timestamp corresponding to the low time from a candlestick aggregate.
  signatures:
    - language: sql
      code: |
        low_time(
            candlestick Candlestick
        ) RETURNS TIMESTAMPTZ
  parameters:
    required:
      - name: candlestick
        type: Candlestick
        description: Candlestick aggregate
    returns:
      - column: low_time
        type: TIMESTAMPTZ
        description: The first time at which the low price occurred
---

