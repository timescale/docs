---
api_name: gauge_agg()
excerpt: Aggregate gauge data into a `GaugeSummary` for further analysis
license: community
toolkit: true
experimental: true
topic: hyperfunctions
tags: [hyperfunctions, gauges, aggregates, GaugeSummary]
api_category: hyperfunction
api_experimental: true
hyperfunction_toolkit: true
hyperfunction_family: 'metric aggregation'
hyperfunction_subfamily: 'counter and gauge aggregation'
hyperfunction_type: accessor
---

import Experimental from '../../../../_partials/_experimental.mdx';

# gauge_agg() <tag type="toolkit" content="Toolkit" /><tag type="experimental" content="Experimental" />
Produces a `GaugeSummary` that can be used to accumulate gauge data for further
calculations. 
```sql
gauge_agg (
    ts TIMESTAMPTZ,
    value DOUBLE PRECISION
) RETURNS GaugeSummary
```

<Experimental />

For more information about counter and gauge aggregation functions, see the
[hyperfunctions documentation][hyperfunctions-counter-agg].

## Required arguments

|Name|Type|Description
|-|-|-|
|`ts`|`TIMESTAMPTZ`|The time at each point|
|`value`|`DOUBLE PRECISION`|The value at that timestamp|

Only `DOUBLE PRECISION` values are accepted for the `value` parameter. For gauge
data stored as other numeric types, cast it to `DOUBLE PRECISION` when using the
function.

<highlight type="note">
If there are `NULL` values in your data, the aggregate ignores them and
aggregates only non-`NULL` values. If you only have `NULL` values, the aggregate
returns `NULL`.
</highlight>

## Optional arguments

|Name|Type|Description|
|-|-|-|
|`bounds`|`TSTZRANGE`|The largest and smallest possible times that can be input to the aggregate. Calling with `NULL`, or leaving out the argument, results in an unbounded `GaugeSummary`|

<highlight type="important">
Bounds are required for extrapolation, but not for other accessor functions.
</highlight>

## Returns

|Column|Type|Description|
|-|-|-|
|`gauge_agg`|`GaugeSummary`|A `GaugeSummary` object that can be passed to accessor functions or other objects in the gauge aggregate API|

<highlight type="important">
The returned `GaugeSummary` can be used as an input the accessor functions
`delta`, `idelta_left`, and `idelta_right`. When this feature is mature, it will support
all the same accessor functions as `CounterSummary`, with the exception of
`num_resets`.
</highlight>

## Sample usage
Create a gauge summary from time-series data that has a timestamp, `ts`, and a
gauge value, `val`. Get the instantaneous rate of change from the last 2 time
intervals using the `irate_right` accessor:
```sql
WITH t as (
    SELECT
        time_bucket('1 day'::interval, ts) as dt,
        gauge_agg(ts, val) AS gs
    FROM foo
    WHERE id = 'bar'
    GROUP BY time_bucket('1 day'::interval, ts)
)
SELECT
    dt,
    irate_right(gs)
FROM t;
```

[hyperfunctions-counter-agg]: timescaledb/:currentVersion:/how-to-guides/hyperfunctions/counter-aggregation/
