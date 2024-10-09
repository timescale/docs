---
api_name: delta()
excerpt: Calculate the change in a counter from a counter aggregate
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
    Get the change in a counter over a time period. This is the simple delta,
    computed by subtracting the last seen value from the first, after accounting
    for resets.
  signatures:
    - language: sql
      code: |
        delta(
            summary CounterSummary
        ) RETURNS DOUBLE PRECISION
  parameters:
    required:
      - name: summary
        type: CounterSummary
        description: A counter aggregated created using [`counter_agg`](#counter_agg)
    returns:
      - column: delta
        type: DOUBLE PRECISION
        description: The change in the counter over the bucketed interval
  examples:
    - description: Get the change in each counter over the entire time interval in table `foo`.
      command:
        code: |
          SELECT
              id,
              delta(summary)
          FROM (
              SELECT
                  id,
                  counter_agg(ts, val) AS summary
              FROM foo
              GROUP BY id
          ) t
---

