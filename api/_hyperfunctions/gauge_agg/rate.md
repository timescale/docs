---
api_name: rate()
excerpt: Calculate the rate of change from a gauge aggregate
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
  type: accessor
  aggregates:
    - gauge_agg()
api_details:
  summary: >
    Calculate the rate of change of the gauge. This is the simple rate, equal to
    the last value minus the first value, divided by the time elapsed.
  signatures:
    - language: sql
      code: |
        rate(
            summary GaugeSummary
        ) RETURNS DOUBLE PRECISION
  parameters:
    required:
      - name: summary
        type: GaugeSummary
        description: A gauge aggregate created using [`gauge_agg`](#gauge_agg)
    returns:
      - column: rate
        type: DOUBLE PRECISION
        description: The rate of change of the gauge
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
                  gauge_agg(ts, val) AS summary
              FROM foo
              GROUP BY id
          ) t
---

