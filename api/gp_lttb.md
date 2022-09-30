---
api_name: gp_lttb()
excerpt: An implementation of our lttb algorithm that will preserve gaps in the original data
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

# gp_lttb()  <tag type="toolkit">Toolkit</tag><tag type="experimental-toolkit">Experimental</tag>

Gap preserving LTTB is a specialization of the [LTTB][lttb] algorithm that
preserves gaps in the underlying data. It uses a minimum gap
size, which can be provided by the caller, or that defaults to the time span of the
incoming data divided by the desired target resolution. It then scans through
the input and breaks it into ranges of points separated by gaps of at least the
minimum size. It then performs a LTTB on each range, with resolution
proportional to the percentage of the total points with that range, and
concatenates the results.

If the minimum gap size is set too low, the algorithm might produce more points
than the target resolution. This occurs if there are more ranges than half the
target resolution, because each range returns at least two points.

## Required arguments

|Name|Type|Description|
|-|-|-|
|`time`|`TIMESTAMPTZ`|Time (x) value for the data point|
|`value`|`DOUBLE PRECISION`|Data (y) value for the data point|
|`resolution`|`INTEGER`|Number of points the output should have|

## Optional arguments

|Name|Type|Description|
|-|-|-|
|`gapsize`|`INTERVAL`|Minimum gap size to divide input on|

If the gapsize is not provided it will be computed as the interval between the first and last times, divided by the resolution.

## Returns

|Column|Type|Description|
|-|-|-|
|`timevector`|`Timevector`|A [`timevector`][hyperfunctions-timevectors] object containing the downsampled points. It can be unpacked with `unnest`.|

## Sample usage

This example uses a table with raw data generated as a sine wave, and removes a
day from the middle of the data:

```sql
SET TIME ZONE 'UTC';
CREATE TABLE metrics(date TIMESTAMPTZ, reading DOUBLE PRECISION);
INSERT INTO metrics
SELECT
    '2020-1-1 UTC'::timestamptz + make_interval(hours=>foo),
    (5 + 5 * sin(foo / 24.0 * PI()))
    FROM generate_series(1,168) foo;
DELETE FROM metrics WHERE date BETWEEN '2020-1-4 UTC' AND '2020-1-5 UTC';
```

You can use gap preserving LTTB to downsample the data while keeping the bounds
of the missing region:

```sql
SELECT time, value
FROM unnest((
    SELECT toolkit_experimental.gp_lttb(date, reading, 8)
    FROM metrics))
```

Which provides these results:

```sql
          time          |        value
------------------------+-------------------
 2020-01-01 01:00:00+00 | 5.652630961100257
 2020-01-02 12:00:00+00 |                 0
 2020-01-03 23:00:00+00 | 5.652630961100255
 2020-01-05 01:00:00+00 | 5.652630961100259
 2020-01-05 13:00:00+00 | 9.957224306869051
 2020-01-06 12:00:00+00 |                 0
 2020-01-07 10:00:00+00 |  9.82962913144534
 2020-01-08 00:00:00+00 | 5.000000000000004
```

[lttb]: /api/:currentVersion:/hyperfunctions/downsample/lttb/
[hyperfunctions-timevectors]: /timescaledb/:currentVersion:/how-to-guides/hyperfunctions/function-pipelines/#timevectors
