# corr() <tag type="toolkit" content="Toolkit" />

```sql
corr(
    summary StatsSummary2D
) RETURNS DOUBLE PRECISION
```
The correlation coefficient of the [least squares fit][least-squares] line 
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
|`corr`|`DOUBLE PRECISION`|The correlation coefficient of the least squares fit line.|

## Sample usage

```sql
SELECT
    id,
    time_bucket('15 min'::interval, ts) AS bucket,
    corr(stats_agg(y, x)) AS summary
FROM foo
GROUP BY id, time_bucket('15 min'::interval, ts)
```


[hyperfunctions-stats-agg]: timescaledb/:currentVersion:/how-to-guides/hyperfunctions/stats-aggs/
[stats-agg]:/hyperfunctions/stats_aggs/stats_agg/
[least-squares]:https://en.wikipedia.org/wiki/Least_squares