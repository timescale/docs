---
api_name: interpolated_state_timeline()
excerpt: Get a state of all states from a state aggregate, interpolating values at time bucket boundaries
topics: [hyperfunctions]
api:
  license: community
  type: function
  toolkit: true
  version:
    experimental: 1.13.0
    stable: 1.15.0
hyperfunction:
  family: state tracking
  type: accessor
  aggregates:
    - state_agg()
api_details:
  summary: |
    Get a state of all states, showing each time a state is entered and exited.

    Unlike [`state_timeline`](#state_timeline), you can use this function across
    multiple state aggregates that cover different time buckets. Any missing
    values at the time bucket boundaries are interpolated from adjacent
    state aggregates.
  signatures:
    - language: sql
      code: |
        interpolated_state_timeline(
            agg StateAgg,
            start TIMESTAMPTZ,
            interval INTERVAL,
            [, prev StateAgg]
        ) RETURNS (TIMESTAMPTZ, TIMESTAMPTZ)

        interpolated_state_int_timeline(
            agg StateAgg,
            start TIMESTAMPTZ,
            interval INTERVAL,
            [, prev StateAgg]
        ) RETURNS (TIMESTAMPTZ, TIMESTAMPTZ)
  parameters:
    required:
      - name: agg
        type: StateAgg
        description: A state aggregate created with [`state_agg`](#state_agg)
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
      - column: state
        type: TEXT | BIGINT
        description: A state found in the state aggregate
      - column: start_time
        type: TIMESTAMPTZ
        description: The time when the state started (inclusive)
      - column: end_time
        type: TIMESTAMPTZ
        description: The time when the state ended (exclusive)
  examples:
    - description: |
        Given state aggregates bucketed by 1-minute intervals, interpolate
        the states at the bucket boundaries and get the history of all states.

        To perform the interpolation, the `LAG` and `LEAD` functions are used
        to get the previous and next state aggregates.
      command:
        code: |
          SELECT
              bucket,
              (interpolated_state_timeline(
                  summary,
                  bucket,
                  '15 min',
                  LAG(summary) OVER (ORDER by bucket)
              )).*
          FROM (
              SELECT
                  time_bucket('1 min'::interval, ts) AS bucket,
                  state_agg(ts, state) AS summary
              FROM states_test
              GROUP BY time_bucket('1 min'::interval, ts)
          ) t;
      return:
        code: |2
                   bucket         | state |       start_time       |        end_time
          ------------------------+-------+------------------------+------------------------
           2020-01-01 00:00:00+00 | START | 2020-01-01 00:00:00+00 | 2020-01-01 00:00:11+00
           2020-01-01 00:00:00+00 | OK    | 2020-01-01 00:00:11+00 | 2020-01-01 00:15:00+00
           2020-01-01 00:01:00+00 | ERROR | 2020-01-01 00:01:00+00 | 2020-01-01 00:01:03+00
           2020-01-01 00:01:00+00 | OK    | 2020-01-01 00:01:03+00 | 2020-01-01 00:16:00+00
           2020-01-01 00:02:00+00 | STOP  | 2020-01-01 00:02:00+00 | 2020-01-01 00:17:00+00
---

