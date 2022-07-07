---
api_name: saturating_add()
excerpt: Computes x+y, saturating at the numeric bounds instead of overflowing
license: community
toolkit: true
experimental-toolkit: true
topic: hyperfunctions
tags: [hyperfunctions, saturating math, hyperloglog]
api_category: hyperfunction
hyperfunction_toolkit: true
hyperfunction_family: 'saturating math'
hyperfunction_subfamily: hyperloglog
hyperfunction_type: accessor
---

# saturating_add()  <tag type="toolkit">Toolkit</tag>
The `saturating_add` function computes x+y, saturating at the numeric bounds instead of overflowing.

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
|saturating_add|INT| The result of x+y, saturating at the numeric bounds instead of overflowing. |


[saturating-math-docs]: timescaledb/:currentVersion:/api/hyperfunctions/saturating-math/
