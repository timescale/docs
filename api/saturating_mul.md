---
api_name: saturating_mul()
excerpt: Computes x*y, saturating at the numeric bounds instead of overflowing
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

# saturating_mul()  <tag type="toolkit">Toolkit</tag>
The `saturating_mul` function computes x*y, saturating at the numeric bounds instead of overflowing.

For more information about saturating math functions, see the
[saturating math docs][saturating-math-docs].

## Required arguments

|Name|Type|Description|
|-|-|-|
|x|INT| An integer that will be multiplied with y |
|y|INT| An integer that will be multiplied with x |

## Returns

|Column|Type|Description|
|-|-|-|
|saturating_mul |INT| The result of x*y, saturating at the numeric bounds instead of overflowing|


[saturating-math-docs]: /api/:currentVersion:/hyperfunctions/saturating_math/
