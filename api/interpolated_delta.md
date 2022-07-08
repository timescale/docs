---
api_name: interpolated_delta()
excerpt: Calculate the interpolated change in a counter from values in a sequence of `CounterSummary`s
license: community
toolkit: true
experimental: true
topic: hyperfunctions
tags: [hyperfunctions, delta, counters, CounterSummary, interpolated]
api_category: hyperfunction
api_experimental: true
hyperfunction_toolkit: true
hyperfunction_family: 'metric aggregation'
hyperfunction_subfamily: 'counter and gauge aggregation'
hyperfunction_type: accessor
---

# interpolated_delta() <tag type="toolkit" content="Toolkit" /><tag type="experimental-toolkit">Experimental</tag>
The change in the counter during the time period specified by the bounds in the
arguments. To calculate the interpolated delta, the previous and next CounterSummaries
are used to linearly interpolate the value at the interval boundary points.

```sql
interpolated_delta(
    summary CounterSummary,
    start TIMESTAMPTZ,
    interval INTERVAL,
    prev CounterSummary,
    next CounterSummary
) RETURNS DOUBLE PRECISION
```

For more information about counter aggregation functions, see the
[hyperfunctions documentation][hyperfunctions-counter-agg].

## Required arguments

|Name|Type|Description|
|-|-|-|
|summary|CounterSummary|The input CounterSummary from a counter_agg call|
|`start`|`TIMESTAMPTZ`|The start of the interval which the delta should be computed over (if there is a preceeding point)|
|`interval`|`INTERVAL`|The length of the interval which the delta should cover|

### Optional arguments

|Name|Type|Description|
|-|-|-|
|`prev`|`TimeWeightSummary`|The CounterSummary from the interval prior to this, used to interpolate the value at `start`. If NULL, the first timestamp in `summary` will be used as the start of the interval.|
|`next`|`TimeWeightSummary`|The CounterSummary from the interval following this, used to interpolate the value at `start` + `interval`. If NULL, the last timestamp in `summary` will be used as the end of the interval.|

## Returns

|Name|Type|Description|
|-|-|-|
|interpolated_delta|DOUBLE PRECISION|The delta computed from the sequence of CounterSummaries|

## Sample usage

```sql
SELECT
    id,
    bucket,
    interpolated_delta(
        summary,
        bucket,
        '15 min',
        LAG(summary) OVER (ORDER by bucket PARTITION BY id),
        LEAD(summary) OVER (ORDER by bucket PARTITION BY id)
    )
FROM (
    SELECT
        id,
        time_bucket('15 min'::interval, ts) AS bucket,
        counter_agg(ts, val) AS summary
    FROM foo
    GROUP BY id, time_bucket('15 min'::interval, ts)
) t
```


[hyperfunctions-counter-agg]: /timescaledb/:currentVersion:/how-to-guides/hyperfunctions/counter-aggregation/
