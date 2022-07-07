---
api_name: saturating_add_pos()
excerpt: Computes x+y, saturating at 0 for the minimum bound
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

# saturating_add_pos()  <tag type="toolkit">Toolkit</tag>
The `saturating_add_pos` function computes x+y, saturating at 0 for the minimum bound.

For more information about saturating math functions, see the
[saturating math docs][saturating-math-docs].

## Required arguments

|Name|Type|Description|
|-|-|-|
|x|INT| An integer to add to y|
|y|INT| An integer to add to x |

## Returns

|Column|Type|Description|
|-|-|-|
|saturating_add_pos|INT| The result of x+y, saturating at 0 for the minimum bound |


[saturating-math-docs]: /api/:currentVersion:/hyperfunctions/saturating_math/
