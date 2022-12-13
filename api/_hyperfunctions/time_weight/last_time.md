---
api_name: last_time()
excerpt: Get the last timestamp from a `TimeWeightSummary` aggregate
topics: [hyperfunctions]
api:
  license: community
  type: function
  toolkit: true
  version:
    stable: 1.11.0
hyperfunction:
  family: time-weighted calculations
  type: accessor
  aggregates:
    - time_weight()
api_details:
  summary: >
    Get the timestamp of the last point in a `TimeWeightSummary` aggregate.
  signatures:
    - language: sql
      code: |
        last_time(
            tw TimeWeightSummary
        ) RETURNS TIMESTAMPTZ
  parameters:
    required:
      - name: tws
        type: TimeWeightSummary
        description: >
          The input `TimeWeightSummary` from a `time_weight()` call.
    returns:
      - column: last_time
        type: TIMESTAMPTZ
        description: The time of the last point in the `TimeWeightSummary`
  examples:
    - description: >
        Produce a linear `TimeWeightSummary` over the column `val` and get the
        last timestamp.
      command:
        code: |
          WITH t as (
              SELECT
                  time_bucket('1 day'::interval, ts) as dt,
                  time_weight('Linear', ts, val) AS tw
              FROM table
              GROUP BY time_bucket('1 day'::interval, ts)
          )
          SELECT
              dt,
              last_time(tw)
          FROM t;
---

