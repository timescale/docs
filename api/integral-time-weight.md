---
api_name: integral()
excerpt: Calculate the time-weighted integral of values in a `TimeWeightSummary`
topics: [hyperfunctions]
keywords: [average, time-weighted, hyperfunctions, toolkit]
api:
  license: community
  type: function
  experimental: true
  toolkit: true
hyperfunction:
  family: time-weighted averages
  type: accessor
  aggregates:
    - time_weight()
# fields below will be deprecated
api_category: hyperfunction
api_experimental: true
toolkit: true
hyperfunction_family: 'time-weighted averages'
hyperfunction_subfamily: 'time-weighted averages'
hyperfunction_type: accessor
---

# integral() <tag type="toolkit">Toolkit</tag><tag type="experimental-toolkit">Experimental</tag>

```SQL
integral(
    tws TimeWeightSummary,
    unit TEXT
) RETURNS DOUBLE PRECISION
```

A function to compute a time-weighted integral from a `TimeWeightSummary`.

This function is similar to [`average`][hyperfunctions-average] but doesn't divide by the length of time being integrated.

*   For more information about time-weighted average functions, see the
    [hyperfunctions documentation][hyperfunctions-time-weight-average].
*   For more information about statistical aggregate functions, see the
    [hyperfunctions documentation][hyperfunctions-stats-agg].

### Required arguments

|Name|Type|Description|
|-|-|-|
|`tws`|`TimeWeightSummary`|The input TimeWeightSummary from a [`time_weight`][time_weight] call|

### Returns

|Column|Type|Description|
|-|-|-|
|`integral`|`DOUBLE PRECISION`|The time-weighted integral computed from the `TimeWeightSummary`|

### Sample usage

```SQL
SELECT
    id,
    integral(tws)
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
[hyperfunctions-average]: /api/:currentVersion:/hyperfunctions/time-weighted-averages/average-time-weight/
