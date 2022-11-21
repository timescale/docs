---
api_name: high()
excerpt: Get the high price from an OHLC aggregate
topics: [hyperfunctions]
tags: [hyperfunctions, finance, high]
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
  summary: Get the high price from an OHLC aggregate.
  signatures:
    - language: sql
      code: |
        high(
          ohlc OpenHighLowClose
        ) RETURNS DOUBLE PRECISION
  parameters:
    required:
      - name: ohlc
        type: OpenHighLowClose
        description: An OpenHighLowClose aggregate.
    returns:
      - column: high
        type: DOUBLE PRECISION
        description: The high price
---

