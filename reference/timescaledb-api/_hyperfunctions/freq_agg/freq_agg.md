---
api_name: freq_agg()
excerpt: Aggregate data into a space-saving aggregate for further frequency analysis
topics: [hyperfunctions]
api:
  license: community
  type: function
  toolkit: true
  experimental: true
  version:
    experimental: 1.5.0
hyperfunction:
  family: frequency analysis
  type: aggregate
  aggregates:
    - freq_agg()
api_details:
  summary: >
    Aggregate data into a space-saving aggregate object, which stores frequency information in an intermediate form.
    You can then use any of the accessors in this group to return estimated frequencies or the most common elements.
  signatures:
    - language: sql
      code: |
        freq_agg(
          min_freq DOUBLE PRECISION,
          value AnyElement
        ) RETURNS SpaceSavingAggregate
  parameters:
    required:
      - name: min_freq
        type: DOUBLE PRECISION
        description: |
          Frequency cutoff for keeping track of a value.
          Values that occur less frequently than the cutoff are not stored.
      - name: value
        type: AnyElement
        description: The column to store frequencies for
    returns:
      - column: agg
        type: SpaceSavingAggregate
        description: >
          An object storing the most common elements of the given table and their estimated frequency.
          You can pass this object to any of the accessor functions to get a final result.
  examples:
    - description: >
        Create a space-saving aggregate over a field `ZIP` in a `HomeSales` table.
        This aggregate tracks any `ZIP` value that occurs in at least 5% of rows.
      command:
        code: |
          SELECT toolkit_experimental.freq_agg(0.05, ZIP) FROM HomeSales;
---

