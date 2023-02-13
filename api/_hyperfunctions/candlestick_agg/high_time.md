---
api_name: high_time()
excerpt: Get the timestamp corresponding to the high time from a candlestick aggregate
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
  summary: Get the timestamp corresponding to the high time from a candlestick aggregate.
  signatures:
    - language: sql
      code: |
        high_time(
            candlestick Candlestick
        ) RETURNS TIMESTAMPTZ
  parameters:
    required:
      - name: candlestick
        type: Candlestick
        description: Candlestick aggregate
    returns:
      - column: high_time
        type: TIMESTAMPTZ
        description: The first time at which the high price occurred
---

