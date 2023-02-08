---
api_name: gauge_zero_time()
excerpt: Calculate the time when the gauge value is predicted to have been zero
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
    Calculate the time when the gauge value is modeled to have been zero.
    This is the x-intercept of the linear fit between gauge value and time.
  signatures:
    - language: sql
      code: |
        gauge_zero_time(
            summary GaugeSummary
        ) RETURNS TIMESTAMPTZ
  parameters:
    required:
      - name: summary
        type: GaugeSummary
        description: A gauge aggregate created using [`gauge_agg`](#gauge_agg)
    returns:
      - column: gauge_zero_time
        type: TIMESTAMPTZ
        description: The time when the gauge value is predicted to have been zero
  examples:
    - description: Estimate the time when the gauge started
      command:
        code: |
          SELECT
              id,
              bucket,
              gauge_zero_time(summary)
          FROM (
              SELECT
                  id,
                  time_bucket('15 min'::interval, ts) AS bucket,
                  gauge_agg(ts, val) AS summary
              FROM foo
              GROUP BY id, time_bucket('15 min'::interval, ts)
          ) t
---

