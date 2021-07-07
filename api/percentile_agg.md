# Percentile aggregate functions
The functions related to percentile aggregates.

## percentile_agg

```sql
percentile_agg(
    value DOUBLE PRECISION
) RETURNS UddSketch
```

This is the default percentile aggregation function. It uses the [UddSketch
algorithm](https://github.com/timescale/timescale-analytics/blob/main/docs/uddsketch.md)
with 200 buckets and an initial maximum error of 0.001. This is appropriate for
most common use cases of percentile approximation. For more advanced use of
percentile approximation algorithms,
see [advanced usage](https://github.com/timescale/timescale-analytics/blob/main/docs/percentile_approximation.md#advanced-usage).
This is the aggregation step
of [two-step aggregates](https://github.com/timescale/timescale-analytics/blob/main/docs/two-step_aggregation.md),
it is usually used with the [approx_percentile()](#approx_percentile) accessor
function to extract an approximate percentile, however it is in a form that can
be re-aggregated using the [summary form](#summary-form) of the function and any
of the other [accessor functions](#accessor-functions).

### Required arguments

|Name|Type|Description|
|---|---|---|
|`value`|`DOUBLE PRECISION`|Column to aggregate|

### Returns

|Column|Type|Description|
|---|---|---|
|`percentile_agg`|`UddSketch`|A UddSketch object which may be passed to other percentile approximation APIs|

The `percentile_agg` function uses the UddSketch algorithm, so it returns the
UddSketch data structure for use in further calls.

### Sample usage
Get the approximate first percentile using the `percentile_agg()` point form plus the [`approx_percentile`](#approx_percentile) accessor function.

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

They are often used to create continuous aggregates, after which you can use
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

## error

```SQL
error(sketch UddSketch) RETURNS DOUBLE PRECISION
```

This returns the maximum relative error that a percentile estimate will have
(relative to the correct value). This means the actual value will fall in the
range defined by `approx_percentile(sketch) +/-
approx_percentile(sketch)*error(sketch)`.

### Required arguments

|Name|Type|Description|
|---|---|---|
|`sketch`|`UddSketch`|The sketch to determine the error of, usually from a `percentile_agg` call|

### Returns

|Column|Type|Description|
|---|---|---|
|`error`|`DOUBLE PRECISION`|The maximum relative error of any percentile estimate|

### Sample usage

```SQL
SELECT error(percentile_agg(data))
FROM generate_series(0, 100) data;
```
```output
 error
-------
 0.001
```

## mean

```SQL
mean(sketch UddSketch) RETURNS DOUBLE PRECISION
```

Get the exact average of all the values in the percentile estimate. (Percentiles
returned are estimates, the average is exact.

### Required arguments

|Name|Type|Description|
|---|---|---|
| `sketch` | `UddSketch` |  The sketch to extract the mean value from, usually from a [`percentile_agg()`](#aggregate-functions) call. |

### Returns

|Column|Type|Description|
|---|---|---|
| `mean` | `DOUBLE PRECISION` | The average of the values in the percentile estimate. |

### Sample usage

```SQL
SELECT mean(percentile_agg(data))
FROM generate_series(0, 100) data;
```
```output
 mean
------
 50
```

## num_vals

```SQL
num_vals(sketch UddSketch) RETURNS DOUBLE PRECISION
```

Get the number of values contained in a percentile estimate.

### Required arguments

|Name|Type|Description|
|---|---|---|
|`sketch`|`UddSketch`| The sketch to extract the number of values from, usually from a `percentile_agg` call|

### Returns

|Column|Type|Description|
|---|---|---|
|`uddsketch_count`|`DOUBLE PRECISION`|The number of values in the percentile estimate|

### Sample usage

```SQL
SELECT num_vals(percentile_agg(data))
FROM generate_series(0, 100) data;
```
```output
 num_vals
-----------
       101
```
