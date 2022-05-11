# time_bucket()
The `time_bucket` function is similar to the standard PostgreSQL `date_trunc`
function. Unlike `date_trunc`, it allows for arbitrary time intervals instead of
second, minute, and hour intervals. The return value is the bucket's
start time.

`TIMESTAMPTZ` arguments are bucketed by the time in UTC, so the alignment of
buckets is on UTC time. One consequence of this is that daily buckets are
aligned to midnight UTC, not local time. If you want buckets aligned by local
time, cast the `TIMESTAMPTZ` input to `TIMESTAMP`, which converts the value to
local time, before you pass it to `time_bucket`. For an example, see the sample
use in this section.

Note that daylight savings time boundaries means that the amount of data
aggregated into a bucket after such a cast can be irregular. For example, if the
`bucket_width` is 2 hours, the number of UTC hours bucketed by local time on
daylight savings time boundaries can be either three hours or one hour.

<highlight type="important">
Month, year, and timezones are not supported by the `time_bucket`
function. If you need to use month, year, or timezone arguments, try the
experimental [`time_bucket_ng`](/api/latest/hyperfunctions/time_bucket_ng/)
function instead.
</highlight>

## Required arguments for interval time inputs

|Name|Type|Description|
|-|-|-|
|`bucket_width`|INTERVAL|A PostgreSQL time interval for how long each bucket is|
|`ts`|TIMESTAMP|The timestamp to bucket|

## Optional arguments for interval time inputs

|Name|Type|Description|
|-|-|-|
|`offset`|INTERVAL|The time interval to offset all time buckets by. A positive value shifts bucket start and end times later. A negative value shifts bucket start and end times earlier. `offset` must be surrounded with double quotes when used as a named argument, because it is a reserved key word in PostgreSQL.|
|`origin`|TIMESTAMP|Buckets are aligned relative to this timestamp|

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

<highlight type="important">
If you are upgrading from a version earlier than 1.0.0, the default origin is
moved from 2000-01-01 (Saturday) to 2000-01-03 (Monday) between versions 0.12.1
and 1.0.0. This change was made to make `time_bucket` compliant with the ISO
standard for Monday as the start of a week. This should only affect multi-day
calls to `time_bucket`. The old behavior can be reproduced by passing
`2000-01-01` as the origin parameter to `time_bucket`.
</highlight>
