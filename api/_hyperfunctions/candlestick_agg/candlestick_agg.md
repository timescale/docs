---
api_name: candlestick_agg()
excerpt: Aggregate tick data into an intermediate form for further calculation
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
  type: aggregate
  aggregates:
    - candlestick_agg()
api_details:
  summary: |
    This is the first step for performing financial calculations on raw tick
    data. Use `candlestick_agg` to create an intermediate aggregate from your
    tick data. This intermediate form can then be used by one or more accessors
    in this group to compute final results.
    
    Optionally, multiple such intermediate aggregate objects can be combined
    using [`rollup()`](#rollup) before an accessor is applied.

    If you're starting with pre-aggregated candlestick data rather than raw tick
    data, use the companion [`candlestick()`](#candlestick) function instead.
    This function transforms the existing aggregated data into the correct form
    for use with the candlestick accessors.
  signatures:
    - language: sql
      code: |
        candlestick_agg(
          ts TIMESTAMPTZ,
          price DOUBLE PRECISION,
          volume DOUBLE PRECISION
        ) RETURNS Candlestick
  parameters:
    required:
      - name: ts
        type: TIMESTAMPTZ
        description: Timestamp associated with stock price
      - name: price
        type: DOUBLE PRECISION
        description: Stock quote/price at the given time
      - name: volume
        type: DOUBLE PRECISION
        description: Volume of the trade
    returns:
      - column: agg
        type: Candlestick
        description: >
          An object storing `(timestamp, value)` pairs for each of the opening,
          high, low, and closing prices, in addition to information used to
          calculate the total volume and Volume Weighted Average Price.
---

