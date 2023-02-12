---
api_name: slope()
excerpt: Calculate the slope from a gauge aggregate
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
    Calculate the slope of the linear least-squares fit for a gauge aggregate.
    The dependent variable is the gauge value, and the
    independent variable is time. Time is always in seconds, so the slope estimates
    the per-second rate of change. This gives a result similar to [`rate`](#rate),
    but it can more accurately reflect the usual gauge behavior in the presence of
    infrequent, abnormally large changes.
  signatures:
    - language: sql
      code: |
        slope(
            summary GaugeSummary
        ) RETURNS DOUBLE PRECISION
  parameters:
    required:
      - name: summary
        type: GaugeSummary
        description: A gauge aggregate created using [`gauge_agg`](#gauge_agg)
    returns:
      - column: slope
        type: DOUBLE PRECISION
        description: The slope of the linear least-squares fit
  examples:
    - description: Calculate the gauge slope per `id` and per 15-minute interval.
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
                  gauge_agg(ts, val) AS summary
              FROM foo
              GROUP BY id, time_bucket('15 min'::interval, ts)
          ) t
---

