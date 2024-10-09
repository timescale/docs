---
api_name: downtime()
excerpt: Get the total time dead during a heartbeat aggregate
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
    Given a heartbeat aggregate, this will sum all the ranges where the system
    did not have a recent enough heartbeat.
    
    There may appear to be some downtime between the start of the aggregate and
    the first heartbeat. If there is a heartbeat aggregage covering the
    previous period, you can use its last heartbeat to correct for this using
    [`interpolated_downtime()`](#interpolated_downtime).
  signatures:
    - language: sql
      code: |
        downtime(
            agg HEARTBEATAGG
        ) RETURNS INTERVAL
  parameters:
    required:
      - name: agg
        type: HeartbeatAgg
        description: >
          A heartbeat aggregate to get the liveness data from.
    returns:
      - column: downtime
        type: INTERVAL
        description: >
          The sum of all the dead ranges in the aggregate.
  examples:
    - description: >
        Given a table called `liveness` containing weekly heartbeat aggregates in column `health` with timestamp column `date`, we can use the following to get the total downtime of the system during the week of Jan 9, 2022.
      command:
        code: |
          SELECT downtime(health)
          FROM liveness
          WHERE date = '01-9-2022 UTC'
      return:
        code: |
          downtime     
          --------
          00:04:25
---
