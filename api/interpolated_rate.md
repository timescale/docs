---
api_name: interpolated_rate()
excerpt: Calculate the rate of change in a counter, interpolated over some time period
topics: [hyperfunctions]
tags: [hyperfunctions, rate, counters, CounterSummary, interpolated]
api:
  license: community
  type: function
  experimental: true
  toolkit: true
hyperfunction:
  family: metric aggregation
  type: function
  aggregates:
    - counter_agg()
    - gauge_agg()
# fields below will be deprecated
api_category: hyperfunction
api_experimental: true
toolkit: true
hyperfunction_family: 'metric aggregation'
hyperfunction_subfamily: 'counter and gauge aggregation'
hyperfunction_type: accessor
---

# interpolated_rate() <tag type="toolkit" content="Toolkit" /><tag type="experimental-toolkit">Experimental</tag>

Calculate the rate of change in a counter over a time period. Data points at the exact
boundaries of the time period aren't needed. The function linerally interpolates the
counter values at the boundaries from adjacent `CounterSummaries` if they are unknown.

This is the same value as an
[`interpolated_delta`][interpolated_delta] divided by the duration in seconds.

```sql
interpolated_rate(
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
|`summary`|`CounterSummary`|The input `CounterSummary` from a `counter_agg` call|
|`start`|`TIMESTAMPTZ`|The start of the interval which the rate should be computed over (if there is a preceeding point)|
|`interval`|`INTERVAL`|The length of the interval which the rate should cover|

### Optional arguments

|Name|Type|Description|
|-|-|-|
|`prev`|`CounterSummary`|The `CounterSummary` from the prior interval, used to interpolate the value at `start`. If `NULL`, the first timestamp in `summary` is used as the start of the interval.|
|`next`|`CounterSummary`|The CounterSummary from the following interval, used to interpolate the value at `start` + `interval`. If `NULL`, the last timestamp in `summary` will be used as the end of the interval.|

## Returns

|Name|Type|Description|
|-|-|-|
|`interpolated_rate`|`DOUBLE PRECISION`|The per-second rate of change of the counter between the specified bounds. If the raw data contains no points calculated at those bounds, the bounding values are linearly interpolated from neighboring `CounterSummaries`.|

## Sample usage

```sql
SELECT
    id,
    bucket,
    interpolated_rate(
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

[interpolated_delta]: /api/:currentVersion:/hyperfunctions/counter_aggs/
[hyperfunctions-counter-agg]: /timescaledb/:currentVersion:/how-to-guides/hyperfunctions/counter-aggregation/
