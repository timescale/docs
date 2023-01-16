---
api_name: rollup()
excerpt: Roll up multiple OHLC aggregates
topics: [hyperfunctions]
tags: [hyperfunctions, finance]
api:
  license: community
  type: function
  experimental: true
  toolkit: true
  version:
    experimental: 1.10.1
hyperfunction:
  family: financial analysis
  type: rollup
  aggregates:
    - ohlc()
api_details:
  summary: >
    Combine multiple intermediate OHLC aggregates, produced by `ohlc`, into a
    single intermediate OHLC aggregate. For example, you can use `rollup` to
    combine OHLC aggregates from 15-minute buckets into daily buckets.
  signatures:
    - language: sql
      code: |
        rollup(
          ohlc OpenHighLowClose
        ) RETURNS OpenHighLowClose
  parameters:
    required:
      - name: ohlc
        type: OpenHighLowClose
        description: The aggregate produced by an `ohlc` call
    returns:
      - column: ohlc
        type: OpenHighLowClose
        description: >
          A new OHLC aggregate produced by combining the input OHLC aggregates
---

