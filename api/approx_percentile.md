---
api_name: approx_percentile()
excerpt: Estimate the value at a given percentile from values in a percentile aggregate
license: community
toolkit: true
experimental: false
topic: hyperfunctions
keywords: [percentile, hyperfunctions]
tags: [approximate, toolkit]
api_category: hyperfunction
api_experimental: false
hyperfunction_toolkit: true
hyperfunction_family: 'percentile approximation'
hyperfunction_subfamily: 'percentile approximation'
hyperfunction_type: accessor
---

## approx_percentile()  <tag type="toolkit">Toolkit</tag>

Get the approximate value at a percentile from a percentile estimate.

```SQL
approx_percentile(
    percentile DOUBLE PRECISION,
    sketch  uddsketch
) RETURNS DOUBLE PRECISION
```

For more information about percentile approximation functions, see the
[hyperfunctions documentation][hyperfunctions-percentile-approx].

## Required arguments

|Name|Type|Description|
|---|---|---|
|`approx_percentile`|`DOUBLE PRECISION`|The desired percentile (0.0-1.0) to approximate|
|`sketch`|`UddSketch`|The sketch to compute the approx_percentile on, usually from a `percentile_agg`|

## Returns

|Column|Type|Description|
|---|---|---|
|`approx_percentile`|`DOUBLE PRECISION`|The estimated value at the requested percentile|

### Sample usage

```SQL
SELECT
    approx_percentile(0.01, percentile_agg(data))
FROM generate_series(0, 100) data;
```
```output
approx_percentile
-------------------
             0.999
```


[hyperfunctions-percentile-approx]: /timescaledb/:currentVersion:/how-to-guides/hyperfunctions/percentile-approx/
