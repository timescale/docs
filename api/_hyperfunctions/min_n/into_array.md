---
api_name: into_array()
excerpt: Returns an array of the lowest values from a MinN aggregate
topics: [hyperfunctions]
tags: [hyperfunctions, toolkit, minimum]
api:
  license: community
  type: function
  experimental: true
  toolkit: true
  version:
    experimental: 1.12.0
hyperfunction:
  family: minimum and maximum
  type: accessor
  aggregates:
    - min_n()
api_details:
  summary: |
    This will return the N lowest values seen by the aggregate. They will be 
    formatted as an array ordered in increasing order.
  signatures:
    - language: sql
      code: |
        into_array (
            agg MinN
        ) BIGINT[] | DOUBLE PRECISION[] | TIMESTAMPTZ[]
  parameters:
    required:
      - name: agg
        type: MinN
        description: >
          The aggregate to return the results from.  Note that the exact type 
          here will vary based on the type of data stored.
    returns:
      - column: into_array
        type: BIGINT[] | DOUBLE PRECISION[] | TIMESTAMPTZ[]
        description: >
          The lowest values seen while creating this aggregate.
  examples:
    - description: >
      Find the bottom 5 values from i * 13 % 10007 for i = 1 to 10000.
    command:
      language: sql
      code: |
        SELECT toolkit_experimental.into_array(
            toolkit_experimental.min_n(sub.val, 5))
        FROM (
          SELECT (i * 13) % 10007 AS val 
          FROM generate_series(1,10000) as i
        ) sub;
    return :
      language: sql
      code: |
        into_array            
        ---------------------------------
        {1,2,3,4,5}
---
