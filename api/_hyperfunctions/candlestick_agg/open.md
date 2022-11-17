---
api_name: open()
excerpt: Get the opening price from a candlestick aggregate
topics: [hyperfunctions]
tags: [hyperfunctions, finance, candlestick, open]
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
  summary: Get the opening price from a candlestick aggregate.
  signatures:
    - language: sql
      code: |
        open(
            candlestick Candlestick
        ) RETURNS DOUBLE PRECISION
  parameters:
    required:
      - name: candlestick
        type: Candlestick
        description: Candlestick aggregate
    returns:
      - column: open
        type: DOUBLE PRECISION
        description: The opening price
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

