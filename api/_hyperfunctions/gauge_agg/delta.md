---
api_name: delta()
excerpt: Calculate the change in a gauge from a gauge aggregate
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
    Get the change in a gauge over a time period. This is the simple delta,
    computed by subtracting the last seen value from the first.
  signatures:
    - language: sql
      code: |
        delta(
            summary GaugeSummary
        ) RETURNS DOUBLE PRECISION
  parameters:
    required:
      - name: summary
        type: GaugeSummary
        description: A gauge aggregated created using [`gauge_agg`](#gauge_agg)
    returns:
      - column: delta
        type: DOUBLE PRECISION
        description: The change in the gauge over the bucketed interval
  examples:
    - description: Get the change in each gauge over the entire time interval in table `foo`.
      command:
        code: |
          SELECT
              id,
              delta(summary)
          FROM (
              SELECT
                  id,
                  gauge_agg(ts, val) AS summary
              FROM foo
              GROUP BY id
          ) t
---

