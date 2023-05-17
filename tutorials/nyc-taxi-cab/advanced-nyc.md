---
title: Query time-series data tutorial - advanced steps
excerpt: Extra things to try with time-series data
products: [cloud, mst, self_hosted]
keywords: [tutorials, advanced, query]
tags: [tutorials, beginner]
---

# Advanced steps

When you have gotten used to some of the simpler queries, you can start
constructing some more advanced queries to find the answers to more complicated
questions. In this section, you learn how to combine the data in the NYC taxi
dataset with geospatial data from [PostGIS][postgis], to answer this question:

*   [How many rides on New Year's Day 2016 originated from Times Square?](#how-many-rides-on-new-years-day-2016-originated-from-times-square)

## How many rides on New Year's Day 2016 originated from Times Square?

To answer this question, you need the ride count data from the NYC taxi dataset,
but you also need some geospatial data to work out which trips originated in
Times Square. TimescaleDB is compatible with all other PostgreSQL extensions so
you can use the [PostGIS][postgis] extension to slice the data by time and
location.

You need to start by altering your hypertable so it's ready for geospatial
queries. The `rides` table contains columns for pickup latitude and longitude,
but it needs to be converted into geometry coordinates so that it works well
with PostGIS. Once you have done that, you can construct a query to return the
number of rides on New Year's Day that originated in Times Square, by 30-minute
buckets.

<Procedure>

### Finding how many rides on New Year's Day 2016 originated from Times Square

<Highlight type="note">
Times Square is located at (40.7589,-73.9851).
</Highlight>

1.  Connect to the Timescale database that contains the NYC taxi dataset.
2.  At the psql prompt, add the PostGIS extension:

    ```sql
    CREATE EXTENSION postgis;
    ```

    You can check that PostGIS is installed properly by checking that it appears
    in the extension list when you run the `\dx` command.
3.  Alter the hypertable to add geometry columns for ride pick up and drop off
    locations:

    ```sql
    ALTER TABLE rides ADD COLUMN pickup_geom geometry(POINT,2163);
    ALTER TABLE rides ADD COLUMN dropoff_geom geometry(POINT,2163);
    ```

4.  Convert the latitude and longitude points into geometry coordinates, so that
    they work well with PostGIS. This could take a while, as it needs to update
    all the data in both columns:

    ```sql
    UPDATE rides SET pickup_geom = ST_Transform(ST_SetSRID(ST_MakePoint(pickup_longitude,pickup_latitude),4326),2163),
       dropoff_geom = ST_Transform(ST_SetSRID(ST_MakePoint(dropoff_longitude,dropoff_latitude),4326),2163);
    ```

5.  Use this query to select all rides taken in the first day of January 2016
    that picked up within 400m of Times Square, and return a count of rides for
    each 30 minute interval:

    ```sql
    SELECT time_bucket('30 minutes', pickup_datetime) AS thirty_min,
        COUNT(*) AS near_times_sq
    FROM rides
    WHERE ST_Distance(pickup_geom, ST_Transform(ST_SetSRID(ST_MakePoint(-73.9851,40.7589),4326),2163)) < 400
    AND pickup_datetime < '2016-01-01 14:00'
    GROUP BY thirty_min
    ORDER BY thirty_min;
    ```

    The result of the query starts like this:

    ```sql
         thirty_min      | near_times_sq
    ---------------------+---------------
     2016-01-01 00:00:00 |            74
     2016-01-01 00:30:00 |           102
     2016-01-01 01:00:00 |           120
     2016-01-01 01:30:00 |            98
     2016-01-01 02:00:00 |           112
    ```

</Procedure>

[postgis]: http://postgis.net/
