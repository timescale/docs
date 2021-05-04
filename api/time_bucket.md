## time_bucket() 

This is a more powerful version of the standard PostgreSQL `date_trunc` function.
It allows for arbitrary time intervals instead of the second, minute, hour, etc.
provided by `date_trunc`. The return value is the bucket's start time.
Below is necessary information for using it effectively.

<highlight type="tip">
TIMESTAMPTZ arguments are bucketed by the time at UTC. So the alignment of 
buckets is on UTC time. One consequence of this is that daily buckets are
aligned to midnight UTC, not local time.

If the user wants buckets aligned by local time, the TIMESTAMPTZ input should be
cast to TIMESTAMP (such a cast converts the value to local time) before being
passed to time_bucket (see example below).  Note that along daylight savings
time boundaries the amount of data aggregated into a bucket after such a cast is
irregular: for example if the bucket_width is 2 hours, the number of UTC hours
bucketed by local time on daylight savings time boundaries can be either 3 hours
or 1 hour.
</highlight>

#### Required Arguments 

|Name|Type|Description|
|---|---|---|
| `bucket_width` | INTERVAL | A PostgreSQL time interval for how long each bucket is |
| `time` | TIMESTAMP | The timestamp to bucket |

### Optional Arguments

|Name|Type|Description|
|---|---|---|
| `offset` | INTERVAL | The time interval to offset all buckets by  |
| `origin` | TIMESTAMP | Buckets are aligned relative to this timestamp  |

### For Integer Time Inputs

#### Required Arguments 

|Name|Type|Description|
|---|---|---|
| `bucket_width` | INTEGER | The bucket width |
| `time` | INTEGER | The timestamp to bucket |

### Optional Arguments

|Name|Type|Description|
|---|---|---|
| `offset` | INTEGER | The amount to offset all buckets by |


### Sample Usage 

Simple 5-minute averaging:

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
5 minute mark (and report the middle of the bucket):
```sql
SELECT time_bucket('5 minutes', time, '-2.5 minutes') + '2.5 minutes'
  AS five_min, avg(cpu)
FROM metrics
GROUP BY five_min
ORDER BY five_min DESC LIMIT 10;
```

To shift the alignment of the buckets you can use the origin parameter
(passed as a timestamp, timestamptz, or date type).
In this example, we shift the start of the week to a Sunday (the default is a Monday).
```sql
SELECT time_bucket('1 week', timetz, TIMESTAMPTZ '2017-12-31')
  AS one_week, avg(cpu)
FROM metrics
GROUP BY one_week
WHERE time > TIMESTAMPTZ '2017-12-01'  AND time < TIMESTAMPTZ '2018-01-03'
ORDER BY one_week DESC LIMIT 10;
```

The value of the origin parameter we used in this example was `2017-12-31`, a Sunday within the
period being analyzed. However, the origin provided to the function can be before, during, or
after the data being analyzed. All buckets are calculated relative to this origin. So, in this example,
any Sunday could have been used. Note that because `time < TIMESTAMPTZ '2018-01-03'` in this example,
the last bucket would have only 4 days of data.

Bucketing a TIMESTAMPTZ at local time instead of UTC(see note above):
```sql
SELECT time_bucket(INTERVAL '2 hours', timetz::TIMESTAMP)
  AS five_min, avg(cpu)
FROM metrics
GROUP BY five_min
ORDER BY five_min DESC LIMIT 10;
```

Note that the above cast to TIMESTAMP converts the time to local time according
to the server's timezone setting.

<highlight type="warning">
 For users upgrading from a version before 1.0.0, please note
 that the default origin was moved from 2000-01-01 (Saturday) to 2000-01-03 (Monday)
 between versions 0.12.1 and 1.0.0. This change was made  to make time_bucket compliant
 with the ISO standard for Monday as the start of a week. This should only affect
 multi-day calls to time_bucket. The old behavior can be reproduced by passing
 2000-01-01 as the origin parameter to time_bucket.
</highlight>