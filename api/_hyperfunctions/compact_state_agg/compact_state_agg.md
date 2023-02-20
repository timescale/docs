---
api_name: compact_state_agg()
excerpt: Aggregate state data into a state aggregate for further analysis
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
  type: aggregate
  aggregates:
    - compact_state_agg()
api_details:
  summary: Aggregate a dataset containing state data into a state aggregate to track the time spent in each state.
  signatures:
    - language: sql
      code: |
        compact_state_agg(
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
        description: An object storing the total time spent in each state
  examples:
    - description: Create a state aggregate to track the status of some devices.
      command:
        code: |
          SELECT toolkit_experimental.compact_state_agg(time, status) FROM devices;
---

