---
api_name: rollup()
excerpt: Roll up multiple percentile aggregates, `uddsketch`es, or `tdigest`s
topics: [hyperfunctions]
keywords: [percentiles, hyperfunctions, Toolkit]
tags: [uddsketch, tdigest]
api:
  license: community
  type: function
  toolkit: true
  version:
    experimental: 0.3.0
    stable: 1.0.0
hyperfunction:
  family: percentile approximation
  type: rollup
  aggregates:
    - percentile_agg()
    - tdigest()
    - uddsketch()
---

# rollup()  <tag type="toolkit">Toolkit</tag>

```SQL
rollup(
    sketch uddsketch
) RETURNS UddSketch
```

```SQL
rollup(
    digest tdigest
) RETURNS tdigest
```

This combines multiple outputs from the
[`percentile_agg()` function][percentile_agg], or either
[`uddsketch()` or `tdigest()`][advanced-agg]). This is especially useful for
re-aggregation in a continuous aggregate. For example, bucketing by a larger
[`time_bucket()`][time_bucket], or re-grouping on other dimensions included in
an aggregation.

*   For more information about percentile approximation algorithms, see
    [advanced aggregation methods][advanced-agg].
*   For more information about percentile approximation functions, see the
    [hyperfunctions documentation][hyperfunctions-percentile-approx].

## Required arguments

|Name|Type|Description|
|-|-|-|
|`sketch`/`digest`|`UddSketch` or `tdigest`|The already constructed data structure from a previous `percentile_agg`, `uddsketch`, or `tdigest` call|

## Returns

|Column|Type|Description|
|---|---|---|
|`rollup`|`UddSketch` / `tdigest`|A UddSketch or tdigest object which may be passed to further APIs|

Because the [`percentile_agg()`][percentile_agg] function uses the [UddSketch
algorithm][advanced-agg], `rollup` returns the `UddSketch` data structure for
use in further calls.

When you use the `percentile_agg` or `UddSketch` aggregates, the `rollup`
function does not introduce additional errors compared to calculating the
estimator directly, however, using `rollup` with `tdigest` can introduce
additional errors compared to calculating the estimator directly on the
underlying data.

## Sample usage

Re-aggregate an hourly continuous aggregate into daily buckets, the usage with
`uddsketch` & `tdigest` is exactly the same:

```SQL
CREATE MATERIALIZED VIEW foo_hourly
WITH (timescaledb.continuous)
AS SELECT
    time_bucket('1 h'::interval, ts) as bucket,
    percentile_agg(value) as pct_agg
FROM foo
GROUP BY 1;

SELECT
    time_bucket('1 day'::interval, bucket) as bucket,
    approx_percentile(0.95, rollup(pct_agg)) as p95,
    approx_percentile(0.99, rollup(pct_agg)) as p99
FROM foo_hourly
GROUP BY 1;
```

[percentile_agg]: /api/:currentVersion:/hyperfunctions/percentile-approximation/percentile_agg/
[advanced-agg]: /timescaledb/:currentVersion:/how-to-guides/hyperfunctions/percentile-approx/advanced-agg/
[time_bucket]: /api/:currentVersion:/hyperfunctions/time_bucket/
[hyperfunctions-percentile-approx]: /timescaledb/:currentVersion:/how-to-guides/hyperfunctions/percentile-approx/
