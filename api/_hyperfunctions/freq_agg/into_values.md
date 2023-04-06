---
api_name: into_values()
excerpt: Get a table of all frequency estimates from a space-saving aggregate
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
  type: accessor
  aggregates:
    - freq_agg()
api_details:
  summary: >
    Returns the data from a space-saving aggregate as a table.
    The table lists the stored values with the minimum and maximum bounds for their estimated frequencies.
  signatures:
    - language: sql
      code: |
        into_values(
            agg SpaceSavingAggregate
        ) RETURNS (AnyElement, DOUBLE PRECISION, DOUBLE PRECISION)
  parameters:
    required:
      - name: agg
        type: SpaceSavingAggregate
        description: A space-saving aggregate created using either [`freq_agg`](#freq_agg) or [`mcv_agg`](#mcv_agg)
    returns:
      - column: value
        type: AnyElement
        description: A commonly seen value in the original dataset
      - column: min_freq
        type: DOUBLE PRECISION
        description: The minimum bound for the estimated frequency
      - column: max_freq
        type: DOUBLE PRECISION
        description: The maximum bound for the estimated frequency
---
