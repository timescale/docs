---
api_name: duration_in()
excerpt: Calculate the total time spent in a given state from a state aggregate
topics: [hyperfunctions]
api:
  license: community
  type: function
  toolkit: true
  experimental: true
  version:
    experimental: 1.5.0
hyperfunction:
  family: state tracking
  type: accessor
  aggregates:
    - compact_state_agg()
api_details:
  summary: >
    Given a state aggregate, calculate the total time spent in the given state. If you
    need to interpolate missing values across time bucket boundaries, use
    [`interpolated_duration_in`](#interpolated_duration_in).
  signatures:
    - language: sql
      code: |
        duration_in(
          state {TEXT | BIGINT},
          aggregate StateAgg
        ) RETURNS INTERVAL
  parameters:
    required:
      - name: state
        type: TEXT | BIGINT
        description: The state to query
      - name: aggregate
        type: StateAgg
        description: A state aggregate created with [`compact_state_agg`](#compact_state_agg)
    returns:
      - column: duration_in
        type: INTERVAL
        description: The time spent in the given state. Displayed in `days`, `hh:mm:ss`, or a combination of the two.
  examples:
    - description: |
        Create a test table that tracks when a system switches between `starting`,
        `running`, and `error` states. Query the table for the time spent in the
        `running` state.

        If you prefer to see the result in seconds,
        [`EXTRACT`](https://www.postgresql.org/docs/current/functions-datetime.html#FUNCTIONS-DATETIME-EXTRACT)
        the epoch from the returned result.
      command:
        code: |
          SET timezone TO 'UTC';
          CREATE TABLE states(time TIMESTAMPTZ, state TEXT);
          INSERT INTO states VALUES
            ('1-1-2020 10:00', 'starting'),
            ('1-1-2020 10:30', 'running'),
            ('1-3-2020 16:00', 'error'),
            ('1-3-2020 18:30', 'starting'),
            ('1-3-2020 19:30', 'running'),
            ('1-5-2020 12:00', 'stopping');

          SELECT toolkit_experimental.duration_in(
            'running',
            toolkit_experimental.compact_state_agg(time, state)
          ) FROM states;
      return:
        code: |
          duration_in  
          ---------------
          3 days 22:00:00
---

