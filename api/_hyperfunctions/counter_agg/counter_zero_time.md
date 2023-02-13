---
api_name: counter_zero_time()
excerpt: Calculate the time when the counter value is predicted to have been zero
topics: [hyperfunctions]
api:
  license: community
  type: function
  toolkit: true
  experimental: false
  version:
    stable: 1.3.0
hyperfunction:
  family: counters and gauges
  type: accessor
  aggregates:
    - counter_agg()
api_details:
  summary: >
    Calculate the time when the counter value is predicted to have been zero.
    This is the x-intercept of the linear fit between counter value and time.
  signatures:
    - language: sql
      code: |
        counter_zero_time(
            summary CounterSummary
        ) RETURNS TIMESTAMPTZ
  parameters:
    required:
      - name: summary
        type: CounterSummary
        description: A counter aggregate created using [`counter_agg`](#counter_agg)
    returns:
      - column: counter_zero_time
        type: TIMESTAMPTZ
        description: The time when the counter value is predicted to have been zero
  examples:
    - description: Estimate the time when the counter started
      command:
        code: |
          SELECT
              id,
              bucket,
              counter_zero_time(summary)
          FROM (
              SELECT
                  id,
                  time_bucket('15 min'::interval, ts) AS bucket,
                  counter_agg(ts, val) AS summary
              FROM foo
              GROUP BY id, time_bucket('15 min'::interval, ts)
          ) t
---

