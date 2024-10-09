---
api_name: approx_count()
excerpt: Estimate the number of times a value appears from a `CountMinSketch`
topics: [hyperfunctions]
api:
  license: community
  type: function
  toolkit: true
  experimental: true
  version:
    experimental: 1.8.0
hyperfunction:
  family: frequency analysis
  type: accessor
  aggregates:
    - count_min_sketch()
api_details:
  summary: Estimate the number of times a given text value appears in a column.
  signatures:
    - language: sql
      code: |
        approx_count (
            item TEXT,
            agg CountMinSketch
        ) RETURNS INTEGER
  parameters:
    required:
      - name: item
        type: TEXT
        description: The value you want to estimate occurrences of
      - name: agg
        type: CountMinSketch
        description: A `CountMinSketch` object created using [`count_min_sketch`](#count_min_sketch)
    returns:
      - column: approx_count
        type: INTEGER
        description: The estimated number of times `item` appeared in the sketch
  examples:
    - description: Given a table of stock data, estimate how many times the symbol `AAPL` appears.
      command:
        code: |
          WITH t AS (
            SELECT toolkit_experimental.count_min_sketch(symbol, 0.01, 0.01) AS symbol_sketch
            FROM stocks_real_time
          )
          SELECT toolkit_experimental.approx_count('AAPL', symbol_sketch)
          FROM t;
---

