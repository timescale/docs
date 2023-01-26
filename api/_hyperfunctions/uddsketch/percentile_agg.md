---
api_name: percentile_agg()
excerpt: Aggregate data in a uddsketch, using some reasonable default values, for further calculation of percentile estimates
topics: [hyperfunctions]
api:
  license: community
  type: function
  toolkit: true
  version:
    experimental: 0.2.0
    stable: 1.0.0
hyperfunction:
  family: percentile approximation
  type: alternate aggregate
  aggregates:
    - uddsketch()
api_details:
  summary: |
    This is an alternate first step for calculating approximate percentiles. It
    provides some added convenience by using some sensible defaults to create
    a `UddSketch`. Internally, it calls `uddsketch` with 200 buckets and a
    maximum error rate of 0.001.
    
    Use `percentile_agg` to create an intermediate aggregate from your raw data.
    This intermediate form can then be used by one or more accessors in this
    group to compute final results. 
    
    Optionally, multiple such intermediate aggregate objects can be combined
    using [`rollup()`](#rollup) before an accessor is applied.
  signatures:
    - language: sql
      code: |
        percentile_agg(
          value DOUBLE PRECISION
        ) RETURNS UddSketch
  parameters:
    required:
      - name: value
        type: DOUBLE PRECISION
        description: Column of values to aggregate for percentile calculation
    returns:
      - column: percentile_agg
        type: UddSketch
        description: >
          A percentile estimator object created to calculate percentiles using
          the `UddSketch` algorithm
  examples:
    - description: >
        Create a continuous aggregate that stores percentile aggregate objects.
        These objects can later be used with multiple accessors for retrospective
        analysis.
      command:
        code: |
          CREATE MATERIALIZED VIEW foo_hourly
          WITH (timescaledb.continuous)
          AS SELECT
              time_bucket('1 h'::interval, ts) as bucket,
              percentile_agg(value) as pct_agg
          FROM foo
          GROUP BY 1;
---

