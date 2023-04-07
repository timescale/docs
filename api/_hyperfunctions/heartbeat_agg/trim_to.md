---
api_name: trim_to()
excerpt: Reduce the covered interval of a heartbeat aggregate
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
    Given a heartbeat aggregate, this will reduce the time range covered by
    that aggregate. This can only be used to narrow the covered interval,
    passing arguments that would extend beyond the range covered by the
    initial aggregate will give an error.
  signatures:
    - language: sql
      code: |
        trim_to(
            agg HEARTBEATAGG,
            start TIMESTAMPTZ,
            duration INTERVAL
        ) RETURNS HEARTBEATAGG
  parameters:
    required:
      - name: agg
        type: HeartbeatAgg
        description: >
          A heartbeat aggregate to trim down.
    optional:
      - name: start
        type: TimestampTz
        description: >
          The start of the trimmed range. If not provided the returned heartbeat agg will start from the same time as the starting one.
      - name: duration
        type: Interval
        description: >
          How long the resulting aggregate should cover. If not provided the returned heartbeat agg will end at the same time as the starting one.
    returns:
      - column: trim_to
        type: heartbeat_agg
        description: >
          The trimmed aggregate.
  examples:
    - description: >
        Given a table called `liveness` containing weekly heartbeat aggregates in column `health` with timestamp column `date`, we can use the following to rollup several weeks and trim the result to an exact month.
      command:
        code: |
          SELECT trim_to(rollup(health), '03-1-2022 UTC', '1 month')
          FROM liveness
          WHERE date > '02-21-2022 UTC' AND date < '3-7-2022 UTC'
---
