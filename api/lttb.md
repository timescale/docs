---
api_name: lttb()
excerpt: Downsample a time series using the Largest Triangle Three Buckets method
topics: [hyperfunctions]
keywords: [downsample, smooth, hyperfunctions, toolkit]
api:
  license: community
  type: function
  experimental: true
  toolkit: true
hyperfunction:
  family: downsample
  type: one-step aggregate
# fields below will be deprecated
api_category: hyperfunction
api_experimental: true
toolkit: true
hyperfunction_family: 'downsample'
hyperfunction_subfamily: 'downsample'
hyperfunction_type: other
---

# lttb()  <tag type="toolkit">Toolkit</tag><tag type="experimental-toolkit">Experimental</tag>

[Largest Triangle Three Buckets][gh-lttb] is a downsampling method that
tries to retain visual similarity between the downsampled data and the
original dataset. The TimescaleDB Toolkit implementation of this takes
`(timestamp, value)` pairs, sorts them if needed, and downsamples them.

## Required arguments

|Name|Type|Description|
|-|-|-|
|`time`|`TIMESTAMPTZ`|Time (x) value for the data point|
|`value`|`DOUBLE PRECISION`|Data (y) value for the data point|
|`resolution`|`INTEGER`|Number of points the output should have|

## Returns

|Column|Type|Description|
|-|-|-|
|`sortedtimevector`|`SortedTimevector`|A [`timevector`][hyperfunctions-timevectors] object containing the downsampled points. It can be unpacked via `unnest`.|

## Sample usage

This example creates a dramatically downsampled data set from a `sample_data` table:

```sql
SELECT time, value
FROM toolkit_experimental.unnest((
    SELECT toolkit_experimental.lttb(time, val, 4)
    FROM sample_data))
```

The output for this query:

```sql
          time          |       value
------------------------+--------------------
 2020-01-11 00:00:00+00 |   12.7015115293407
 2020-02-01 00:00:00+00 |  5.004324248633603
 2020-03-03 00:00:00+00 | 14.982710485116087
 2020-04-20 00:00:00+00 | 10.022128489940254
```

This example creates a downsampled dataset from multiple series:

```sql
WITH downsamples AS (
 SELECT
  metric_id,
  toolkit_experimental.lttb("time", value, :datapoint_count) AS samples
 FROM sample_data
 WHERE metric_id = any(:metric_ids)
     AND TIME BETWEEN
      :start_time - interval '1 seconds' * :resolution
      AND :end_time + interval '1 seconds' * :resolution
 GROUP BY metric_id
)
SELECT
 metric_id,
 s."time",
 s.value
FROM downsamples ds
 CROSS JOIN lateral (SELECT * FROM toolkit_experimental.unnest(ds.samples)) s
;
```

[gh-lttb]: https://github.com/sveinn-steinarsson/flot-downsample
[hyperfunctions-timevectors]: /timescaledb/:currentVersion:/how-to-guides/hyperfunctions/function-pipelines/#timevectors
