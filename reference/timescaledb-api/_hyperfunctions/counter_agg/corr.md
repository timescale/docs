---
api_name: corr()
excerpt: Calculate the correlation coefficient from a counter aggregate
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
  type: accessor
  aggregates:
    - counter_agg()
api_details:
  summary: >
    Calculate the correlation coefficient from a counter aggregate. The calculation
    uses a linear least-squares fit, and returns a value between 0.0 and 1.0, from
    no correlation to the strongest possible correlation.
  signatures:
    - language: sql
      code: |
        corr(
            summary CounterSummary
        ) RETURNS DOUBLE PRECISION
  parameters:
    required:
      - name: summary
        type: CounterSummary
        description: A counter aggregate created using [`counter_agg`](#counter_agg)
    returns:
      - column: corr
        type: DOUBLE PRECISION
        description: >
          The correlation coefficient calculated with time as the independent variable
          and counter value as the dependent variable.
  examples:
    - description: >
        Calculate the correlation coefficient to determine the goodness of a linear fit
        between counter value and time.
      command:
        code: |
          SELECT
              id,
              bucket,
              corr(summary)
          FROM (
              SELECT
                  id,
                  time_bucket('15 min'::interval, ts) AS bucket,
                  counter_agg(ts, val) AS summary
              FROM foo
              GROUP BY id, time_bucket('15 min'::interval, ts)
          ) t
---

