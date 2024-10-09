---
api_name: num_elements()
excerpt: Get the number of points with distinct timestamps from a gauge aggregate
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
    Get the number of points with distinct timestamps from a gauge aggregate.
    Duplicate timestamps are ignored.
  signatures:
    - language: sql
      code: |
        num_elements(
            summary GaugeSummary
        ) RETURNS BIGINT
  parameters:
    required:
      - name: summary
        type: GaugeSummary
        description: A gauge aggregate created using [`gauge_agg`](#gauge_agg)
    returns:
      - column: num_elements
        type: BIGINT
        description: The number of points with distinct timestamps
  examples:
    - description: Get the number of points for each 15-minute gauge aggregate.
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
                  gauge_agg(ts, val) AS summary
              FROM foo
              GROUP BY id, time_bucket('15 min'::interval, ts)
          ) t
---

