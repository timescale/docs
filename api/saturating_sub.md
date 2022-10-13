---
api_name: saturating_sub()
excerpt: Subtracts one number from another, saturating at the numeric bounds instead of overflowing
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

# saturating_sub()  <tag type="toolkit">Toolkit</tag><tag type="toolkit-experimental" content="Experimental" />

The `saturating_sub` function subtracts the second number from the first, saturating at -2147483648 and 2147483647 instead of overflowing.

For more information about saturating math functions, see the
[saturating math docs][saturating-math-docs].

## Required arguments

|Name|Type|Description|
|-|-|-|
|`x`|`INT`| An integer for y to subtract from |
|`y`|`INT`| An integer to subtract from x |

## Returns

|Column|Type|Description|
|-|-|-|
|`saturating_sub` |`INT`| The result of `x-y`, saturating at the numeric bounds instead of overflowing |

[saturating-math-docs]: /api/:currentVersion:/hyperfunctions/saturating_math/
