---
api_name: interpolated_delta()
excerpt: Calculate the change in a counter, interpolating values at boundaries as needed
topics: [hyperfunctions]
api:
  license: community
  type: function
  toolkit: true
  experimental: false
  version:
    experimental: 1.8.0
    stable: 1.14.0
hyperfunction:
  family: counters and gauges
  type: accessor
  aggregates:
    - counter_agg()
api_details:
  summary: >
    Calculate the change in a counter over the time period covered by a counter aggregate. Data points at the exact
    boundaries of the time period aren't needed. The function interpolates the
    counter values at the boundaries from adjacent counter aggregates if needed.
  signatures:
    - language: sql
      code: |
        interpolated_delta(
            summary CounterSummary,
            start TIMESTAMPTZ,
            interval INTERVAL
            [, prev CounterSummary]
            [, next CounterSummary]
        ) RETURNS DOUBLE PRECISION
  parameters:
    required:
      - name: summary
        type: CounterSummary
        description: A counter aggregate created using [`counter_agg`](#counter_agg)
      - name: start
        type: TIMESTAMPTZ
        description: The start of the time period to compute the delta over
      - name: interval
        type: INTERVAL
        description: The length of the time period to compute the delta over
    optional:
      - name: prev
        type: CounterSummary
        description: >
          The counter aggregate from the previous interval, used to interpolate the value
          at `start`. If `NULL`, the first timestamp in `summary` is used as the start of the
          interval.
      - name: next
        type: CounterSummary
        description: >
          The counter aggregate from the next interval, used to interpolate the value
          at `start + interval`. If `NULL`, the last timestamp in `summary` is used as the end of the
          interval.    
    returns:
      - column: interpolated_delta
        type: DOUBLE PRECISION
        description: >
          The delta between the first and last points of the time interval. If exact values are missing in the raw data for the first and last points, these values are interpolated linearly from the neighboring counter aggregates.
  examples:
    - description: >
        Calculate the counter delta for each 15-minute interval, using interpolation
        to get the values at the interval boundaries if they don't exist in the data.
      command:
        code: |
          SELECT
              id,
              bucket,
              interpolated_delta(
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
                  counter_agg(ts, val) AS summary
              FROM foo
              GROUP BY id, time_bucket('15 min'::interval, ts)
          ) t
---

