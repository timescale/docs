---
api_name: saturating_mul()
excerpt: Multiples two numbers, saturating at the numeric bounds instead of overflowing
topics: [hyperfunctions]
tags: [hyperfunctions, saturating math]
api:
  license: community
  type: function
  experimental: true
  toolkit: true
  version:
    experimental: 1.8.0
hyperfunction:
  family: saturating math
  type: one-step operation
# fields below will be deprecated
api_category: hyperfunction
api_experimental: true
toolkit: true
hyperfunction_family: 'saturating math'
hyperfunction_subfamily: saturating math
hyperfunction_type: one-step
---

# saturating_mul()  <tag type="toolkit">Toolkit</tag><tag type="experimental-toolkit" content="Experimental" />

The `saturating_mul` function multiples two numbers, saturating at -2147483648 and 2147483647 instead of overflowing.

For more information about saturating math functions, see the
[saturating math docs][saturating-math-docs].

## Required arguments

|Name|Type|Description|
|-|-|-|
|`x`|`INT`| An integer to multiply with y |
|`y`|`INT`| An integer to multiply with x |

## Returns

|Column|Type|Description|
|-|-|-|
|saturating_mul |INT| The result of `x*y`, saturating at the numeric bounds instead of overflowing|

[saturating-math-docs]: /api/:currentVersion:/hyperfunctions/saturating_math/
