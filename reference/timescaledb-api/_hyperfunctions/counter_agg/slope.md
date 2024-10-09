---
api_name: slope()
excerpt: Calculate the slope from a counter aggregate
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
    Calculate the slope of the linear least-squares fit for a counter aggregate.
    The dependent variable is the counter value, adjusted for resets, and the
    independent variable is time. Time is always in seconds, so the slope estimates
    the per-second rate of change. This gives a result similar to [`rate`](#rate),
    but it can more accurately reflect the usual counter behavior in the presence of
    infrequent, abnormally large changes.
  signatures:
    - language: sql
      code: |
        slope(
            summary CounterSummary
        ) RETURNS DOUBLE PRECISION
  parameters:
    required:
      - name: summary
        type: CounterSummary
        description: A counter aggregate created using [`counter_agg`](#counter_agg)
    returns:
      - column: slope
        type: DOUBLE PRECISION
        description: The slope of the linear least-squares fit
  examples:
    - description: Calculate the counter slope per `id` and per 15-minute interval.
      command:
        code: |
          SELECT
              id,
              bucket,
              slope(summary)
          FROM (
              SELECT
                  id,
                  time_bucket('15 min'::interval, ts) AS bucket,
                  counter_agg(ts, val) AS summary
              FROM foo
              GROUP BY id, time_bucket('15 min'::interval, ts)
          ) t
---

