---
api_name: corr()
excerpt: Calculate the correlation coefficient from a gauge aggregate
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
    Calculate the correlation coefficient from a gauge aggregate. The calculation
    uses a linear least-squares fit, and returns a value between 0.0 and 1.0, from
    no correlation to the strongest possible correlation.
  signatures:
    - language: sql
      code: |
        corr(
            summary GaugeSummary
        ) RETURNS DOUBLE PRECISION
  parameters:
    required:
      - name: summary
        type: GaugeSummary
        description: A gauge aggregate created using [`gauge_agg`](#gauge_agg)
    returns:
      - column: corr
        type: DOUBLE PRECISION
        description: >
          The correlation coefficient calculated with time as the independent variable
          and gauge value as the dependent variable.
  examples:
    - description: >
        Calculate the correlation coefficient to determine the goodness of a linear fit
        between gauge value and time.
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
                  gauge_agg(ts, val) AS summary
              FROM foo
              GROUP BY id, time_bucket('15 min'::interval, ts)
          ) t
---

