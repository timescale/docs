---
api_name: rollup()
excerpt: Combine multiple state aggregates
topics: [hyperfunctions]
api:
  license: community
  type: function
  toolkit: true
  version:
    experimental: 1.13.0
    stable: 1.15.0
hyperfunction:
  family: state tracking
  type: rollup
  aggregates:
    - state_agg()
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
        description: State aggregates created using `state_agg`
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
              state_agg(ts, state) AS sa
          FROM states_test
          GROUP BY time_bucket('1 minute', ts))
          SELECT duration_in(
              'START',
              rollup(buckets.sa)
          )
          FROM buckets;
---