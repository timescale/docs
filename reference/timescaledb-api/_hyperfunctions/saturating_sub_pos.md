---
api_name: saturating_sub_pos()
excerpt: Subtracts one number from another, saturating at 0 for the minimum bound
topics: [hyperfunctions]
api:
  license: community
  type: function
  toolkit: true
  experimental: true
  version:
    experimental: 1.8.0
hyperfunction:
  family: saturating math
  type: function
api_details:
  summary: The `saturating_sub_pos` subtracts the second number from the first, saturating at 0 and 2,147,483,647 instead of overflowing.
  signatures:
    - language: sql
      code: |
        saturating_sub_pos(
          x INT,
          y INT
        ) RETURNS INT
  parameters:
    required:
      - name: x
        type: INT
        description: An integer for `y` to subtract from
      - name: y
        type: INT
        description: An integer to subtract from `x`
    returns:
      - column: saturating_sub_pos
        type: INT
        description: The result of `x - y`, saturating at 0 for the minimum bound.
---

