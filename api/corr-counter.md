---
api_name: corr
api_category: hyperfunction
api_experimental: false
hyperfunction_toolkit: true
hyperfunction_family: 'metric aggregation'
hyperfunction_subfamily: 'counter and gauge aggregation'
hyperfunction_type: accessor
---

# corr() <tag type="toolkit" content="Toolkit" />
The correlation coefficient of the least squares fit line of the adjusted
counter value and epoch value of the time column. Given that the slope of a line for any counter value must be
non-negative, this must also always be non-negative and in the range from 0.0 to
1.0. It measures how well the least squares fit the available data, where a
value of 1.0 represents the strongest correlation between time and the counter
increasing.

```sql
corr(
    summary CounterSummary
) RETURNS DOUBLE PRECISION
```

For more information about counter aggregation functions, see the
[hyperfunctions documentation][hyperfunctions-counter-agg].

## Required arguments

|Name|Type|Description|
|-|-|-|
|summary|CounterSummary|The input CounterSummary from a counter_agg call|

## Returns

|Name|Type|Description|
|-|-|-|
|corr|DOUBLE PRECISION|The correlation coefficient computed from the least squares fit of the adjusted counter values input to the CounterSummary|

## Sample usage

```sql
SELECT
    id,
    bucket,
    corr(summary)
FROM (
    SELECT
        id,
        time_bucket('15 min'::interval, ts) AS bucket,
        counter_agg(ts, val) AS summary
    FROM foo
    GROUP BY id, time_bucket('15 min'::interval, ts)
) t
```


[hyperfunctions-counter-agg]: timescaledb/:currentVersion:/how-to-guides/hyperfunctions/counter-aggregation/
