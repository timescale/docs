---
api_name: rollup()
excerpt: Combine multiple state aggregates
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
    - compact_state_agg()
api_details:
  summary: >
    Combine multiple state aggregates into a single state aggregate. For
    example, you can use `rollup` to combine state aggregates from 15-minute
    buckets into daily buckets.
  signatures:
    - language: sql
      code: |
        rollup(
            agg StateAgg
        ) RETURNS StateAgg
  parameters:
    required:
      - name: agg
        type: StateAgg
        description: State aggregates created using `compact_state_agg`
    returns:
      - column: agg
        type: StateAgg
        description: A new state aggregate that combines the input state aggregates
  examples:
    - description: Combine multiple state aggregates and calculate the duration spent in the `START` state.
      command:
        code: |
          WITH buckets AS (SELECT
              time_bucket('1 minute', ts) as dt,
              toolkit_experimental.compact_state_agg(ts, state) AS sa
          FROM states_test
          GROUP BY time_bucket('1 minute', ts))
          SELECT toolkit_experimental.duration_in(
              'START',
              toolkit_experimental.rollup(buckets.sa)
          )
          FROM buckets;
---