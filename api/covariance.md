---
api_name: covariance
api_category: hyperfunction
api_experimental: false
hyperfunction_toolkit: true
hyperfunction_family: 'statistical aggregates'
hyperfunction_subfamily: 'statistical aggregates'
hyperfunction_type: accessor-2d
---

# covariance() <tag type="toolkit" content="Toolkit" />

```sql
covariance(
    summary StatsSummary2D,
    method TEXT 
) RETURNS DOUBLE PRECISION
```
The covariance of the [least squares fit][least-squares] line 
computed from a two-dimensional statistical aggregate. 

The `method` determines whether you calculate a 'population' or 'sample' covariance. 
These values can be provided as their full names, or you can abbreviate them as `pop` or `samp`. These
are the only four accepted values for the `method` argument. The default is `sample`.

For more information about statistical aggregate functions, see the
[hyperfunctions documentation][hyperfunctions-stats-agg].

## Required arguments

|Name|Type|Description|
|-|-|-|
|`summary`|`StatsSummary2D`|The input StatsSummary from a [`stats_agg` call][stats-agg]|

### Optional arguments

|Name|Type|Description|
|-|-|-|
|`method`|`TEXT`|The method for the calculation 'population' or 'sample' (default)|

## Returns

|Name|Type|Description|
|-|-|-|
|`covariance`|`DOUBLE PRECISION`|The x intercept of the least squares fit line.|

## Sample usage

```sql
SELECT
    id,
    time_bucket('15 min'::interval, ts) AS bucket,
    covariance(stats_agg(y, x)) AS summary
FROM foo
GROUP BY id, time_bucket('15 min'::interval, ts)
```


[hyperfunctions-stats-agg]: timescaledb/:currentVersion:/how-to-guides/hyperfunctions/stats-aggs/
[stats-agg]:/hyperfunctions/stats_aggs/stats_agg/
[least-squares]:https://en.wikipedia.org/wiki/Least_squares