---
api_name: gauge_agg()
excerpt: Aggregate gauge data into an intermediate form for further analysis
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
  type: aggregate
  aggregates:
    - gauge_agg()
api_details:
  summary: |
    This is the first step for performing any aggregate calculations
    on gauge data. Use `gauge_agg` to create an intermediate aggregate
    from your data. This intermediate form can then be used
    by one or more accessors in this group to compute final results. Optionally,
    you can combine multiple intermediate aggregate objects with
    [`rollup()`](#rollup) before an accessor is applied.
  signatures:
    - language: sql
      code: |
        gauge_agg(
          ts TIMESTAMPTZ,
          value DOUBLE PRECISION
          [, bounds TSTZRANGE]
        ) RETURNS GaugeSummary
  parameters:
    required:
      - name: ts
        type: TIMESTAMPTZ
        description: The time at each point
      - name: value
        type: DOUBLE PRECISION
        description: The value of the gauge at each point
    optional:
      - name: bounds
        type: TSTZRANGE
        description: >
          The smallest and largest possible times that can be input to this aggregate.
          Bounds are required for extrapolation, but not for other accessor functions.
          If you don't specify bounds at aggregate creation time, you can add them later
          using the [`with_bounds`](#with_bounds) function.
    returns:
      - column: gauge_agg
        type: GaugeSummary
        description: >
          The gauge aggregate, containing data about the variables in an
          intermediate form. Pass the aggregate to accessor functions in the
          gauge aggregates API to perform final calculations. Or, pass the
          aggregate to rollup functions to combine multiple gauge aggregates
          into larger aggregates.
  examples:
    - description: Create a gauge aggregate to summarize daily gauge data.
      command:
        code: |
          SELECT
            time_bucket('1 day'::interval, ts) as dt,
            gauge_agg(ts, val) AS cs
          FROM foo
          WHERE id = 'bar'
          GROUP BY time_bucket('1 day'::interval, ts)
---

