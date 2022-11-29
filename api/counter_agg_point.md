---
api_name: counter_agg()
excerpt: Aggregate counter data into a `CounterSummary` for further analysis
topics: [hyperfunctions]
keywords: [counters, aggregates, hyperfunctions, Toolkit]
api:
  license: community
  type: function
  toolkit: true
  version:
    experimental: 0.2.0
    stable: 1.3.0
hyperfunction:
  family: metric aggregation
  type: aggregate
---

# counter_agg() <tag type="toolkit" content="Toolkit" />

An aggregate that produces a CounterSummary from timestamps and associated
values.

For more information about counter aggregation functions, see the
[hyperfunctions documentation][hyperfunctions-counter-agg].

## Required arguments

|Name|Type|Description|
|-|-|-|
|ts|TIMESTAMPTZ|The time at each point|
|value|DOUBLE PRECISION|The value at each point to use for the counter aggregate|

The `value` argument is currently only accepted as a DOUBLE PRECISION number,
because it is the most common type for counters, even though other numeric
types, such as BIGINT, might sometimes be more intuitive. If you store a value
as a different numeric type you can cast to DOUBLE PRECISION on input to the
function.

<highlight type="note">
If there are `NULL` values in your data, the aggregate ignores them and
aggregates only non-`NULL` values. If you only have `NULL` values, the aggregate
returns `NULL`.
</highlight>

### Optional arguments

|Name|Type|Description|
|-|-|-|
|bounds|TSTZRANGE|A range of timestamptz|

The `bounds` argument represents the largest and smallest possible times that
could be input to this aggregate. Calling with NULL, or leaving out the
argument, results in an unbounded `CounterSummary`. Bounds are required for
extrapolation, but not for other accessor functions.

## Returns

|Column|Type|Description|
|-|-|-|
|counter_agg|CounterSummary|A CounterSummary object that can be passed to accessor functions or other objects in the counter aggregate API|

<!---Any special notes about the returns-->

## Sample usage

This example produces a CounterSummary from timestamps and associated values,
then computes the [`irate_right`][irate] accessor:

``` sql
WITH t as (
    SELECT
        time_bucket('1 day'::interval, ts) as dt,
        counter_agg(ts, val) AS cs -- get a CounterSummary
    FROM foo
    WHERE id = 'bar'
    GROUP BY time_bucket('1 day'::interval, ts)
)
SELECT
    dt,
    irate_right(cs) -- extract instantaneous rate from the CounterSummary
FROM t;
```

[hyperfunctions-counter-agg]: /timescaledb/:currentVersion:/how-to-guides/hyperfunctions/counter-aggregation/
[irate]: /api/:currentVersion:/hyperfunctions/counter_aggs/irate/
