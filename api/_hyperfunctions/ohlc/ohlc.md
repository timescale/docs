---
api_name: ohlc()
excerpt: Aggregate financial asset data into an intermediate form for further calculation
topics: [hyperfunctions]
tags: [hyperfunctions, finance, open, high, low, close]
api:
  license: community
  type: function
  experimental: true
  toolkit: true
  version:
    experimental: 1.10.1
hyperfunction:
  family: financial analysis
  type: aggregate
  aggregates:
    - ohlc()
api_details:
  summary: |
    This is the first step for performing financial calculations on asset
    prices. Use `ohlc` to create an intermediate aggregate from your price data. This intermediate form can then be used by one or more accessors in this
    group to compute final results.
    
    Optionally, multiple such intermediate aggregate objects can be combined
    using [`rollup()`](#rollup) before an accessor is applied.
  signatures:
    - language: sql
      code: |
        ohlc(
          ts TIMESTAMPTZ,
          price DOUBLE PRECISION
        ) RETURNS OpenHighLowClose
  parameters:
    required:
      - name: ts
        type: TIMESTAMPTZ
        description: Timestamp associated with stock price
      - name: price
        type: DOUBLE PRECISION
        description: Stock quote price at the given time
    returns:
      - column: agg
        type: OpenHighLowClose
        description: >
          An object storing `(timestamp, value)` pairs for each of the opening,
          high, low, and closing prices.
  examples:
    - description: >
        Create a continuous aggregate on some stock data. Store the asset prices
        for each bucket.
      command:
        language: sql
        code: |
          CREATE MATERIALIZED VIEW ohlc
          WITH (timescaledb.continuous) AS
          SELECT time_bucket('1 minute'::interval, "time") AS ts,
            symbol,
            toolkit_experimental.ohlc("time", price)
          FROM stocks_real_time
          GROUP BY ts, symbol
---

