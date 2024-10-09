---
api_name: interpolated_average()
excerpt: Calculate the time-weighted average over an interval, while interpolating the interval bounds
topics: [hyperfunctions]
api:
  license: community
  type: function
  toolkit: true
  version:
    experimental: 1.8.0
    stable: 1.14.0
hyperfunction:
  family: time-weighted calculations
  type: accessor
  aggregates:
    - time_weight()
api_details:
  summary: |
    Calculate the time-weighted average over an interval, while interpolating
    the interval bounds.
    
    Similar to [`average`](#average), but allows an accurate calculation across
    interval bounds when data has been bucketed into separate time intervals,
    and there is no data point precisely at the interval bound. For example,
    this is useful in a window function.

    Values from the previous and next buckets are used to interpolate the values
    at the bounds, using the same interpolation method used within the
    `TimeWeightSummary` itself.
    
    Equal to [`interpolated_integral`](#interpolated_integral) divided by the
    elapsed time.
  signatures:
    - language: sql
      code: |
        interpolated_average(
            tws TimeWeightSummary,
            start TIMESTAMPTZ,
            interval INTERVAL
            [, prev TimeWeightSummary]
            [, next TimeWeightSummary]
        ) RETURNS DOUBLE PRECISION
  parameters:
    required:
      - name: tws
        type: TimeWeightSummary
        description: The input `TimeWeightSummary` from a `time_weight()` call.
      - name: start
        type: TIMESTAMPTZ
        description: >
          The start of the interval which the time-weighted average should cover
          (if there is a preceeding point).
      - name: interval
        type: INTERVAL
        description: >
          The length of the interval which the time-weighted average should
          cover.
    optional:
      - name: prev
        type: TimeWeightSummary
        description: >
          The `TimeWeightSummary` from the prior interval, used to interpolate
          the value at `start`. If NULL, the first timestamp in `tws` is used for
          the starting value. The prior interval can be determined from the
          PostgreSQL [`lag()`](https://www.postgresql.org/docs/current/functions-window.html#FUNCTIONS-WINDOW-TABLE)
          function.
      - name: next
        type: TimeWeightSummary
        description: >
          The `TimeWeightSummary` from the next interval, used to interpolate
          the value at `start` + `interval`. If NULL, the first timestamp in
          `tws` is used for the starting value. The next interval can be
          determined from the PostgreSQL
          [`lead()`](https://www.postgresql.org/docs/current/functions-window.html#FUNCTIONS-WINDOW-TABLE)
          function.
    returns:
      - column: average
        type: DOUBLE PRECISION
        description: >
          The time-weighted average for the interval (`start`, `start` + `interval`),
          computed from the `TimeWeightSummary` plus end points interpolated from `prev` and `next`
  examples:
    - description: >
        Calculate the time-weighted daily average of the column `val`,
        interpolating over bucket bounds using the 'last observation carried
        forward' method.
      command:
        code: |
          SELECT
              id,
              time,
              interpolated_average(
                  tws,
                  time,
                  '1 day',
                  LAG(tws) OVER (PARTITION BY id ORDER by time),
                  LEAD(tws) OVER (PARTITION BY id ORDER by time)
              )
          FROM (
              SELECT
                  id,
                  time_bucket('1 day', ts) AS time,
                  time_weight('LOCF', ts, val) AS tws
              FROM foo
              GROUP BY id, time
          ) t
---

