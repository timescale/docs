---
api_name: error()
excerpt: Get the maximum relative error for a percentile estimate
topics: [hyperfunctions]
keywords: [percentiles, hyperfunctions, toolkit]
tags: [relative error]
api:
  license: community
  type: function
  toolkit: true
hyperfunction:
  family: percentile approximation
  type: accessor
  aggregates:
    - percentile_agg()
    - uddsketch()
# fields below will be deprecated
api_category: hyperfunction
toolkit: false
hyperfunction_family: 'percentile approximation'
hyperfunction_subfamily: 'percentile approximation'
hyperfunction_type: accessor
---

# error()  <tag type="toolkit">Toolkit</tag>

```SQL
error(sketch UddSketch) RETURNS DOUBLE PRECISION
```

This returns the maximum relative error that a percentile estimate has
relative to the correct value. This means the actual value falls in the range
defined by `approx_percentile(sketch) +/- approx_percentile(sketch)*error(sketch)`.

This function can only be used on estimators produced by
[`percentile_agg()`][percentile-agg] or [`uddsketch()`][uddsketch] calls.

*   For more information about percentile approximation algorithms, see
    [advanced aggregation methods][advanced-agg].
*   For more information about percentile approximation functions, see the
    [hyperfunctions documentation][hyperfunctions-percentile-approx].

## Required arguments

|Name|Type|Description|
|-|-|-|
|`sketch`|`UddSketch`|The sketch to determine the error of, usually from a [`percentile_agg()`](https://docs.timescale.com/api/latest/hyperfunctions/percentile-approximation/percentile_agg/) call|

## Returns

|Column|Type|Description|
|-|-|-|
|`error`|`DOUBLE PRECISION`|The maximum relative error of any percentile estimate|

## Sample usage

```SQL
SELECT error(percentile_agg(data))
FROM generate_series(0, 100) data;
```

```output
 error
-------
 0.001
```

[hyperfunctions-percentile-approx]: /timescaledb/:currentVersion:/how-to-guides/hyperfunctions/percentile-approx/
[uddsketch]: /api/:currentVersion:/hyperfunctions/percentile-approximation/percentile-aggregation-methods/uddsketch/
[percentile-agg]: /api/:currentVersion:/hyperfunctions/percentile-approximation/percentile_agg/
[advanced-agg]: /timescaledb/:currentVersion:/how-to-guides/hyperfunctions/percentile-approx/advanced-agg/
