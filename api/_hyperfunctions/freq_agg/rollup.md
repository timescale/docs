---
api_name: rollup()
excerpt: Combine multiple frequency aggregates
topics: [hyperfunctions]
api:
  license: community
  type: function
  toolkit: true
  version:
    experimental: 1.14.0
    stable: 1.16.0
hyperfunction:
  family: frequency analysis
  type: rollup
  aggregates:
    - freq_agg()
api_details:
  summary: |
    This will combine multiple aggregates created with `freq_agg` or 
    `mcv_agg` functions. This function does require that the source 
    aggregates have been created with the same parameters (same `min_freq`
    for `freq_agg`, same n-factor and `skew`, if used, for a `mcv_agg`).

    This will produce a very similar aggregate to running the same
    aggregate function over all the source data. In most cases, any
    difference will be no more than what you might get from simply reordering
    the input. However, if the source data for the different aggregates is
    very differently distributed, the rollup result may have looser frequency
    bounds.
  signatures:
    - language: sql
      code: |
        rollup(
            agg SpaceSavingAggregate
        ) RETURNS SpaceSavingAggregate
  parameters:
    required:
      - name: agg
        type: SpaceSavingAggregate
        description: The aggregates to roll up. These must have been created with the same parameters.
    returns:
      - column: rollup
        type: SpaceSavingAggregate
        description: >
          An aggregate containing the most common elements from all of the underlying data for all of the aggregates.
---