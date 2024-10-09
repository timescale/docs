---
api_name: interpolated_rate()
excerpt: Calculate the rate of change in a gauge, interpolating values at boundaries as needed
topics: [hyperfunctions]
api:
  license: community
  type: function
  toolkit: true
  experimental: true
  version:
    experimental: 1.8.0
hyperfunction:
  family: counters and gauges
  type: accessor
  aggregates:
    - gauge_agg()
api_details:
  summary: >
    Calculate the rate of change in a gauge over a time period. Data points at the exact
    boundaries of the time period aren't needed. The function interpolates the
    gauge values at the boundaries from adjacent gauge aggregates if needed.
  signatures:
    - language: sql
      code: |
        interpolated_rate(
            summary GaugeSummary,
            start TIMESTAMPTZ,
            interval INTERVAL
            [, prev GaugeSummary]
            [, next GaugeSummary]
        ) RETURNS DOUBLE PRECISION
  parameters:
    required:
      - name: summary
        type: GaugeSummary
        description: A gauge aggregate created using [`gauge_agg`](#gauge_agg)
      - name: start
        type: TIMESTAMPTZ
        description: The start of the time period to compute the rate over
      - name: interval
        type: INTERVAL
        description: The length of the time period to compute the rate over
    optional:
      - name: prev
        type: GaugeSummary
        description: >
          The gauge aggregate from the previous interval, used to interpolate the value
          at `start`. If `NULL`, the first timestamp in `summary` is used as the start of the
          interval.
      - name: next
        type: GaugeSummary
        description: >
          The gauge aggregate from the next interval, used to interpolate the value
          at `start + interval`. If `NULL`, the last timestamp in `summary` is used as the end of the
          interval.    
    returns:
      - column: interpolated_rate
        type: DOUBLE PRECISION
        description: >
          The per-second rate of change of the gauge between the specified bounds. If exact values are missing in the raw data for the first and last points, these values are interpolated linearly from the neighboring gauge aggregates.
  examples:
    - description: >
        Calculate the per-second rate of change for each 15-minute interval, using interpolation
        to get the values at the interval boundaries if they don't exist in the data.
      command:
        code: |
          SELECT
              id,
              bucket,
              interpolated_rate(
                  summary,
                  bucket,
                  '15 min',
                  LAG(summary) OVER (PARTITION BY id ORDER by bucket),
                  LEAD(summary) OVER (PARTITION BY id ORDER by bucket)
              )
          FROM (
              SELECT
                  id,
                  time_bucket('15 min'::interval, ts) AS bucket,
                  gauge_agg(ts, val) AS summary
              FROM foo
              GROUP BY id, time_bucket('15 min'::interval, ts)
          ) t
---

