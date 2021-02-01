## histogram() 

The `histogram()` function represents the distribution of a set of
values as an array of equal-width buckets. It partitions the dataset
into a specified number of buckets (`nbuckets`) ranging from the
inputted `min` and `max` values.

The return value is an array containing `nbuckets`+2 buckets, with the
middle `nbuckets` bins for values in the stated range, the first
bucket at the head of the array for values under the lower `min` bound,
and the last bucket for values greater than or equal to the `max` bound.
Each bucket is inclusive on its lower bound, and exclusive on its upper
bound. Therefore, values equal to the `min` are included in the bucket
starting with `min`, but values equal to the `max` are in the last bucket.

#### Required Arguments 

|Name|Description|
|---|---|
| `value` | A set of values to partition into a histogram |
| `min` | The histogram’s lower bound used in bucketing (inclusive) |
| `max` | The histogram’s upper bound used in bucketing (exclusive) |
| `nbuckets` | The integer value for the number of histogram buckets (partitions) |

#### Sample Usage 

A simple bucketing of device's battery levels from the `readings` dataset:

```sql
SELECT device_id, histogram(battery_level, 20, 60, 5)
FROM readings
GROUP BY device_id
LIMIT 10;
```

The expected output:
```sql
 device_id  |          histogram
------------+------------------------------
 demo000000 | {0,0,0,7,215,206,572}
 demo000001 | {0,12,173,112,99,145,459}
 demo000002 | {0,0,187,167,68,229,349}
 demo000003 | {197,209,127,221,106,112,28}
 demo000004 | {0,0,0,0,0,39,961}
 demo000005 | {12,225,171,122,233,80,157}
 demo000006 | {0,78,176,170,8,40,528}
 demo000007 | {0,0,0,126,239,245,390}
 demo000008 | {0,0,311,345,116,228,0}
 demo000009 | {295,92,105,50,8,8,442}
```

---

## interpolate() <tag type="community">Community</tag> 

The `interpolate` function does linear interpolation for missing values.
It can only be used in an aggregation query with [time_bucket_gapfill](#time_bucket_gapfill).
The `interpolate` function call cannot be nested inside other function calls.

#### Required Arguments 

|Name|Description|
|---|---|
| `value` | The value to interpolate (int2/int4/int8/float4/float8) |

#### Optional Arguments 

|Name|Description|
|---|---|
| `prev` | The lookup expression for values before the gapfill time range (record) |
| `next` | The lookup expression for values after the gapfill time range (record) |

Because the interpolation function relies on having values before and after
each bucketed period to compute the interpolated value, it might not have
enough data to calculate the interpolation for the first and last time bucket
if those buckets do not otherwise contain valid values.
For example, the interpolation would require looking before this first
time bucket period, yet the query's outer time predicate WHERE time > ...
normally restricts the function to only evaluate values within this time range.
Thus, the `prev` and `next` expression tell the function how to look for
values outside of the range specified by the time predicate.
These expressions will only be evaluated when no suitable value is returned by the outer query
(i.e., the first and/or last bucket in the queried time range is empty).
The returned record for `prev` and `next` needs to be a time, value tuple.
The datatype of time needs to be the same as the time datatype in the `time_bucket_gapfill` call.
The datatype of value needs to be the same as the `value` datatype of the `interpolate` call.

#### Sample Usage 

Get the temperature every day for each device over the last week interpolating for missing readings:
```sql
SELECT
  time_bucket_gapfill('1 day', time, now() - INTERVAL '1 week', now()) AS day,
  device_id,
  avg(temperature) AS value,
  interpolate(avg(temperature))
FROM metrics
WHERE time > now () - INTERVAL '1 week'
GROUP BY day, device_id
ORDER BY day;

           day          | device_id | value | interpolate
------------------------+-----------+-------+-------------
 2019-01-10 01:00:00+01 |         1 |       |
 2019-01-11 01:00:00+01 |         1 |   5.0 |         5.0
 2019-01-12 01:00:00+01 |         1 |       |         6.0
 2019-01-13 01:00:00+01 |         1 |   7.0 |         7.0
 2019-01-14 01:00:00+01 |         1 |       |         7.5
 2019-01-15 01:00:00+01 |         1 |   8.0 |         8.0
 2019-01-16 01:00:00+01 |         1 |   9.0 |         9.0
(7 row)
```

Get the average temperature every day for each device over the last 7 days interpolating for missing readings with lookup queries for values before and after the gapfill time range:
```sql
SELECT
  time_bucket_gapfill('1 day', time, now() - INTERVAL '1 week', now()) AS day,
  device_id,
  avg(value) AS value,
  interpolate(avg(temperature),
    (SELECT (time,temperature) FROM metrics m2 WHERE m2.time < now() - INTERVAL '1 week' AND m.device_id = m2.device_id ORDER BY time DESC LIMIT 1),
    (SELECT (time,temperature) FROM metrics m2 WHERE m2.time > now() AND m.device_id = m2.device_id ORDER BY time DESC LIMIT 1)
  ) AS interpolate
FROM metrics m
WHERE time > now () - INTERVAL '1 week'
GROUP BY day, device_id
ORDER BY day;

           day          | device_id | value | interpolate
------------------------+-----------+-------+-------------
 2019-01-10 01:00:00+01 |         1 |       |         3.0
 2019-01-11 01:00:00+01 |         1 |   5.0 |         5.0
 2019-01-12 01:00:00+01 |         1 |       |         6.0
 2019-01-13 01:00:00+01 |         1 |   7.0 |         7.0
 2019-01-14 01:00:00+01 |         1 |       |         7.5
 2019-01-15 01:00:00+01 |         1 |   8.0 |         8.0
 2019-01-16 01:00:00+01 |         1 |   9.0 |         9.0
(7 row)
```
