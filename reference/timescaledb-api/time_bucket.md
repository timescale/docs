---
api_name: time_bucket()
excerpt: Bucket rows by time interval to calculate aggregates
topics: [hyperfunctions]
keywords: [aggregate, hyperfunctions]
tags: [time buckets, date_trunc, date_bin]
api:
  license: apache
  type: function
  version:
    stable: 0.0.10-beta
hyperfunction:
  type: bucket
---

# time_bucket()

The `time_bucket` function is similar to the standard PostgreSQL `date_bin`
function. Unlike `date_bin`, it allows for arbitrary time intervals of months or
longer. The return value is the bucket's start time.

Note that daylight savings time boundaries means that the amount of data
aggregated into a bucket after such a cast can be irregular. For example, if the
`bucket_width` is 2 hours, the number of UTC hours bucketed by local time on
daylight savings time boundaries can be either three hours or one hour.

## Required arguments for interval time inputs

|Name|Type|Description|
|-|-|-|
|`bucket_width`|INTERVAL|A PostgreSQL time interval for how long each bucket is|
|`ts`|DATE, TIMESTAMP, or TIMESTAMPTZ|The timestamp to bucket|

If you use months as an interval for `bucket_width`, you cannot combine it with
a non-month component. For example, `1 month` and `3 months` are both valid
bucket widths, but `1 month 1 day` and `3 months 2 weeks` are not.

## Optional arguments for interval time inputs

|Name|Type|Description|
|-|-|-|
|`timezone`|TEXT|The timezone for calculating bucket start and end times. Can only be used with `TIMESTAMPTZ`. Defaults to UTC.|
|`origin`|DATE, TIMESTAMP, or TIMESTAMPTZ|Buckets are aligned relative to this timestamp. Defaults to midnight on January 3, 2000, for buckets that don't include a month or year interval, and to midnight on January 1, 2000, for month, year, and century buckets.|
|`offset`|INTERVAL|The time interval to offset all time buckets by. A positive value shifts bucket start and end times later. A negative value shifts bucket start and end times earlier. `offset` must be surrounded with double quotes when used as a named argument, because it is a reserved key word in PostgreSQL.|

## Required arguments for integer time inputs

|Name|Type|Description|
|-|-|-|
|`bucket_width`|INTEGER|The bucket width|
|`ts`|INTEGER|The timestamp to bucket|

## Optional arguments for integer time inputs

|Name|Type|Description|
|-|-|-|
|`offset`|INTEGER|The amount to offset all buckets by. A positive value shifts bucket start and end times later. A negative value shifts bucket start and end times earlier. `offset` must be surrounded with double quotes when used as a named argument, because it is a reserved key word in PostgreSQL.|

## Sample usage

Simple five minute averaging:

```sql
SELECT time_bucket('5 minutes', time) AS five_min, avg(cpu)
FROM metrics
GROUP BY five_min
ORDER BY five_min DESC LIMIT 10;
```

To report the middle of the bucket, instead of the left edge:

```sql
SELECT time_bucket('5 minutes', time) + '2.5 minutes'
  AS five_min, avg(cpu)
FROM metrics
GROUP BY five_min
ORDER BY five_min DESC LIMIT 10;
```

For rounding, move the alignment so that the middle of the bucket is at the
five minute mark, and report the middle of the bucket:

```sql
SELECT time_bucket('5 minutes', time, '-2.5 minutes'::INTERVAL) + '2.5 minutes'
  AS five_min, avg(cpu)
FROM metrics
GROUP BY five_min
ORDER BY five_min DESC LIMIT 10;
```

In this example, add the explicit cast to ensure that PostgreSQL chooses the
correct function.

To shift the alignment of the buckets you can use the origin parameter passed as
a timestamp, timestamptz, or date type. This example shifts the start of the
week to a Sunday, instead of the default of Monday:

```sql
SELECT time_bucket('1 week', timetz, TIMESTAMPTZ '2017-12-31')
  AS one_week, avg(cpu)
FROM metrics
GROUP BY one_week
WHERE time > TIMESTAMPTZ '2017-12-01'  AND time < TIMESTAMPTZ '2018-01-03'
ORDER BY one_week DESC LIMIT 10;
```

The value of the origin parameter in this example is `2017-12-31`, a Sunday
within the period being analyzed. However, the origin provided to the function
can be before, during, or after the data being analyzed. All buckets are
calculated relative to this origin. So, in this example, any Sunday could have
been used. Note that because `time < TIMESTAMPTZ '2018-01-03'` is used in this
example, the last bucket would have only 4 days of data. This cast to TIMESTAMP
converts the time to local time according to the server's timezone setting.

```sql
SELECT time_bucket(INTERVAL '2 hours', timetz::TIMESTAMP)
  AS five_min, avg(cpu)
FROM metrics
GROUP BY five_min
ORDER BY five_min DESC LIMIT 10;
```

Bucket temperature values to calculate the average monthly temperature. Set the
timezone to 'Europe/Berlin' so bucket start and end times are aligned to
midnight in Berlin.

```sql
SELECT time_bucket('1 month', ts, 'Europe/Berlin') AS month_bucket,
  avg(temperature) AS avg_temp
FROM weather
GROUP BY month_bucket
ORDER BY month_bucket DESC LIMIT 10;
```
