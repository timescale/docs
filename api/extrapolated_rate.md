---
api_name: extrapolated_rate()
excerpt: Calculate the extrapolated rate of change from values in a `CounterSummary`
topics: [hyperfunctions]
keywords: [rate, counters, hyperfunctions, Toolkit]
tags: [extrapolate]
api:
  license: community
  type: function
  toolkit: true
  version:
    experimental: 0.2.0
    stable: 1.3.0
hyperfunction:
  family: metric aggregation
  type: accessor
  aggregates:
    - counter_agg()
    - gauge_agg()
---

# extrapolated_rate() <tag type="toolkit" content="Toolkit" />

The rate of change in the counter computed over the time period specified by the
bounds in the CounterSummary, extrapolating to the edges. It is an
`extrapolated_delta` divided by the duration in seconds.

The bounds must be specified for the `extrapolated_rate` function to work. The
bounds can be provided in the `counter_agg` call, or by using the `with_bounds`
utility function.

```sql
extrapolated_rate(
    summary CounterSummary,
    method TEXT
) RETURNS DOUBLE PRECISION
```

For more information about counter aggregation functions, see the
[hyperfunctions documentation][hyperfunctions-counter-agg].

## Required arguments

|Name|Type|Description|
|-|-|-|
|summary|CounterSummary|The input CounterSummary from a counter_agg call|
|method|TEXT|The extrapolation method to use. Not case-sensitive.|

Currently, the only allowed value of method is `prometheus`, as we have only
implemented extrapolation following the Prometheus extrapolation protocol.

## Returns

|Name|Type|Description|
|-|-|-|
|extrapolated_rate|DOUBLE PRECISION|The per-second rate of change of the counter computed from the CounterSummary extrapolated to the bounds specified there.|

## Sample usage

```sql
SELECT
    id,
    bucket,
    extrapolated_rate(
        with_bounds(
            summary,
            toolkit_experimental.time_bucket_range('15 min'::interval, bucket)
        ),'prometheus'
    )
FROM (
    SELECT
        id,
        time_bucket('15 min'::interval, ts) AS bucket,
        counter_agg(ts, val) AS summary
    FROM foo
    GROUP BY id, time_bucket('15 min'::interval, ts)
) t;
```

[hyperfunctions-counter-agg]: /timescaledb/:currentVersion:/how-to-guides/hyperfunctions/counter-aggregation/
