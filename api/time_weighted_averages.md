# Time-weighted average functions
The functions related to time-weighted averages.

## time_weight() (point form)

```SQL
time_weight(
    method TEXT,
    ts TIMESTAMPTZ,
    value DOUBLE PRECISION
) RETURNS TimeWeightSummary
```

Only two values for `method` are currently supported: `linear` and `LOCF`, and
any capitalization is accepted.
See [interpolation methods](https://github.com/timescale/timescale-analytics/blob/main/docs/time_weighted_average.md#interpolation-methods-details)
for more information.

An aggregate that produces a `TimeWeightSummary` from timestamps and associated values.

### Required arguments

|Name|Type|Description|
|---|---|---|
|`method`|`TEXT`|The weighting method we should use, options are `linear` or `LOCF`, not case sensitive|
|`ts`|`TIMESTAMPTZ`|The time at each point|
|`value`|`DOUBLE PRECISION`|The value at each point to use for the time weighted average|


Note that `ts` and `value` can be `null`, however the aggregate is not evaluated
on `null` values and will return `null`, but it will not error on `null` inputs.

### Returns

|Column|Type|Description|
|---|---|---|
|`time_weight`|`TimeWeightSummary`|A TimeWeightSummary object that can be passed to other functions within the time weighting API|

### Sample usage

```SQL
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

## rollup() (summary form)

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

## average()

```SQL
average(
    tws TimeWeightSummary
) RETURNS DOUBLE PRECISION
```

A function to compute a time weighted average from a `TimeWeightSummary`.

### Required arguments

|Name|Type|Description|
|---|---|---|
|`tws`|`TimeWeightSummary`|The input TimeWeightSummary from a `time_weight` call|

### Returns

|Column|Type|Description|
|---|---|---|
|`average`|`DOUBLE PRECISION`|The time weighted average computed from the `TimeWeightSummary`|

### Sample usage

```SQL
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

This ends up being equal to the rectangle with width equal to the duration
between two points and height the midpoint between the two magnitudes. Once we
have this weighted sum, we can divide by the total duration to get the time
weighted average.
