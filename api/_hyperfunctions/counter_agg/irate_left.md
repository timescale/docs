---
api_name: irate_left()
excerpt: Calculate the instantaneous rate of change at the left, or earliest, edge of a counter aggregate
topics: [hyperfunctions]
api:
  license: community
  type: function
  toolkit: true
  experimental: false
  version:
    experimental: 0.2.0
    stable: 1.3.0
hyperfunction:
  family: counters and gauges
  type: accessor
  aggregates:
    - counter_agg()
api_details:
  summary: >
    Calculate the instantaneous rate of change at the left, or earliest, edge of a counter aggregate.
    This is equal to the second value minus the first value, divided by the time lapse between the
    two points, after accounting for resets. This calculation is useful for fast-moving counters.
  signatures:
    - language: sql
      code: |
        irate_left(
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
        description: The instantaneous rate of change at the left, or earliest, edge of the counter aggregate
  examples:
    - description: Get the instantaneous rate of change at the start of each 15-minute counter aggregate.
      command:
        code: |
          SELECT
              id,
              bucket,
              irate_left(summary)
          FROM (
              SELECT
                  id,
                  time_bucket('15 min'::interval, ts) AS bucket,
                  counter_agg(ts, val) AS summary
              FROM foo
              GROUP BY id, time_bucket('15 min'::interval, ts)
          ) t
---

