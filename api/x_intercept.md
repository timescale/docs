# x_intercept() <tag type="toolkit" content="toolkit" />

```sql
x_intercept(
    summary StatsSummary2D
) RETURNS DOUBLE PRECISION
```
The x intercept of the least squares fit line computed from a two-dimensional statistical aggregate. 

*   For more information about statistical aggregate functions, see the
    [hyperfunctions documentation][hyperfunctions-stats-agg].

## Required arguments

|Name|Type|Description|
|-|-|-|
|`summary`|`StatsSummary2D`|The input StatsSummary from a [`stats_agg` call][stats-agg]|

## Returns

|Name|Type|Description|
|-|-|-|
|`intercept`|`DOUBLE PRECISION`|The x intercept of the least squares fit line. |

## Sample usage

```sql

SELECT
    id,
    time_bucket('15 min'::interval, ts) AS bucket,
    x_intercept(stats_agg(y, x)) AS summary
FROM foo
GROUP BY id, time_bucket('15 min'::interval, ts)
```


[hyperfunctions-stats-agg]: timescaledb/:currentVersion:/how-to-guides/hyperfunctions/stats-aggs/
[stats-agg]:/hyperfunctions/stats_aggs/stats_agg/