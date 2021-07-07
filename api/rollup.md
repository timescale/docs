# rollup (summary form)

## rollup() - uddsketch

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

## rollup() - time_weight

```SQL
rollup(
    tws TimeWeightSummary
) RETURNS TimeWeightSummary
```

An aggregate to compute a combined `TimeWeightSummary` from a series of
non-overlapping `TimeWeightSummaries`. Non-disjoint `TimeWeightSummaries` will
cause errors.
See [Notes on Parallelism and Ordering](https://github.com/timescale/timescale-analytics/blob/main/docs/time_weighted_average.md#notes-on-parallelism-and-ordering)
for more information.

### Required arguments

|Name| Type |Description|
|---|---|---|
|`tws`|`TimeWeightSummary`|The input TimeWeightSummary from a previous `time_weight` (point form) call, often from a continuous aggregate|

### Returns

|Column|Type|Description|
|---|---|---|
|`time_weight`|`TimeWeightSummary`|A TimeWeightSummary object that can be passed to other functions within the time weighting API|


### Sample usage

```SQL
WITH t as (
    SELECT
        date_trunc('day', ts) as dt,
        time_weight('Linear', ts, val) AS tw -- get a time weight summary
    FROM foo
    WHERE measure_id = 10
    GROUP BY date_trunc('day', ts)
), q as (
    SELECT rollup(tw) AS full_tw -- do a second level of aggregation to get the full time weighted average
    FROM t
)
SELECT
    dt,
    average(tw),  -- extract the average from the time weight summary
    average(tw) / (SELECT average(full_tw) FROM q LIMIT 1)  as normalized -- get the normalized average
FROM t;
```
