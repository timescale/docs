---
title: Use Grafana to visualize geospatial data
excerpt: Create a Grafana visualization to see geospatial data on a map
products: [cloud, mst, self_hosted]
keywords: [Grafana, visualizations, analytics, geospatial data]
---

# Use Grafana to visualize geospatial data stored in Timescale

Grafana includes a WorldMap visualization so you can see geospatial data
overlaid on a map. This can be helpful to understand how data
changes based on its location.

## Build a geospatial query in Grafana

This section visualizes taxi rides in Manhattan, where the distance traveled
was greater than 5 miles. It uses the same query as the [NYC Taxi Cab][nyc-taxi]
tutorial as a starting point.

<Procedure>

### Building a geospatial query in Grafana

1.  In your Grafana dashboard, create a new panel, select `New Visualization`,
    and select `Worldmap Panel`.
1.  Navigate to the `Queries` tab.
1.  Select your data source.
1.  In the `Format as` dropdown, select `Table`. Click `Edit SQL` and enter the
    query you want to use. This examples uses this query:

    ```sql
    SELECT time_bucket('5m', rides.pickup_datetime) AS time,
           rides.trip_distance AS value,
           rides.pickup_latitude AS latitude,
           rides.pickup_longitude AS longitude
    FROM rides
    WHERE $__timeFilter(rides.pickup_datetime) AND
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

1.  Configure the visualization by navigating to the `Visualization` tab. Make
    sure the `Map Data Options` are set to `table` and `current`.
1.  In the `Field Mappings` section, set the `Table Query Format` to `Table`.
1.  Map the `Latitude Field` to the `latitude` variable, the `Longitude Field`
    to the `longitude` variable, and the `Metric` field to the `value` variable.
1.  In the `Map Visual Options` section, set the `Min Circle Size` to `1`, and
    the `Max Circle Size` to `5`.
1.  In the `Threshold Options` section, set the `Thresholds` to `2,5,10`. This
    automatically configures a set of colors, which you can adjust later.

<img class="main-content__illustration"
width={1375} height={944}
src="https://assets.iobeam.com/images/docs/screenshots-for-grafana-tutorial/grafana_worldmap_query_results.png"
alt="Visualizing time series data in PostgreSQL using the Grafana Worldmap"/>

</Procedure>

[nyc-taxi]: /tutorials/:currentVersion:/nyc-taxi-cab
