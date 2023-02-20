---
api_name: rate()
excerpt: Calculate the rate of change from a counter aggregate
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
    Calculate the rate of change of the counter. This is the simple rate, equal to
    the last value minus the first value, divided by the time elapsed, after
    accounting for resets.
  signatures:
    - language: sql
      code: |
        rate(
            summary CounterSummary
        ) RETURNS DOUBLE PRECISION
  parameters:
    required:
      - name: summary
        type: CounterSummary
        description: A counter aggregate created using [`counter_agg`](#counter_agg)
    returns:
      - column: rate
        type: DOUBLE PRECISION
        description: The rate of change of the counter
  examples:
    - description: Get the rate of change per `id` over the entire recorded interval.
      command:
        code: |
          SELECT
              id,
              rate(summary)
          FROM (
              SELECT
                  id,
                  counter_agg(ts, val) AS summary
              FROM foo
              GROUP BY id
          ) t
---

