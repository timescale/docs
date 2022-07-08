---
api_name: determination_coeff
excerpt: Calculate the determination coefficient from values in a 2-dimensional statistical aggregate
license: community
toolkit: true
topic: hyperfunctions
tags: [hyperfunctions, determination coefficient, statistics, statistical aggregates, StatsSummary]
api_category: hyperfunction
api_experimental: false
hyperfunction_toolkit: true
hyperfunction_family: 'statistical aggregates'
hyperfunction_subfamily: 'statistical aggregates'
hyperfunction_type: accessor-2d
---

# determination_coeff() <tag type="toolkit" content="Toolkit" />

```sql
determination_coeff(
    summary StatsSummary2D
) RETURNS DOUBLE PRECISION
```
The coefficient of determination (or the R squared) of the least squares fit line 
computed from a two-dimensional statistical aggregate. 

For more information about statistical aggregate functions, see the
[hyperfunctions documentation][hyperfunctions-stats-agg].

## Required arguments

|Name|Type|Description|
|-|-|-|
|`summary`|`StatsSummary2D`|The input StatsSummary from a [`stats_agg` call][stats-agg]|

## Returns

|Name|Type|Description|
|-|-|-|
|`determination_coeff`|`DOUBLE PRECISION`|The determination coefficient of the least squares fit line.|

## Sample usage

```sql
SELECT
    id,
    time_bucket('15 min'::interval, ts) AS bucket,
    determination_coeff(stats_agg(y, x)) AS summary
FROM foo
GROUP BY id, time_bucket('15 min'::interval, ts)
```


[hyperfunctions-stats-agg]: timescaledb/:currentVersion:/how-to-guides/hyperfunctions/stats-aggs/
[stats-agg]:/hyperfunctions/stats_aggs/stats_agg/
