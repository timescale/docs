---
api_name: hyperloglog()
excerpt: Aggregate data into a hyperloglog for approximate counting
topics: [hyperfunctions]
api:
  license: community
  type: function
  toolkit: true
  version:
    experimental: 0.1.0
    stable: 1.3.0
hyperfunction:
  family: approximate count distinct
  type: aggregate
  aggregates:
    - hyperloglog()
api_details:
  summary: |
    This is the first step for estimating the approximate number of distinct
    values using the `hyperloglog` algorithm. Use `hyperloglog` to create an
    intermediate aggregate from your raw data. This intermediate form can then
    be used by one or more accessors in this group to compute final results.
    
    Optionally, multiple such intermediate aggregate objects can be combined
    using [`rollup()`](#rollup) before an accessor is applied.

    If you're not sure what value to set for `buckets`, try using the alternate
    aggregate function, [`approx_count_distinct()`](#approx_count_distinct).
    `approx_count_distinct` also creates a `hyperloglog`, but it sets a
    default bucket value that should work for many use cases.
  signatures:
    - language: sql
      code: |
        hyperloglog(
            buckets INTEGER,
            value AnyElement
        ) RETURNS Hyperloglog
  parameters:
    required:
      - name: buckets
        type: INTEGER
        description: >
          Number of buckets in the hyperloglog. Increasing the number of buckets improves accuracy but increases memory use. Value is rounded up to the next power of 2, and must be between 2^4 (16) and 2^18. Setting a value less than 2^10 (1,024) may result in poor accuracy if the true cardinality is high and is not recommended. If unsure, start experimenting with 8,192 (2^13) which has an approximate error rate of 1.15%.
      - name: value
        type: AnyElement
        description: >
          The column containing the elements to count. The type must have an
          extended, 64-bit, hash function.
    returns:
      - column: hyperloglog
        type: Hyperloglog
        description: >
          A `hyperloglog` object which can be passed to other hyperloglog APIs
          for rollups and final calculation
  examples:
    - description: >
        Given a table called `samples`, with a column called `weights`, return
        a `hyperloglog` over the `weights` column.
      command:
        code: SELECT hyperloglog(32768, weights) FROM samples;
    - description: >
        Using the same data, build a view from the aggregate that you can pass
        to other `hyperloglog` functions.
      command:
        code: CREATE VIEW hll AS SELECT hyperloglog(32768, data) FROM samples;
---

