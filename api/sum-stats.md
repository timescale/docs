---
api_name: 'sum() | sum_y() | sum_x()'
excerpt: Calculate the sum from values in a statistical aggregate
license: community
toolkit: true
topic: hyperfunctions
keywords: [statistics, statistical aggregate, hyperfunctions, toolkit]
tags: [sum]
api_category: hyperfunction
api_experimental: false
hyperfunction_toolkit: true
hyperfunction_family: 'statistical aggregates'
hyperfunction_subfamily: 'statistical aggregates'
hyperfunction_type: accessor-1d
---

# sum(), sum_y(), and sum_x() <tag type="toolkit">Toolkit</tag>

```SQL
sum(summary StatsSummary1D, method TEXT) RETURNS BIGINT
```
```SQL
sum_y(summary StatsSummary2D, method TEXT) RETURNS BIGINT
```
```SQL
sum_x(summary StatsSummary2D, method TEXT) RETURNS BIGINT
```

Get the  sum of the values contained in a statistical aggregate.

In a two-dimensional [`stats_agg`][stats-agg] use the `_y`/ `_x` form to access the 
`sum` of the dependent and independent variables. 


For more information about statistical aggregate functions, see the
[hyperfunctions documentation][hyperfunctions-stats-agg].

## Required arguments

|Name|Type|Description|
|-|-|-|
|`summary`|`StatsSummary1D` / `StatsSummary2D`|The already constructed data structure from a previous [`stats_agg`][stats-agg] call|

## Returns

|Column|Type|Description|
|-|-|-|
|`sum`/`sum_y`/`sum_x`|`DOUBLE PRECISION`|The standard deviation of the values in the statistical aggregate|

## Sample usage

```SQL
SELECT sum_y(stats_agg(data, data))
FROM generate_series(0, 100) data;
```
```output
 sum_y 
-------
  5050
```


[hyperfunctions-stats-agg]: /timescaledb/:currentVersion:/how-to-guides/hyperfunctions/stats-aggs/
[stats-agg]: /api/:currentVersion:/hyperfunctions/stats_aggs/stats_agg/
