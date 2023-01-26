---
api_name: rollup()
excerpt: Combine multiple timeline aggregates
topics: [hyperfunctions]
api:
  license: community
  type: function
  toolkit: true
  experimental: true
  version:
    experimental: 1.13.0
hyperfunction:
  family: state tracking
  type: rollup
  aggregates:
    - timeline_agg()
api_details:
  summary: >
    Combine multiple timeline aggregates into a single timeline aggregate. For
    example, you can use `rollup` to combine timeline aggregates from 15-minute
    buckets into daily buckets.
  signatures:
    - language: sql
      code: |
        rollup(
            agg TimelineAgg
        ) RETURNS TimelineAgg
  parameters:
    required:
      - name: agg
        type: Timeline
        description: Timeline aggregates created using `timeline_agg`
    returns:
      - column: agg
        type: TimelineAgg
        description: A new timeline aggregate that combines the input timeline aggregates
  examples:
    - description: Combine multiple timeline aggregates and calculate the duration spent in the `START` state.
      command:
        code: |
          WITH buckets AS (SELECT
              time_bucket('1 minute', ts) as dt,
              toolkit_experimental.timeline_agg(ts, state) AS ta
          FROM states_test
          GROUP BY time_bucket('1 minute', ts))
          SELECT toolkit_experimental.duration_in(
              'START',
              toolkit_experimental.rollup(buckets.ta)
          )
          FROM buckets;
---