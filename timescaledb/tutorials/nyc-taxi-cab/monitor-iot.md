---
title: Query IoT data tutorial - advanced steps
excerpt: Extra things to try with IoT data
keywords: [tutorials, advanced, query, iot]
tags: [tutorials, IoT]
---

<!-- markdown-link-check-disable -->

# Advanced steps

### Mission 3: Monitoring

We can also use the time-series data from taxi rides to monitor
a ride's current status.

>:WARNING: A more realistic setup would involve creating a data pipeline that streams sensor data directly from the cars into TimescaleDB. However, we use the January 2016 data to illustrate the underlying principles that are applicable regardless of setup.

#### How many rides took place every 5 minutes for the first day of 2016?

It's January 1, 2016. NYC riders have celebrated New Year's Eve, and are using taxi
cabs to travel to and from their first gathering of the new year.

The first thing you might like to know is how many rides have recently taken
place. We can approximate that by counting the number of rides that were
completed on the first day of 2016, in 5 minute intervals.

While it's easy to count how many rides took place, there is no easy way
to segment data by 5 minute time intervals in PostgreSQL. As a result, we
need to use a query similar to the query below:

```sql
-- Vanilla Postgres query for num rides every 5 minutes
SELECT
  EXTRACT(hour from pickup_datetime) as hours,
  trunc(EXTRACT(minute from pickup_datetime) / 5)*5 AS five_mins,
  COUNT(*)
FROM rides
WHERE pickup_datetime < '2016-01-02 00:00'
GROUP BY hours, five_mins;
```

It may not be immediately clear why the above query returns rides segmented
by 5 minute buckets, so let's examine it more closely, using the sample time
of 08:49:00.

In the above query, we first extract the hour that a ride took place in:

```sql
EXTRACT(hour from pickup_datetime) as hours
```

So for 08:49 our result for `hours` would be 8. Then we need to calculate, `five_mins`,
the closest multiple of 5 minutes for a given timestamp. To do this, we calculate
the quotient of the minute that a ride began in divided by 5. Then we truncate
the result to take the floor of that quotient. Afterward, we multiply that truncated
quotient by 5 to, in essence, find the 5 minute bucket that the minute is closest to:

```sql
trunc(EXTRACT(minute from pickup_datetime) / 5)*5 AS five_mins
```

So our result for time of 08:49 would be `trunc(49/5)*5 = trunc(9.8)*5 = 9*5 = 45`,
so this time would be in the 45&nbsp;min bucket. After extracting both the hours and which
5 minute interval the time fell into, we then group our results, first by the
`hours` and then the `five_mins` interval. Whew, that was a lot for a conceptually
simple question!

Segmentation by arbitrary time intervals is common in time-series analysis,
but can sometimes be unwieldy in vanilla PostgreSQL. Thankfully,
TimescaleDB has many custom-built SQL functions to make time-series
analysis quick and simple. For example, `time_bucket` is a more powerful
version of the PostgreSQL `date_trunc` function. It allows for arbitrary
time intervals, rather than the standard day, minute, hour provided by `date_trunc`.

So when using TimescaleDB, the complex query above turns into a simpler
SQL query, as seen below:

```sql
-- How many rides took place every 5 minutes for the first day of 2016?
-- using the TimescaleDB "time_bucket" function
SELECT time_bucket('5 minute', pickup_datetime) AS five_min, count(*)
FROM rides
WHERE pickup_datetime < '2016-01-02 00:00'
GROUP BY five_min
ORDER BY five_min;
```

The result of your query should start something like this:

```sql
      five_min       | count
---------------------+-------
 2016-01-01 00:00:00 |   703
 2016-01-01 00:05:00 |  1482
 2016-01-01 00:10:00 |  1959
 2016-01-01 00:15:00 |  2200
 2016-01-01 00:20:00 |  2285

```

#### How many rides on New Year's morning originated from within 400m of Times Square, in 30 minute buckets?

New York City is famous for its annual Ball Drop New Year's Eve
celebration in Times Square. Thousands of people gather to bring in the
new year together and then head home, to their favorite bar, or first
gathering of the new year.

This matters to your analysis because you'd like to understand taxi demand
in peak times, and there's no more peak time in New York than the Times Square area
on the first day of the year.

To answer this question, your first guess might be to use our friend `time_bucket`
from the previous section to count rides initiated in 30 minute intervals. But
there's one piece of information we don't have: how do we figure out
which rides started *near Times Square*?

This requires that we make use of the pickup latitude and longitude columns
in our `rides` hypertable. To use the pickup location, we'll need to get our
hypertable ready for geospatial queries.

The good news is that TimescaleDB is compatible with all other PostgreSQL
extensions and, for geospatial data, we'll use [PostGIS][postgis]. This allows us
to slice data by time and location with the speed and scale of TimescaleDB!

```sql
-- Geospatial queries - TimescaleDB + POSTGIS -- slice by time and location
-- Install the extension in the database
CREATE EXTENSION postgis;
```

Then, run the `\dx` command in `psql` to verify that PostGIS was installed properly.
You should see the PostGIS extension in your extension list, as noted below:

```sql
                                        List of installed extensions
     Name     | Version |   Schema   |                             Description
 -------------+---------+------------+---------------------------------------------------------------------
  plpgsql     | 1.0     | pg_catalog | PL/pgSQL procedural language
  postgis     | 2.5.1   | public     | PostGIS geometry, geography, and raster spatial types and functions
  timescaledb | 1.6.0   | public     | Enables scalable inserts and complex queries for time-series data
 (3 rows)
 ```

Now, we need to alter our table to work with PostGIS. To start, we'll add
geometry columns for ride pick up and drop off locations:

```sql
-- Create geometry columns for each of our (lat,long) points
ALTER TABLE rides ADD COLUMN pickup_geom geometry(POINT,2163);
ALTER TABLE rides ADD COLUMN dropoff_geom geometry(POINT,2163);
```

Next we'll need to convert the latitude and longitude points into geometry coordinates
so that it plays well with PostGIS:

>:WARNING: This next query may take several minutes. Updating both columns in one UPDATE statement
as shown reduces the amount of time it takes to update all rows in the `rides` table.

```sql
-- Generate the geometry points and write to table
UPDATE rides SET pickup_geom = ST_Transform(ST_SetSRID(ST_MakePoint(pickup_longitude,pickup_latitude),4326),2163),
   dropoff_geom = ST_Transform(ST_SetSRID(ST_MakePoint(dropoff_longitude,dropoff_latitude),4326),2163);
```

Lastly, we need one more piece of info: Times Square is located at (`lat`, `long`) (`40.7589`,`-73.9851`).

Now, we have all the information to answer our original question:
*How many rides on New Year's morning originated within 400m of Times Square, in 30 minute buckets?*

```sql
-- How many taxis pick up rides within 400m of Times Square on New Years Day, grouped by 30 minute buckets.
-- Number of rides on New Years Day originating within 400m of Times Square, by 30 min buckets
-- Note: Times Square is at (lat, long) (40.7589,-73.9851)
SELECT time_bucket('30 minutes', pickup_datetime) AS thirty_min, COUNT(*) AS near_times_sq
FROM rides
WHERE ST_Distance(pickup_geom, ST_Transform(ST_SetSRID(ST_MakePoint(-73.9851,40.7589),4326),2163)) < 400
AND pickup_datetime < '2016-01-01 14:00'
GROUP BY thirty_min ORDER BY thirty_min;
```

You should get the following results:

```sql
     thirty_min      | near_times_sq
---------------------+---------------
 2016-01-01 00:00:00 |            74
 2016-01-01 00:30:00 |           102
 2016-01-01 01:00:00 |           120
 2016-01-01 01:30:00 |            98
 2016-01-01 02:00:00 |           112
 2016-01-01 02:30:00 |           109
 2016-01-01 03:00:00 |           163
 2016-01-01 03:30:00 |           181
 2016-01-01 04:00:00 |           214
 2016-01-01 04:30:00 |           185
 2016-01-01 05:00:00 |           158
 2016-01-01 05:30:00 |           113
 2016-01-01 06:00:00 |           102
 2016-01-01 06:30:00 |            91
 2016-01-01 07:00:00 |            88
 2016-01-01 07:30:00 |            58
 2016-01-01 08:00:00 |            72
 2016-01-01 08:30:00 |            94
 2016-01-01 09:00:00 |           115
 2016-01-01 09:30:00 |           118
 2016-01-01 10:00:00 |           135
 2016-01-01 10:30:00 |           160
 2016-01-01 11:00:00 |           212
 2016-01-01 11:30:00 |           229
 2016-01-01 12:00:00 |           244
 2016-01-01 12:30:00 |           230
 2016-01-01 13:00:00 |           235
 2016-01-01 13:30:00 |           238
(28 rows)
```

From the figure above, you can surmise that few people wanted to leave
by taxi around midnight, while many left by taxi between 03:00-05:00, after the
bars, clubs, and other New Year's Eve parties closed. This is useful information
for capacity planning, reducing idling vehicles, and pre-positioning alternative
transportation with a smaller carbon footprint, such as shuttle buses to/from
subway and train lines.

As an aside, the data also shows you that rides then picked up in the mid-morning
hours, as people headed to breakfast and other New Years activities. New York is
truly the city that never sleeps and Times Square is a good reflection of that!

### Conclusions and next steps

In this tutorial you learned how to get started with TimescaleDB.

In **Mission 1**, you learned how to setup and connect to a TimescaleDB instance
and load data from a CSV file using `psql`.

In **Missions 2 and 3** you learned how to use TimescaleDB to conduct analysis and
monitoring on a large dataset. You learned about hypertables, saw how TimescaleDB
supports full SQL, and how JOINs enable you to combine your time-series data
with your relational or business data.

You also learned about special TimescaleDB SQL functions like `time_bucket` and
how they make time-series analysis possible in fewer lines of code, as well
as how TimescaleDB is compatible with other extensions like *PostGIS*, for fast
querying by time and location.

Ready for more learning? Here's a few suggestions:

*   [Time Series Forecasting using TimescaleDB, R, Apache MADlib and Python][time-series-forecasting]
*   [Continuous Aggregates][continuous-aggregates]
*   [Try Other Sample Datasets][other-samples]
*   [Migrate your own Data][migrate]
