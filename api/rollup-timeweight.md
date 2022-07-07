---
api_name: rollup()
excerpt: Roll up multiple `TimeWeightSummaries`
license: community
toolkit: true
topic: hyperfunctions
keywords: [rollup, time-weighted, hyperfunctions, toolkit]
api_category: hyperfunction
api_experimental: false
hyperfunction_toolkit: true
hyperfunction_family: 'time-weighted averages'
hyperfunction_subfamily: 'time-weighted averages'
hyperfunction_type: rollup
---

# rollup(TimeWeightSummary) <tag type="toolkit">Toolkit</tag>

```SQL
rollup(
    tws TimeWeightSummary
) RETURNS TimeWeightSummary
```

An aggregate to compute a combined `TimeWeightSummary` from a series of
non-overlapping `TimeWeightSummaries`. Overlapping `TimeWeightSummaries` causes
errors.

For more information about time-weighted average functions, see the
[hyperfunctions documentation][hyperfunctions-time-weight-average].

## Required arguments

|Name| Type |Description|
|---|---|---|
|`tws`|`TimeWeightSummary`|The input TimeWeightSummary from a previous `time_weight` call, often from a continuous aggregate|

## Returns

|Column|Type|Description|
|---|---|---|
|`time_weight`|`TimeWeightSummary`|A TimeWeightSummary object that can be passed to other functions within the time weighting API|


## Sample usage

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


[hyperfunctions-time-weight-average]: /timescaledb/:currentVersion:/how-to-guides/hyperfunctions/time-weighted-averages/
