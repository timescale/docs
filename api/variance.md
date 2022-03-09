# variance(), variance_y(), and variance_x() <tag type="toolkit">Toolkit</tag>

```SQL
variance(summary StatsSummary1D, method TEXT) RETURNS BIGINT
```
```SQL
variance_y(summary StatsSummary2D, method TEXT) RETURNS BIGINT
```
```SQL
variance_x(summary StatsSummary2D, method TEXT) RETURNS BIGINT
```

Get the variance of the values contained in a statistical aggregate.
In a two-dimensional [`stats_agg`][stats-agg] use the `_y`/ `_x` form to access the 
`variance` of the dependent and independent variables. 

The `method` determines whether you calculate a population or sample variance. 
These values can be provided as their full names, or you can abbreviate them to `pop` 
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
|`variance`/`variance_y`/`variance_x`|`DOUBLE PRECISION`|The variance of the values in the statistical aggregate|

## Sample usage

```SQL
SELECT variance_y(stats_agg(data, data))
FROM generate_series(0, 100) data;
```
```output
 variance_y 
------------
      858.5
```


[hyperfunctions-stats-agg]: timescaledb/:currentVersion:/how-to-guides/hyperfunctions/stats-aggs/
[stats-agg]:/hyperfunctions/stats_aggs/stats_agg/