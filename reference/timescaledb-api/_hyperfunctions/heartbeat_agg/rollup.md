---
api_name: rollup()
excerpt: Combine multiple heartbeat aggregates
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
  type: rollup
  aggregates:
    - heartbeat_agg()
api_details:
  summary: |
    This combines multiple heartbeat aggregates into one. This can be used
    to combine aggregates into adjacent intervals into one larger interval,
    such as rolling daily aggregates into a weekly or monthly aggregate.

    Another use for this is to combine heartbeat aggregates for redundant
    systems to determine if there were any overlapping failures. For instance,
    a master and standby system can have their heartbeats combined to see if
    there were any intervals where both systems were down at the same time. The
    result of rolling overlapping heartbeats together like this is a
    heartbeat aggregate which considers a time live if any of its component
    aggregates were live.
  signatures:
    - language: sql
      code: |
        rollup(
          heartbeatagg HEARTBEATAGG
        ) RETURNS HEARTBEATAGG
  parameters:
    required:
      - name: heartbeatagg
        type: HeartbeatAgg
        description: The heartbeat aggregates to roll up.
    returns:
      - column: rollup
        type: HeartbeatAgg
        description: >
          A heartbeat aggregate covering the interval from the earliest start time of its component aggregates to the latest end time.  It combines the live ranges of all the components.
---