---
api_name: num_elements()
excerpt: Get the number of points with distinct timestamps from a counter aggregate
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
    Get the number of points with distinct timestamps from a counter aggregate.
    Duplicate timestamps are ignored.
  signatures:
    - language: sql
      code: |
        num_elements(
            summary CounterSummary
        ) RETURNS BIGINT
  parameters:
    required:
      - name: summary
        type: CounterSummary
        description: A counter aggregate created using [`counter_agg`](#counter_agg)
    returns:
      - column: num_elements
        type: BIGINT
        description: The number of points with distinct timestamps
  examples:
    - description: Get the number of points for each 15-minute counter aggregate.
      command:
        code: |
          SELECT
              id,
              bucket,
              num_elements(summary)
          FROM (
              SELECT
                  id,
                  time_bucket('15 min'::interval, ts) AS bucket,
                  counter_agg(ts, val) AS summary
              FROM foo
              GROUP BY id, time_bucket('15 min'::interval, ts)
          ) t
---

