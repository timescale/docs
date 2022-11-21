---
api_name: low()
excerpt: Get the low price from an OHLC aggregate
topics: [hyperfunctions]
tags: [hyperfunctions, finance, low]
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
  summary: Get the low price from an OHLC aggregate.
  signatures:
    - language: sql
      code: |
        low(
          ohlc OpenHighLowClose
        ) RETURNS DOUBLE PRECISION
  parameters:
    required:
      - name: ohlc
        type: OpenHighLowClose
        description: An OpenHighLowClose aggregate.
    returns:
      - column: low
        type: DOUBLE PRECISION
        description: The low price
---

