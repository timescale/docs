---
api_name: min_n()
excerpt: Find the smallest values in a set of data
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
    - min_n()
api_details:
  summary: |
    Construct an aggregate that keeps track of the smallest values passed 
    through it.
  signatures:
    - language: sql
      code: |
        min_n(
            value BIGINT | DOUBLE PRECISION | TIMESTAMPTZ,
            capacity BIGINT
        ) MinN
  parameters:
    required:
      - name: value
        type: BIGINT | DOUBLE PRECISION | TIMESTAMPTZ
        description: The values passed into the aggregate
      - name: capacity
        type: BIGINT
        description: The number of values to retain.
    returns:
      - column: min_n
        type: MinN
        description: >
          The compiled aggregate.  Note that the exact type is `MinInts`, `MinFloats`, or `MinTimes` depending on the input type
---

