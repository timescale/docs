---
api_name: num_vals()
excerpt: Calculate the number of values contained in a statistical aggregate
license: community
toolkit: true
topic: hyperfunctions
keywords: [statistics, statistical aggregate, hyperfunctions, toolkit]
tags: [count, number]
api_category: hyperfunction
api_experimental: false
hyperfunction_toolkit: true
hyperfunction_family: 'statistical aggregates'
hyperfunction_subfamily: 'statistical aggregates'
hyperfunction_type: accessor-1d
---

# num_vals()  <tag type="toolkit">Toolkit</tag>

```SQL
num_vals(summary StatsSummary1D) RETURNS BIGINT
```
```SQL
num_vals(summary StatsSummary2D) RETURNS BIGINT
```

Get the number of values contained in a statistical aggregate. This saves space
when you need both a count and other statistical aggregates as part of a continuous
aggregate. You do not need to specify a separate `count` aggregate.

For more information about statistical aggregate functions, see the
[hyperfunctions documentation][hyperfunctions-stats-agg].

## Required arguments

|Name|Type|Description|
|-|-|-|
|`summary`|`StatsSummary1D`/`StatsSummary2D`|The already constructed data structure from a previous [`stats_agg`][stats-agg] call|

## Returns

|Column|Type|Description|
|-|-|-|
|`num_vals`|`BIGINT`|The number of values in the stats agg|

## Sample usage

```SQL
SELECT num_vals(stats_agg(data))
FROM generate_series(0, 100) data;
```
```output
 num_vals
-----------
       101
```


[hyperfunctions-stats-agg]: /timescaledb/:currentVersion:/how-to-guides/hyperfunctions/stats-aggs/
[stats-agg]: /api/:currentVersion:/hyperfunctions/stats_aggs/stats_agg/
