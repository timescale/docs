## percentile_agg()

```sql
percentile_agg(
    value DOUBLE PRECISION
) RETURNS UddSketch
```

This is the default percentile aggregation function. It uses the [UddSketch
algorithm](/hyperfunctions/percentile-approximation/percentile-aggregation-methods/uddsketch/)
with 200 buckets and an initial maximum error of 0.001. This is appropriate for
most common use cases of percentile approximation. For more advanced use of
percentile approximation algorithms,
see [advanced usage](/hyperfunctions/percentile-approximation/percentile-aggregation-methods/).
This creates a `Uddsketch` percentile estimator, it is usually used with the [approx_percentile()](/hyperfunctions/percentile-approximation/approx_percentile/) accessor
function to extract an approximate percentile, however it is in a form that can
be re-aggregated using the [rollup](/hyperfunctions/percentile-approximation/rollup-percentile/) function and/or any of the  [accessor functions](/hyperfunctions/percentile-approximation/#accessor-functions).

### Required arguments

|Name|Type|Description|
|---|---|---|
|`value`|`DOUBLE PRECISION`|Column to aggregate|

### Returns

|Column|Type|Description|
|---|---|---|
|`percentile_agg`|`UddSketch`|A UddSketch percentile estimator object which may be passed to other percentile approximation APIs|

The `percentile_agg` function uses the UddSketch algorithm, so it returns the
UddSketch data structure for use in further calls.

### Sample usage
Get the approximate first percentile using the `percentile_agg()` plus the [`approx_percentile`](/hyperfunctions/percentile-approximation/approx_percentile/) accessor function.

```SQL
SELECT
    approx_percentile(0.01, percentile_agg(data))
FROM generate_series(0, 100) data;
```
```output
approx_percentile
-------------------
             0.999
```

The `percentile_agg` function is often used to create continuous aggregates, after which you can use
multiple accessors
for [retrospective analysis](https://github.com/timescale/timescale-analytics/blob/main/docs/two-step_aggregation.md#retrospective-analysis-over-downsampled-data).

```SQL
CREATE MATERIALIZED VIEW foo_hourly
WITH (timescaledb.continuous)
AS SELECT
    time_bucket('1 h'::interval, ts) as bucket,
    percentile_agg(value) as pct_agg
FROM foo
GROUP BY 1;
```
---
