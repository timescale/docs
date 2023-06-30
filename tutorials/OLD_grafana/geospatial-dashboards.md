---
title: Use Grafana to visualize geospatial data stored in TimescaleDB
excerpt: Use the WorldMap visualization to see a geospatial data overload on a map of the world
products: [cloud, mst, self_hosted]
keywords: [Grafana, visualizations, analytics, geospatial data]
---

# Use Grafana to visualize geospatial data stored in TimescaleDB

Grafana includes a WorldMap visualization that help you see geospatial data overlaid
atop a map of the world. This can be helpful to understand how data changes based on
its location.

### Prerequisites

To complete this tutorial, you need a cursory knowledge of the Structured Query
Language (SQL). The tutorial walks you through each SQL command, but it is
helpful if you've seen SQL before.

*   To start, [install TimescaleDB][install-timescale].
*   Next setup Grafana.

Once your installation of TimescaleDB and Grafana are complete, ingest the data found
in the [NYC Taxi Cab][nyc-taxi] tutorial and configure Grafana to connect
to that database. Be sure to follow the full tutorial if you're interested in background
on how to use TimescaleDB.

<Highlight type="tip">
 Be sure to pay close attention to the geospatial query portion
 of the tutorial and complete those steps.

</Highlight>

### Build a geospatial query

The NYC Taxi Cab data also contains the location of each ride pickup. In the
[NYC Taxi Cab][nyc-taxi] tutorial, we examined rides that originated
near Times Square. Let's build on that query and
**visualize rides whose distance traveled was greater than five miles in Manhattan**.

We can do this in Grafana using the 'Worldmap Panel'. Start by creating a
new panel, selecting 'New Visualization', and selecting the 'Worldmap Panel'.

Once again, you can edit the query directly. In the Query screen, be sure
to select your NYC Taxicab Data as the data source. In the 'Format as' dropdown,
select 'Table'. Click on 'Edit SQL' and enter the following query in the text window:

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

Let's dissect this query. First, we're looking to plot rides with visual markers that
denote the trip distance. Trips with longer distances get different visual treatments
on our map. Use the `trip_distance` as the value for our plot, and store
this result in the `value` field.

In the second and third lines of the `SELECT` statement, we are using the `pickup_longitude`
and `pickup_latitude` fields in the database and mapping them to variables `longitude`
and `latitude`, respectively.

In the `WHERE` clause, we are applying a geospatial boundary to look for trips within
2000m of Times Square.

Finally, in the `GROUP BY` clause, we supply the `trip_distance` and location variables
so that Grafana can plot data properly.

<Highlight type="warning">
 This query may take a while, depending on the speed of your Internet connection. This
 is why we're using the `LIMIT` statement for demonstration purposes.

</Highlight>

### Configure the worldmap Grafana panel

Now let's configure our Worldmap visualization. Select the 'Visualization' tab in the far
left of the Grafana user interface. You'll see options for 'Map Visual Options', 'Map Data Options',
and more.

First, make sure the 'Map Data Options' are set to 'table' and 'current'.  Then in
the 'Field Mappings' section. Set the 'Table Query Format' to be 'Table'.
We can map the 'Latitude Field' to our `latitude` variable, the 'Longitude Field' to
our `longitude` variable, and the 'Metric' field to our `value` variable.

In the 'Map Visual Options', set the 'Min Circle Size' to 1 and the 'Max Circle Size' to 5.

In the 'Threshold Options' set the 'Thresholds' to '2,5,10'. This auto configures a set
of colors. Any plot whose `value` is below 2 is a color, any `value` between 2 and 5 is another color, any `value` between 5 and 10 is a third color, and any `value` over 10
is a fourth color.

Your configuration should look like this:

<img class="main-content__illustration" src="https://assets.iobeam.com/images/docs/screenshots-for-grafana-tutorial/grafana-fieldmapping.png" alt="Mapping Worldmap fields to query results in Grafana"/>

At this point, data should be flowing into our Worldmap visualization, like so:

<img class="main-content__illustration" src="https://assets.iobeam.com/images/docs/screenshots-for-grafana-tutorial/grafana_worldmap_query_results.png" alt="Visualizing time series data in PostgreSQL using the Grafana Worldmap"/>

You should be able to edit the time filter at the top of your visualization to see trip pickup data
for different timeframes.

### Summary

Complete your Grafana knowledge by following all the TimescaleDB + Grafana tutorials.

[install-timescale]: /getting-started/latest/
[nyc-taxi]: /tutorials/:currentVersion:/nyc-taxi-cab
