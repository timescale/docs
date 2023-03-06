---
section: hyperfunction
subsection: saturating math
---

The saturating math hyperfunctions help you perform saturating math on integers.
In saturating math, the final result is bounded. If the result of a normal
mathematical operation exceeds either the minimum or maximum bound, the result
of the corresponding saturating math operation is capped at the bound. For
example, `2 + (-3) = -1`. But in a saturating math function with a lower bound
of `0`, such as [`saturating_add_pos`](#saturating_add_pos), the result is `0`.

You can use saturating math to make sure your results don't overflow the allowed
range of integers, or to force a result to be greater than or equal to zero.
