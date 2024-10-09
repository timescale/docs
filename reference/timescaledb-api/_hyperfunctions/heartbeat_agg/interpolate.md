---
api_name: interpolate()
excerpt: Adjust a heartbeat aggregate with predecessor information
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
    This takes a heartbeat aggregate and the aggregate immediately
    preceding it. It updates the aggregate to include any live ranges that
    should have been carried over from the last heartbeat in the predecessor,
    even if there aren't heartbeats for that range in the interval covered by
    this aggregate. It returns the updated aggregate, which can then be
    used with any of the heartbeat aggregate accessors.
  signatures:
    - language: sql
      code: |
        interpolate(
            agg HEARTBEATAGG,
            pred HEARTBEATAGG
        ) RETURNS HEARTBEATAGG
  parameters:
    required:
      - name: agg
        type: HeartbeatAgg
        description: >
          A heartbeat aggregate containing liveness data for a particular interval.
    optional:
      - name: pred
        type: HeartbeatAgg
        description: >
          The heartbeat aggregate for the preceding interval, if one exists.
    returns:
      - column: interpolate
        type: HeartbeatAgg
        description: >
          A copy of `agg` which has been update to include any heartbeat intervals extending past the end of `pred`.
  examples:
    - description: >
        Given a table called `liveness` containing weekly heartbeat aggregates in column `health` with timestamp column `date`, we can use the following to get the intervals where the system was unhealthy during the week of Jan 9, 2022.  This correctly excludes any ranges covered by a heartbeat at the end of the Jan 2 week.
      command:
        code: |
          SELECT dead_ranges(
            interpolate(
              health,
              LAG(health) OVER (ORDER BY date)
            )
          )
          FROM liveness
          WHERE date = '01-9-2022 UTC'
      return:
        code: |2
                              dead_ranges                     
          -----------------------------------------------------
          ("2022-01-12 15:27:22+00","2022-01-12 15:31:17+00")
---
