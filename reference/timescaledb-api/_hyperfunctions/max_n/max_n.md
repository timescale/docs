---
api_name: max_n()
excerpt: Find the largest values in a set of data
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
    - max_n()
api_details:
  summary: |
    Construct an aggregate which will keep track of the largest values passed 
    through it.
  signatures:
    - language: sql
      code: |
        max_n(
            value BIGINT | DOUBLE PRECISION | TIMESTAMPTZ,
            capacity BIGINT
        ) MaxN
  parameters:
    required:
      - name: value
        type: BIGINT | DOUBLE PRECISION | TIMESTAMPTZ
        description: The values passed into the aggregate
      - name: capacity
        type: BIGINT
        description: The number of values to retain.
    returns:
      - column: max_n
        type: MaxN
        description: >
          The compiled aggregate.  Note that the exact type will be `MaxInts`, `MaxFloats`, or `MaxTimes` depending on the input type
---