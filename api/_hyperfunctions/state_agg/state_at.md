---
api_name: state_at()
excerpt: Deterimine the state at a given time
topics: [hyperfunctions]
api:
  license: community
  type: function
  toolkit: true
  version:
    stable: 1.15.0
hyperfunction:
  family: state tracking
  type: accessor
  aggregates:
    - state_agg()
api_details:
  summary: >
    Given a state aggregate, deterimine the state at a given time.
  signatures:
    - language: sql
      code: |
        state_at(
          agg StateAgg,
          ts TIMESTAMPTZ
        ) RETURNS TEXT

        state_at_int(
          agg StateAgg,
          ts TIMESTAMPTZ
        ) RETURNS BIGINT
  parameters:
    required:
      - name: agg
        type: StateAgg
        description: A state aggregate created with [`state_agg`](#state_agg)
      - name: ts
        type: TIMESTAMPTZ
        description: The time to get the state at.
    returns:
      - column: state
        type: TEXT | BIGINT
        description: The state at the given time.
  examples:
    - description: >
        Create a state aggregate and determine the state at a particular time.
      command:
        code: |
          SELECT state_at(
            (SELECT state_agg(ts, state) FROM states_test),
            '2020-01-01 00:00:05+00'
          );
      return:
        code: |2
          state_at
          ----------
          START
---
