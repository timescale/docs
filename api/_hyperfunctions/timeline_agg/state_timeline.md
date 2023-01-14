---
api_name: state_timeline()
excerpt: Get a timeline of all states from a timeline aggregate
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
    Get a timeline of all states, showing each time a state is entered and exited.

    If you have multiple timeline aggregates and need to interpolate the state
    across interval boundaries, use [`interpolated_state_timeline`](#interpolated_state_timeline).
  signatures:
    - language: sql
      code: |
        state_timeline(
            agg TimelineAgg
        ) RETURNS (TEXT, TIMESTAMPTZ, TIMESTAMPTZ)

        state_int_timeline(
            agg TimelineAgg
        ) RETURNS (BIGINT, TIMESTAMPTZ, TIMESTAMPTZ)
  parameters:
    required:
      - name: agg
        type: TimelineAgg
        description: The aggregate from which to get a timeline
    returns:
      - column: state
        type: TEXT | BIGINT
        description: A state found in the timeline aggregate
      - column: start_time
        type: TIMESTAMPTZ
        description: The time when the state started (inclusive)
      - column: end_time
        type: TIMESTAMPTZ
        description: The time when the state ended (exclusive)
  examples:
    - description: Get the history of states from a timeline aggregate.
      command:
        code: |
          SELECT state, start_time, end_time
            FROM toolkit_experimental.state_timeline(
              (SELECT toolkit_experimental.timeline_agg(ts, state) FROM states_test)
            );
      return:
        code: |2
           state |       start_time       |        end_time
          -------+------------------------+------------------------
           START | 2020-01-01 00:00:00+00 | 2020-01-01 00:00:11+00
           OK    | 2020-01-01 00:00:11+00 | 2020-01-01 00:01:00+00
           ERROR | 2020-01-01 00:01:00+00 | 2020-01-01 00:01:03+00
           OK    | 2020-01-01 00:01:03+00 | 2020-01-01 00:02:00+00
           STOP  | 2020-01-01 00:02:00+00 | 2020-01-01 00:02:00+00
---

