---
api_name: saturating_add_pos()
excerpt: Adds two numbers, saturating at 0 for the minimum bound
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
  summary: The `saturating_add_pos` function adds two numbers, saturating at 0 and 2,147,483,647 instead of overflowing.
  signatures:
    - language: sql
      code: |
        saturating_add_pos(
          x INT,
          y INT
        ) RETURNS INT
  parameters:
    required:
      - name: x
        type: INT
        description: An integer to add to `y`
      - name: y
        type: INT
        description: An integer to add to `x`
    returns:
      - column: saturating_add_pos
        type: INT
        description: The result of `x + y`, saturating at 0 for the minimum bound.
---

