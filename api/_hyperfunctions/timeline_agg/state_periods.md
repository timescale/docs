---
api_name: state_periods()
excerpt: Get the time periods corresponding to a given state from a timeline aggregate
topics: [hyperfunctions]
api:
  license: community
  type: function
  toolkit: true
  experimental: true
  version:
    experimental: 1.13.0
hyperfunction:
  family: state tracking
  type: accessor
  aggregates:
    - timeline_agg()
api_details:
  summary: |
    Given a timeline aggregate and a specific state, list the periods when the
    system is in that state. Periods are defined by the start time and end
    time.

    If you have multiple timeline aggregates and need to interpolate the state
    across interval boundaries, use [`interpolated_state_periods`](#interpolated_state_periods).
  signatures:
    - language: sql
      code: |
        state_periods(
            state [TEXT | BIGINT],
            agg TimelineAgg
        ) RETURNS (TIMESTAMPTZ, TIMESTAMPTZ)
  parameters:
    required:
      - name: state
        type: TEXT | BIGINT
        description: The target state to get data for.
      - name: agg
        type: TimelineAgg
        description: A timeline aggregate created using [`timeline_agg`](#timeline_agg).
    returns:
      - column: start_time
        type: TIMESTAMPTZ
        description: The time when the state started (inclusive)
      - column: end_time
        type: TIMESTAMPTZ
        description: The time when the state ended (exclusive)
  examples:
    - description: >
        Create a timeline aggregate and list all periods corresponding to the
        state `OK`.
      command:
        code: |
          SELECT start_time, end_time FROM toolkit_experimental.state_periods(
            'OK',
            (SELECT toolkit_experimental.timeline_agg(ts, state) FROM states_test)
          );
      return:
        code: |2
                 start_time       |        end_time
          ------------------------+------------------------
           2020-01-01 00:00:11+00 | 2020-01-01 00:01:00+00
           2020-01-01 00:01:03+00 | 2020-01-01 00:02:00+00
---

