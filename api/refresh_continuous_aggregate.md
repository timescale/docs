---
api_name: refresh_continuous_aggregate()
excerpt: Manually refresh a continuous aggregate
topics: [continuous aggregates]
keywords: [continuous aggregates, refresh]
api:
  license: community
  type: function
---

## refresh_continuous_aggregate() <tag type="community">Community</tag>

Refresh all buckets of a continuous aggregate in the refresh window given by
`window_start` and `window_end`.

A continuous aggregate materializes aggregates in time buckets (for example,
min, max, average over 1 day worth of data), as determined by the `time_bucket`
interval specified when the continuous aggregate was created. Therefore, when
refreshing the continuous aggregate, only buckets that completely fit within the
refresh window are refreshed. In other words, it is not possible to compute the
aggregate over, for example, half a bucket. Therefore, any buckets that do not
fit within the given refresh window are excluded.

The function expects the window parameter values to have a time type that is
compatible with the continuous aggregate's time bucket expression&mdash;for
example, if the time bucket is specified in `TIMESTAMP WITH TIME ZONE`, then the
start and end time should be a date or timestamp type. Note that a continuous
aggregate using the `TIMESTAMP WITH TIME ZONE` type aligns with the UTC time
zone, so, if `window_start` and `window_end` is specified in the local time
zone, any time zone shift relative UTC needs to be accounted for when refreshing
to align with bucket boundaries.

### Required arguments

|Name|Type|Description|
|-|-|-|
|`continuous_aggregate`|REGCLASS|The continuous aggregate to refresh.|
|`window_start`|INTERVAL, TIMESTAMPZ, INTEGER|Start of the window to refresh, has to be before `window_end`. `NULL` is equivalent to `MIN(timestamp)` of the hypertable.|
|`window_end`|INTERVAL, TIMESTAMPZ, INTEGER|End of the window to refresh, has to be after `window_start`. `NULL` is equivalent to `MAX(timestamp)` of the hypertable.|

You must specify the `start_offset` and `end_offset` parameters differently,
depending on the type of the time column of the hypertable. For hypertables with
`TIMESTAMP`, `TIMESTAMPTZ`, and `DATE` time columns, set the offset as an
`INTERVAL` type. For hypertables with integer-based timestamps, set the offset
as an `INTEGER` type.

### Sample usage

Refresh the continuous aggregate `conditions` between `2020-01-01` and
`2020-02-01` exclusive.

```sql
CALL refresh_continuous_aggregate('conditions', '2020-01-01', '2020-02-01');
```
