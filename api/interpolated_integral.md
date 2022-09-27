---
api_name: interpolated_integral()
excerpt: Calculate the time-weighted integral of values within an interval, interpolating the interval bounds
topics: [hyperfunctions]
tags: [hyperfunctions, integral, time-weighted, TimeWeightSummary, interpolated]
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

# interpolated_integral() <tag type="toolkit">Toolkit</tag><tag type="experimental-toolkit">Experimental</tag>

```SQL
interpolated_integral(
    tws TimeWeightSummary,
    start TIMESTAMPTZ,
    interval INTERVAL,
    prev TimeWeightSummary,
    next TimeWeightSummary,
    unit TEXT
) RETURNS DOUBLE PRECISION
```

A function to compute a time-weighted integral over the interval, defined as `start`
plus `interval`, given a `prev` and `next` time-weight summary from which to
compute the boundary points. This is intended to allow a precise time-weighted
integral over intervals even when the points representing the intervals are grouped
into discrete time-weight summaries. PostgreSQL window functions such as
`LEAD` and `LAG` can be used to determine the `prev` and `next` arguments,
as used in the examples in this section.

Note that if either `prev` or `next` are `NULL`, the first or last point in the
summary is treated as the edge of the interval. The interpolated point is
determined using LOCF (Last Observation Carries Forward) or linear
interpolation, depending on which interpolation style the time-weight summary
was created with.

This function is similar to [`interpolated_average`][hyperfunctions-interpolated-average] but doesn't divide by the length of time being integrated.

*   For more information about time-weighted average functions, see the
    [hyperfunctions documentation][hyperfunctions-time-weight-average].
*   For more information about statistical aggregate functions, see the
    [hyperfunctions documentation][hyperfunctions-stats-agg].

### Required arguments

|Name|Type|Description|
|-|-|-|
|`tws`|`TimeWeightSummary`|The input TimeWeightSummary from a [`time_weight`][hyperfunctions-time-weight] call|
|`start`|`TIMESTAMPTZ`|The start of the interval which the time-weighted integral should cover (if there is a preceeding point)|
|`interval`|`INTERVAL`|The length of the interval which the time-weighted integral should cover|

### Optional arguments

|Name|Type|Description|
|-|-|-|
|`prev`|`TimeWeightSummary`|The TimeWeightSummary from the prior interval, used to interpolate the value at `start`. If `NULL`, the first timestamp in `tws` is used as the start of the interval.|
|`next`|`TimeWeightSummary`|The TimeWeightSummary from the following interval, used to interpolate the value at `start` + `interval`. If `NULL`, the last timestamp in `tws` is used as the end of the interval.|
|`unit`|`TEXT`|The unit of time to express the integral in. Can be `microsecond`/`millisecond`/`second`/`minute`/`hour` or any alias for those units supported by PostgreSQL. If `NULL`, `second` is defaulted to.|

### Returns

|Column|Type|Description|
|-|-|-|
|`interpolated_integral`|`DOUBLE PRECISION`|The time-weighted integral for the interval (`start`, `start` + `interval`) computed from the `TimeWeightSummary` plus end points interpolated from `prev` and `next`|

### Sample usage

```SQL
SELECT
    id,
    time,
    interpolated_integral(
        tws,
        time,
        '1 day',
        LAG(tws) OVER (ORDER BY time PARTITION BY id),
        LEAD(tws) OVER (ORDER BY time PARTITION BY id)
    )
FROM (
    SELECT
        id,
        time_bucket('1 day', ts) AS time,
        time_weight('LOCF', ts, val) AS tws
    FROM foo
    GROUP BY id, time
) t
```

[hyperfunctions-time-weight-average]: /timescaledb/:currentVersion:/how-to-guides/hyperfunctions/time-weighted-averages/
[hyperfunctions-time-weight]: /api/:currentVersion:/hyperfunctions/time-weighted-averages/time_weight/
[hyperfunctions-interpolated-average]: /api/:currentVersion:/hyperfunctions/time-weighted-averages/interpolated_average/
[hyperfunctions-stats-agg]: /timescaledb/:currentVersion:/how-to-guides/hyperfunctions/stats-aggs/
