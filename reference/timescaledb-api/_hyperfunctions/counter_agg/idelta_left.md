---
api_name: idelta_left()
excerpt: Calculate the instantaneous change at the left, or earliest, edge of a counter aggregate
topics: [hyperfunctions]
api:
  license: community
  type: function
  toolkit: true
  experimental: false
  version:
    stable: 1.3.0
hyperfunction:
  family: counters and gauges
  type: accessor
  aggregates:
    - counter_agg()
api_details:
  summary: >
    Calculate the instantaneous change at the left, or earliest, edge of a counter aggregate.
    This is equal to the second value minus the first value, after accounting for resets.
  signatures:
    - language: sql
      code: |
        idelta_left(
          summary CounterSummary
        ) RETURNS DOUBLE PRECISION
  parameters:
    required:
      - name: summary
        type: CounterSummary
        description: A counter aggregate created using [`counter_agg`](#counter_agg)
    returns:
      - column: idelta_left
        type: DOUBLE PRECISION
        description: The instantaneous delta at the left, or earliest, edge of the counter aggregate
  examples:
    - description: Get the instantaneous change at the start of each 15-minute counter aggregate.
      command:
        code: |
          SELECT
              id,
              bucket,
              idelta_left(summary)
          FROM (
              SELECT
                  id,
                  time_bucket('15 min'::interval, ts) AS bucket,
                  counter_agg(ts, val) AS summary
              FROM foo
              GROUP BY id, time_bucket('15 min'::interval, ts)
          ) t
---

