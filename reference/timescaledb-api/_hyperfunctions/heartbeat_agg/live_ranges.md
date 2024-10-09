---
api_name: live_ranges()
excerpt: Get the live intervals from a heartbeat_agg
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
    Given a heartbeat aggregate, this returns a set of (start_time,
    end_time) pairs representing when the underlying system was live during the
    interval of the aggregate.
  signatures:
    - language: sql
      code: |
        live_ranges(
            agg HEARTBEATAGG
        ) RETURNS TABLE (
            start TIMESTAMPTZ,
            end TIMESTAMPTZ
        )
  parameters:
    required:
      - name: agg
        type: HeartbeatAgg
        description: >
          A heartbeat aggregate to get the liveness data from.
    returns:
      - column: live_ranges
        type: TABLE (start TIMESTAMPTZ, end TIMESTAMPTZ)
        description: >
          The (start, end) pairs of when the system was live.
  examples:
    - description: >
        Given a table called `liveness` containing weekly heartbeat aggregates in column `health` with timestamp column `date`, we can use the following to get the intervals where the system was live during the week of Jan 9, 2022.
      command:
        code: |
          SELECT live_ranges(health)
          FROM liveness
          WHERE date = '01-9-2022 UTC'
      return:
        code: |2
                              live_ranges                     
          -----------------------------------------------------
          ("2022-01-09 00:00:30+00","2022-01-12 15:27:22+00")
          ("2022-01-12 15:31:17+00","2022-01-16 00:00:00+00")
---
