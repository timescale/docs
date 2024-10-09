---
api_name: state_agg()
excerpt: Aggregate state data into a state aggregate for further analysis
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
  type: aggregate
  aggregates:
    - state_agg()
api_details:
  summary: >
    Aggregate state data into a state aggregate to track state transitions.
    Unlike [`state_agg`](/api/latest/hyperfunctions/state-tracking/state_agg/),
    which only stores durations, `state_agg` also stores the timestamps of
    state transitions.
  signatures:
    - language: sql
      code: |
        state_agg(
          ts TIMESTAMPTZ,
          value {TEXT | BIGINT}
        ) RETURNS StateAgg
  parameters:
    required:
      - name: ts
        type: TIMESTAMPTZ
        description: Timestamps associated with each state reading
      - name: value
        type: TEXT | BIGINT
        description: The state at that time
    returns:
      - column: agg
        type: StateAgg
        description: An object storing the periods spent in each state, including timestamps of state transitions
  examples:
    - description: Create a state aggregate to track the status of some devices.
      command:
        code: |
          SELECT state_agg(time, status) FROM devices;
---

