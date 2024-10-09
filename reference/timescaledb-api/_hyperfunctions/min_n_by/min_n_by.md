---
api_name: min_n_by()
excerpt: Track the smallest values and associated data in a set of values
topics: [hyperfunctions]
tags: [hyperfunctions, toolkit, minimum]
api:
  license: community
  type: function
  toolkit: true
  version:
    experimental: 1.12.0
    stable: 1.16.0
hyperfunction:
  family: minimum and maximum
  type: aggregate
  aggregates:
    - min_n_by()
api_details:
  summary: |
    Construct an aggregate that keeps track of the smallest values passed 
    through it, as well as some associated data which is passed alongside the
    value.
  signatures:
    - language: sql
      code: |
        min_n_by(
            value BIGINT | DOUBLE PRECISION | TIMESTAMPTZ,
            data ANYELEMENT,
            capacity BIGINT
        ) MinNBy
  parameters:
    required:
      - name: value
        type: BIGINT | DOUBLE PRECISION | TIMESTAMPTZ
        description: The values passed into the aggregate
      - name: data
        type: ANYELEMENT
        description: The data associated with a particular value
      - name: capacity
        type: BIGINT
        description: The number of values to retain.
    returns:
      - column: min_n_by
        type: MinNBy
        description: >
          The compiled aggregate.  Note that the exact type is `MinByInts`, `MinByFloats`, or `MinByTimes` depending on the input type
---