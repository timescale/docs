# Use time buckets to aggregate time-series data
The `time_bucket` function helps you group your data, so you can perform
aggregate calculations over arbitrary time intervals. It is usually used
in combination with `GROUP BY` for this purpose.

This section shows examples of `time_bucket` use. To learn how time buckets
work, see the section that explains [time buckets][time-buckets].

## Calculate the average daily value
Group data into daily buckets and calculate the average daily value of a column.
For example, calculate the average daily temperature in a table named
`weather_conditions`. The table has a time column named `time` and a
`temperature` column.
```sql
SELECT time_bucket('1 day', time) AS bucket,
    avg(temperature) AS avg_temp
FROM weather_conditions
GROUP BY bucket;

`time_bucket` returns the start time of the bucket. In this example, the first
bucket starts at midnight on November 15, 2016, and aggregates all the data from
that day:
```sql
         bucket         |      avg_temp       
------------------------+---------------------
 2016-11-15 00:00:00+00 | 68.3704391666665821
 2016-11-16 00:00:00+00 | 67.0816684374999347
 ```

## Calculate the max and min value within 5-minute intervals
Group data into 5-minute buckets and calculate the maximum and minimum values of
a column within each interval. Report the end time of the bucket rather than the
start time. For example, calculate the minimum and maximum CPU usage in a table
named `metrics`. The table has a time column named `time` and a CPU usage column
named `cpu`.
```sql
SELECT time_bucket('5 min', time) + '5 min' AS bucket
    min(cpu),
    max(cpu)
FROM metrics
GROUP BY bucket;
```

## Calculate the time bucket of a single value
Time buckets are usually used together with `GROUP BY` to aggregate data. But
you can also run `time_bucket` on a single time value. This is useful for
testing and learning, because you can use it to see what bucket a value would
fall into.

For example, to see the one-week time bucket into which January 5, 2021 would
fall, run:
```sql
SELECT time_bucket(INTERVAL '1 week', TIMESTAMP '2021-01-05');
```

The function returns `2020-01-04 00:00:00`. That is the start time of the
time bucket: the Monday of that week, at midnight.

[time-buckets]: /how-to-guides/time-buckets/