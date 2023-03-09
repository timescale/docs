---
api_name: locf()
excerpt: Fill in missing values by carrying the last observed value forward
topics: [hyperfunctions]
api:
  license: community
  type: function
  version:
    stable: 1.1.1
hyperfunction:
  family: gapfilling
  type: interpolator
  bucket_function: time_bucket_gapfill()
api_details:
  summary: >
    Fill in missing values by carrying the last observed value forward.
    Use in the same query as [`time_bucket_gapfill`](#time_bucket_gapfill).
    `locf` cannot be nested inside another function call.
  signatures:
    - language: sql
      code: |
        locf(
          value ANY ELEMENT
          [, prev EXPRESSION]
          [, treat_null_as_missing BOOLEAN]
        ) RETURNS ANY ELEMENT
  parameters:
    required:
      - name: value
        type: ANY ELEMENT
        description: The value to carry forward
    optional:
      - name: prev
        type: EXPRESSION
        description: >
          If no previous value is available for gapfilling, use the `prev` lookup expression to get a previous value.
          For example, you can use `prev` to fill in the first bucket in a queried time range.
      - name: treat_null_as_missing
        type: BOOLEAN
        description: When `true`, `NULL` values are ignored, and only non-`NULL` values are carried forward.
    returns:
      - column: locf
        type: ANY ELEMENT
        description: The gapfilled value. The return type is the type of `value`.
---

