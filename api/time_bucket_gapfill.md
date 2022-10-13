---
api_name: time_bucket_gapfill()
excerpt: Bucket rows by time interval while filling gaps in data
topics: [hyperfunctions]
keywords: [gapfill, interpolate, aggregate, hyperfunctions, toolkit]
tags: [time buckets]
api:
  license: community
  type: function
  version:
    experimental: 1.2.0
hyperfunction:
  family: gapfilling and interpolation
  type: bucket
# fields below will be deprecated
api_category: hyperfunction
hyperfunction_family: 'gapfilling and interpolation'
hyperfunction_subfamily: gapfill
hyperfunction_type: other
---

# time_bucket_gapfill() <tag type="community">Community</tag>

The `time_bucket_gapfill` function works similar to `time_bucket` but also
activates gap filling for the interval between `start` and `finish`. It can only
be used with an aggregation query. Values outside of `start` and `finish` pass
through but no gap filling is done outside of the specified range.

<highlight type="important">
The `time_bucket_gapfill` function must be a top-level expression in a query or
subquery, as shown in these examples. You cannot, for example, do something like
`round(time_bucket_gapfill(...))` or cast the result of the gapfill call. The
only exception is if you use it as a subquery, where the outer query does the
type cast.
</highlight>

For more information about gapfilling and interpolation functions, see the
[hyperfunctions documentation][hyperfunctions-gapfilling].

## Required arguments

|Name|Type|Description|
|-|-|-|
|`bucket_width`|INTERVAL|A PostgreSQL time interval for how long each bucket is|
|`time`|TIMESTAMP|The timestamp to bucket|

## Optional arguments

|Name|Type|Description|
|-|-|-|
|`start`|TIMESTAMP|The start of the gapfill period|
|`finish`|TIMESTAMP|The end of the gapfill period|

In TimescaleDB 1.3 and later, `start` and `finish` are optional arguments. If
they are not supplied, the parameters are inferred from the `WHERE` clause. We
recommend using a `WHERE` clause if possible, instead of `start` and `finish`
arguments. This is because `start` and `finish` arguments do not filter input
rows. If you do not provide a `WHERE` clause, TimescaleDB's planner selects all
data, and does not perform constraint exclusion to exclude chunks from further
processing, which is less performant.

Values explicitly provided in `start` and `stop` arguments, or values derived
from `WHERE` clause values, must be simple expressions. They should be evaluated
to constants at query planning. For example, simple expressions can contain
constants or call to `now()`, but cannot reference columns of a table.

## For integer time inputs

### Required arguments

|Name|Type|Description|
|-|-|-|
|`bucket_width`|INTEGER|integer interval for how long each bucket is|
|`time`|INTEGER|The timestamp to bucket|

## Optional arguments

|Name|Type|Description|
|-|-|-|
|`start`|INTEGER|The start of the gapfill period|
|`finish`|INTEGER|The end of the gapfill period|

In TimescaleDB 1.3 and later, `start` and `finish` are optional arguments. If
they are not supplied, the parameters are inferred from the `WHERE` clause. We
recommend using a `WHERE` clause if possible, instead of `start` and `finish`
arguments. This is because `start` and `finish` arguments do not filter input
rows. If you do not provide a `WHERE` clause, TimescaleDB's planner selects all
data, and does not perform constraint exclusion to exclude chunks from further
processing, which is less performant.

### Sample usage

Get the metric value every day over the last seven days:

```sql
SELECT
  time_bucket_gapfill('1 day', time) AS day,
  device_id,
  avg(value) AS value
FROM metrics
WHERE time > now() - INTERVAL '1 week' AND time < now()
GROUP BY day, device_id
ORDER BY day;

           day          | device_id | value
------------------------+-----------+-------
 2019-01-10 01:00:00+01 |         1 |
 2019-01-11 01:00:00+01 |         1 |   5.0
 2019-01-12 01:00:00+01 |         1 |
 2019-01-13 01:00:00+01 |         1 |   7.0
 2019-01-14 01:00:00+01 |         1 |
 2019-01-15 01:00:00+01 |         1 |   8.0
 2019-01-16 01:00:00+01 |         1 |   9.0
(7 row)
```

Get the metric value every day over the last seven days, carrying forward the
previous seen value if none is available in an interval:

```sql
SELECT
  time_bucket_gapfill('1 day', time) AS day,
  device_id,
  avg(value) AS value,
  locf(avg(value))
FROM metrics
WHERE time > now() - INTERVAL '1 week' AND time < now()
GROUP BY day, device_id
ORDER BY day;

           day          | device_id | value | locf
------------------------+-----------+-------+------
 2019-01-10 01:00:00+01 |         1 |       |
 2019-01-11 01:00:00+01 |         1 |   5.0 |  5.0
 2019-01-12 01:00:00+01 |         1 |       |  5.0
 2019-01-13 01:00:00+01 |         1 |   7.0 |  7.0
 2019-01-14 01:00:00+01 |         1 |       |  7.0
 2019-01-15 01:00:00+01 |         1 |   8.0 |  8.0
 2019-01-16 01:00:00+01 |         1 |   9.0 |  9.0
```

Get the metric value every day over the last seven days, interpolating missing
values:

```sql
SELECT
  time_bucket_gapfill('1 day', time) AS day,
  device_id,
  avg(value) AS value,
  interpolate(avg(value))
FROM metrics
WHERE time > now() - INTERVAL '1 week' AND time < now()
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
```

[hyperfunctions-gapfilling]: /timescaledb/:currentVersion:/how-to-guides/hyperfunctions/gapfilling-interpolation/
