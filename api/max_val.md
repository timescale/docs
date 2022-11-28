---
api_name: max_val()
excerpt: Calculate the maximum from values in a `tdigest`
topics: [hyperfunctions]
keywords: [tdigest, hyperfunctions, Toolkit]
tags: [percentiles, maximum]
api:
  license: community
  type: function
  toolkit: true
  version:
    experimental: 0.1.0
    stable: 1.0.0
hyperfunction:
  family: percentile approximation
  type: accessor
  aggregates:
    - tdigest()
---

# max_val()  <tag type="toolkit">Toolkit</tag>

```SQL
max_val(digest TDigest) RETURNS DOUBLE PRECISION
```

Get the maximum value from a `tdigest`. This does not work with `percentile_agg`
or `uddsketch` based estimators. This is provided in order to save space when
both a maximum and a percentile estimate are required as part of continuous
aggregates. You can calculate a single percentile estimator by extracting the
`max_val` from the percentile estimator, without needing to specify a separate
`max` aggregate.

*   For more information about percentile approximation algorithms, see
    [advanced aggregation methods][advanced-agg].
*   For more information about percentile approximation functions, see the
    [hyperfunctions documentation][hyperfunctions-percentile-approx].

### Required arguments

|Name|Type|Description|
|-|-|-|
|`digest`|`TDigest`|The digest to extract the max value from|

### Returns

|Column|Type|Description|
|-|-|-|
|`max_val`|`DOUBLE PRECISION`|The maximum value entered into the t-digest.|

### Sample usage

```SQL
SELECT max_val(tdigest(100, data))
FROM generate_series(1, 100) data;
```

```bash
 max_val
---------
     100
```

[advanced-agg]: /timescaledb/:currentVersion:/how-to-guides/hyperfunctions/percentile-approx/advanced-agg/
[hyperfunctions-percentile-approx]: /timescaledb/:currentVersion:/how-to-guides/hyperfunctions/percentile-approx/
