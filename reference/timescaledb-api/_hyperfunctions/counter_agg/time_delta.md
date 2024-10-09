---
api_name: time_delta()
excerpt: Calculate the difference between the first and last times from a counter aggregate
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
    Get the number of seconds between the first and last measurements in a counter aggregate
  signatures:
    - language: sql
      code: |
        time_delta(
            summary CounterSummary
        ) RETURNS DOUBLE PRECISION
  parameters:
    required:
      - name: summary
        type: CounterSummary
        description: A counter aggregate created using [`counter_agg`](#counter_agg)
    returns:
      - column: time_delta
        type: DOUBLE PRECISION
        description: The difference, in seconds, between the first and last times
  examples:
    - description: >
        Get the time difference between the first and last counter readings for each
        15-minute interval. Note this difference isn't necessarily equal to
        `15 minutes * 60 seconds / minute`, because the first and last readings might
        not fall exactly on the interval boundaries. 
      command:
        code: |
          SELECT
              id,
              bucket,
              time_delta(summary)
          FROM (
              SELECT
                  id,
                  time_bucket('15 min'::interval, ts) AS bucket,
                  counter_agg(ts, val) AS summary
              FROM foo
              GROUP BY id, time_bucket('15 min'::interval, ts)
          ) t
---

