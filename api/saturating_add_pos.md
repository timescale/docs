---
api_name: saturating_add_pos()
excerpt: Adds two numbers, saturating at 0 for the minimum bound
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

# saturating_add_pos()  <tag type="toolkit">Toolkit</tag><tag type="toolkit-experimental" content="Experimental" />

The `saturating_add_pos` function adds two numbers, saturating at 0 and 2147483647 instead of overflowing.

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
|`saturating_add_pos`|`INT`| The result of `x+y`, saturating at 0 for the minimum bound |

[saturating-math-docs]: /api/:currentVersion:/hyperfunctions/saturating_math/
