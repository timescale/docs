## time_weight() (point form)

```SQL
time_weight(
    method TEXT**,
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
