---
api_name: time_weight()
excerpt: Aggregate data in a `TimeWeightSummary` for further time-weighted analysis
topics: [hyperfunctions]
keywords: [time-weighted, aggregate, hyperfunctions, Toolkit]
api:
  license: community
  type: function
  toolkit: true
  version:
    experimental: 0.1.0
    stable: 1.0.0
hyperfunction:
  family: time-weighted averages
  type: aggregate
---

## time_weight() <tag type="toolkit">Toolkit</tag>

```SQL
time_weight(
    method TEXT,
    ts TIMESTAMPTZ,
    value DOUBLE PRECISION
) RETURNS TimeWeightSummary
```

An aggregate that produces a `TimeWeightSummary` from timestamps and associated values.

For more information about time-weighted average functions, see the
[hyperfunctions documentation][hyperfunctions-time-weight-average].

### Required arguments

|Name|Type|Description|
|---|---|---|
|`method`|`TEXT`| The weighting method to use, options are `linear` (or its alias `trapezoidal`) or `LOCF`, not case sensitive|
|`ts`|`TIMESTAMPTZ`|The time at each point|
|`value`|`DOUBLE PRECISION`|The value at each point to use for the time-weighted average|

Note that `ts` and `value` can be `null`, however the aggregate is not evaluated
on `null` values and returns `null`, but does not error on `null` inputs.

Only two values for `method` are currently supported: `linear` (or its alias `trapezoidal`) and `LOCF`, and
any capitalization is accepted. See [interpolation methods](#interpolation-methods-details)
for more information.

### Returns

|Column|Type|Description|
|---|---|---|
|`time_weight`|`TimeWeightSummary`|A TimeWeightSummary object that can be passed to other functions within the time-weighting API|

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

## Advanced usage notes

Most cases work out of the box, but for power users, or those who want to
dive deeper, we've included a bit more context below.

### Interpolation methods details

Discrete time values don't always allow for an obvious calculation of the time-weighted average. In order to calculate a time-weighted average, you need to choose
how to weight each value. The two methods currently available in TimescaleDB
Toolkit are last observation
carried forward (LOCF) and linear interpolation.

In the LOCF approach, the value is treated as if it remains constant until the
next value is seen. The LOCF approach is commonly used when the sensor or
measurement device sends measurement only when there is a change in value.

The linear interpolation approach treats the values between any two measurements
as if they lie on the line connecting the two measurements. The linear
interpolation approach is used to account for irregularly sampled data where the
sensor doesn't provide any guarantees.

### Parallelism and ordering

The time-weighted average calculations we perform require a strict ordering of
inputs and therefore the calculations are not parallelizable in the strict
Postgres sense. This is because when Postgres does parallelism it hands out rows
randomly, basically as it sees them to workers. However, if your parallelism can
guarantee disjoint (in time) sets of rows, the algorithm can be parallelized, just
so long as within some time range, all rows go to the same worker. This is the
case for both continuous aggregates and for distributed hypertables (as long as
the partitioning keys are in the group by, though the aggregate itself doesn't
horribly make sense otherwise).

We throw an error if there is an attempt to combine overlapping `TimeWeightSummaries`,
for instance, in our example above, if you were to try to combine summaries across
`measure_ids` it would error. This is because the interpolation techniques really
only make sense within a given time series determined by a single `measure_id`.
However, given that the time weighted average produced is a dimensionless
quantity, a simple average of time weighted average should better represent the
variation across devices, so the recommendation for things like baselines across
many timeseries would be something like:

```sql
WITH t as (SELECT measure_id,
        average(
            time_weight('LOCF', ts, val)
        ) as time_weighted_average
    FROM foo
    GROUP BY measure_id)
SELECT avg(time_weighted_average) -- use the normal avg function to average our time weighted averages
FROM t;
```

Internally, the first and last points seen as well as the calculated weighted sum
are stored in each `TimeWeightSummary` and used to combine with a neighboring
`TimeWeightSummary` when re-aggregation or the PostgreSQL combine function is called.
In general, the functions support partial aggregation and partitionwise aggregation
in the multinode context, but are not parallelizable (in the PostgreSQL sense,
which requires them to accept potentially overlapping input).

Because they require ordered sets, the aggregates build up a buffer of input
data, sort it and then perform the proper aggregation steps. In cases where
memory is proving to be too small to build up a buffer of points causing OOMs
or other issues, a multi-level aggregate can be useful. Following our example
from above:

```sql
WITH t as (SELECT measure_id,
    time_bucket('1 day'::interval, ts),
    time_weight('LOCF', ts, val)
    FROM foo
    GROUP BY measure_id, time_bucket('1 day'::interval, ts)
    )
SELECT measure_id,
    average(
        rollup(time_weight)
    )
FROM t
GROUP BY measure_id;
```

[hyperfunctions-time-weight-average]: /timescaledb/:currentVersion:/how-to-guides/hyperfunctions/time-weighted-averages/
