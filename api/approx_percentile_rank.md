---
api_name: approx_percentile_rank()
excerpt: Estimate the percentile of a given value from values in a percentile aggregate
topics: [hyperfunctions]
keywords: [percentile, hyperfunctions]
tags: [approximate, rank, toolkit]
api:
  license: community
  type: function
  toolkit: true
  version:
    experimental: 0.2.0
    stable: 1.0.0
hyperfunction:
  family: percentile approximation
  type: accessor
  aggregates:
    - percentile_agg()
    - tdigest()
    - uddsketch()
---

# approx_percentile_rank()  <tag type="toolkit">Toolkit</tag>

Estimate what percentile a given value would be located at in a `UddSketch`.

```SQL
approx_percentile_rank(
    value DOUBLE PRECISION,
    sketch UddSketch
) RETURNS UddSketch
```

*   For more information about percentile approximation algorithms, see
    [advanced aggregation methods][advanced-agg].
*   For more information about percentile approximation functions, see the
    [hyperfunctions documentation][hyperfunctions-percentile-approx].

## Required arguments

|Name|Type|Description|
|---|---|---|
|`value`|`DOUBLE PRECISION`|The value to estimate the percentile of|
|`sketch`|`UddSketch`|The sketch to compute the percentile on|

## Returns

|Column|Type|Description|
|---|---|---|
|`approx_percentile_rank`|`DOUBLE PRECISION`|The estimated percentile associated with the provided value|

## Sample usage

```SQL
SELECT
    approx_percentile_rank(99, percentile_agg(data))
FROM generate_series(0, 100) data;
```

```output
 approx_percentile_rank
----------------------------
         0.9851485148514851
```

[hyperfunctions-percentile-approx]: /timescaledb/:currentVersion:/how-to-guides/hyperfunctions/percentile-approx/
[advanced-agg]: /timescaledb/:currentVersion:/how-to-guides/hyperfunctions/percentile-approx/advanced-agg/
