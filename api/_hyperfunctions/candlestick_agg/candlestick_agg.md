---
api_name: candlestick_agg()
excerpt: Aggregate tick data into an intermediate form for further calculation
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
    This function transforms the existing aggregate into the correct form for
    use with the candlestick accessors.
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

