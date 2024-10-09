---
api_name: num_changes()
excerpt: Get the number of times a gauge changed from a gauge aggregate
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
    Get the number of times the gauge changed during the period summarized by the
    gauge aggregate.
  signatures:
    - language: sql
      code: |
        num_changes(
            summary GaugeSummary
        ) RETURNS BIGINT
  parameters:
    required:
      - name: summary
        type: GaugeSummary
        description: A gauge summary created using [`gauge_agg`](#gauge_agg)
    returns:
      - column: num_changes
        type: BIGINT
        description: The number of times the gauge changed
  examples:
    - description: Get the number of times the gauge changed over each 15-minute interval.
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
                  gauge_agg(ts, val) AS summary
              FROM foo
              GROUP BY id, time_bucket('15 min'::interval, ts)
          ) t
---

