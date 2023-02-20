---
api_name: first_time()
excerpt: Get the first timestamp from a counter aggregate
topics: [hyperfunctions]
api:
  license: community
  type: function
  toolkit: true
  experimental: false
  version:
    stable: 1.11.0
hyperfunction:
  family: counters and gauges
  type: accessor
  aggregates:
    - counter_agg()
api_details:
  summary: Get the first timestamp from a counter aggregate.
  signatures:
    - language: sql
      code: |
        first_time(
            cs CounterSummary
        ) RETURNS TIMESTAMPTZ
  parameters:
    required:
      - name: cs
        type: CounterSummary
        description: A counter aggregate produced using [`counter_agg`](#counter_agg)
    returns:
      - column: first_time
        type: TIMESTAMPTZ
        description: The timestamp of the first point in the counter aggregate
  examples:
    - description: Get the first and last point of each daily counter aggregate.
      command:
        code: |
          WITH t as (
            SELECT
                time_bucket('1 day'::interval, ts) as dt,
                counter_agg(ts, val) AS cs -- get a CounterSummary
            FROM table
            GROUP BY time_bucket('1 day'::interval, ts)
          )
          SELECT
              dt,
              first_time(cs) -- extract the timestamp of the first point in the CounterSummary
              last_time(cs) -- extract the timestamp of the last point in the CounterSummary
          FROM t;
---

