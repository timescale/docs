---
api_name: with_bounds()
excerpt: Add bounds to a counter aggregate
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
  type: mutator
  aggregates:
    - counter_agg()
api_details:
  summary: |
    Add time bounds to an already-computed counter aggregate. Bounds are necessary
    to use extrapolation accessors on the aggregate.
  signatures:
    - language: sql
      code: |
        with_bounds(
            summary CounterSummary,
            bounds TSTZRANGE,
        ) RETURNS CounterSummary
  parameters:
    required:
      - name: cs
        type: CounterSummary
        description: A counter aggregate created using [`counter_agg`](#counter_agg)
      - name: bounds
        type: TSTZRANGE
        description: A range of `timestamptz` giving the smallest and largest allowed times in the counter aggregate
    returns:
      - column: counter_agg
        type: CounterSummary
        description: A new counter aggregate with the bounds applied
  examples:
    - description: >
        Create a counter aggregate for each `id` and each 15-minute interval. Then add
        bounds to the counter aggregate, so you can calculate the extrapolated rate.
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
                  counter_agg(ts, val) AS summary
              FROM foo
              GROUP BY id, time_bucket('15 min'::interval, ts)
          ) t
---