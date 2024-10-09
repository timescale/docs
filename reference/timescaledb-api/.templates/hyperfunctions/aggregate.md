---
api_name: <FUNCTION NAME, INCLUDING BRACKETS>
excerpt: <BRIEF DESCRIPTION, THIS SHOWS UP IN SUMMARY LISTS OF FUNCTIONS>
topics: [hyperfunctions]
api:
  license: community
  type: function
  toolkit: true
  experimental: <BOOL>
  version:
    experimental: <VERSION WHEN EXPERIMENTAL FUNCTION INTRODUCED>
    stable: <VERSION WHEN STABILIZED, REMOVE IF NOT STABLE>
hyperfunction:
  family: <LARGER CATEGORY FOR THIS FUNCTION, E.G., STATISTICAL AND REGRESSION ANALYSIS>
  type: aggregate
  aggregates:
    - <AGGREGATE NAME, INCLUDING BRACKETS>
api_details:
  summary: <LONGER DESCRIPTION OF WHAT THIS FUNCTION DOES>
  signatures:
    - language: sql
      code: |
        <FUNCTION SIGNATURE>
  parameters:
    required:
      - name: <NAME>
        type: <TYPE>
        description: <DESCRIPTION>
    optional:
      - name: <NAME>
        type: <TYPE>
        description: <DESCRIPTION, DELETE THIS SECTION IF NO OPTIONAL ARGUMENTS>
    returns:
      - column: <COLUMN NAME>
        type: <TYPE>
        description: <DESCRIPTION>
  examples:
    - description: <WHAT THIS EXAMPLE DOES>
      command:
        code: |
          <CODE TO RUN>
      return:
        code: |
          <WHAT THE OUTPUT LOOKS LIKE, DELETE IF OUTPUT TRIVIAL OR UNIMPORTANT>
---

