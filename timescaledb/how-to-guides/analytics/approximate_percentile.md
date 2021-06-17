# Approximate percentiles
In general, percentiles are useful for understanding the distribution of data.
The 50th percentile is the point at which half of your data is greater and half
is lesser. The 10th percentile is the point at which 90% of the data is greater,
and 10% is lesser. The 99th percentile is the point at which 1% is greater, and
99% is lesser.

The 50th percentile, or median, is often a more useful measure than the average,
especially when your data contains outliers. Outliers can dramatically change
the average, but do not effect the median as much. For example, if you have
three rooms in your house and two of them are 40℉ (4℃) and one is 130℉ (54℃),
the fact that the average room is 70℉ (21℃) doesn't matter much. However, the
50th percentile temperature is 40℉ (4℃), and tells you that at least half your
rooms are at refrigerator temperatures (also, you should probably get your
heating checked!)

Percentiles are sometimes used less frequently because they can use more CPU and
memory to calculate than an average or another aggregate measure. This is
because an exact computation of the percentile needs the full dataset as an
ordered list. Timescale Analytics uses approximation algorithms to calculate a
percentile without requiring all of the data. This also makes them more
compatible with continuous aggregates. By default, Timescale Analytics uses
`uddsketch`, but you can also choose to use `tdigest`. See
the [Analytics documentation][gh-analytics-algorithms] for more information
about these algorithms.

<highlight type="tip">
Technically, a percentile divides a group into 100 equally sized pieces, while a
quintile divides a group into an arbitrary number of pieces. Because we don't
always use exactly 100 buckets, "quintile" is the more technically correct term
in this case. However, we use the word "percentile" because it's a more common
word for this type of function.
</highlight>

## Run an approximate percentage query
In this procedure, we are using an example table called `response_times` that contains information about how long a server takes to respond to API calls.

### Procedure: Running an approximate percentage query
1.  At the `psql` prompt, create a continuous aggregate that computes the daily aggregates:
    ```sql
    CREATE MATERIALIZED VIEW response_times_daily
    WITH (timescaledb.continuous)
    AS SELECT
      time_bucket('1 day'::interval, ts) as bucket,
      percentile_agg(response_time_ms)
    FROM response_times
    GROUP BY 1;
    ```
1.  Re-aggregate the aggregate to get the last 30 days, and look for the 95th percentile:
    ```sql
    SELECT approx_percentile(0.95, percentile_agg(percentile_agg)) as threshold
    FROM response_times_daily
    WHERE bucket >= time_bucket('1 day'::interval, now() - '30 days'::interval);
    ```
1.  You can also create an alert:
    ```sql
    WITH t as (SELECT approx_percentile(0.95, percentile_agg(percentile_agg)) as threshold
    FROM response_times_daily
    WHERE bucket >= time_bucket('1 day'::interval, now() - '30 days'::interval))

    SELECT count(*)
    FROM response_times
    WHERE ts > now()- '1 minute'::interval
    AND response_time_ms > (SELECT threshold FROM t);
    ```

<!---
Move content below here to API docs. --LKB 2021-06-17
-->

## API <a id="percentile-approx-api"></a>
Aggregate Functions <a id="aggregate-functions">
> - [percentile_agg (point form)](#point-form)
> - [rollup (summary form)](#summary-form)

Accessor Functions <a id="accesor-functions">

> - [error](#error)
> - [mean](#mean)
> - [num_vals](#num-vals)
> - [approx_percentile](#approx_percentile)
> - [approx_percentile_rank](#approx_percentile-at-value)


---
## **percentile_agg (point form)** <a id="point-form"></a>
```SQL ,ignore
percentile_agg(
    value DOUBLE PRECISION
) RETURNS UddSketch
```

This is the default percentile aggregation function. Under the hood, it uses the [UddSketch algorithm](/docs/uddsketch.md) with 200 buckets and an initial max error of 0.001. This should be good for most common use cases of percentile approximation. For more advanced usage of the uddsketch algorithm or use cases for other percentile approximation algorithms see [advanced usage](#advanced-usage). This is the aggregation step of the [two-step aggregate](/docs/two-step_aggregation.md), it is usually used with the [approx_percentile()](#approx_percentile) accessor function in order to extract an approximate percentile, however it is in a form that can be re-aggregated using the [summary form](#summary-form) of the function and any of the other [accessor functions](#accessor-functions).


### Required Arguments <a id="point-form-required-arguments"></a>
|Name| Type |Description|
|---|---|---|
| `value` | `DOUBLE PRECISION` |  Column to aggregate.
<br>

### Returns

|Column|Type|Description|
|---|---|---|
| `percentile_agg` | `UddSketch` | A UddSketch object which may be passed to other percentile approximation APIs|

Because the `percentile_agg` function uses the [UddSketch algorithm](/docs/uddsketch.md), it returns the UddSketch data structure for use in further calls.
<br>

### Sample Usages <a id="point-form-examples"></a>

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

They are often used to create [continuous aggregates]() after which we can use multiple [accessors](#accessor-functions) for [retrospective analysis](/docs/two-step_aggregation.md#retrospective-analysis).

```SQL ,ignore
CREATE MATERIALIZED VIEW foo_hourly
WITH (timescaledb.continuous)
AS SELECT
    time_bucket('1 h'::interval, ts) as bucket,
    percentile_agg(value) as pct_agg
FROM foo
GROUP BY 1;
```
---

## **rollup (summary form)** <a id="summary-form"></a>
```SQL ,ignore
rollup(
    sketch uddsketch
) RETURNS UddSketch
```

This will combine multiple outputs from the [point form](#point-form) of the `percentile_agg()` function, this is especially useful for re-aggregation in the [continuous aggregate]() context (ie bucketing by a larger [`time_bucket`](), or re-grouping on other dimensions included in an aggregation).

### Required Arguments <a id="summary-form-required-arguments"></a>
|Name| Type |Description|
|---|---|---|
| `sketch` | `UddSketch` | The already constructed uddsketch from a previous [percentile_agg()](#point-form) call. |
<br>

### Returns

|Column|Type|Description|
|---|---|---|
| `uddsketch` | `UddSketch` | A UddSketch object which may be passed to other UddSketch APIs. |

Because the `percentile_agg` function uses the [UddSketch algorithm](/docs/uddsketch.md), `rollup` returns the UddSketch data structure for use in further calls.
<br>

### Sample Usages <a id="summary-form-examples"></a>
Let's presume we created the [continuous aggregate]() in the [point form example](#point-form-examples):

We can then rollup function to re-aggregate the results from the `foo_hourly` view and the [`approx_percentile`](#approx_percentile) accessor function to get the 95th and 99th percentiles over each day:

```SQL , ignore
SELECT
    time_bucket('1 day'::interval, bucket) as bucket,
    approx_percentile(0.95, rollup(pct_agg)) as p95,
    approx_percentile(0.99, rollup(pct_agg)) as p99
FROM foo_hourly
GROUP BY 1;
```

---


## **error** <a id="error"></a>

```SQL ,ignore
error(sketch UddSketch) RETURNS DOUBLE PRECISION
```

This returns the maximum relative error that a percentile estimate will have (relative to the correct value). This means the actual value will fall in the range defined by `approx_percentile(sketch) +/- approx_percentile(sketch)*error(sketch)`.

### Required Arguments <a id="error-required-arguments"></a>
|Name|Type|Description|
|---|---|---|
| `sketch` | `UddSketch` | The sketch to determine the error of, usually from a [`percentile_agg()`](#aggregate-functions) call. |
<br>

### Returns

|Column|Type|Description|
|---|---|---|
| `error` | `DOUBLE PRECISION` | The maximum relative error of any percentile estimate. |
<br>

### Sample Usages <a id="error-examples"></a>

```SQL
SELECT error(percentile_agg(data))
FROM generate_series(0, 100) data;
```
```output
 error
-------
 0.001
```

---
## **mean** <a id="mean"></a>

```SQL ,ignore
mean(sketch UddSketch) RETURNS DOUBLE PRECISION
```

Get the exact average of all the values in the percentile estimate. (Percentiles returned are estimates, the average is exact.

### Required Arguments <a id="mean-required-arguments"></a>
|Name|Type|Description|
|---|---|---|
| `sketch` | `UddSketch` |  The sketch to extract the mean value from, usually from a [`percentile_agg()`](#aggregate-functions) call. |
<br>

### Returns
|Column|Type|Description|
|---|---|---|
| `mean` | `DOUBLE PRECISION` | The average of the values in the percentile estimate. |
<br>

### Sample Usage <a id="mean-examples"></a>

```SQL
SELECT mean(percentile_agg(data))
FROM generate_series(0, 100) data;
```
```output
 mean
------
 50
```
## **num_vals** <a id="num-vals"></a>

```SQL ,ignore
num_vals(sketch UddSketch) RETURNS DOUBLE PRECISION
```

Get the number of values contained in a percentile estimate.

### Required Arguments <a id="num-vals-required-arguments"></a>
|Name|Type|Description|
|---|---|---|
| `sketch` | `UddSketch` | The sketch to extract the number of values from, usually from a [`percentile_agg()`](#aggregate-functions) call. |
<br>

### Returns
|Column|Type|Description|
|---|---|---|
| `uddsketch_count` | `DOUBLE PRECISION` | The number of values in the percentile estimate |
<br>

### Sample Usage <a id="num-vals-examples"></a>

```SQL
SELECT num_vals(percentile_agg(data))
FROM generate_series(0, 100) data;
```
```output
 num_vals
-----------
       101
```

---
---
## **approx_percentile** <a id="approx_percentile"></a>

```SQL ,ignore
approx_percentile(
    percentile DOUBLE PRECISION,
    sketch  uddsketch
) RETURNS DOUBLE PRECISION
```

Get the approximate value at a percentile from a percentile estimate.

### Required Arguments <a id="approx_percentile-required-arguments"></a>
|Name|Type|Description|
|---|---|---|
| `approx_percentile` | `DOUBLE PRECISION` | The desired percentile (0.0-1.0) to approximate. |
| `sketch` | `UddSketch` | The sketch to compute the approx_percentile on, usually from a [`percentile_agg()`](#aggregate-functions) call. |
<br>

### Returns
|Column|Type|Description|
|---|---|---|
| `approx_percentile` | `DOUBLE PRECISION` | The estimated value at the requested percentile. |
<br>

### Sample Usage <a id="approx_percentile-examples"></a>

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

---
## **approx_percentile_rank** <a id="approx_percentile_rank"></a>

```SQL ,ignore
approx_percentile_rank(
    value DOUBLE PRECISION,
    sketch UddSketch
) RETURNS UddSketch
```

Estimate what percentile a given value would be located at in a UddSketch.

### Required Arguments <a id="approx_percentile_rank-required-arguments"></a>
|Name|Type|Description|
|---|---|---|
| `value` | `DOUBLE PRECISION` |  The value to estimate the percentile of. |
| `sketch` | `UddSketch` | The sketch to compute the percentile on. |
<br>

### Returns
|Column|Type|Description|
|---|---|---|
| `approx_percentile_rank` | `DOUBLE PRECISION` | The estimated percentile associated with the provided value. |
<br>

### Sample Usage <a id="approx_percentile_rank-examples"></a>

```SQL
SELECT
    approx_percentile_rank(99, percentile_agg(data))
FROM generate_series(0, 100) data;
```
```output
 approx_percentile_rank
----------------------------
         0.9851485148514851
```





[gh-analytics-algorithms]: https://github.com/timescale/timescale-analytics/blob/main/docs/percentile_approximation.md#advanced-usage
