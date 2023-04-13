---
api_name: topn()
excerpt: Get the top N most common values from a space-saving aggregate
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
    Get the top N most common values from a space-saving aggregate.
    The space-saving aggregate can be created from either [`freq_agg`](#freq_agg) or [`mcv_agg`](#mcv_agg).
  signatures:
    - language: sql
      code: |
        topn (
            agg SpaceSavingAggregate,
            n INTEGER
        ) RETURNS AnyElement
  parameters:
    required:
      - name: agg
        type: SpacingsavingAggregate
        description: |
          A space-saving aggregate created using either [`freq_agg`](#freq_agg) or [`mcv_agg`](#mcv_agg)
      - name: n
        type: INTEGER
        description: >
            The number of values to return. Required only for frequency aggregates.
            For top N aggregates, defaults to target N of the aggregate itself, and requests for a higher N return an error.
            In some cases, the function might return fewer than N values.
            This might happen if a frequency aggregate doesn't contain N values above the minimum frequency, or if the data isn't skewed enough to support N values from a top N aggregate.
    returns:
      - column: topn
        type: AnyElement
        description: The N most-frequent values in the aggregate
  examples:
    - description: >
        Get the 20 most frequent `zip_codes` from an `employees` table.
      command:
        code: |
          SELECT topn(mcv_agg(20, zip_code)) FROM employees;
---
