---
api_name: vwap()
excerpt: Get the Volume Weighted Average Price from a candlestick aggregate
topics: [hyperfunctions]
tags: [hyperfunctions, finance, candlestick, average, volume]
api:
  license: community
  type: function
  experimental: true
  toolkit: true
  version:
    experimental: 1.12.0
hyperfunction:
  family: financial analysis
  type: accessor
  aggregates:
    - candlestick_agg()
api_details:
  summary: |
    Get the Volume Weighted Average Price from a candlestick aggregate.

    For Candlesticks constructed from data that is already aggregated, the Volume
    Weighted Average Price is calculated using the typical price for each period
    (where the typical price refers to the arithmetic mean of the high, low, and
    closing prices).
  signatures:
    - language: sql
      code: |
        vwap(
            candlestick Candlestick
        ) RETURNS DOUBLE PRECISION
  parameters:
    required:
      - name: candlestick
        type: Candlestick
        description: Candlestick aggregate
    returns:
      - column: vwap
        type: DOUBLE PRECISION
        description: The volume weighted average price
  examples:
    # put examples that only use this single function here. for examples that
    # use multiple functions from this family, put them in examples.md, which
    # you can write as a normal freeform text doc
    # 
    # can delete the examples section if you only want to use examples.md
    - description: >
        =======================TODO=======================
      command:
        language: sql
        code: |
          =======================TODO=======================
---
