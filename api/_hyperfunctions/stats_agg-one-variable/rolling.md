---
api_name: rolling()
excerpt: Combine multiple one-dimensional statistical aggregates to calculate rolling window aggregates
topics: [hyperfunctions]
keywords: [statistics, hyperfunctions, Toolkit]
api:
  license: community
  type: function
  toolkit: true
  version:
    experimental: 1.0.0
    stable: 1.3.0
hyperfunction:
  family: statistical and regression analysis
  type: rollup
  aggregates:
    - stats_agg() (one variable)
api_details:
  summary: >
    Combine multiple intermediate statistical aggregate (`StatsSummary1D`)
    objects into a single `StatsSummary1D` object. It is optimized for use in a
    window function context for computing tumbling window statistical aggregates.
  details:
    - type: note
      content: >
        This is especially useful for computing tumbling window aggregates from
        a continuous aggregate. It can be orders of magnitude faster because it
        uses inverse transition and combine functions, with the possibility that
        bigger floating point errors can occur in unusual scenarios.
        
        For re-aggregation in a non-window function context, such as combining
        hourly buckets into daily buckets, see [`rollup()`](#rollup).
  signatures:
    - language: sql
      code: |
        rolling(
            ss StatsSummary1D
        ) RETURNS StatsSummary1D
  parameters:
    required:
      - name: summary
        type: StatsSummary1D
        description: >
          The statistical aggregate produced by a `stats_agg` call
    returns:
      - column: rolling
        type: StatsSummary1D
        description: >
          A new statistical aggregate produced by combining the input statistical
          aggregates
  examples:
    - description: >
        Combine hourly continuous aggregates to create a tumbling window daily
        aggregate. Calculate the [average](#average) and [standard
        deviation](#stddev) using the appropriate accessors.
      command:
        language: sql
        code: |
          CREATE MATERIALIZED VIEW foo_hourly
          WITH (timescaledb.continuous)
          AS SELECT
            time_bucket('1h'::interval, ts) AS bucket,
            stats_agg(value) as stats
          FROM foo
          GROUP BY 1;
          
          SELECT
            bucket,
            average(rolling(stats) OVER (ORDER BY bucket RANGE '1 day' PRECEDING)),
            stddev(rolling(stats) OVER (ORDER BY bucket RANGE '1 day' PRECEDING)),
          FROM foo_hourly;
---

