---
api_name: extrapolated_delta()
excerpt: Calculate the extrapolated change in a counter from values in a `CounterSummary`
topics: [hyperfunctions]
keywords: [counters, hyperfunctions, toolkit]
tags: [change, extrapolate]
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
# fields below will be deprecated
api_category: hyperfunction
toolkit: true
hyperfunction_family: 'metric aggregation'
hyperfunction_subfamily: 'counter and gauge aggregation'
hyperfunction_type: accessor
---

# extrapolated_delta() <tag type="toolkit" content="Toolkit" />

The change in the counter during the time period specified by the bounds in the
CounterSummary. To calculate the extrapolated delta, any counter resets are
accounted for and the observed values are extrapolated to the bounds using the
method specified, then the values are subtracted to compute the delta.

The bounds must be specified for the `extrapolated_delta` function to work, the
bounds can be provided in the `counter_agg` call, or by using the `with_bounds`
utility function to set the bounds.

```sql
extrapolated_delta(
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

Currently, the only allowed value of method is `prometheus`, as we have only implemented extrapolation following the Prometheus extrapolation protocol.

## Returns

|Name|Type|Description|
|-|-|-|
|extrapolated_delta|DOUBLE PRECISION|The delta computed from the CounterSummary|

## Sample usage

```sql
SELECT
    id,
    bucket,
    extrapolated_delta(
        with_bounds(
            summary,
            time_bucket_range('15 min'::interval, bucket)
        )
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
