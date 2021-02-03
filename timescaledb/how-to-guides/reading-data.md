# Reading data

TimescaleDB hypertables are designed to behave in the same manner as
PostgreSQL database tables for reading data, using standard SQL commands.

## SELECT Commands [](select)

Data can be queried from a hypertable using the standard `SELECT` SQL command
([PostgreSQL docs][postgres-select]), including with arbitrary `WHERE` clauses,
`GROUP BY` and `ORDER BY` commands, joins, subqueries, window functions,
user-defined functions (UDFs), `HAVING` clauses, and so on.

From basic queries:

```sql
-- Return the most recent 100 entries in the table 'conditions' ordered newest to oldest
SELECT * FROM conditions ORDER BY time DESC LIMIT 100;

-- Return the number of data entries written in past 12 hours
SELECT COUNT(*) FROM conditions
  WHERE time > NOW() - INTERVAL '12 hours';
```
To more advanced SQL queries:

```sql
-- Information about each 15-min period for each location
-- over the past 3 hours, ordered by time and temperature
SELECT time_bucket('15 minutes', time) AS fifteen_min,
    location, COUNT(*),
    MAX(temperature) AS max_temp,
    MAX(humidity) AS max_hum
  FROM conditions
  WHERE time > NOW() - INTERVAL '3 hours'
  GROUP BY fifteen_min, location
  ORDER BY fifteen_min DESC, max_temp DESC;


-- How many distinct locations with air conditioning
-- have reported data in the past day
SELECT COUNT(DISTINCT location) FROM conditions
  JOIN locations
    ON conditions.location = locations.location
  WHERE locations.air_conditioning = True
    AND time > NOW() - INTERVAL '1 day'
```

---

## Advanced Analytic Queries  [](advanced-analytics)

TimescaleDB can be used for a variety of analytical queries, both through its
native support for PostgreSQL's full range of SQL functionality, as well as
additional functions added to TimescaleDB (both for ease-of-use and for better
query optimization).

The following list is just a sample of some of its analytical capabilities.

### Median/Percentile [](median)

PostgreSQL has inherent methods for determining median values and percentiles
namely the function [`percentile_cont`][percentile_cont].  An example query
for the median temperature is:

```sql
SELECT percentile_cont(0.5)
  WITHIN GROUP (ORDER BY temperature)
  FROM conditions;
```

### Cumulative Sum [](cumulative-sum)

One way to determine cumulative sum is using the SQL
command `sum(sum(column)) OVER(ORDER BY group)`.  For example:

```sql
SELECT location, sum(sum(temperature)) OVER(ORDER BY location)
  FROM conditions
  GROUP BY location;
```

### Moving Average [](moving-average)

For a simple moving average, you can use the `OVER` windowing function over
some number of rows, then compute an aggregation function over those rows. The
following computes the smoothed temperature of a device by averaging its last
10 readings together:

```sql
SELECT time, AVG(temperature) OVER(ORDER BY time
      ROWS BETWEEN 9 PRECEDING AND CURRENT ROW)
    AS smooth_temp
  FROM conditions
  WHERE location = 'garage' and time > NOW() - INTERVAL '1 day'
  ORDER BY time DESC;
```

### Increase[](increase)

To calculate the increase from monotonically increasing counters like bytes sent
of a host or container you need to account for counter resets caused, for
example by host reboots or container restarts.  The following query calculates
bytes sent while taking counter resets into account.

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

### Rate [](rate)

Like [increase](#increase), rate applies to a situation with monotonically
increasing counters. If your sample interval is variable or you use different
sampling intervals between different series it is helpful to normalize the
values to a common time interval to make the calculated values comparable.
The following query calculates bytes per second sent while taking counter
resets into account.

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

### Delta [](delta)

In many monitoring (and IoT) use cases, devices or sensors report metrics that typically do not
change. In cases where the value changes, these changes are considered anomalies. When querying
for these changes in values over time, users typically do not want to transmit all the values where
no changes were observed since they want to minimize the amount of data that gets sent back to
the client.

Users can leverage a combination of window functions and subselects to achieve this. The below query
uses diffs to filter rows where values have not changed and only transmits rows where values
have changed.

```sql
SELECT time, value FROM (
  SELECT time,
    value,
    value - LAG(value) OVER (ORDER BY time) AS diff
  FROM hypertable) ht
WHERE diff IS NULL OR diff != 0;
```

### Time Bucket :timescale_function: [](time-bucket)

TimescaleDB's [`time_bucket`][time_bucket] acts as a more powerful version of the PostgreSQL function [`date_trunc`][date_trunc].  It accepts arbitrary time intervals as well as optional offsets and returns the bucket start time.

```sql
SELECT time_bucket('5 minutes', time) AS five_min, avg(cpu)
  FROM metrics
  GROUP BY five_min
  ORDER BY five_min DESC LIMIT 12;
```

### First, Last :timescale_function: [](first-last)

TimescaleDB defines functions for [`first`][first] and [`last`][last],
which allow you to get the value of one column as ordered by another.
This is commonly used in an aggregation, such as getting the
first or last element of that group.

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

### Histogram :timescale_function: [](histogram)

TimescaleDB also provides a [`histogram`][histogram] function.
The following example defines a histogram with five buckets defined over
the range 60..85. The generated histogram has seven bins where the first
is for values below the minimun threshold of 60, the middle five bins are for
values in the stated range and the last is for values above 85.


```sql
SELECT location, COUNT(*),
    histogram(temperature, 60.0, 85.0, 5)
   FROM conditions
   WHERE time > NOW() - INTERVAL '7 days'
   GROUP BY location;
```
This query will output data in the following form:
```bash
 location   | count |        histogram
------------+-------+-------------------------
 office     | 10080 | {0,0,3860,6220,0,0,0}
 basement   | 10080 | {0,6056,4024,0,0,0,0}
 garage     | 10080 | {0,2679,957,2420,2150,1874,0}
```

### Gap Filling :timescale_function: :community_function: [](gap-filling)

Some time-series analyses or visualizations want to display records for
each selected time period, even if no data was recorded during that
period.  This is commonly termed "gap filling", and may involve
performing such operations as recording a "0" for any missing period.

In the following example, we use trading data that includes
a `time` timestamp, the `asset_code` being traded, as well as
the `price` of the asset and `volume` of the asset traded.

Consider first a query for the volume of a certain asset 'TIMS' being
traded every day for the month of September:

```sql
SELECT
    time_bucket('1 day', time) AS date,
    sum(volume) AS volume
  FROM trades
  WHERE asset_code = 'TIMS'
    AND time >= '2017-09-01' AND time < '2017-10-01'
  GROUP BY date
  ORDER BY date DESC;
```
This query will output data in the following form:
```
          date          | volume
------------------------+--------
 2017-09-29 00:00:00+00 |  11315
 2017-09-28 00:00:00+00 |   8216
 2017-09-27 00:00:00+00 |   5591
 2017-09-26 00:00:00+00 |   9182
 2017-09-25 00:00:00+00 |  14359
 2017-09-22 00:00:00+00 |   9855
```

Note that no records are included for 09-23, 09-24, or 09-30 as no
trade data was recorded for those days (they were weekends).
To instead include time records for each missing day, one can use
the following TimescaleDB function `time_bucket_gapfill`, which
serves to generate a series of time buckets according to some
interval (here, `1 day`) across a specified period.

```sql
SELECT
  time_bucket_gapfill('1 day', time) AS date,
  sum(volume) AS volume
FROM trades
WHERE asset_code = 'TIMS'
  AND time >= '2017-09-01' AND time < '2017-10-01'
GROUP BY date
ORDER BY date DESC;
```
This query will then output data in the following form:
```
          date          | volume
------------------------+--------
 2017-09-30 00:00:00+00 |
 2017-09-29 00:00:00+00 |  11315
 2017-09-28 00:00:00+00 |   8216
 2017-09-27 00:00:00+00 |   5591
 2017-09-26 00:00:00+00 |   9182
 2017-09-25 00:00:00+00 |  14359
 2017-09-24 00:00:00+00 |
 2017-09-23 00:00:00+00 |
 2017-09-22 00:00:00+00 |   9855
```
For example, let's say you want 1080 data points in the last two weeks and, as many graphing
libraries require time data points with null values to draw gaps in a graph, we need to
generate the correct timestamp for each of the data points even if there is no data there.
Note that we can do basic arithmetic operations on intervals easily in order to get the correct
value to pass to time_bucket.
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
This query will output data of the form:
```
         btime          | volume
------------------------+----------
 2018-03-09 17:28:00+00 |  1085.25
 2018-03-09 17:46:40+00 |  1020.42
 2018-03-09 18:05:20+00 |
 2018-03-09 18:24:00+00 |  1031.25
 2018-03-09 18:42:40+00 |  1049.09
 2018-03-09 19:01:20+00 |  1083.80
 2018-03-09 19:20:00+00 |  1092.66
 2018-03-09 19:38:40+00 |
 2018-03-09 19:57:20+00 |  1048.42
 2018-03-09 20:16:00+00 |  1063.17
 2018-03-09 20:34:40+00 |  1054.10
 2018-03-09 20:53:20+00 |  1037.78
```

### Last Observation Carried Forward (locf) :timescale_function: :community_function: [](locf)

If your data collections only records rows when the actual value changes,
your visualizations might still need all data points to properly display
your results. In this situation you want to carry forward the last observed
value.

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

### Last Point [](last-point)

A common query in many settings is to find the *last point* for each
unique item in the database, e.g., the last recorded measurement from
each IoT device, the last location of each item in asset tracking, the
last price of each security, etc.

Yet the standard approach for minimizing the amount of data one needs
to search -- using a time predicate to tightly bound the amount of
time (number of chunks) one needs to traverse -- is not sound if you
can't guarantee that all items have at least one record within that
period.

Instead, a last point query effectively determines, for each unique
item, the latest record for that item.

Consider the following setup in asset tracking or fleet management,
where you have a meta-data table about each vehicle, and a second
time-series table about their location at a given time.

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

Now, we use this first table, which gives us the distinct set of
vehicles, to perform a LATERAL JOIN against the location table:

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

This approach requires keeping a separate table of distinct item
identifiers/names, which can be done through the use of a foreign key
from the hypertable to the metadata table (as shown via the
`REFERENCES` definition above).

This metadata table may be populated through other business logic
(e.g., when a vehicle is first registered with the system), or it can
be dynamically populated via a trigger when inserts or updates
are performed against the hypertable:

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

Alternatively, you can implement this functionality without a separate
metadata table by performing a [loose index scan][] over the
`location` hypertable, albeit at higher cost.


What analytic functions are we missing?  [Let us know on github][issues].

[postgres-select]: https://www.postgresql.org/docs/current/static/sql-select.html
[percentile_cont]: https://www.postgresql.org/docs/current/static/functions-aggregate.html#FUNCTIONS-ORDEREDSET-TABLE
[time_bucket]: /api#time_bucket
[date_trunc]: https://www.postgresql.org/docs/current/static/functions-datetime.html#functions-datetime-trunc
[first]: /api#first
[last]: /api#last
[histogram]: /api#histogram
[loose index scan]: https://wiki.postgresql.org/wiki/Loose_indexscan
[issues]: https://github.com/timescale/timescaledb/issues
