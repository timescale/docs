---
api_name: into_values()
excerpt: Returns the highest values and associated data from a MaxNBy aggregate
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
    - max_n_by()
api_details:
  summary: |
    This will return the largest values seen by the aggregate and the
    corresponding values associated with them. Note that PostgresQL requires
    an input argument with type matching the associated value in order to
    deterimine the response type.
  signatures:
    - language: sql
      code: |
        into_values(
          agg MaxNBy,
          dummy ANYELEMENT
        ) TABLE (
          value BIGINT | DOUBLE PRECISION | TIMESTAMPTZ,
          data ANYELEMENT
        )
  parameters:
    required:
      - name: agg
        type: MaxNBy
        description: >
          The aggregate to return the results from.  Note that the exact type 
          here varies based on the type of data stored.
      - name: dummy
        type: ANYELEMENT
        description: >
          This is purely to inform PostgresQL of the response type.  A NULL
          cast to the appropriate type is typical.
    returns:
      - column: into_values
        type: TABLE (value BIGINT | DOUBLE PRECISION | TIMESTAMPTZ, data ANYELEMENT)
        description: >
          The largest values and associated data seen while creating this aggregate.
  examples:
    - description: >
        Find the top 5 values from `i * 13 % 10007` for i = 1 to 10000, and the
        integer result of the operation that generated that modulus.
      command:
        language: sql
        code: |
          SELECT into_values(
              max_n_by(sub.mod, sub.div, 5),
              NULL::INT)
          FROM (
            SELECT (i * 13) % 10007 AS mod, (i * 13) / 10007 AS div
            FROM generate_series(1,10000) as i
          ) sub;
      return :
        language: sql
        code: |
          into_values 
          -------------
          (10006,3)
          (10005,7)
          (10004,11)
          (10003,2)
          (10002,6)
---

