---
api_name: saturating_sub()
excerpt: Subtracts one number from another, saturating at the 32-bit integer bounds instead of overflowing
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
  summary: The `saturating_sub` function subtracts the second number from the first, saturating at -2,147,483,648 and 2,147,483,647 instead of overflowing.
  signatures:
    - language: sql
      code: |
        saturating_sub(
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
      - column: saturating_add
        type: INT
        description: The result of `x - y`, saturating at the numeric bounds instead of overflowing. The numeric bounds are the upper and lower bounds of the 32-bit signed integers.
---

