---
api_name: into_values()
excerpt: Expand the timeline aggregate into a set of rows, displaying the duration of each state
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
  summary: >
    Unpack the timeline aggregate into a set of rows with two columns,
    displaying the duration of each state. By default, the columns are named
    `state` and `duration`. You can rename them as you can do with any table.
  signatures:
    - language: sql
      code: |
        into_values(
          agg TimelineAgg
        ) RETURNS (TEXT, BIGINT)

        into_int_values(
          agg TimelineAgg
        ) RETURNS (INT, BIGINT)
  parameters:
    required:
      - name: agg
        type: TimelineAgg
        description: A timeline aggregate created with [`timeline_agg`](#timeline_agg)
    returns:
      - column: state
        type: TEXT | BIGINT
        description: A state found in the timeline aggregate
      - column: duration
        type: BIGINT
        description: The total time spent in that state
  examples:
    - description: >
        Create a timeline aggregate from the table `states_test`. The time column is named
        `time`, and the `state` column contains text values corresponding to different
        states of a system. Use `into_values` to display the data from the state
        aggregate.
      command:
        code: |
          SELECT state, duration FROM toolkit_experimental.into_values(
            (SELECT toolkit_experimental.timeline_agg(time, state) FROM states_test)
          );
      return:
        code: |
          state | duration
          ------+-----------
          ERROR |   3000000
          OK    | 106000000
          START |  11000000
---

