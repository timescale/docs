---
api_name: open()
excerpt: Get the opening price from an OHLC aggregate
topics: [hyperfunctions]
tags: [hyperfunctions, finance, open]
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
  summary: Get the opening price from an OHLC aggregate.
  signatures:
      - language: sql
        code: |
          open(
            ohlc OpenHighLowClose
          ) RETURNS DOUBLE PRECISION
  parameters:
    required:
      - name: ohlc
        type: OpenHighLowClose
        description: An OpenHighLowClose aggregate.
    returns:
      - column: open
        type: DOUBLE PRECISION
        description: The opening price
---

