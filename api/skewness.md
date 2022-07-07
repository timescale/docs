---
api_name: 'skewness() | skewness_y() | skewness_x()'
excerpt: Calculate the skewness from values in a statistical aggregate
license: community
toolkit: true
topic: hyperfunctions
keywords: [statistics, statistical aggregate, hyperfunctions, toolkit]
api_category: hyperfunction
api_experimental: false
hyperfunction_toolkit: true
hyperfunction_family: 'statistical aggregates'
hyperfunction_subfamily: 'statistical aggregates'
hyperfunction_type: accessor-1d
---

# skewness() / skewness_y() / skewness_x() <tag type="toolkit">Toolkit</tag>

```SQL
skewness(summary StatsSummary1D, method TEXT) RETURNS BIGINT
```
```SQL
skewness_y(summary StatsSummary2D, method TEXT) RETURNS BIGINT
```
```SQL
skewness_x(summary StatsSummary2D, method TEXT) RETURNS BIGINT
```

Calculate the [skewness][skewness], or the third statisical moment, of the values contained
in a statistical aggregate. In a two-dimensional [`stats_agg`][stats-agg] use the `_y`/ `_x` 
form to access the `skewness` of the dependent and independent variables. 

The `method` determines whether you calculate a population or sample skewness. 
These values can be provided as their full names, or you can abbreviate them as `pop` 
or `samp`. These are the only four accepted values for the `method` argument. The 
default is `sample`.

For more information about statistical aggregate functions, see the
[hyperfunctions documentation][hyperfunctions-stats-agg].

## Required arguments

|Name|Type|Description|
|-|-|-|
|`summary`|`StatsSummary1D`/`StatsSummary2D`|The already constructed data structure from a previous [`stats_agg`][stats-agg] call|

### Optional arguments

|Name|Type|Description|
|-|-|-|
|`method`|`TEXT`|The method for the calculation 'population' or 'sample' (default)|

## Returns

|Column|Type|Description|
|-|-|-|
|`skewness`/`skewness_y`/`skewness_x`|`DOUBLE PRECISION`|The skewness of the values in the statistical aggregate|

## Sample usage

```SQL
SELECT skewness_x(stats_agg(data, data))
FROM generate_series(0, 100) data;
```
```output
 skewness_x 
------------
          0
```


[hyperfunctions-stats-agg]: timescaledb/:currentVersion:/how-to-guides/hyperfunctions/stats-aggs/
[stats-agg]:/hyperfunctions/stats_aggs/stats_agg/
[skewness]: https://en.wikipedia.org/wiki/Skewness
