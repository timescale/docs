---
api_name: timeline_agg()
excerpt: Aggregate state data into a timeline aggregate for further analysis
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
  type: aggregate
  aggregates:
    - timeline_agg()
api_details:
  summary: >
    Aggregate state data into a timeline aggregate to track state transitions.
    Unlike [`state_agg`](/api/latest/hyperfunctions/state-tracking/state-agg/),
    which only stores durations, `timeline_agg` also stores the timestamps of
    state transitions.
  signatures:
    - language: sql
      code: |
        timeline_agg(
          ts TIMESTAMPTZ,
          value {TEXT | BIGINT}
        ) RETURNS TimelineAgg
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
        type: TimelineAgg
        description: An object storing the periods spent in each state, including timestamps of state transitions
  examples:
    - description: Create a timeline aggregate to track the status of some devices.
      command:
        code: |
          SELECT toolkit_experimental.timeline_agg(time, status) FROM devices;
---

