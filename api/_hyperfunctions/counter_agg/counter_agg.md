---
api_name: counter_agg()
excerpt: Aggregate counter data into an intermediate form for further analysis
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
  type: aggregate
  aggregates:
    - counter_agg()
api_details:
  summary: |
    This is the first step for performing any aggregate calculations
    on counter data. Use `counter_agg` to create an intermediate aggregate
    from your data. This intermediate form can then be used
    by one or more accessors in this group to compute final results. Optionally,
    you can combine multiple intermediate aggregate objects using
    [`rollup()`](#rollup) before an accessor is applied.
  signatures:
    - language: sql
      code: |
        counter_agg(
          ts TIMESTAMPTZ,
          value DOUBLE PRECISION
          [, bounds TSTZRANGE]
        ) RETURNS CounterSummary
  parameters:
    required:
      - name: ts
        type: TIMESTAMPTZ
        description: The time at each point
      - name: value
        type: DOUBLE PRECISION
        description: The value of the counter at each point
    optional:
      - name: bounds
        type: TSTZRANGE
        description: >
          The smallest and largest possible times that can be input to this aggregate.
          Bounds are required for extrapolation, but not for other accessor functions.
          If you don't specify bounds at aggregate creation time, you can add them later
          using the [`with_bounds`](#with_bounds) function.
    returns:
      - column: counter_agg
        type: CounterSummary
        description: >
          The counter aggregate, containing data about the variables in an
          intermediate form. Pass the aggregate to accessor functions in the
          counter aggregates API to perform final calculations. Or, pass the
          aggregate to rollup functions to combine multiple counter aggregates
          into larger aggregates.
  examples:
    - description: Create a counter aggregate to summarize daily counter data.
      command:
        code: |
          SELECT
            time_bucket('1 day'::interval, ts) as dt,
            counter_agg(ts, val) AS cs
          FROM foo
          WHERE id = 'bar'
          GROUP BY time_bucket('1 day'::interval, ts)
---

