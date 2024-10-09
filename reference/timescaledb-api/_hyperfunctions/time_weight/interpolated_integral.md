---
api_name: interpolated_integral()
excerpt: Calculate the integral over an interval, while interpolating the interval bounds
topics: [hyperfunctions]
api:
  license: community
  type: function
  toolkit: true
  version:
    experimental: 1.11.0
    stable: 1.15.0
hyperfunction:
  family: time-weighted calculations
  type: accessor
  aggregates:
    - time_weight()
api_details:
  summary: |
    Calculate the integral over an interval, while interpolating the interval
    bounds.
    
    Similar to [`integral`](#integral), but allows an accurate calculation across
    interval bounds when data has been bucketed into separate time intervals,
    and there is no data point precisely at the interval bound. For example,
    this is useful in a window function.

    Values from the previous and next buckets are used to interpolate the values
    at the bounds, using the same interpolation method used within the
    `TimeWeightSummary` itself.
    
    Equal to [`interpolated_average`](#interpolated_average) multiplied by the
    elapsed time.
  signatures:
    - language: sql
      code: |
        interpolated_integral(
            tws TimeWeightSummary,
            start TIMESTAMPTZ,
            interval INTERVAL
            [, prev TimeWeightSummary]
            [, next TimeWeightSummary]
            [, unit TEXT]
        ) RETURNS DOUBLE PRECISION
  parameters:
    required:
      - name: tws
        type: TimeWeightSummary
        description: The input `TimeWeightSummary` from a `time_weight()` call.
      - name: start
        type: TIMESTAMPTZ
        description: >
          The start of the interval which the time-weighted integral should cover
          (if there is a preceding point).
      - name: interval
        type: INTERVAL
        description: >
          The length of the interval which the time-weighted integral should
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
      - name: unit
        type: TEXT
        description: >
          The unit of time to express the integral in. Can be `microsecond`,
          `millisecond`, `second`, `minute`, `hour`, or any alias for those units
          supported by PostgreSQL. Defaults to `second`.
    returns:
      - column: integral
        type: DOUBLE PRECISION
        description: >
          The time-weighted integral for the interval (`start`, `start` + `interval`),
          computed from the `TimeWeightSummary` plus end points interpolated from `prev` and `next`
  examples:
    - description: >
        Create a table to track irregularly sampled storage usage in bytes, and
        get the total storage used in byte-hours between January 1 and January
        6. Use the 'last observation carried forward' interpolation method.
      command:
        code: |
            -- Create a table to track irregularly sampled storage usage
            CREATE TABLE user_storage_usage(ts TIMESTAMP, storage_bytes BIGINT);
            INSERT INTO user_storage_usage(ts, storage_bytes) VALUES
                ('01-01-2022 20:55', 27),
                ('01-02-2022 18:33', 100),
                ('01-03-2022 03:05', 300),
                ('01-04-2022 12:13', 1000),
                ('01-05-2022 07:26', 817);


            -- Get the total byte-hours used between Jan. 1 and Jan. 6
            SELECT
                interpolated_integral(
                    time_weight('LOCF', ts, storage_bytes),
                    '01-01-2022',
                    '5 days',
                    NULL,
                    NULL,
                    'hours'
                )
            FROM
                user_storage_usage;
---

