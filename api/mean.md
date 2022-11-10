---
api_name: mean()
excerpt: Calculate the mean from values in a percentile aggregate
topics: [hyperfunctions]
keywords: [hyperfunctions, toolkit]
tags: [average, percentiles]
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
    - percentile_agg()
    - tdigest()
    - uddsketch()
---

# mean()  <tag type="toolkit">Toolkit</tag>

```SQL
mean(sketch UddSketch) RETURNS DOUBLE PRECISION
```

```SQL
mean(digest tdigest) RETURNS DOUBLE PRECISION
```

Get the exact average of all the values in the percentile estimate. Percentiles
returned are estimates, the average is exact. This is provided in order to save
space when both a mean and a percentile estimate are required as part of
continuous aggregates. You can  compute a single percentile estimator by
extracting the mean from the percentile estimator, without needing to specify a
separate `avg` aggregate.

*   For more information about percentile approximation algorithms, see
    [advanced aggregation methods][advanced-agg].
*   For more information about percentile approximation functions, see the
    [hyperfunctions documentation][hyperfunctions-percentile-approx].

### Required arguments

|Name|Type|Description|
|-|-|-|
|`sketch`/`digest`|`UddSketch`/`tdigest`|The sketch to extract the mean value from, usually from a `percentile_agg()`|

### Returns

|Column|Type|Description|
|-|-|-|
|`mean`|`DOUBLE PRECISION`|The average of the values in the percentile estimate.|

### Sample usage

```SQL
SELECT mean(percentile_agg(data))
FROM generate_series(0, 100) data;
```

```output
 mean
------
 50
```

[advanced-agg]: /timescaledb/:currentVersion:/how-to-guides/hyperfunctions/percentile-approx/advanced-agg/
[hyperfunctions-percentile-approx]: /timescaledb/:currentVersion:/how-to-guides/hyperfunctions/percentile-approx/
