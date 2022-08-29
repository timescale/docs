---
api_name: saturating_add()
excerpt: Adds two numbers, saturating at the numeric bounds instead of overflowing
topics: [hyperfunctions]
tags: [hyperfunctions, saturating math]
api:
  license: community
  type: function
  experimental: true
  toolkit: true
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

# saturating_add()  <tag type="toolkit">Toolkit</tag><tag type="toolkit-experimental" content="Experimental" />

The `saturating_add` function adds two numbers, saturating at -2147483648 and 2147483647 instead of overflowing.

For more information about saturating math functions, see the
[saturating math docs][saturating-math-docs].

## Required arguments

|Name|Type|Description|
|-|-|-|
|`x`|`INT`| An integer to add to y|
|`y`|`INT`| An integer to add to x |

## Returns

|Column|Type|Description|
|-|-|-|
|`saturating_add`|`INT`| The result of `x+y`, saturating at the numeric bounds instead of overflowing. The numeric bounds are the upper and lower bounds of the 32-bit signed integers.|

[saturating-math-docs]: /api/:currentVersion:/hyperfunctions/saturating_math/
