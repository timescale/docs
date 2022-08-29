---
api_name: saturating_sub_pos()
excerpt: Subtracts one number from another, saturating at 0 for the minimum bound
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

# saturating_sub_pos()  <tag type="toolkit">Toolkit</tag><tag type="experimental-toolkit" content="Experimental" />

The `saturating_sub_pos` subtracts the second number from the first, saturating at 0 and 2147483647 instead of overflowing.

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
|`saturating_sub_pos` |`INT|` The result of `x-y`, saturating at 0 for the minimum bound |

[saturating-math-docs]: /api/:currentVersion:/hyperfunctions/saturating_math/
