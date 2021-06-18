# Time-weighted averages
Time weighted averages are used in cases where a time series is not evenly
sampled. Time series data points are often evenly spaced, for example every 30
seconds, or every hour. But sometimes data points are recorded irregularly, for
example if a value has a large change, or changes quickly. Computing an average
on data that is not evenly sampled is not always useful.

For example, if you have a lot of ice cream in freezers, you need to make sure
the ice cream stays within a 0-10℉ (-20 to -12℃) temperature range. The
temperature in the freezer can vary if folks are opening and closing the door,
but the ice cream will only have a problem if the temperature is out of range
for a long time. You can set your sensors in the freezer to sample every five
minutes while the temperature is in range, and every 30 seconds while the
temperature is out of range. If the results are generally stable, but with some
quick moving transients, an average of all the data points weights the transient
values too highly. A time weighted average weights each value by the duration
over which it occurred based on the points around it, producing much more
accurate results.

Timescale Analytics' time weighted average is implemented as an aggregate that
weights each value using last observation carried forward (LOCF), or linear
interpolation. The aggregate is not parallelizable, but it is supported with
[continuous aggregation][caggs]. See the Analytics documentation for more
information about [interpolation methods][gh-interpolation],
and [parallelism and ordering][gh-parallelism].


## Run a time-weighted average query
In this procedure, we are using an example table called `freezer_temps` that contains data about internal freezer temperatures.

### Procedure: Running a time-weighted average query
1.  At the `psql`prompt, find the average and the time-weighted average of the data:
    ```sql
    SELECT freezer_id,
      avg(temperature),
	    average(time_weight('Linear', ts, temperature)) as time_weighted_average
    FROM freezer_temps
    GROUP BY freezer_id;
    ```
1.  To determine if the freezer has been out of temperature range for more than 15 minutes at a time, use a time-weighted average in a window function:
    ```sql
    SELECT *,
    average(
	           time_weight('Linear', ts, temperature) OVER (PARTITION BY freezer_id ORDER BY ts RANGE  '15 minutes'::interval PRECEDING )
	          ) as rolling_twa
    FROM freezer_temps
    ORDER BY freezer_id, ts;
    ```




<!---
Move content below here to API docs. --LKB 2021-06-18
-->

## Command List (A-Z) <a id="time-weighted-average-api"></a>
> - [time_weight() (point form)](#time_weight_point)
> - [rollup() (summary form)](#time-weight-summary)
> - [average()](#time-weight-average)

---
## **time_weight() (point form)** <a id="time_weight_point"></a>
```SQL ,ignore
time_weight(
    method TEXT¹,
    ts TIMESTAMPTZ,
    value DOUBLE PRECISION
) RETURNS TimeWeightSummary
```
¹ Only two values are currently supported, 'linear' and 'LOCF', any capitalization of these will be accepted. [See interpolation methods for more info.](#time-weight-methods)

An aggregate that produces a `TimeWeightSummary` from timestamps and associated values.

### Required Arguments² <a id="time-weight-point-required-arguments"></a>
|Name| Type |Description|
|---|---|---|
| `method` | `TEXT` | The weighting method we should use, options are 'linear' or 'LOCF', not case sensitive |
| `ts` | `TIMESTAMPTZ` |  The time at each point |
| `value` | `DOUBLE PRECISION` | The value at each point to use for the time weighted average|
<br>

##### ² Note that `ts` and `value` can be `null`, however the aggregate is not evaluated on `null` values and will return `null`, but it will not error on `null` inputs.

### Returns

|Column|Type|Description|
|---|---|---|
| `time_weight` | `TimeWeightSummary` | A TimeWeightSummary object that can be passed to other functions within the time weighting API. |
<br>

### Sample Usage
```SQL ,ignore-output
WITH t as (
    SELECT
        time_bucket('1 day'::interval, ts) as dt,
        time_weight('Linear', ts, val) AS tw -- get a time weight summary
    FROM foo
    WHERE measure_id = 10
    GROUP BY time_bucket('1 day'::interval, ts)
)
SELECT
    dt,
    average(tw) -- extract the average from the time weight summary
FROM t;
```

## **rollup() (summary form)** <a id="time-weight-summary"></a>
```SQL ,ignore
rollup(
    tws TimeWeightSummary
) RETURNS TimeWeightSummary
```

An aggregate to compute a combined `TimeWeightSummary` from a series of non-overlapping `TimeWeightSummaries`. Non-disjoint `TimeWeightSummaries` will cause errors. See [Notes on Parallelism and Ordering](#time-weight-ordering) for more information.

### Required Arguments² <a id="time-weight-summary-required-arguments"></a>
|Name| Type |Description|
|---|---|---|
| `tws` | `TimeWeightSummary` | The input TimeWeightSummary from a previous `time_weight` (point form) call, often from a [continuous aggregate](https://docs.timescale.com/latest/using-timescaledb/continuous-aggregates)|

### Returns

|Column|Type|Description|
|---|---|---|
| `time_weight` | `TimeWeightSummary` | A TimeWeightSummary object that can be passed to other functions within the time weighting API. |
<br>

### Sample Usage
```SQL ,ignore-output
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

## **average()** <a id="time-weight-average"></a>
```SQL ,ignore
average(
    tws TimeWeightSummary
) RETURNS DOUBLE PRECISION
```

A function to compute a time weighted average from a `TimeWeightSummary`.

### Required Arguments <a id="time-weight-summary-required-arguments"></a>
|Name| Type |Description|
|---|---|---|
| `tws` | `TimeWeightSummary` | The input TimeWeightSummary from a `time_weight` call.|

### Returns

|Column|Type|Description|
|---|---|---|
| `average` | `DOUBLE PRECISION` | The time weighted average computed from the `TimeWeightSummary`|
<br>

### Sample Usage

```SQL ,ignore
SELECT
    id,
    average(tws)
FROM (
    SELECT
        id,
        time_weight('LOCF', ts, val) AS tws
    FROM foo
    GROUP BY id
) t
```


Here this ends up being equal to the rectangle with width equal to the duration between two points and height the midpoint between the two magnitudes. Once we have this weighted sum, we can divide by the total duration to get the time weighted average.

[caggs]: /how-to-guides/continuous-aggregates
[gh-interpolation]: https://github.com/timescale/timescale-analytics/blob/main/docs/time_weighted_average.md#interpolation-methods-details
[gh-parallelism]: https://github.com/timescale/timescale-analytics/blob/main/docs/time_weighted_average.md#notes-on-parallelism-and-ordering
