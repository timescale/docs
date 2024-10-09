---
api_name: into_values()
excerpt: Expand a state aggregate into a set of rows displaying the duration of each state
topics: [hyperfunctions]
api:
  license: community
  type: function
  toolkit: true
  experimental: true
  version:
    experimental: 1.6.0
hyperfunction:
  family: state tracking
  type: accessor
  aggregates:
    - compact_state_agg()
api_details:
  summary: >
    Unpack the state aggregate into a set of rows with two columns, displaying the duration of each state. By
    default, the columns are named `state` and `duration`. You can rename
    them using the same method as renaming a table.
  signatures:
    - language: sql
      code: |
        into_values(
          agg StateAgg
        ) RETURNS (TEXT, INTERVAL)

        into_int_values(
          agg StateAgg
        ) RETURNS (INT, INTERVAL)
  parameters:
    required:
      - name: agg
        type: StateAgg
        description: A state aggregate created with [`compact_state_agg`](#compact_state_agg)
    returns:
      - column: state
        type: TEXT | BIGINT
        description: A state found in the state aggregate
      - column: duration
        type: INTERVAL
        description: The total time spent in that state
  examples:
    - description: >
        Create a state aggregate from the table `states_test`. The time column is named
        `time`, and the `state` column contains text values corresponding to different
        states of a system. Use `into_values` to display the data from the state
        aggregate.
      command:
        code: |
          SELECT state, duration FROM toolkit_experimental.into_values(
            (SELECT toolkit_experimental.compact_state_agg(time, state) FROM states_test)
          );
      return:
        code: |
          state | duration
          ------+----------
          ERROR | 00:00:03
          OK    | 00:01:46
          START | 00:00:11
---

