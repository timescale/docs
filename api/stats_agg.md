# stats_agg() <tag type="toolkit" content="toolkit" />
An aggregate that produces a StatsSummary from `DOUBLE PRECISION` values. 

Statistical aggregates can be done on either a single variable, in which case
only one-dimensional aggregates are calculated or two variables, in which case
one-dimensional aggregates are calculated for each and linear regression is performed
on both together. 

For more information about statistical aggregation functions, see the
[hyperfunctions documentation][hyperfunctions-stats-agg].

## 1D Statistical Aggregates
## Required arguments

|Name|Type|Description|
|-|-|-|
|value|DOUBLE PRECISION|The variable to use for the statistical aggregate|

The `value` argument is currently only accepted as a DOUBLE PRECISION number.
If you store a valueas a different numeric type you can cast to DOUBLE PRECISION 
on input to thefunction.

<highlight type="note">
Note that `value` can be NULL, but the aggregate is not evaluated
on NULL values. This means that if the aggregate receives only a NULL value, it will
return NULL, it will not return an error. If non-NULL values are also received, the NULL 
values will be ignored. 
</highlight>


## Returns

|Column|Type|Description|
|-|-|-|
|stats_agg|StatsSummary1D|A one-dimensional StatsSummary object that can be passed to accessor functions or other objects in the stats aggregate API|

## 2D Statistical Aggregates
## Required arguments

|Name|Type|Description|
|-|-|-|
|Y|DOUBLE PRECISION|The dependent variable to use for the statistical aggregate|
|X|DOUBLE PRECISION|The independent variable to use for the statistical aggregate|

The `Y` and `X`  arguments are currently only accepted as DOUBLE PRECISION numbers.
If you store a valueas a different numeric type you can cast to DOUBLE PRECISION 
on input to the function.

Note that the function is called with the dependent variable first (`stats_agg(Y, X)`)
this may feel unusual to some as the independent variable is often first in non-SQL contexts. 
However, PostgreSQL and the SQL standard follow the convention of putting the dependent variable
first in linear regression type functions and we have followed suit. 

<highlight type="note">
Note that `value` can be NULL, but the aggregate is not evaluated
on NULL values. This means that if the aggregate receives only a NULL value, it will
return NULL, it will not return an error. If non-NULL values are also received, the NULL 
values will be ignored. Both `Y` and `X` must be non-NULL for the row to be included.
</highlight>


## Returns

|Column|Type|Description|
|-|-|-|
|stats_agg|StatsSummary1D|A StatsSummary object that can be passed to accessor functions or other objects in the stats aggregate API|


<!---Any special notes about the returns-->

## Sample usage
This example produces a CounterSummary from timestamps and associated values.

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


[hyperfunctions-stats-agg]: timescaledb/:currentVersion:/how-to-guides/hyperfunctions/stats-aggs/
