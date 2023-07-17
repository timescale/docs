---
api_name: num_gaps()
excerpt: Count the number of gaps between live ranges
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
    Given a heartbeat aggregate, this returns the number of gaps between
    the periods of liveness. Additionally, if the aggregate is not live at the
    start or end of its covered interval, these are also considered gaps.
  signatures:
    - language: sql
      code: |
        num_gaps(
            agg HEARTBEATAGG
        ) RETURNS BIGINT
  parameters:
    required:
      - name: agg
        type: HeartbeatAgg
        description: >
          A heartbeat aggregate to get the number of gaps from.
    returns:
      - column: num_gaps
        type: bigint
        description: >
          The number of gaps in the aggregate.
  examples:
    - description: >
        Given a table called `liveness` containing weekly heartbeat aggregates in column `health` with timestamp column `date`, use this query to see how many times the system was down in a particular week:
      command:
        code: |
          SELECT num_gaps(health)
          FROM liveness
          WHERE date = '01-9-2022 UTC'
      return:
        code: |
           num_gaps     
          ---------
           4
---
