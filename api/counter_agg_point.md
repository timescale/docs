# counter_agg() <tag type="toolkit" content="toolkit" />
An aggregate that produces a CounterSummary from timestamps and associated
values.

For more information about counter aggregation functions, see the
[hyperfunctions documentation][hyperfunctions-counter-agg].

## Required arguments

|Name|Type|Description|
|-|-|-|
|ts|TIMESTAMPZ|The time at each point|
|value|DOUBLE PRECISION|The value at each point to use for the counter aggregate|

The `value` argument is currently only accepted as a DOUBLE PRECISION number,
because it is the most common type for counters, even though other numeric
types, such as BIGINT, might sometimes be more intuitive. If you store a value
as a different numeric type you can cast to DOUBLE PRECISION on input to the
function.

<highlight type="note">
Note that both `ts` and `value` can be NULL, but the aggregate is not evaluated
on NULL values. This means that if the aggregate receives only a NULL value, it will
return NULL, it will not return an error. If non-NULL values are also received, the NULL 
values will be ignored. Both `ts` and `value` must be non-NULL for the row to be included.
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
This example produces a CounterSummary from timestamps and associated values and then computes the [`irate_right` accessor]((/hyperfunctions/counter_aggs/irate/) on it

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


[hyperfunctions-counter-agg]: timescaledb/:currentVersion:/how-to-guides/hyperfunctions/counter-aggregation/
