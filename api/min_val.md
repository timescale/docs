---
api_name: min_val()
excerpt: Calculate the minimum from values in a `tdigest`
license: community
toolkit: true
api_category: hyperfunction
api_experimental: false
hyperfunction_toolkit: false
hyperfunction_family: 'percentile approximation'
hyperfunction_subfamily: 'percentile approximation'
hyperfunction_type: accessor
---

# min_val()  <tag type="toolkit">Toolkit</tag>

```SQL
min_val(digest TDigest) RETURNS DOUBLE PRECISION
```

Get the minimum value from a `tdigest`. This does not work with `percentile_agg`
or `uddsketch` based estimators. This saves space when you require both a
minimum and a percentile estimate as part of a continuous aggregate. You can
compute a single percentile estimator and do not need to specify a separate
`min` aggregate, by extracting the `min_val` from the percentile estimator.

*   For more information about percentile approximation algorithms, see
    [advanced aggregation methods][advanced-agg].
*   For more information about percentile approximation functions, see the
    [hyperfunctions documentation][hyperfunctions-percentile-approx].

## Required arguments
|Name|Type|Description|
|-|-|-|
|`digest`|`TDigest`|The digest to extract the min value from|

## Returns

|Column|Type|Description|
|---|---|---|
|`min_val`|`DOUBLE PRECISION`|The minimum value entered into the t-digest|

## Sample usage

```SQL
SELECT min_val(tdigest(100, data))
FROM generate_series(1, 100) data;
```

```bash
 min_val
-----------
         1
```


[hyperfunctions-percentile-approx]: timescaledb/:currentVersion:/how-to-guides/hyperfunctions/percentile-approx/
[advanced-agg]: /timescaledb/:currentVersion:/how-to-guides/hyperfunctions/percentile-approx/advanced-agg/
