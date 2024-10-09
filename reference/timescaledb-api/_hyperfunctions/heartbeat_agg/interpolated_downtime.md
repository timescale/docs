---
api_name: interpolated_downtime()
excerpt: Get the total time dead from a heartbeat aggregate and predecessor
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
    This behaves very similarly to [`downtime()`](#downtime), but it also takes the heartbeat aggregate from the preceding interval.  It checks when the last heartbeat in the predecessor was received and makes sure not to consider the heartbeat interval after that time as unhealthy, even if it extends into the current aggregate prior to the first heartbeat.
  signatures:
    - language: sql
      code: |
        interpolated_downtime(
            agg HEARTBEATAGG,
            pred HEARTBEATAGG
        ) RETURNS INTERVAL
  parameters:
    required:
      - name: agg
        type: HeartbeatAgg
        description: >
          A heartbeat aggregate to get the liveness data from.
    optional:
      - name: pred
        type: HeartbeatAgg
        description: >
          The heartbeat aggregate for the interval before the one being measured, if one exists.
    returns:
      - column: interpolated_downtime
        type: INTERVAL
        description: >
          The sum of all the unhealthy ranges in the aggregate, excluding those covered by the last heartbeat of the previous interval.
  examples:
    - description: >
        Given a table called `liveness` containing weekly heartbeat aggregates in column `health` with timestamp column `date`, you can use this command to get the total interpolated downtime of the system during the week of Jan 9, 2022.
      command:
        code: |
          SELECT interpolated_downtime(
            health,
            LAG(health) OVER (ORDER BY date)
          )
          FROM liveness
          WHERE date = '01-9-2022 UTC'
      return:
        code: |
          interpolated_downtime     
          ---------------------
                 00:03:55
---
