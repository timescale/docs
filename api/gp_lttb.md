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

The gap preserving LTTB is a specialization of our [LTTB][lttb] algorithm that will preserve gaps in the underlying data.  It does this by using a minimum gap size, either provided by the caller, or defaulting to the time span of the incoming data divided by the desired target resolution.  It then scans through the input and breaks it into ranges of points separated by gaps of at least that minimum size.  It will then perform a LTTB on each range, with resolution proportional to the percentage of the total points with that range, and concatonates the results together.

Note that this algorithm may produce more points than the target resolution if the minimum gap size is set so low that there are more ranges than half the target resolution (each range will return at least two points).

## Required arguments

|Name| Type |Description|
|-|-|-|
|`time`|`TIMESTAMPTZ`|Time (x) value for the data point|
|`value`|`DOUBLE PRECISION`|Data (y) value for the data point|
|`gapsize`|`INTERVAL`|(Optional) Minimum gap size to divide input on|
|`resolution`|`INTEGER`|Number of points the output should have|

## Returns

|Column|Type|Description|
|-|-|-|
|`timevector`|`Timevector`|A [`timevector`][hyperfunctions-timevectors] object containing the downsampled points. It can be unpacked via `unnest`.|

## Sample usage
For this example we'll use a table with raw data generated as a sine wave, and remove a day from the middle of the data.
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

Using gap preserving LTTB we can downsample the data while keeping the bounds of the missing region.
```sql
SELECT time, value
FROM unnest((
    SELECT toolkit_experimental.gp_lttb(date, reading, 8)
    FROM metrics))
```

Which gives us:
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

------- continue here fixing this----
[lttb]: /api/:currentVersion:/hyperfunctions/downsample/lttb/
