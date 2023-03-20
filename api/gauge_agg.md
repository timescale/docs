---
api_name: gauge_agg()
excerpt: Aggregate gauge data into a `GaugeSummary` for further analysis
topics: [hyperfunctions]
keywords: [gauges, aggregate, hyperfunctions, Toolkit]
api:
  license: community
  type: function
  experimental: true
  toolkit: true
  version:
    experimental: 1.6.0
hyperfunction:
  family: metric aggregation
  type: aggregate
---

import Experimental from 'versionContent/_partials/_experimental.mdx';

# gauge_agg() <Tag type="toolkit" content="Toolkit" /><Tag type="experimental" content="Experimental" />

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

<Highlight type="note">
If there are `NULL` values in your data, the aggregate ignores them and
aggregates only non-`NULL` values. If you only have `NULL` values, the aggregate
returns `NULL`.
</Highlight>

## Optional arguments

|Name|Type|Description|
|-|-|-|
|`bounds`|`TSTZRANGE`|The largest and smallest possible times that can be input to the aggregate. Calling with `NULL`, or leaving out the argument, results in an unbounded `GaugeSummary`|

<Highlight type="important">
Bounds are required for extrapolation, but not for other accessor functions.
</Highlight>

## Returns

|Column|Type|Description|
|-|-|-|
|`gauge_agg`|`GaugeSummary`|A `GaugeSummary` object that can be passed to accessor functions or other objects in the gauge aggregate API|

<Highlight type="important">
The returned `GaugeSummary` can be used as an input the accessor functions
`delta`, `idelta_left`, and `idelta_right`. When this feature is mature, it will support
all the same accessor functions as `CounterSummary`, with the exception of
`num_resets`.
</Highlight>

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

[hyperfunctions-counter-agg]: /use-timescale/:currentVersion:/hyperfunctions/counter-aggregation/
