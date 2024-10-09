---
api_name: max_n_by()
excerpt: Track the largest values and associated data in a set of values
topics: [hyperfunctions]
tags: [hyperfunctions, toolkit, maximum]
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
    - max_n_by()
api_details:
  summary: |
    Construct an aggregate that keeps track of the largest values passed 
    through it, as well as some associated data which is passed alongside the
    value.
  signatures:
    - language: sql
      code: |
        max_n_by(
            value BIGINT | DOUBLE PRECISION | TIMESTAMPTZ,
            data ANYELEMENT,
            capacity BIGINT
        ) MaxNBy
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
      - column: max_n_by
        type: MaxNBy
        description: >
          The compiled aggregate.  Note that the exact type will be MaxByInts, MaxByFloats, or MaxByTimes depending on the input type
---