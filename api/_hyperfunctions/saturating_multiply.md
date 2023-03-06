---
api_name: saturating_mul()
excerpt: Multiples two numbers, saturating at the 32-bit integer bounds instead of overflowing
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
  summary: The `saturating_mul` function multiples two numbers, saturating at -2,147,483,648 and 2,147,483,647 instead of overflowing.
  signatures:
    - language: sql
      code: |
        saturating_mul(
          x INT,
          y INT
        ) RETURNS INT
  parameters:
    required:
      - name: x
        type: INT
        description: An integer to multiply with `y`
      - name: y
        type: INT
        description: An integer to multiply with `x`
    returns:
      - column: saturating_mul
        type: INT
        description: The result of `x * y`, saturating at the numeric bounds instead of overflowing. The numeric bounds are the upper and lower bounds of the 32-bit signed integers.
---

