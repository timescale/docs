---
api_name: rollup()
excerpt: Combine multiple counter aggregates
topics: [hyperfunctions]
api:
  license: community
  type: function
  toolkit: true
  experimental: false
  version:
    experimental: 0.3.0
    stable: 1.3.0
hyperfunction:
  family: counters and gauges
  type: rollup
  aggregates:
    - counter_agg()
api_details:
  summary: |
    This function combines multiple counter aggregates into one. This can be used
    to combine aggregates from adjacent intervals into one larger interval,
    such as rolling daily aggregates into a weekly or monthly aggregate.
  signatures:
    - language: sql
      code: |
        rollup(
            cs CounterSummary
        ) RETURNS CounterSummary
  parameters:
    required:
      - name: cs
        type: CounterSummary
        description: A counter aggregate created using [`counter_agg`](#counter_agg)
    returns:
      - column: counter_agg
        type: CounterSummary
        description: A new counter aggregate created by combining the input counter aggregates
---