---
api_name: candlestick()
excerpt: Transform pre-aggregated candlestick data into the correct form to use with `candlestick_agg` functions
topics: [hyperfunctions]
tags: [hyperfunctions, finance, candlestick, open, high, low, close]
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
  type: pseudo-aggregate
  aggregates:
    - candlestick_agg()
api_details:
  summary: |
    This function transforms pre-aggregated candlestick data into a candlestick
    aggregate object. This object contains the data in the correct form to use
    with the accessors and rollups in this function group.

    If you're starting with raw tick data rather than candlestick data, use
    [`candlestick_agg()`](#candlestick_agg) instead.
  signatures:
    - language: sql
      code: |
        candlestick(
          ts TIMESTAMPTZ,
          open DOUBLE PRECISION,
          high DOUBLE PRECISION,
          low DOUBLE PRECISION,
          close DOUBLE PRECISION,
          volume DOUBLE PRECISION
        ) RETURNS Candlestick
  parameters:
    required:
      - name: ts
        type: TIMESTAMPTZ
        description: Timestamp associated with stock price
      - name: open
        type: DOUBLE PRECISION
        description: Opening price of candlestick
      - name: high
        type: DOUBLE PRECISION
        description: High price of candlestick
      - name: low
        type: DOUBLE PRECISION
        description: Low price of candlestick
      - name: close
        type: DOUBLE PRECISION
        description: Closing price of candlestick
      - name: volume
        type: DOUBLE PRECISION
        description: Total volume of trades during the candlestick period
    returns:
      - column: agg
        type: Candlestick
        description: >
          An object storing `(timestamp, value)` pairs for each of the opening,
          high, low, and closing prices, in addition to information used to
          calculate the total volume and Volume Weighted Average Price.
---

