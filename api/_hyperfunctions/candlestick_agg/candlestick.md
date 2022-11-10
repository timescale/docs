---
api_name: candlestick()
excerpt: Transform pre-aggregated candlestick data into the correct form to use with `candlestick_agg` functions
topics: [hyperfunctions]
tags: [hyperfunctions, finance, candlestick, open, high, low, close]
api:
  license: community
  type: function
  experimental: true
  toolkit: true
  version:
    experimental: 1.12.0
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
        =======================TODO=======================
  parameters:
    required:
      - name: =======================TODO=======================
        type: =======================TODO=======================
        description: =======================TODO=======================
    returns:
      - column: =======================TODO=======================
        type: =======================TODO=======================
        description: >
          =======================TODO=======================
  examples:
    # put examples that only use this single function here, for examples that
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

