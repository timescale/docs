---
api_name: rollup()
excerpt: Roll up multiple statistical aggregates
license: community
toolkit: true
api_category: hyperfunction
api_experimental: false
hyperfunction_toolkit: true
hyperfunction_family: 'statistical aggregates'
hyperfunction_subfamily: 'statistical aggregates'
hyperfunction_type: rollup
---

# rollup()  <tag type="toolkit">Toolkit</tag>

```SQL
rollup(
    ss StatsSummary1D
) RETURNS StatsSummary1D
```
```SQL
rollup(
    ss StatsSummary2D
) RETURNS StatsSummary2D
```

This combines multiple outputs from the [`stats_agg()` function][stats_agg] function,
it works with both one and two dimensional statistical aggregates.
This is especially useful for re-aggregation in a continuous aggregate.
For example, bucketing by a larger[`time_bucket()`][time_bucket],
or re-grouping on other dimensions included in an aggregation.

For use in [window function][postgres-window-functions] see the [`rolling`][rolling-stats].
`rollup` works in window function contexts, but `rolling` can be more efficient.

For more information about statistical aggregation functions, see the
[hyperfunctions documentation][hyperfunctions-stats-aggs].

## Required arguments

|Name|Type|Description|
|-|-|-|
|`ss`|`StatsSummary1D`/`StatsSummary2D`|The already constructed data structure from a previous `stats_agg` call|

## Returns

|Column|Type|Description|
|-|-|-|
|`rollup`|`StatsSummary1D`/`StatsSummary2D`|A StatsSummary object which may be passed to further APIs|

## Sample usage
Re-aggregate an hourly continuous aggregate into daily buckets, then use accessors:
```SQL
CREATE MATERIALIZED VIEW foo_hourly
WITH (timescaledb.continuous)
AS SELECT
    time_bucket('1 h'::interval, ts) as bucket,
    stats_agg(value) as stats
FROM foo
GROUP BY 1;

SELECT
    time_bucket('1 day'::interval, bucket) as bucket,
    average(rollup(stats)),
    stddev(rollup(stats))
FROM foo_hourly
GROUP BY 1;
```


[stats_agg]: /hyperfunctions/stats_aggs/stats_agg/
[hyperfunctions-stats-aggs]: timescaledb/:currentVersion:/how-to-guides/hyperfunctions/stats-aggs/
[time_bucket]: /hyperfunctions/time_bucket/
[postgres-window-functions]: https://www.postgresql.org/docs/current/tutorial-window.html
[rolling-stats]: /hyperfunctions/stats_aggs/rolling-stats/
