---
api_name: average()
excerpt: Calculate the time-weighted average of values in a `TimeWeightSummary`
topics: [hyperfunctions]
keywords: [average, time-weighted, hyperfunctions, toolkit]
api:
  license: community
  type: function
  toolkit: true
  version:
    experimental: 0.1.0
    stable: 1.0.0
hyperfunction:
  family: time-weighted averages
  type: accessor
  aggregates:
    - time_weight()
---

# average() <tag type="toolkit">Toolkit</tag>

```SQL
average(
    tws TimeWeightSummary
) RETURNS DOUBLE PRECISION
```

Compute a time-weighted average from a `TimeWeightSummary`.

This function is similar to [`integral`][hyperfunctions-integral] but divides by the length of time being averaged.

*   For more information about time-weighted average functions, see the
    [hyperfunctions documentation][hyperfunctions-time-weight-average].

### Required arguments

|Name|Type|Description|
|-|-|-|
|`tws`|`TimeWeightSummary`|The input TimeWeightSummary from a [`time_weight`][time_weight] call|

### Returns

|Column|Type|Description|
|-|-|-|
|`average`|`DOUBLE PRECISION`|The time-weighted average computed from the `TimeWeightSummary`|

### Sample usage

```SQL
SELECT
    id,
    average(tws)
FROM (
    SELECT
        id,
        time_weight('LOCF', ts, val) AS tws
    FROM foo
    GROUP BY id
) t
```

[hyperfunctions-time-weight-average]: /timescaledb/:currentVersion:/how-to-guides/hyperfunctions/time-weighted-averages/
[hyperfunctions-stats-agg]: /timescaledb/:currentVersion:/how-to-guides/hyperfunctions/stats-aggs/
[time_weight]: /api/:currentVersion:/hyperfunctions/time-weighted-averages/time_weight/
[hyperfunctions-integral]: /api/:currentVersion:/hyperfunctions/time-weighted-averages/integral-time-weight/
