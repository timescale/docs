---
api_name: num_vals()
excerpt: Calculate the number of values contained in a percentile estimate
license: community
toolkit: true
topic: hyperfunctions
keywords: [percentiles, hyperfunctions, toolkit]
tags: [number, count]
api_category: hyperfunction
api_experimental: false
hyperfunction_toolkit: false
hyperfunction_family: 'percentile approximation'
hyperfunction_subfamily: 'percentile approximation'
hyperfunction_type: accessor
---

# num_vals()  <tag type="toolkit">Toolkit</tag>

```SQL
num_vals(StatsSummary1D) RETURNS DOUBLE PRECISION
```
```SQL
num_vals(digest tdigest) RETURNS DOUBLE PRECISION
```

Get the number of values contained in a percentile estimate. This saves space
when you need both a count and a percentile estimate as part of a continuous
aggregate. You can compute a single percentile estimator by extracting the
`num_vals` from the percentile estimator. You do not need to specify a separate
`count` aggregate.


*   For more information about percentile approximation functions, see the
    [hyperfunctions documentation][hyperfunctions-percentile-approx].

## Required arguments

|Name|Type|Description|
|---|---|---|
|`sketch`/`digest`|`UddSketch` or `tdigest`|The percentile estimator to extract the number of values from, usually from a [`percentile_agg()`](/hyperfunctions/percentile-approximation/percentile_agg/) call|

## Returns

|Column|Type|Description|
|---|---|---|
|`num_vals`|`DOUBLE PRECISION`|The number of values in the percentile estimate|

## Sample usage

```SQL
SELECT num_vals(percentile_agg(data))
FROM generate_series(0, 100) data;
```
```output
 num_vals
-----------
       101
```


[hyperfunctions-stats-agg]: timescaledb/:currentVersion:/how-to-guides/hyperfunctions/stats-aggs/
[hyperfunctions-percentile-approx]: timescaledb/:currentVersion:/how-to-guides/hyperfunctions/percentile-approx/
