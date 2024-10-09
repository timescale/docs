---
api_name: into_array()
excerpt: Returns an array of the highest values from a MaxN aggregate
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
    Return the N largest values seen by the aggregate. The values are formatted 
    as an array in decreasing order.
  signatures:
    - language: sql
      code: |
        into_array (
            agg MaxN
        ) BIGINT[] | DOUBLE PRECISION[] | TIMESTAMPTZ[]
  parameters:
    required:
      - name: agg
        type: MaxN
        description: >
          The aggregate to return the results from.  Note that the exact type 
          here varies based on the type of data stored in the aggregate.
    returns:
      - column: into_array
        type: BIGINT[] | DOUBLE PRECISION[] | TIMESTAMPTZ[]
        description: >
          The largest values seen while creating this aggregate.
  examples:
    - description: >
        Find the top 5 values from `i * 13 % 10007` for i = 1 to 10000.
      command:
        language: sql
        code: |
          SELECT into_array(
              max_n(sub.val, 5))
          FROM (
            SELECT (i * 13) % 10007 AS val 
            FROM generate_series(1,10000) as i
          ) sub;
      return :
        language: sql
        code: |
          into_array            
          ---------------------------------
          {10006,10005,10004,10003,10002}
---

