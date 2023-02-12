---
api_name: with_bounds()
excerpt: Add bounds to a gauge aggregate
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
  type: mutator
  aggregates:
    - gauge_agg()
api_details:
  summary: |
    Add time bounds to an already-computed gauge aggregate. Bounds are necessary
    to use extrapolation accessors on the aggregate.
  signatures:
    - language: sql
      code: |
        with_bounds(
            summary GaugeSummary,
            bounds TSTZRANGE,
        ) RETURNS GaugeSummary
  parameters:
    required:
      - name: cs
        type: GaugeSummary
        description: A gauge aggregate created using [`gauge_agg`](#gauge_agg)
      - name: bounds
        type: TSTZRANGE
        description: A range of `timestamptz` giving the smallest and largest allowed times in the gauge aggregate
    returns:
      - column: gauge_agg
        type: GaugeSummary
        description: A new gauge aggregate with the bounds applied
  examples:
    - description: >
        Create a gauge aggregate for each `id` and each 15-minute interval. Then add
        bounds to the gauge aggregate, so you can calculate the extrapolated rate.
      command:
        code: |
          SELECT
              id,
              bucket,
              extrapolated_rate(
                  with_bounds(
                      summary,
                      time_bucket_range('15 min'::interval, bucket)
                  )
              )
          FROM (
              SELECT
                  id,
                  time_bucket('15 min'::interval, ts) AS bucket,
                  gauge_agg(ts, val) AS summary
              FROM foo
              GROUP BY id, time_bucket('15 min'::interval, ts)
          ) t
---