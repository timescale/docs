## rollup(`UddSketch`)

```SQL
rollup(
    sketch uddsketch
) RETURNS UddSketch
```

This combines multiple outputs from the point form of the `percentile_agg()`
function. This is especially useful for re-aggregation in a continuous
aggregate. For example, bucketing by a larger `time_bucket`, or re-grouping on
other dimensions included in an aggregation.

### Required arguments

|Name|Type|Description|
|---|---|---|
|`sketch`|`UddSketch`|The already constructed uddsketch from a previous `percentile_agg` call|

### Returns

|Column|Type|Description|
|---|---|---|
|`uddsketch`|`UddSketch`|A UddSketch object which may be passed to other UddSketch APIs|

Because the `percentile_agg` function uses the [UddSketch algorithm](/docs/uddsketch.md), `rollup` returns the UddSketch data structure for use in further calls.

### Sample usage
Using the continuous aggregate from the [point form
example](#point-form-examples), use the `rollup` function to re-aggregate the
results from the `foo_hourly` view and the `approx_percentile` accessor function
to get the 95th and 99th percentiles over each day:

```SQL
SELECT
    time_bucket('1 day'::interval, bucket) as bucket,
    approx_percentile(0.95, rollup(pct_agg)) as p95,
    approx_percentile(0.99, rollup(pct_agg)) as p99
FROM foo_hourly
GROUP BY 1;
```