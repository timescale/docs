---
api_name: intercept()
excerpt: Calculate the y-intercept from a counter aggregate
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
    Calculate the y-intercept of a linear least-squares fit between counter value
    and time. This corresponds to the projected value at the PostgreSQL epoch
    `(2000-01-01 00:00:00+00)`. You can use the y-intercept with the slope to plot
    a best-fit line.
  signatures:
    - language: sql
      code: |
        intercept(
            summary CounterSummary
        ) RETURNS DOUBLE PRECISION
  parameters:
    required:
      - name: summary
        type: CounterSummary
        description: A counter aggregate created using [`counter_agg`](#counter_agg)
    returns:
      - column: intercept
        type: DOUBLE PRECISION
        description: The y-intercept of the linear least-squares fit
  examples:
    - description: Calculate the y-intercept of the linear fit for each 15-minute counter aggregate.
      command:
        code: |
          SELECT
              id,
              bucket,
              intercept(summary)
          FROM (
              SELECT
                  id,
                  time_bucket('15 min'::interval, ts) AS bucket,
                  counter_agg(ts, val) AS summary
              FROM foo
              GROUP BY id, time_bucket('15 min'::interval, ts)
          ) t
---

