---
api_name: intercept()
excerpt: Calculate the y-intercept from a gauge aggregate
topics: [hyperfunctions]
api:
  license: community
  type: function
  toolkit: true
  experimental: true
  version:
    experimental: 1.6.0
hyperfunction:
  family: counters and gauges
  type: accessor
  aggregates:
    - gauge_agg()
api_details:
  summary: >
    Calculate the y-intercept of a linear least-squares fit between gauge value
    and time. This corresponds to the projected value at the PostgreSQL epoch
    `(2000-01-01 00:00:00+00)`. You can use the y-intercept with the slope to plot
    a best-fit line.
  signatures:
    - language: sql
      code: |
        intercept(
            summary GaugeSummary
        ) RETURNS DOUBLE PRECISION
  parameters:
    required:
      - name: summary
        type: GaugeSummary
        description: A gauge aggregate created using [`gauge_agg`](#gauge_agg)
    returns:
      - column: intercept
        type: DOUBLE PRECISION
        description: The y-intercept of the linear least-squares fit
  examples:
    - description: Calculate the y-intercept of the linear fit for each 15-minute gauge aggregate.
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
                  gauge_agg(ts, val) AS summary
              FROM foo
              GROUP BY id, time_bucket('15 min'::interval, ts)
          ) t
---

