---
api_name: stats_agg()
excerpt: Aggregate statistical data into a statistical aggregate for further analysis
license: community
toolkit: true
topic: hyperfunctions
tags: [hyperfunctions, aggregates, statistics, statistical aggregates]
api_category: hyperfunction
api_experimental: false
hyperfunction_toolkit: true
hyperfunction_family: 'statistical aggregates'
hyperfunction_subfamily: 'statistical aggregates'
hyperfunction_type: aggregate
---

# stats_agg() <tag type="toolkit" content="Toolkit" />
An aggregate that produces a StatsSummary from `DOUBLE PRECISION` values. 

Statistical aggregates can be done on either one or two variables. 
For a single variable, only one-dimensional aggregates are calculated. 
For two variables, one-dimensional aggregates are calculated for 
each variable, and linear regression is performed on both together. 

For more information about statistical aggregation functions, see the
[hyperfunctions documentation][hyperfunctions-stats-agg].

## 1D statistical aggregates
When you perform a statistical aggregate on a single variable, a 
one-dimensional aggregate is calculated.

### Required arguments

|Name|Type|Description|
|-|-|-|
|value|DOUBLE PRECISION|The variable to use for the statistical aggregate|

The `value` argument is currently only accepted as a DOUBLE PRECISION number.
If you store a value as a different numeric type you can cast to DOUBLE PRECISION 
on input to the function.

<highlight type="note">
The `value` can be NULL, but the aggregate is not evaluated
on NULL values. This means that if the aggregate receives only a NULL value, it 
returns NULL, it does not return an error. If non-NULL values are also received, the NULL 
values are ignored. 
</highlight>

### Returns

|Column|Type|Description|
|-|-|-|
|`stats_agg`|`StatsSummary1D`|A one-dimensional StatsSummary object that can be passed to accessor functions or other objects in the stats aggregate API|

## 2D statistical aggregates
When you perform a statistical aggregate on two variables, 
one-dimensional aggregates are calculated for each variable, 
and linear regression is performed on both together. 

### Required arguments

|Name|Type|Description|
|-|-|-|
|`Y`|`DOUBLE PRECISION`|The dependent variable to use for the statistical aggregate|
|`X`|`DOUBLE PRECISION`|The independent variable to use for the statistical aggregate|

The `Y` and `X`  arguments are currently only accepted as DOUBLE PRECISION numbers.
If you store a value as a different numeric type you can cast to DOUBLE PRECISION 
on input to the function.

Note that the function is called with the dependent variable first (`stats_agg(Y, X)`), which
could seem unusual because the independent variable is often first in non-SQL contexts. 
However, this function follows PostgreSQL and the SQL standard, which puts the dependent 
variable first in [linear regression type functions][pg-stats-aggs]. 

<highlight type="note">
Note that `value` can be NULL, but the aggregate is not evaluated
on NULL values. This means that if the aggregate receives only a NULL value, it 
returns NULL, it does not return an error. If non-NULL values are also received, the NULL 
values are ignored. Both `Y` and `X` must be non-NULL for the row to be included.
</highlight>

### Returns

|Column|Type|Description|
|-|-|-|
|`stats_agg`|`StatsSummary2D`|A two-dimensional StatsSummary object that can be passed to accessor functions or other objects in the stats aggregate API|

## Sample usage
This example produces one and two dimensional `StatsSummaries` in the 
CTE (`WITH t as (...)`, and then uses the `average` and `slope` accessors 
for each type to calculate the corresponding values from each function: 
``` sql
WITH t as (
    SELECT
        time_bucket('1 day'::interval, ts) as dt,
        stats_agg(val2, val1) AS stats2D, 
        stats_agg(val1) AS stats1D 
    FROM foo
    WHERE id = 'bar'
    GROUP BY time_bucket('1 day'::interval, ts)
)
SELECT
    average_x(stats2D), -- use average_x on 2D summary
    average(stats1D), -- use normal average on 1D summary to get same value
    slope(stats2D) -- slope and other regression functions only work on 2D aggregates
FROM t;
```


[hyperfunctions-stats-agg]: timescaledb/:currentVersion:/how-to-guides/hyperfunctions/stats-aggs/
[pg-stats-aggs]: https://www.postgresql.org/docs/current/functions-aggregate.html#FUNCTIONS-AGGREGATE-STATISTICS-TABLE
