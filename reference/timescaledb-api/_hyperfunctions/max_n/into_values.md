---
api_name: into_values()
excerpt: Returns the highest values from a MaxN aggregate
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
  type: accessor
  aggregates:
    - max_n()
api_details:
  summary: |
    Return the N largest values seen by the aggregate.
  signatures:
    - language: sql
      code: |
        into_values (
            agg MaxN
        ) SETOF BIGINT | SETOF DOUBLE PRECISION | SETOF TIMESTAMPTZ
  parameters:
    required:
      - name: agg
        type: MaxN
        description: >
          The aggregate to return the results from.  Note that the exact type 
          here varies based on the type of data stored.
    returns:
      - column: into_values
        type: SETOF BIGINT | SETOF DOUBLE PRECISION | SETOF TIMESTAMPTZ
        description: >
          The largest values seen while creating this aggregate.
  examples:
    - description: >
        Find the top 5 values from `i * 13 % 10007` for i = 1 to 10000.
      command:
        language: sql
        code: |
          SELECT into_values(
              max_n(sub.val, 5))
          FROM (
            SELECT (i * 13) % 10007 AS val 
            FROM generate_series(1,10000) as i
          ) sub;
      return :
        language: sql
        code: |
          into_values 
          -------------
          10006
          10005
          10004
          10003
          10002
---

