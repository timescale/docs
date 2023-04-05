---
api_name: approx_count_distinct()
excerpt: Aggregate data into a hyperloglog for approximate counting without specifying the number of buckets
topics: [hyperfunctions]
api:
  license: community
  type: function
  toolkit: true
  version:
    experimental: 1.8.0
    stable: 1.16.0
hyperfunction:
  family: approximate count distinct
  type: alternate aggregate
  aggregates:
    - hyperloglog()
api_details:
  summary: |
    This is an alternate first step for approximating the number of distinct
    values. It provides some added convenience by using some sensible default
    parameters to create a `hyperloglog`.
    
    Use `approx_count_distinct` to create an intermediate aggregate from your raw data.
    This intermediate form can then be used by one or more accessors in this
    group to compute final results. 
    
    Optionally, multiple such intermediate aggregate objects can be combined
    using [`rollup()`](#rollup) before an accessor is applied.
  signatures:
    - language: sql
      code: |
        approx_count_distinct(
            value AnyElement
        ) RETURNS Hyperloglog
  parameters:
    required:
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
        a `hyperloglog` over the `weights` column:
      command:
        code: SELECT toolkit_experimental.approx_count_distinct(weights) FROM samples;
    - description: >
        Using the same data, build a view from the aggregate that you can pass
        to other `hyperloglog` functions.
      command:
        code: CREATE VIEW hll AS SELECT toolkit_experimental.approx_count_distinct(data) FROM samples;
---

