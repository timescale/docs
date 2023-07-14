---
api_name: mcv_agg()
excerpt: Aggregate data into a space-saving aggregate for further calculation of most-frequent values
topics: [hyperfunctions]
api:
  license: community
  type: function
  toolkit: true
  version:
    experimental: 1.6.0
    stable: 1.16.0
hyperfunction:
  family: frequency analysis
  type: alternate aggregate
  aggregates:
    - freq_agg()
api_details:
  summary: |
    Aggregate data into a space-saving aggregate, which stores frequency information in an intermediate form.
    You can then use any of the accessors in this group to return estimated frequencies or the most common elements.

    This differs from [`freq_agg`](#freq_agg) in that you can specify a target number of values to keep, rather than a frequency cutoff.
  signatures:
    - language: sql
      code: |
        mcv_agg (
            n INTEGER,
            value AnyElement
            [, skew DOUBLE PRECISION]
        ) RETURNS SpaceSavingAggregate
  parameters:
    required:
      - name: n
        type: INTEGER
        description: The target number of most-frequent values
      - name: value
        type: AnyElement
        description: The column to store frequencies for
    optional:
      - name: skew
        type: DOUBLE PRECISION
        description: >
          The estimated skew of the data, defined as the `s` parameter of a zeta distribution.
          Must be greater than `1.0`.
          Defaults to `1.1`.
          For more information, see the section on [skew](#estimated-skew).
    returns:
      - column: agg
        type: SpaceSavingAggregate
        description: >
          An object storing the most common elements of the given table and their estimated frequency.
          You can pass this object to any of the accessor functions to get a final result.
  examples:
    - description: >
        Create a topN aggregate over the `country` column of the `users` table.
        Targets the top 10 most-frequent values.
      command:
        code: |
          SELECT mcv_agg(10, country) FROM users;
    - description: >
        Create a topN aggregate over the `type` column of the `devices` table.
        Estimates the skew of the data to be 1.05, and targets the 5 most-frequent values.
      command:
        code: |
          SELECT mcv_agg(5, 1.05, type) FROM devices;
---
