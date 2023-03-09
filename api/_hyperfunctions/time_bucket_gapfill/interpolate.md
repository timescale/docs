---
api_name: interpolate()
excerpt: Fill in missing values by linear interpolation
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
    Fill in missing values by linear interpolation.
    Use in the same query as [`time_bucket_gapfill`](#time_bucket_gapfill).
    `interpolate` cannot be nested inside another function call.
  signatures:
    - language: sql
      code: |
        interpolate(
          value SMALLINT | INTEGER | BIGINT | REAL | DOUBLE PRECISION
          [, prev EXPRESSION]
          [, next EXPRESSION]
        ) RETURNS SMALLINT | INTEGER | BIGINT | REAL | DOUBLE PRECISION
  parameters:
    required:
      - name: value
        type: SMALLINT | INTEGER | BIGINT | REAL | DOUBLE PRECISION
        description: The value to interpolate
    optional:
      - name: prev
        type: EXPRESSION
        description: >
          If no previous value is available for gapfilling, use the `prev` lookup expression to get a previous value.
          For example, you can use `prev` to fill in the first bucket in a queried time range.
          The expression must return a `(time, value)` tuple with types corresponding to the bucketed times and values.
      - name: next
        type: EXPRESSION
        description: >
          If no next value is available for gapfilling, use the `next` lookup expression to get a next value.
          For example, you can use `next` to fill in the last bucket in a queried time range.
          The expression must return a `(time, value)` tuple with types corresponding to the bucketed times and values.
    returns:
      - column: interpolate
        type: SMALLINT | INTEGER | BIGINT | REAL | DOUBLE PRECISION
        description: The gapfilled value. The return type is the type of `value`.
---

