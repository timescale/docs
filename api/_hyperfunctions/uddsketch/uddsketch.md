---
api_name: uddsketch()
excerpt: Aggregate data in a `uddsketch` for further calculation of percentile estimates
topics: [hyperfunctions]
api:
  license: community
  type: function
  toolkit: true
  version:
    experimental: 0.1.0
    stable: 1.0.0
hyperfunction:
  family: percentile approximation
  type: aggregate
  aggregates:
    - uddsketch()
api_details:
  summary: |
    This is the first step for calculating approximate percentiles with the
    `uddsketch` algorithm. Use `uddsketch` to create an intermediate aggregate
    from your raw data. This intermediate form can then be used by one or more
    accessors in this group to compute final results.
    
    Optionally, multiple such intermediate aggregate objects can be combined
    using [`rollup()`](#rollup) before an accessor is applied.

    If you aren't sure what values to set for `size` and `max_error`, try using
    the alternate aggregate function, [`percentile_agg()`](#percentile_agg).
    `percentile_agg` also creates a `UddSketch`, but it sets some sensible
    default values for `size` and `max_error` that should work for many use
    cases.
  signatures:
    - language: sql
      code: |
        uddsketch(
            size INTEGER,
            max_error DOUBLE PRECISION,
            value DOUBLE PRECISION
        ) RETURNS UddSketch
  parameters:
    required:
      - name: size
        type: INTEGER
        description: >
          Maximum number of buckets in the `uddsketch`. Providing a larger value
          here makes it more likely that the aggregate is able to maintain the
          desired error, but potentially increases the memory usage.
      - name: max_error
        type: DOUBLE PRECISION
        description: >
          The desired maximum relative error of the sketch. The true error may
          exceed this if too few buckets are provided for the data distribution.
          You can get the true error using the [`error`](#error) function.
      - name: value
        type: DOUBLE PRECISION
        description: The column to aggregate for further calculation.
    returns:
      - column: uddsketch
        type: UddSketch
        description: >
          A percentile estimator object created to calculate percentiles using
          the `uddsketch` algorithm
  examples:
    - description: >
        Given a table called `samples`, with a column called `data`, build a
        `uddsketch` using the `data` column. Use a maximum of 100 buckets and a
        relative error of 0.01.
      command:
        code: SELECT uddsketch(100, 0.01, data) FROM samples;
---

