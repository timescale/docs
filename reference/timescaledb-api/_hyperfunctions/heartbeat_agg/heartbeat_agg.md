---
api_name: heartbeat_agg()
excerpt: Create a liveness aggregate from a set of heartbeats
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
    - heartbeat_agg()
api_details:
  summary: |
    This takes a set of heartbeat timestamps and aggregates the liveness state of
    the underlying system for the specified time range.
  signatures:
    - language: sql
      code: |
        heartbeat_agg(
            heartbeat TIMESTAMPTZ,
            agg_start TIMESTAMPTZ,
            agg_duration INTERVAL,
            heartbeat_liveness INTERVAL
        ) RETURNS HeartbeatAgg
  parameters:
    required:
      - name: heartbeat
        type: TIMESTAMPTZ
        description: >
          The column containing the timestamps of the heartbeats.
      - name: agg_start
        type: TIMESTAMPTZ
        description: >
          The start of the time range over which this aggregate is tracking liveness.
      - name: agg_duration
        type: INTERVAL
        description: >
          The length of the time range over which this aggregate is tracking liveness. Any point in this range that doesn't closely follow a heartbeat is considered to be dead.
      - name: heartbeat_liveness
        type: INTERVAL
        description: >
          How long the system is considered to be live after each heartbeat.
    returns:
      - column: heartbeat_agg
        type: HeartbeatAgg
        description: >
          The liveness data for the heartbeated system over the provided interval.
  examples:
    - description: >
        Given a table called `system_health` with a `ping_time` column, construct an aggregate of system liveness for 10 days starting from Jan 1, 2022.  This assumes a system is unhealthy if it hasn't been heard from in a 5 minute window.
      command:
        code: |
          SELECT heartbeat_agg(
            ping_time,
            '01-01-2022 UTC',
            '10 days',
            '5 min')
          FROM system_health;
---
