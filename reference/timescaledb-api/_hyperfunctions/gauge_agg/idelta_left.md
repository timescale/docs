---
api_name: idelta_left()
excerpt: Calculate the instantaneous change at the left, or earliest, edge of a gauge aggregate
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
    Calculate the instantaneous change at the left, or earliest, edge of a gauge aggregate.
    This is equal to the second value minus the first value.
  signatures:
    - language: sql
      code: |
        idelta_left(
          summary GaugeSummary
        ) RETURNS DOUBLE PRECISION
  parameters:
    required:
      - name: summary
        type: GaugeSummary
        description: A gauge aggregate created using [`gauge_agg`](#gauge_agg)
    returns:
      - column: idelta_left
        type: DOUBLE PRECISION
        description: The instantaneous delta at the left, or earliest, edge of the gauge aggregate
  examples:
    - description: Get the instantaneous change at the start of each 15-minute gauge aggregate.
      command:
        code: |
          SELECT
              id,
              bucket,
              idelta_left(summary)
          FROM (
              SELECT
                  id,
                  time_bucket('15 min'::interval, ts) AS bucket,
                  gauge_agg(ts, val) AS summary
              FROM foo
              GROUP BY id, time_bucket('15 min'::interval, ts)
          ) t
---

