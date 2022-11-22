---
api_name: close_time()
excerpt: Get the timestamp corresponding to the closing time from an OHLC aggregate
topics: [hyperfunctions]
tags: [hyperfunctions, finance, close]
api:
  license: community
  type: function
  experimental: true
  toolkit: true
  version:
    experimental: 1.10.1
hyperfunction:
  family: financial analysis
  type: accessor
  aggregates:
    - ohlc()
api_details:
  summary: Get the timestamp corresponding to the closing time from an OHLC aggregate.
  signatures:
    - language: sql
      code: |
        close_time(
          ohlc OpenHighLowClose
        ) RETURNS TIMESTAMPTZ
  parameters:
    required:
      - name: ohlc
        type: OpenHighLowClose
        description: An OpenHighLowClose aggregate.
    returns:
      - column: close_time
        type: TIMESTAMPTZ
        description: The time at which the closing price occurred
---