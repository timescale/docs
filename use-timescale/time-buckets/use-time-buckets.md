---
title: Aggregate time-series data with time bucket
excerpt: Group your data to perform aggregate calculations over arbitrary time intervals
products: [cloud, mst, self_hosted]
keywords: [time buckets]
---

# Aggregate time-series data with time_bucket

The `time_bucket` function helps you group in a [hypertable][create-hypertable] so you can 
perform aggregate calculations over arbitrary time intervals. It is usually used
in combination with `GROUP BY` for this purpose.

This section shows examples of `time_bucket` use. To learn how time buckets
work, see the [about time buckets section][time-buckets].

## Group data by time buckets and calculate a summary value

Group data into time buckets and calculate a summary value for a column. For
example, calculate the average daily temperature in a table named
`weather_conditions`. The table has a time column named `time` and a
`temperature` column:

```sql
SELECT time_bucket('1 day', time) AS bucket,
  avg(temperature) AS avg_temp
FROM weather_conditions
GROUP BY bucket
ORDER BY bucket ASC;
```

The `time_bucket` function returns the start time of the bucket. In this
example, the first bucket starts at midnight on November 15, 2016, and
aggregates all the data from that day:

```sql
bucket                 |      avg_temp
-----------------------+---------------------
2016-11-15 00:00:00+00 | 68.3704391666665821
2016-11-16 00:00:00+00 | 67.0816684374999347
```

## Group data by time buckets and show the end time of the bucket

By default, the `time_bucket` column shows the start time of the bucket. If you
prefer to show the end time, you can shift the displayed time using a
mathematical operation on `time`.

For example, you can calculate the minimum and maximum CPU usage for 5-minute
intervals, and show the end of time of the interval. The example table is named
`metrics`. It has a time column named `time` and a CPU usage column named `cpu`:

```sql
SELECT time_bucket('5 min', time) + '5 min' AS bucket,
  min(cpu),
  max(cpu)
FROM metrics
GROUP BY bucket
ORDER BY bucket DESC;
```

The addition of `+ '5 min'` changes the displayed timestamp to the end of the
bucket. It doesn't change the range of times spanned by the bucket.

## Group data by time buckets and change the time range of the bucket

To change the time range spanned by the buckets, use the `offset` parameter,
which takes an `INTERVAL` argument. A positive offset shifts the start and end
time of the buckets later. A negative offset shifts the start and end time of
the buckets earlier.

For example, you can calculate the average CPU usage for 5-hour intervals, and
shift the start and end times of all buckets 1 hour later:

```sql
SELECT time_bucket('5 hours', time, '1 hour'::INTERVAL) AS bucket,
  avg(cpu)
FROM metrics
GROUP BY bucket
ORDER BY bucket DESC;
```

## Calculate the time bucket of a single value

Time buckets are usually used together with `GROUP BY` to aggregate data. But
you can also run `time_bucket` on a single time value. This is useful for
testing and learning, because you can see what bucket a value falls into.

For example, to see the 1-week time bucket into which January 5, 2021 would
fall, run:

```sql
SELECT time_bucket(INTERVAL '1 week', TIMESTAMP '2021-01-05');
```

The function returns `2021-01-04 00:00:00`. The start time of the time bucket is
the Monday of that week, at midnight.

[time-buckets]: /use-timescale/:currentVersion:/time-buckets/
[create-hypertable]: /use-timescale/:currentVersion:/hypertables/create/
