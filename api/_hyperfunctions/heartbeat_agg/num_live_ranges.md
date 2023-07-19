---
api_name: num_live_ranges()
excerpt: Count the number of live ranges
topics: [hyperfunctions]
api:
  license: community
  type: function
  toolkit: true
  version:
    stable: 1.16.0
hyperfunction:
  family: state tracking
  type: accessor
  aggregates:
    - heartbeat_agg()
api_details:
  summary: |
    Given a heartbeat aggregate, this returns the number of live periods.
  signatures:
    - language: sql
      code: |
        num_live_ranges(
            agg HEARTBEATAGG
        ) RETURNS BIGINT
  parameters:
    required:
      - name: agg
        type: HeartbeatAgg
        description: >
          A heartbeat aggregate to get the number of ranges from.
    returns:
      - column: num_live_ranges
        type: bigint
        description: >
          The number of live ranges in the aggregate.
  examples:
    - description: >
        Given a table called `liveness` containing weekly heartbeat aggregates in column `health` with timestamp column `date`, use this query to see how many intervals the system was up in a given week:
      command:
        code: |
          SELECT num_live_ranges(health)
          FROM liveness
          WHERE date = '01-9-2022 UTC'
      return:
        code: |
           num_live_ranges
           ---------
           5
---

