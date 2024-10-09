---
api_name: rollup()
excerpt: Combine multiple gauge aggregates
topics: [hyperfunctions]
api:
  license: community
  type: function
  toolkit: true
  experimental: true
  version:
    experimental: 1.6.0
hyperfunction:
  family: counters and gauges
  type: rollup
  aggregates:
    - gauge_agg()
api_details:
  summary: |
    This function combines multiple gauge aggregates into one. This can be used
    to combine aggregates from adjacent intervals into one larger interval,
    such as rolling daily aggregates into a weekly or monthly aggregate.
  signatures:
    - language: sql
      code: |
        rollup(
            cs GaugeSummary
        ) RETURNS GaugeSummary
  parameters:
    required:
      - name: cs
        type: GaugeSummary
        description: A gauge aggregate created using [`gauge_agg`](#gauge_agg)
    returns:
      - column: gauge_agg
        type: GaugeSummary
        description: A new gauge aggregate created by combining the input gauge aggregates
---