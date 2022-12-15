---
api_name: live_at()
excerpt: Test if the aggregate has a heartbeat covering a given time
topics: [hyperfunctions]
api:
  license: community
  type: function
  toolkit: true
  experimental: true
  version:
    experimental: 1.13.0
hyperfunction:
  family: state aggregates
  type: aggregate
  aggregates:
    - heartbeat_agg()
api_details:
  summary: |
    Given a heartbeat aggregate and a timestamp, this will return whether the
    aggregate has a heartbeat indicating the system was live at the given time.

    Note that this will return false for any time not covered by the aggregate.
  signatures:
    - language: sql
      code: |
        live_at(
            agg HEARTBEATAGG,
            test TIMESTAMPTZ
        ) RETURNS BOOL
  parameters:
    required:
      - name: agg
        type: HeartbeatAgg
        description: >
          A heartbeat aggregate to get the liveness data from.
      - name: test
        type: TimestampTz
        description: >
          The time to test the liveness of.
    returns:
      - column: live_at
        type: bool
        description: >
          True if the heartbeat aggregate had a heartbeat close before the test time.
  examples:
    - description: >
        Given a table called `liveness` containing weekly heartbeat aggregates in column `health` with timestamp column `date`, we can use the following to see if the sytem was live at a particular time.
      command:
        code: |
          SELECT live_at(health, '2022-01-12 15:30:00+00')
          FROM liveness
          WHERE date = '01-9-2022 UTC'
      return:
        code: |
           live_at     
          ---------
           f
---
