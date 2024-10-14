---
section: hyperfunction
subsection: time_bucket_gapfill()
---

### Use `time_bucket_gapfill` without a gapfilling algorithm

Get the daily average metric value. Use `time_bucket_gapfill` without specifying
a gapfilling algorithm. This leaves the missing values as `NULL`:

```sql
SELECT time_bucket_gapfill('1 day', time) AS day,
    avg(value) as value
    FROM metrics
    WHERE time > '2021-12-31 00:00:00+00'::timestamptz
        AND time < '2022-01-10 00:00:00-00'::timestamptz
    GROUP BY day
    ORDER BY day desc;
```

```text
day                    |              value
-----------------------+--------------------
2022-01-09 00:00:00+00 |                   
2022-01-08 00:00:00+00 |  48.61293155993108
2022-01-07 00:00:00+00 | 54.388267525986485
2022-01-06 00:00:00+00 |                   
2022-01-05 00:00:00+00 | 58.257520634785266
2022-01-04 00:00:00+00 |  46.09172424261765
2022-01-03 00:00:00+00 |  42.53498707820027
2022-01-02 00:00:00+00 |                   
2022-01-01 00:00:00+00 |  47.84420001415975
2021-12-31 00:00:00+00 |                   
(10 rows)
```

### Use `time_bucket_gapfill` and carry last value forward

Get the daily average metric value. Use `locf` to carry the last value forward
if a value is missing. Note that `avg` is nested _inside_ `locf`, and not the
other way around.

```sql
SELECT time_bucket_gapfill('1 day', time) AS day,
    locf(avg(value)) as value
    FROM metrics
    WHERE time > '2021-12-31 00:00:00+00'::timestamptz
        AND time < '2022-01-10 00:00:00-00'::timestamptz
    GROUP BY day
    ORDER BY day desc;
```

```text
day                    |              value
-----------------------+--------------------
2022-01-09 00:00:00+00 |  48.61293155993108
2022-01-08 00:00:00+00 |  48.61293155993108
2022-01-07 00:00:00+00 | 54.388267525986485
2022-01-06 00:00:00+00 | 58.257520634785266
2022-01-05 00:00:00+00 | 58.257520634785266
2022-01-04 00:00:00+00 |  46.09172424261765
2022-01-03 00:00:00+00 |  42.53498707820027
2022-01-02 00:00:00+00 |  47.84420001415975
2022-01-01 00:00:00+00 |  47.84420001415975
2021-12-31 00:00:00+00 |                   
(10 rows)

```

### Use `time_bucket_gapfill` and carry last value forward with `prev` expression

Get the daily average metric value. Use the optional `prev` argument to `locf`
to fill gaps at the beginning of the queried time range. Note that the
`prev` expression returns just a value to fill the gap with. This is sufficient since the value is just carried forward and not further processed.

```sql
SELECT time_bucket_gapfill('1 day', time) AS day,
    locf(
        avg(value),
        (
            SELECT value
            FROM metrics
            WHERE time > '2021-12-31 00:00:00+00'::timestamptz
            ORDER BY time ASC
            LIMIT 1
        )
    ) as value
    FROM metrics
    WHERE time > '2021-12-31 00:00:00+00'::timestamptz
        AND time < '2022-01-10 00:00:00-00'::timestamptz
    GROUP BY day
    ORDER BY day desc;
```

```text
day                    |              value
-----------------------+--------------------
2022-01-09 00:00:00+00 |  48.61293155993108
2022-01-08 00:00:00+00 |  48.61293155993108
2022-01-07 00:00:00+00 | 54.388267525986485
2022-01-06 00:00:00+00 | 58.257520634785266
2022-01-05 00:00:00+00 | 58.257520634785266
2022-01-04 00:00:00+00 |  46.09172424261765
2022-01-03 00:00:00+00 |  42.53498707820027
2022-01-02 00:00:00+00 |  47.84420001415975
2022-01-01 00:00:00+00 |  47.84420001415975
2021-12-31 00:00:00+00 |  47.84420001415975
(10 rows)

```

### Use `time_bucket_gapfill` and use linear interpolation

Get the daily average metric value. Use `interpolate` to linearly interpolate
the value if it is missing. Note that `avg` is nested _inside_ `interpolate`.

```sql
SELECT time_bucket_gapfill('1 day', time) AS day,
    interpolate(avg(value)) as value
    FROM metrics
    WHERE time > '2021-12-31 00:00:00+00'::timestamptz
        AND time < '2022-01-10 00:00:00-00'::timestamptz
    GROUP BY day
    ORDER BY day desc;
```

```text
day                    |              value
-----------------------+--------------------
2022-01-09 00:00:00+00 |                   
2022-01-08 00:00:00+00 |  48.61293155993108
2022-01-07 00:00:00+00 | 54.388267525986485
2022-01-06 00:00:00+00 |  56.32289408038588
2022-01-05 00:00:00+00 | 58.257520634785266
2022-01-04 00:00:00+00 |  46.09172424261765
2022-01-03 00:00:00+00 |  42.53498707820027
2022-01-02 00:00:00+00 | 45.189593546180014
2022-01-01 00:00:00+00 |  47.84420001415975
2021-12-31 00:00:00+00 |                   
(10 rows)
 ```

### Use `time_bucket_gapfill` and use linear interpolation with `prev` and `next` expression

Get the daily average metric value. Use the optional `prev` and `next`
arguments of `interpolate` to extrapolate, i.e. to fill the gaps at the
beginning and end of the queried time range. Note that the `prev` and
`next` expressions each return a tuple with time and value.

```sql
SELECT time_bucket_gapfill('1 day', time) AS day,
    interpolate(
        avg(value),
        (
            SELECT (time, value)
            FROM metrics
            WHERE time > '2021-12-31 00:00:00+00'::timestamptz
            ORDER BY time ASC
            LIMIT 1
        ),
        (
            SELECT (time, value)
            FROM metrics
            WHERE time < '2021-12-10 00:00:00-00'::timestamptz
            ORDER BY time DESC
            LIMIT 1
        )
    ) as value
    FROM metrics
    WHERE time > '2021-12-31 00:00:00+00'::timestamptz
        AND time < '2022-01-10 00:00:00-00'::timestamptz
    GROUP BY day
    ORDER BY day desc;
```

```text
day                    |              value
-----------------------+--------------------
2022-01-09 00:00:00+00 |  48.61293155993108
2022-01-08 00:00:00+00 |  48.61293155993108
2022-01-07 00:00:00+00 | 54.388267525986485
2022-01-06 00:00:00+00 |  56.32289408038588
2022-01-05 00:00:00+00 | 58.257520634785266
2022-01-04 00:00:00+00 |  46.09172424261765
2022-01-03 00:00:00+00 |  42.53498707820027
2022-01-02 00:00:00+00 | 45.189593546180014
2022-01-01 00:00:00+00 |  47.84420001415975
2021-12-31 00:00:00+00 |  47.84420001415975
(10 rows)
 ```

### Use `time_bucket_gapfill` with a timezone argument

Get the daily average metric value, using `Europe/Berlin` as the timezone. Note
that daily time buckets now start at `23:00 UTC`, which is equivalent to
midnight in Berlin for the selected dates:

```sql
SELECT time_bucket_gapfill('1 day', time, 'Europe/Berlin') AS day,
    interpolate(avg(value)) as value
    FROM metrics
    WHERE time > '2021-12-31 00:00:00+00'::timestamptz
        AND time < '2022-01-10 00:00:00-00'::timestamptz
    GROUP BY day
    ORDER BY day desc;
```

```text
day                    |              value
-----------------------+--------------------
2022-01-09 23:00:00+00 |                   
2022-01-08 23:00:00+00 |  48.65079127913703
2022-01-07 23:00:00+00 |  47.31847777099154
2022-01-06 23:00:00+00 |  55.98845740343859
2022-01-05 23:00:00+00 |  55.61667401777108
2022-01-04 23:00:00+00 |  58.74115574522012
2022-01-03 23:00:00+00 |  45.77993635988273
2022-01-02 23:00:00+00 |  41.78689923453202
2022-01-01 23:00:00+00 | 24.324313477743974
2021-12-31 23:00:00+00 |  48.86680377661261
2021-12-30 23:00:00+00 |                   
(11 rows)
```
