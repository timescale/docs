---
api_name: extrapolated_rate()
excerpt: Calculate the extrapolated rate of change from a gauge aggregate
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
  summary: |
    Calculate the rate of change of a gauge during the time period specified by the bounds
    in the gauge aggregate. The bounds must be specified for the `extrapolated_rate`
    function to work. You can provide them as part of the original [`gauge_agg`](#gauge_agg)
    call, or by using the [`with_bounds`](#with_bounds) function on an existing
    gauge aggregate.
  signatures:
    - language: sql
      code: |
        extrapolated_rate(
            summary GaugeSummary,
            method TEXT
        ) RETURNS DOUBLE PRECISION
  parameters:
    required:
      - name: summary
        type: GaugeSummary
        description: A gauge aggregate created using [`gauge_agg`](#gauge_agg)
      - name: method
        type: TEXT
        description: |
          The extrapolation method to use. Not case-sensitive. The only allowed value
          is `prometheus`, for the Prometheus extrapolation protocol.
    returns:
      - column: extrapolated_rate
        type: DOUBLE PRECISION
        description: The extrapolated rate of change of the gauge over the timer period of the gauge aggregate.
  examples:
    - description: 
      command:
        code: |
          SELECT
              id,
              bucket,
              extrapolated_rate(
                  with_bounds(
                      summary,
                      toolkit_experimental.time_bucket_range('15 min'::interval, bucket)
                  ),'prometheus'
              )
          FROM (
              SELECT
                  id,
                  time_bucket('15 min'::interval, ts) AS bucket,
                  gauge_agg(ts, val) AS summary
              FROM foo
              GROUP BY id, time_bucket('15 min'::interval, ts)
          ) t;
---

