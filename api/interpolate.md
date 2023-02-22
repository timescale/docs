---
api_name: interpolate()
excerpt: Linearly interpolate missing values when gapfilling
topics: [hyperfunctions]
keywords: [gapfilling, interpolate, hyperfunctions, Toolkit]
tags: [missing values]
api:
  license: community
  type: function
  version:
    stable: 1.1.1
hyperfunction:
  family: gapfilling and interpolation
  type: interpolator
---

# interpolate() <Tag type="community">Community</Tag>

The `interpolate` function does linear interpolation for missing values. It can
only be used in an aggregation query with
[time_bucket_gapfill][time_bucket_gapfill].
The `interpolate` function call cannot be nested inside other function calls.

For more information about gapfilling and interpolation functions, see the
[hyperfunctions documentation][hyperfunctions-gapfilling].

## Required arguments

|Name|Type|Description|
|-|-|-|
|`value`|ANY VALUES|The value to interpolate (int2/int4/int8/float4/float8)|

## Optional arguments

|Name|Type|Description|
|-|-|-|
|`prev`|EXPRESSION|The lookup expression for values before the gapfill time range (record)|
|`next`|EXPRESSION|The lookup expression for values after the gapfill time range (record)|

Because the `interpolation` function relies on having values before and after
each time bucket to compute the interpolated value, it might not have enough
data to calculate the interpolation for the first and last time bucket if those
buckets do not contain valid values. For example, the interpolation requires
looking before the first time bucket period, but the query's outer time
predicate `WHERE time > ...` restricts the function to only evaluate values
within this time range. You can use the `prev` and `next` expressions to tell
the function how to look for values outside of the range specified by the time
predicate. These expressions are only evaluated when no suitable value is
returned by the outer query, such as when the first or last bucket in the
queried time range is empty. The returned record for `prev` and `next` needs to
be a time,value tuple. The data type of `time` needs to be the same as the time
data type in the `time_bucket_gapfill` call. The data type of `value` needs to
be the same as the `value` data type of the `interpolate` call.

## Sample usage

Get the temperature every day for each device over the last week, interpolating
for missing readings:

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

Get the average temperature every day for each device over the last seven days,
interpolating for missing readings, with lookup queries for values before and
after the gapfill time range:

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

[hyperfunctions-gapfilling]: /timescaledb/:currentVersion:/how-to-guides/hyperfunctions/gapfilling-interpolation/
[time_bucket_gapfill]: /api/:currentVersion:/hyperfunctions/gapfilling-interpolation/time_bucket_gapfill/
