## timescaledb_experimental.time_bucket_ng()

The `time_bucket_ng()` (new generation) experimental function is
similar to [`time_bucket()`][time_bucket], but works with years and
months. It is expected that the feature will also support timezones
in a future release.

<highlight="warning">
Experimental features could have bugs! They might not be backwards compatible,
and could be removed in future releases. Use these features at your own risk, and
do not use any experimental features in production.
</highlight>

In this example, `time_bucket_ng()` is used to create bucket data in three month 
intervals: 

```
SELECT timescaledb_experimental.time_bucket_ng('3 month', date '2021-08-01');
 time_bucket_ng
----------------
 2021-07-01
(1 row)
```

This example uses `time_bucket_ng()` to bucket data in one year intervals:

```
SELECT timescaledb_experimental.time_bucket_ng('1 year', date '2021-08-01');
 time_bucket_ng
----------------
 2021-01-01
(1 row)
```

You can also use `time_bucket_ng()` with continuous aggregates.
This example tracks the temperature in Moscow over seven day intervals: 

```
CREATE TABLE conditions(
  day DATE NOT NULL,
  city text NOT NULL,
  temperature INT NOT NULL);

SELECT create_hypertable(
  'conditions', 'day',
  chunk_time_interval => INTERVAL '1 day'
);

INSERT INTO conditions (day, city, temperature) VALUES
  ('2021-06-14', 'Moscow', 26),
  ('2021-06-15', 'Moscow', 22),
  ('2021-06-16', 'Moscow', 24),
  ('2021-06-17', 'Moscow', 24),
  ('2021-06-18', 'Moscow', 27),
  ('2021-06-19', 'Moscow', 28),
  ('2021-06-20', 'Moscow', 30),
  ('2021-06-21', 'Moscow', 31),
  ('2021-06-22', 'Moscow', 34),
  ('2021-06-23', 'Moscow', 34),
  ('2021-06-24', 'Moscow', 34),
  ('2021-06-25', 'Moscow', 32),
  ('2021-06-26', 'Moscow', 32),
  ('2021-06-27', 'Moscow', 31);

CREATE MATERIALIZED VIEW conditions_summary_weekly
WITH (timescaledb.continuous) AS
SELECT city,
       timescaledb_experimental.time_bucket_ng('7 days', day) AS bucket,
       MIN(temperature),
       MAX(temperature)
FROM conditions
GROUP BY city, bucket;

SELECT to_char(bucket, 'YYYY-MM-DD'), city, min, max
FROM conditions_summary_weekly
ORDER BY bucket;

  to_char   |  city  | min | max
------------+--------+-----+-----
 2021-06-12 | Moscow |  22 |  27
 2021-06-19 | Moscow |  28 |  34
 2021-06-26 | Moscow |  31 |  32
(3 rows)
```

For more information, see the [continuous aggregates documentation][caggs].


[time_bucket]: hyperfunctions/time_bucket/
[2]: https://docs.timescale.com/timescaledb/latest/overview/core-concepts/continuous-aggregates/
