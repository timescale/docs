---
title: Plot geospatial time-series data tutorial - query the data
excerpt: Query geospatial time-series data
products: [cloud]
keywords: [tutorials, GIS, geospatial, learn]
tags: [tutorials, intermediate]
layout_components: [next_prev_large]
content_group: Plot geospatial NYC taxi cab data
---

# Query the data

When you have your dataset loaded, you can start constructing some queries to
discover what your data tells you. In this section, you learn how to combine the
data in the NYC taxi dataset with geospatial data from [PostGIS][postgis], to
answer these questions:

*   [How many rides on New Year's Day 2016 originated from Times Square?](#how-many-rides-on-new-years-day-2016-originated-from-times-square)
*   [Which rides traveled more than 5 miles in Manhattan?](#which-rides-traveled-more-than-5-miles-in-manhattan).

## Set up your dataset for PostGIS

To answer these geospatial questions, you need the ride count data from the NYC
taxi dataset, but you also need some geospatial data to work out which trips
originated where. $COMPANY is compatible with all other PostgreSQL extensions
so you can use the [PostGIS][postgis] extension to slice the data by time and
location.

With the extension loaded, you alter your $HYPERTABLE so it's ready for geospatial
queries. The `rides` table contains columns for pickup latitude and longitude,
but it needs to be converted into geometry coordinates so that it works well
with PostGIS.

<Procedure>

### Setting up your dataset for PostGIS

1.  Connect to the $COMPANY database that contains the NYC taxi dataset.
1.  At the psql prompt, add the PostGIS extension:

    ```sql
    CREATE EXTENSION postgis;
    ```

    You can check that PostGIS is installed properly by checking that it appears
    in the extension list when you run the `\dx` command.
1.  Alter the $HYPERTABLE to add geometry columns for ride pick up and drop off
    locations:

    ```sql
    ALTER TABLE rides ADD COLUMN pickup_geom geometry(POINT,2163);
    ALTER TABLE rides ADD COLUMN dropoff_geom geometry(POINT,2163);
    ```

1.  Convert the latitude and longitude points into geometry coordinates, so that
    they work well with PostGIS. This could take a while, as it needs to update
    all the data in both columns:

    ```sql
    UPDATE rides SET pickup_geom = ST_Transform(ST_SetSRID(ST_MakePoint(pickup_longitude,pickup_latitude),4326),2163),
       dropoff_geom = ST_Transform(ST_SetSRID(ST_MakePoint(dropoff_longitude,dropoff_latitude),4326),2163);
    ```

</Procedure>

## How many rides on New Year's Day 2016 originated from Times Square?

When you have your database set up for PostGIS data, you can construct a query
to return the number of rides on New Year's Day that originated in Times Square,
in 30-minute buckets.

<Procedure>

### Finding how many rides on New Year's Day 2016 originated from Times Square

<Highlight type="note">
Times Square is located at (40.7589,-73.9851).
</Highlight>

1.  Connect to the $COMPANY database that contains the NYC taxi dataset.
1.  At the psql prompt, use this query to select all rides taken in the first
    day of January 2016 that picked up within 400m of Times Square, and return a
    count of rides for each 30 minute interval:

    ```sql
    SELECT time_bucket('30 minutes', pickup_datetime) AS thirty_min,
        COUNT(*) AS near_times_sq
    FROM rides
    WHERE ST_Distance(pickup_geom, ST_Transform(ST_SetSRID(ST_MakePoint(-73.9851,40.7589),4326),2163)) < 400
    AND pickup_datetime < '2016-01-01 14:00'
    GROUP BY thirty_min
    ORDER BY thirty_min;
    ```

1.  The data you get back looks a bit like this:

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

## Which rides traveled more than 5 miles in Manhattan?

This query is especially well suited to plot on a map. It looks at
rides that were longer than 5 miles, within the city of Manhattan.

In this query, you want to return rides longer than 5 miles, but also include
the distance, so that you can visualize longer distances with different visual
treatments. The query also includes a `WHERE` clause to apply a geospatial
boundary, looking for trips within 2 km of Times Square. Finally, in the
`GROUP BY` clause, supply the `trip_distance` and location variables so that
Grafana can plot the data properly.

<Procedure>

### Finding rides that traveled more than 5 miles in Manhattan

1.  Connect to the $COMPANY database that contains the NYC taxi dataset.
1.  At the psql prompt, use this query to find rides longer than 5 miles in
    Manhattan:

    ```sql
    SELECT time_bucket('5m', rides.pickup_datetime) AS time,
           rides.trip_distance AS value,
           rides.pickup_latitude AS latitude,
           rides.pickup_longitude AS longitude
    FROM rides
    WHERE rides.pickup_datetime BETWEEN '2016-01-01T01:41:55.986Z' AND '2016-01-01T07:41:55.986Z' AND
      ST_Distance(pickup_geom,
                  ST_Transform(ST_SetSRID(ST_MakePoint(-73.9851,40.7589),4326),2163)
      ) < 2000
    GROUP BY time,
             rides.trip_distance,
             rides.pickup_latitude,
             rides.pickup_longitude
    ORDER BY time
    LIMIT 500;
    ```

1.  The data you get back looks a bit like this:

    ```sql
            time         | value |      latitude      |      longitude
    ---------------------+-------+--------------------+---------------------
     2016-01-01 01:40:00 |  0.00 | 40.752281188964844 | -73.975021362304688
     2016-01-01 01:40:00 |  0.09 | 40.755722045898437 | -73.967872619628906
     2016-01-01 01:40:00 |  0.15 | 40.752742767333984 | -73.977737426757813
     2016-01-01 01:40:00 |  0.15 | 40.756877899169922 | -73.969779968261719
     2016-01-01 01:40:00 |  0.18 | 40.756717681884766 | -73.967330932617188
     ...
    ```

1.  [](#)<Optional /> To visualize this in Grafana, create a new panel, and select the
    `Geomap` visualization. Select the NYC taxis dataset as your data source,
    and type the query from the previous step. In the `Format as` section,
    select `Table`. Your world map now shows a dot over New York, zoom in
    to see the visualization.
1.  [](#)<Optional /> To make this visualization more useful, change the way that the
    rides are displayed. In the options panel, under `Data layer`, add a layer
    called `Distance traveled` and select the `markers` option. In the `Color`
    section, select `value`. You can also adjust the symbol and size here.
1.  [](#)<Optional /> Select a color scheme so that different ride lengths are shown
    in different colors. In the options panel, under `Standard options`, change
    the `Color scheme` to a useful `by value` range. This example uses the
    `Blue-Yellow-Red (by value)` option.

    <img
    class="main-content__illustration"
    src="https://assets.timescale.com/docs/images/grafana-postgis.webp"
    width={1375} height={944}
    alt="Visualizing taxi journeys by distance in Grafana"
    />

</Procedure>

[postgis]: http://postgis.net/
