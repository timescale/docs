---
api_name: min_frequency()
excerpt: Get the minimum bound of the estimated frequency for a given value in a space-saving aggregate
topics: [hyperfunctions]
api:
  license: community
  type: function
  toolkit: true
  experimental: true
  version:
    experimental: 1.6.0
hyperfunction:
  family: frequency analysis
  type: accessor
  aggregates:
    - freq_agg()
api_details:
  summary: Get the minimum bound of the estimated frequency for a given value in a space-saving aggregate
  signatures:
    - language: sql
      code: |
        min_frequency (
            agg SpaceSavingAggregate,
            value AnyElement
        ) RETURNS DOUBLE PRECISION
  parameters:
    required:
      - name: agg
        type: SpaceSavingAggregate
        description: A space-saving aggregate creating using either [`freq_agg`](#freq_agg) or [`topn_agg`](#topn_agg)
      - name: value
        type: AnyElement
        description: The value to get the frequency of
    returns:
      - column: min_frequency
        type: DOUBLE PRECISION
        description: >
          The minimum bound for the value's estimated frequency.
          The minimum frequency might be 0 if the value's frequency falls below the space-saving aggregate's cut-off threshold.
          For more information, see [`freq_agg`](#freq_agg).
  examples:
    - description: Find the minimum frequency of the value `3` in a column named `value` within the table `value_test`.
      command:
        code: |
          SELECT toolkit_experimental.min_frequency(
              (SELECT toolkit_experimental.freq_agg(0.05, value) FROM value_test),
              3
          );
---

