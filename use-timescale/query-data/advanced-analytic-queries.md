---
title: Perform advanced analytic queries
excerpt: Perform advanced data analysis using native PostgreSQL queries and Timescale hyperfunctions
products: [cloud, mst, self_hosted]
keywords: [queries, hyperfunctions, analytics]
---

# Perform advanced analytic queries

You can use Timescale for a variety of analytical queries. Some of these
queries are native PostgreSQL, and some are additional functions provided by
Timescale. This section contains the most common and useful analytic queries.

## Calculate the median and percentile

Use [`percentile_cont`][percentile_cont] to calculate percentiles. You can also
use this function to look for the fiftieth percentile, or median. For example, to
find the median temperature:

```sql
SELECT percentile_cont(0.5)
  WITHIN GROUP (ORDER BY temperature)
  FROM conditions;
```

You can also use Timescale Toolkit to find the
[approximate percentile][toolkit-approx-percentile].

## Calculate the cumulative sum

Use `sum(sum(column)) OVER(ORDER BY group)` to find the cumulative sum. For
example:

```sql
SELECT location, sum(sum(temperature)) OVER(ORDER BY location)
  FROM conditions
  GROUP BY location;
```

## Calculate the moving average

For a simple moving average, use the `OVER` windowing function over a number of
rows, then compute an aggregation function over those rows. For example, to find
the smoothed temperature of a device by averaging the ten most recent readings:

```sql
SELECT time, AVG(temperature) OVER(ORDER BY time
      ROWS BETWEEN 9 PRECEDING AND CURRENT ROW)
    AS smooth_temp
  FROM conditions
  WHERE location = 'garage' and time > NOW() - INTERVAL '1 day'
  ORDER BY time DESC;
```

## Calculate the increase in a value

To calculate the increase in a value, you need to account for counter resets.
Counter resets can occur if a host reboots or container restarts. This example
finds the number of bytes sent, and takes counter resets into account:

```sql
SELECT
  time,
  (
    CASE
      WHEN bytes_sent >= lag(bytes_sent) OVER w
        THEN bytes_sent - lag(bytes_sent) OVER w
      WHEN lag(bytes_sent) OVER w IS NULL THEN NULL
      ELSE bytes_sent
    END
  ) AS "bytes"
  FROM net
  WHERE interface = 'eth0' AND time > NOW() - INTERVAL '1 day'
  WINDOW w AS (ORDER BY time)
  ORDER BY time
```

## Calculate the rate of change

Like [increase](#calculate-the-increase-in-a-value), rate applies to a situation
with monotonically increasing counters. If your sample interval is variable or
you use different sampling intervals between different series it is helpful to
normalize the values to a common time interval to make the calculated values
comparable. This example finds bytes per second sent, and takes counter resets
into account:

```sql
SELECT
  time,
  (
    CASE
      WHEN bytes_sent >= lag(bytes_sent) OVER w
        THEN bytes_sent - lag(bytes_sent) OVER w
      WHEN lag(bytes_sent) OVER w IS NULL THEN NULL
      ELSE bytes_sent
    END
  ) / extract(epoch from time - lag(time) OVER w) AS "bytes_per_second"
  FROM net
  WHERE interface = 'eth0' AND time > NOW() - INTERVAL '1 day'
  WINDOW w AS (ORDER BY time)
  ORDER BY time
```

## Calculate the delta

In many monitoring and IoT use cases, devices or sensors report metrics that do
not change frequently, and any changes are considered anomalies. When you query
for these changes in values over time, you usually do not want to transmit all
the values, but only the values where changes were observed. This helps to
minimize the amount of data sent. You can use a combination of window functions
and subselects to achieve this. This example uses diffs to filter rows where
values have not changed and only transmits rows where values have changed:

```sql
SELECT time, value FROM (
  SELECT time,
    value,
    value - LAG(value) OVER (ORDER BY time) AS diff
  FROM hypertable) ht
WHERE diff IS NULL OR diff != 0;
```

## Calculate the change in a metric within a group

To group your data by some field, and calculate the change in a metric within
each group, use `LAG ... OVER (PARTITION BY ...)`. For example, given some
weather data, calculate the change in temperature for each city:

```sql
SELECT ts, city_name, temp_delta
FROM (
  SELECT
    ts,
    city_name,
    avg_temp - LAG(avg_temp) OVER (PARTITION BY city_name ORDER BY ts) as temp_delta
  FROM weather_metrics_daily
) AS temp_change
WHERE temp_delta IS NOT NULL
ORDER BY bucket;
```

## Group data into time buckets

The Timescale [`time_bucket`][time_bucket] function extends the PostgreSQL
[`date_bin`][date_bin] function. Time bucket accepts arbitrary time intervals,
as well as optional offsets, and returns the bucket start time. For example:

```sql
SELECT time_bucket('5 minutes', time) AS five_min, avg(cpu)
  FROM metrics
  GROUP BY five_min
  ORDER BY five_min DESC LIMIT 12;
```

## Get the first or last value in a column

The Timescale [`first`][first] and [`last`][last] functions allow you to get
the value of one column as ordered by another. This is commonly used in an
aggregation. These examples find the last element of a group:

```sql
SELECT location, last(temperature, time)
  FROM conditions
  GROUP BY location;
```

```sql
SELECT time_bucket('5 minutes', time) five_min, location, last(temperature, time)
  FROM conditions
  GROUP BY five_min, location
  ORDER BY five_min DESC LIMIT 12;
```

## Generate a histogram

The Timescale [`histogram`][histogram] function allows you to generate a
histogram of your data. This example defines a histogram with five buckets
defined over the range 60 to 85. The generated histogram has seven bins; the
first is for values below the minimum threshold of 60, the middle five bins are
for values in the stated range and the last is for values above 85:

```sql
SELECT location, COUNT(*),
    histogram(temperature, 60.0, 85.0, 5)
   FROM conditions
   WHERE time > NOW() - INTERVAL '7 days'
   GROUP BY location;
```

This query outputs data like this:

```bash
 location   | count |        histogram
------------+-------+-------------------------
 office     | 10080 | {0,0,3860,6220,0,0,0}
 basement   | 10080 | {0,6056,4024,0,0,0,0}
 garage     | 10080 | {0,2679,957,2420,2150,1874,0}
```

## Fill gaps in time-series data

You can display records for a selected time range, even if no data exists for
part of the range. This is often called gap filling, and usually involves an
operation to record a null value for any missing data.

In this example, the trading data that includes a `time` timestamp, the
`asset_code` being traded, the `price` of the asset, and the `volume` of the
asset being traded is used.

Create a query for the volume of the asset 'TIMS' being traded every day
for the month of September:

```sql
SELECT
    time_bucket('1 day', time) AS date,
    sum(volume) AS volume
  FROM trades
  WHERE asset_code = 'TIMS'
    AND time >= '2021-09-01' AND time < '2021-10-01'
  GROUP BY date
  ORDER BY date DESC;
```

This query outputs data like this:

```bash
          date          | volume
------------------------+--------
 2021-09-29 00:00:00+00 |  11315
 2021-09-28 00:00:00+00 |   8216
 2021-09-27 00:00:00+00 |   5591
 2021-09-26 00:00:00+00 |   9182
 2021-09-25 00:00:00+00 |  14359
 2021-09-22 00:00:00+00 |   9855
```

You can see from the output that no records are included for 09-23, 09-24, or
09-30, because no trade data was recorded for those days. To include time
records for each missing day, you can use the TimescaleDB `time_bucket_gapfill`
function, which generates a series of time buckets according to a given interval
across a time range. In this example, the interval is one day, across the month
of September:

```sql
SELECT
  time_bucket_gapfill('1 day', time) AS date,
  sum(volume) AS volume
FROM trades
WHERE asset_code = 'TIMS'
  AND time >= '2021-09-01' AND time < '2021-10-01'
GROUP BY date
ORDER BY date DESC;
```

This query outputs data like this:

```bash
          date          | volume
------------------------+--------
 2021-09-30 00:00:00+00 |
 2021-09-29 00:00:00+00 |  11315
 2021-09-28 00:00:00+00 |   8216
 2021-09-27 00:00:00+00 |   5591
 2021-09-26 00:00:00+00 |   9182
 2021-09-25 00:00:00+00 |  14359
 2021-09-24 00:00:00+00 |
 2021-09-23 00:00:00+00 |
 2021-09-22 00:00:00+00 |   9855
```

You can also use the Timescale `time_bucket_gapfill` function to generate data
points that also include timestamps. This can be useful for graphic libraries
that require even null values to have a timestamp so that they can accurately
draw gaps in a graph. In this example, you generate 1080 data points across the
last two weeks, fill in the gaps with null values, and give each null value a
timestamp:

```sql
SELECT
  time_bucket_gapfill(INTERVAL '2 weeks' / 1080, time, now() - INTERVAL '2 weeks', now()) AS btime,
  sum(volume) AS volume
FROM trades
WHERE asset_code = 'TIMS'
  AND time >= now() - INTERVAL '2 weeks' AND time < now()
GROUP BY btime
ORDER BY btime;
```

This query outputs data like this:

```bash
         btime          | volume
------------------------+----------
 2021-03-09 17:28:00+00 |  1085.25
 2021-03-09 17:46:40+00 |  1020.42
 2021-03-09 18:05:20+00 |
 2021-03-09 18:24:00+00 |  1031.25
 2021-03-09 18:42:40+00 |  1049.09
 2021-03-09 19:01:20+00 |  1083.80
 2021-03-09 19:20:00+00 |  1092.66
 2021-03-09 19:38:40+00 |
 2021-03-09 19:57:20+00 |  1048.42
 2021-03-09 20:16:00+00 |  1063.17
 2021-03-09 20:34:40+00 |  1054.10
 2021-03-09 20:53:20+00 |  1037.78
```

### Fill gaps by carrying the last observation forward

If your data collections only record rows when the actual value changes,
your visualizations might still need all data points to properly display
your results. In this situation, you can carry forward the last observed
value to fill the gap. For example:

```sql
SELECT
  time_bucket_gapfill(INTERVAL '5 min', time, now() - INTERVAL '2 weeks', now()) as 5min,
  meter_id,
  locf(avg(data_value)) AS data_value
FROM my_hypertable
WHERE
  time > now() - INTERVAL '2 weeks'
  AND meter_id IN (1,2,3,4)
GROUP BY 5min, meter_id
```

## Find the last point for each unique item

You can find the last point for each unique item in your database. For example,
the last recorded measurement from each IoT device, the last location of each
item in asset tracking, or the last price of a security. The standard approach
to minimize the amount of data to be searched for the last point is to use a
time predicate to tightly bound the amount of time, or the number of chunks, to
traverse. This method does not work unless all items have at least one record
within the time range. A more robust method is to use a last point query to
determine the last record for each unique item.

In this example, useful for asset tracking or fleet management, you create a
metadata table for each vehicle being tracked, and a second time-series table
containing the vehicle's location at a given time:

```sql
CREATE TABLE vehicles (
  vehicle_id INTEGER PRIMARY KEY,
  vin_number CHAR(17),
  last_checkup TIMESTAMP
);

CREATE TABLE location (
  time TIMESTAMP NOT NULL,
  vehicle_id INTEGER REFERENCES vehicles (vehicle_id),
  latitude FLOAT,
  longitude FLOAT
);

SELECT create_hypertable('location', 'time');
```

You can use the first table, which gives a distinct set of vehicles, to
perform a `LATERAL JOIN` against the location table:

```sql
SELECT data.* FROM vehicles v
  INNER JOIN LATERAL (
    SELECT * FROM location l
      WHERE l.vehicle_id = v.vehicle_id
      ORDER BY time DESC LIMIT 1
  ) AS data
ON true
ORDER BY v.vehicle_id, data.time DESC;

            time            | vehicle_id | latitude  |  longitude
----------------------------+------------+-----------+-------------
 2017-12-19 20:58:20.071784 |         72 | 40.753690 |  -73.980340
 2017-12-20 11:19:30.837041 |        156 | 40.729265 |  -73.993611
 2017-12-15 18:54:01.185027 |        231 | 40.350437 |  -74.651954
```

This approach requires keeping a separate table of distinct item identifiers or
names. You can do this by using a foreign key from the hypertable to the
metadata table, as shown in the `REFERENCES` definition in the example.

The metadata table can be populated through business logic, for example when a
vehicle is first registered with the system. Alternatively, you can dynamically
populate it using a trigger when inserts or updates are performed against the
hypertable. For example:

```sql
CREATE OR REPLACE FUNCTION create_vehicle_trigger_fn()
  RETURNS TRIGGER LANGUAGE PLPGSQL AS
$BODY$
BEGIN
  INSERT INTO vehicles VALUES(NEW.vehicle_id, NULL, NULL) ON CONFLICT DO NOTHING;
  RETURN NEW;
END
$BODY$;

CREATE TRIGGER create_vehicle_trigger
  BEFORE INSERT OR UPDATE ON location
  FOR EACH ROW EXECUTE PROCEDURE create_vehicle_trigger_fn();
```

You could also implement this functionality without a separate metadata table by
performing a [loose index scan][loose-index-scan] over the `location`
hypertable, although this requires more compute resources. Alternatively, you
speed up your `SELECT DISTINCT` queries by structuring them so that TimescaleDB can
use its [SkipScan][skipscan] feature.

[date_bin]: hhttps://www.postgresql.org/docs/current/functions-datetime.html#FUNCTIONS-DATETIME-BIN
[first]: /api/:currentVersion:/hyperfunctions/first
[histogram]: /api/:currentVersion:/hyperfunctions/histogram
[last]: /api/:currentVersion:/hyperfunctions/last
[loose-index-scan]: https://wiki.postgresql.org/wiki/Loose_indexscan
[percentile_cont]: https://www.postgresql.org/docs/current/static/functions-aggregate.html#FUNCTIONS-ORDEREDSET-TABLE
[skipscan]: /use-timescale/:currentVersion:/query-data/skipscan/
[time_bucket]: /api/:currentVersion:/hyperfunctions/time_bucket
[toolkit-approx-percentile]: /api/:currentVersion:/hyperfunctions/percentile-approximation/uddsketch/
