---
api_name: rolling()
excerpt: Roll up multiple statistical aggregates to calculate rolling window aggregates
license: community
toolkit: true
topic: hyperfunctions
keywords: [rollup, statistics, statistical aggregates, hyperfunctions, toolkit]
api_category: hyperfunction
api_experimental: false
hyperfunction_toolkit: true
hyperfunction_family: 'statistical aggregates'
hyperfunction_subfamily: 'statistical aggregates'
hyperfunction_type: rollup
---

# rolling()  <tag type="toolkit">Toolkit</tag>

```SQL
rolling(
    ss StatsSummary1D
) RETURNS StatsSummary1D
```
```SQL
rolling(
    ss StatsSummary2D
) RETURNS StatsSummary2D
```

This combines multiple outputs from the [`stats_agg()` function][stats_agg] function.
It works with both one and two dimensional statistical aggregates. It is optimized
for use in a [window function][postgres-window-functions] context for computing tumbling window
statistical aggregates. 

This is especially useful for computing tumbling window aggregates from a continuous aggregate. 
It uses inverse transition and combine functions to do more efficient windowed aggregates, with the
possibility that more floating point errors can occur in unusual scenarios. 

It also works for re-aggregation in a non-window context, but the [`rollup` function][rollup-func] 
is more clear. The `rollup` function also work for windowed aggregates, less efficiently but without
the risk of extra floating point error. 

For more information about statistical aggregation functions, see the
[hyperfunctions documentation][hyperfunctions-stats-aggs].

## Required arguments

|Name|Type|Description|
|-|-|-|
|`stats_agg`|`StatsSummary1D` / `StatsSummary2D`|The already constructed data structure from a previous `stats_agg` call|

## Returns

|Column|Type|Description|
|-|-|-|
|`rolling`|`StatsSummary1D`/`StatsSummary2D`|A StatsSummary object that can be passed to further APIs|

## Sample usage
Create a tumbling window daily aggregate from an hourly continuous aggregate, then use accessors:
```SQL
CREATE MATERIALIZED VIEW foo_hourly
WITH (timescaledb.continuous)
AS SELECT
    time_bucket('1 h'::interval, ts) as bucket,
    stats_agg(value) as stats
FROM foo
GROUP BY 1;

SELECT
    bucket,
    average(rolling(stats) OVER (ORDER BY bucket RANGE '1 day' PRECEDING)),
    stddev(rolling(stats) OVER (ORDER BY bucket RANGE '1 day' PRECEDING))
FROM foo_hourly;
```


[stats_agg]: /hyperfunctions/stats_aggs/stats_agg/
[hyperfunctions-stats-aggs]: timescaledb/:currentVersion:/how-to-guides/hyperfunctions/stats-aggs/
[time_bucket]: /hyperfunctions/time_bucket/
[postgres-window-functions]: https://www.postgresql.org/docs/current/tutorial-window.html
[rollup-func]: /hyperfunctions/stats_aggs/rollup-stats/
