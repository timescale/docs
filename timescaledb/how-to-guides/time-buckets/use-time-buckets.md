# Use time buckets to group time-series data

## Calculate time buckets
For example, to see the one-week time bucket into which January 5, 2021 would
fall, run:
```sql
SELECT time_bucket(INTERVAL '1 week', '2021-01-05');
```

The function returns `2020-01-04 00:00:00+00`. That is the start time of the
time bucket: the Monday of that week, at midnight UTC time.