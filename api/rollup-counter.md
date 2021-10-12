## rollup(CounterSummary) <tag type="toolkit">Toolkit</tag>

```SQL
rollup(
    cs CounterSummary
) RETURNS CounterSummary
```

An aggregate to compute a combined CounterSummary from a series of
non-overlapping CounterSummaries. Non-disjoint CounterSummaries causes
errors. See
[Notes on Parallelism and Ordering](/hyperfunctions/time-weighted-averages/time_weight/##advanced-usage-notes) for more information.

### Required arguments

|Name| Type |Description|
|---|---|---|
|`cs`|CounterSummary|The input CounterSummary from a previous counter_agg (point form) call, often from a continuous aggregate|

### Returns

|Column|Type|Description|
|---|---|---|
|`counter_agg`|CounterSummary|A CounterSummary object that can be passed to accessor functions or other objects in the counter aggregate API|


### Sample usage

```SQL
WITH t as (
    SELECT
        date_trunc('day', ts) as dt,
        counter_agg(ts, val) AS counter_summary -- get a time weight summary
    FROM foo
    WHERE id = 'bar'
    GROUP BY date_trunc('day')
), q as (
    SELECT rollup(counter_summary) AS full_cs -- do a second level of aggregation to get the full CounterSummary
    FROM t
)
SELECT
    dt,
    delta(counter_summary),  -- extract the delta from the  CounterSummary
    delta(counter_summary) / (SELECT delta(full_cs) FROM q LIMIT 1)  as normalized -- get the fraction of the delta that happened each day compared to the full change of the counter
FROM t;
```
