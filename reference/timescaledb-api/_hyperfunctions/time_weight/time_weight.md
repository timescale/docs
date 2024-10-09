---
api_name: time_weight()
excerpt: Aggregate data into an intermediate time-weighted aggregate form for further calculation
topics: [hyperfunctions]
api:
  license: community
  type: function
  toolkit: true
  version:
    experimental: 0.1.0
    stable: 1.0.0
hyperfunction:
  family: time-weighted calculations
  type: aggregate
  aggregates:
    - time_weight()
api_details:
  summary: >
    This is the first step for performing any time-weighted calculations. Use
    `time_weight` to create an intermediate aggregate (`TimeWeightSummary`) from
    your data. This intermediate form can then be used by one or more accessors
    in this group to compute final results.
    
    Optionally, multiple such intermediate aggregate objects can be combined
    using [`rollup()`](#rollup) before an accessor is applied.
  signatures:
    - language: sql
      code: |
        time_weight(
            method TEXT,
            ts TIMESTAMPTZ,
            value DOUBLE PRECISION
        ) RETURNS TimeWeightSummary
  parameters:
    required:
      - name: method
        type: TEXT
        description: >
          The weighting method to use. The available methods are `linear` (or
          its alias `trapezoidal`, for those familiar with numeric integration
          methods) and `LOCF`, which stands for 'last observation carried
          forward'. `linear` fills in missing data by interpolating linearly
          between the start and end points of the gap. `LOCF` fills in the gap
          by assuming that the value remains constant until the next value is
          seen.

          `LOCF` is most useful when a measurement is taken only when a value
          changes. `linear` is most useful if there are no such guarantees on
          the measurement.

          The method names are case-insensitive.
      - name: ts
        type: TIMESTAMPTZ
        description: >
          The time at each point. Null values are ignored. An aggregate
          evaluated on only `null` values returns `null`.
      - name: value
        type: DOUBLE PRECISION
        description: >
          The value at each point to use for the time-weighted aggregate. Null
          values are ignored. An aggregate evaluated on only `null` values
          returns `null`.
    returns:
      - column: time_weight
        type: TimeWeightSummary
        description: >
          A `TimeWeightSummary` object that can be passed to other functions
          within the time-weighting API
  examples:
    - description: >
        Aggregate data from column `val` into daily time-weighted aggregates,
        using the linear interpolation method.
      command:
        language: sql
        code: |
          SELECT
              time_bucket('1 day'::interval, ts) as dt,
              time_weight('Linear', ts, val) AS tw
          FROM foo
          GROUP BY time_bucket('1 day'::interval, ts)
---

