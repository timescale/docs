---
api_name: 'average() | average_y() | average_x()'
excerpt: Calculate the average of values in a statistical aggregate
license: community
toolkit: true
experimental: false
topic: hyperfunctions
keywords: [average, statistics, statistical aggregate, hyperfunctions, toolkit]
api_category: hyperfunction
api_experimental: false
hyperfunction_toolkit: true
hyperfunction_family: 'statistical aggregates'
hyperfunction_subfamily: 'statistical aggregates'
hyperfunction_type: accessor-1d
---

# average(), average_y(), and average_x() <tag type="toolkit">Toolkit</tag>

```SQL
average(summary StatsSummary1D) RETURNS BIGINT
```
```SQL
average_y(summary StatsSummary2D) RETURNS BIGINT
```
```SQL
average_x(summary StatsSummary2D) RETURNS BIGINT
```

Get the average of the values contained in a statistical aggregate.
In a two-dimensional [`stats_agg`][stats-agg] use the `_y`/ `_x` form to access the 
average of the dependent and independent variables. 

For more information about statistical aggregate functions, see the
[hyperfunctions documentation][hyperfunctions-stats-agg].

## Required arguments

|Name|Type|Description|
|-|-|-|
|`summary`|`StatsSummary1D`/`StatsSummary2D`|The already constructed data structure from a previous [`stats_agg`][stats-agg] call|

## Returns

|Column|Type|Description|
|-|-|-|
|`average`/`average_y`/`average_x`|`DOUBLE PRECISION`|The average of  the values in the statistical aggregate|

## Sample usage

```SQL
SELECT average(stats_agg(data))
FROM generate_series(0, 100) data;
```
```output
 average
-----------
       50
```


[hyperfunctions-stats-agg]: timescaledb/:currentVersion:/how-to-guides/hyperfunctions/stats-aggs/
[stats-agg]:/hyperfunctions/stats_aggs/stats_agg/
