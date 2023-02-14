---
api_name: interpolated_duration_in()
excerpt: Calculate the total time spent in a given state from a state aggregate, interpolating values at time bucket boundaries
topics: [hyperfunctions]
api:
  license: community
  type: function
  toolkit: true
  experimental: true
  version:
    experimental: 1.8.0
hyperfunction:
  family: state tracking
  type: accessor
  aggregates:
    - compact_state_agg()
api_details:
  summary: >
    Calculate the total duration in the given state.
    Unlike [`duration_in`](#duration_in), you can use this function across multiple state
    aggregates that cover multiple time buckets. Any missing values at the time bucket
    boundaries are interpolated from adjacent state aggregates.
  signatures:
    - language: sql
      code: |
        interpolated_duration_in(
          agg StateAgg,
          state {TEXT | BIGINT},
          start TIMESTAMPTZ,
          interval INTERVAL
          [, prev StateAgg]
        ) RETURNS DOUBLE PRECISION
  parameters:
    required:
      - name: agg
        type: StateAgg
        description: A state aggregate created with [`compact_state_agg`](#compact_state_agg)
      - name: state
        type: TEXT | BIGINT
        description: The state to query
      - name: start
        type: TIMESTAMPTZ
        description: The start of the interval to be calculated
      - name: interval
        type: INTERVAL
        description: The length of the interval to be calculated
    optional:
      - name: prev
        type: StateAgg
        description: >
          The state aggregate from the prior interval, used to interpolate
          the value at `start`. If `NULL`, the first timestamp in `aggregate` is used
          as the start of the interval.
    returns:
      - column: interpolated_duration_in
        type: INTERVAL
        description: The total time spent in the queried state. Displayed as `days`, `hh:mm:ss`, or a combination of the two.
  examples:
    - description: >
        Create a test table that tracks when a system switches between `starting`,
        `running`, and `error` states. Query the table for the time spent in the
        `running` state. Use `LAG` and `LEAD` to get the neighboring aggregates
        for interpolation.

        If you prefer to see the result in seconds,
        [`EXTRACT`](https://www.postgresql.org/docs/current/functions-datetime.html#FUNCTIONS-DATETIME-EXTRACT)
        the epoch from the returned result.
      command:
        code: |
          SELECT 
            time,
            toolkit_experimental.interpolated_duration_in(
              agg,
              'running',
              time,
              '1 day',
              LAG(agg) OVER (ORDER BY time)
          ) FROM (
            SELECT
              time_bucket('1 day', time) as time,
              toolkit_experimental.compact_state_agg(time, state) as agg
            FROM
              states
            GROUP BY time_bucket('1 day', time)
          ) s;
      return:
        code: |
          time                    | interpolated_duration_in 
          ------------------------+--------------------------
          2020-01-01 00:00:00+00  | 13:30:00
          2020-01-02 00:00:00+00  | 16:00:00
          2020-01-03 00:00:00+00  | 04:30:00
          2020-01-04 00:00:00+00  | 12:00:00
---

