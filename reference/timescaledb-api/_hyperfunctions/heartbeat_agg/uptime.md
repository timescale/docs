---
api_name: uptime()
excerpt: Get the total time live during a heartbeat aggregate
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
  type: accessor
  aggregates:
    - heartbeat_agg()
api_details:
  summary: |
    Given a heartbeat aggregate, this sums all the ranges where the system
    was live and returns the total.
    
    There may appear to be some downtime between the start of the aggregate and
    the first heartbeat. If there is a heartbeat aggregage covering the
    previous period, you can use its last heartbeat to correct for this using
    [`interpolated_uptime()`](#interpolated_uptime).
  signatures:
    - language: sql
      code: |
        uptime(
            agg HEARTBEATAGG
        ) RETURNS INTERVAL
  parameters:
    required:
      - name: agg
        type: HeartbeatAgg
        description: >
          A heartbeat aggregate to get the liveness data from.
    returns:
      - column: uptime
        type: INTERVAL
        description: >
          The sum of all the live ranges in the aggregate.
  examples:
    - description: >
        Given a table called `liveness` containing weekly heartbeat aggregates in column `health` with timestamp column `date`, you can use this command to get the total uptime of the system during the week of Jan 9, 2022.
      command:
        code: |
          SELECT uptime(health)
          FROM liveness
          WHERE date = '01-9-2022 UTC'
      return:
        code: |2
              uptime     
          -----------------
          6 days 23:55:35
---
