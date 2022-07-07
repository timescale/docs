---
api_name: saturating_sub()
excerpt: Computes x-y, saturating at the numeric bounds instead of overflowing
license: community
toolkit: true
topic: hyperfunctions
tags: [hyperfunctions, saturating math, hyperloglog]
api_category: hyperfunction
experimental-toolkit: true
hyperfunction_toolkit: true
hyperfunction_family: 'saturating math'
hyperfunction_subfamily: hyperloglog
hyperfunction_type: accessor
---

# saturating_sub()  <tag type="toolkit">Toolkit</tag>
The `saturating_sub` function computes x-y, saturating at the numeric bounds instead of overflowing

For more information about saturating math functions, see the
[saturating math docs][saturating-math-docs].

## Required arguments

|Name|Type|Description|
|-|-|-|
|x|INT| An integer that y will subtract from |
|y|INT| An integer to subtract from x |

## Returns

|Column|Type|Description|
|-|-|-|
|saturating_sub |INT| The result of x-y, saturating at the numeric bounds instead of overflowing |


[saturating-math-docs]: /api/:currentVersion:/hyperfunctions/saturating_math/
