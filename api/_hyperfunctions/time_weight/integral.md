---
api_name: integral()
excerpt: Calculate the integral from a `TimeWeightSummary`
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
  summary: >
    Calculate the integral, or the area under the curve formed by the data
    points. Equal to [`average`](#average) multiplied by the elapsed time.
  signatures:
    - language: sql
      code: |
        integral(
            tws TimeWeightSummary
            [, unit TEXT]
        ) RETURNS DOUBLE PRECISION
  parameters:
    required:
      - name: tws
        type: TimeWeightSummary
        description: >
          The input `TimeWeightSummary` from a `time_weight()` call.
    optional:
      - name: unit
        type: TEXT
        description: >
          The unit of time to express the integral in. Can be `microsecond`,
          `millisecond`, `second`, `minute`, `hour`, or any alias for those units
          supported by PostgreSQL. Defaults to `second`.
    returns:
      - column: integral
        type: DOUBLE PRECISION
        description: The time-weighted integral.
  examples:
    - description: >
        Create a table to track irregularly sampled storage usage in bytes, and
        get the total storage used in byte-hours. Use the 'last observation
        carried forward' interpolation method.
      command:
        code: |
          -- Create a table to track irregularly sampled storage usage
          CREATE TABLE user_storage_usage(ts TIMESTAMP, storage_bytes BIGINT);
          INSERT INTO user_storage_usage(ts, storage_bytes) VALUES
              ('01-01-2022 00:00', 0),
              ('01-01-2022 00:30', 100),
              ('01-01-2022 03:00', 300),
              ('01-01-2022 03:10', 1000),
              ('01-01-2022 03:25', 817);

          -- Get the total byte-hours used
          SELECT
              integral(time_weight('LOCF', ts, storage_bytes), 'hours')
          FROM
              user_storage_usage;
---

