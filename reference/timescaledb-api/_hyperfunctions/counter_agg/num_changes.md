---
api_name: num_changes()
excerpt: Get the number of times a counter changed from a counter aggregate
topics: [hyperfunctions]
api:
  license: community
  type: function
  toolkit: true
  experimental: false
  version:
    experimental: 0.2.0
    stable: 1.3.0
hyperfunction:
  family: counters and gauges
  type: accessor
  aggregates:
    - counter_agg()
api_details:
  summary: >
    Get the number of times the counter changed during the period summarized by the
    counter aggregate. Any change is counted, including resets to zero.
  signatures:
    - language: sql
      code: |
        num_changes(
            summary CounterSummary
        ) RETURNS BIGINT
  parameters:
    required:
      - name: summary
        type: CounterSummary
        description: A counter summary created using [`counter_agg`](#counter_agg)
    returns:
      - column: num_changes
        type: BIGINT
        description: The number of times the counter changed
  examples:
    - description: Get the number of times the counter changed over each 15-minute interval.
      command:
        code: |
          SELECT
              id,
              bucket,
              num_changes(summary)
          FROM (
              SELECT
                  id,
                  time_bucket('15 min'::interval, ts) AS bucket,
                  counter_agg(ts, val) AS summary
              FROM foo
              GROUP BY id, time_bucket('15 min'::interval, ts)
          ) t
---

