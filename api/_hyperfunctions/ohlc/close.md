---
api_name: close()
excerpt: Get the closing price from an OHLC aggregate
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
  summary: Get the closing price from an OHLC aggregate.
  signatures:
    - language: sql
      code: |
        close(
          ohlc OpenHighLowClose
        ) RETURNS DOUBLE PRECISION
  parameters:
    required:
      - name: ohlc
        type: OpenHighLowClose
        description: An OpenHighLowClose aggregate.
    returns:
      - column: close
        type: DOUBLE PRECISION
        description: The closing price
---

