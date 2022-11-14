---
api_name: lttb()
excerpt: Downsample a time series using the Largest Triangle Three Buckets method
topics: [hyperfunctions]
keywords: [downsample, smooth, hyperfunctions, toolkit]
api:
  license: community
  type: function
  toolkit: true
  version:
    experimental: 0.2.0
    stable: 1.10.1
hyperfunction:
  family: downsample
  type: one-step aggregate
# fields below will be deprecated
api_category: hyperfunction
toolkit: true
hyperfunction_family: 'downsample'
hyperfunction_subfamily: 'downsample'
hyperfunction_type: other
---

# lttb()  <tag type="toolkit">Toolkit</tag>

[Largest Triangle Three Buckets][gh-lttb] is a downsampling method that
tries to retain visual similarity between the downsampled data and the
original dataset. The TimescaleDB Toolkit implementation of this takes
`(timestamp, value)` pairs, sorts them if needed, and downsamples them.

## Required arguments

|Name| Type |Description|
|-|-|-|
|`time`|`TIMESTAMPTZ`|Time (x) value for the data point|
|`value`|`DOUBLE PRECISION`|Data (y) value for the data point|
|`resolution`|`INTEGER`|Number of points the output should have|

## Returns

|Column|Type|Description|
|-|-|-|
|`timevector`|`Timevector`|A [`timevector`][hyperfunctions-timevectors] object containing the downsampled points. It can be unpacked with `unnest`.|

## Sample usage

This examples uses a table with raw data generated as a sine wave:

```sql
SET TIME ZONE 'UTC';
CREATE TABLE metrics(date TIMESTAMPTZ, reading DOUBLE PRECISION);
INSERT INTO metrics
SELECT
    '2020-1-1 UTC'::timestamptz + make_interval(hours=>foo),
    (5 + 5 * sin(foo / 24.0 * PI()))
    FROM generate_series(1,168) foo;
```

You can use LTTB to dramatically reduce the number of points while still
capturing the peaks and valleys in the data:

```sql
SELECT time, value
FROM unnest((
    SELECT lttb(date, reading, 8)
    FROM metrics))
```

The output looks like this:

```sql
          time          |        value        
------------------------+---------------------
 2020-01-01 01:00:00+00 |   5.652630961100257
 2020-01-01 13:00:00+00 |   9.957224306869053
 2020-01-02 11:00:00+00 | 0.04277569313094798
 2020-01-03 11:00:00+00 |   9.957224306869051
 2020-01-04 13:00:00+00 | 0.04277569313094709
 2020-01-05 16:00:00+00 |   9.330127018922191
 2020-01-06 20:00:00+00 |  2.4999999999999996
 2020-01-08 00:00:00+00 |   5.000000000000004
```

[gh-lttb]: https://github.com/sveinn-steinarsson/flot-downsample
[hyperfunctions-timevectors]: /timescaledb/:currentVersion:/how-to-guides/hyperfunctions/function-pipelines/#timevectors
