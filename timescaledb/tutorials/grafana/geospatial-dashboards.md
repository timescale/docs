# Use Grafana to Visualize Geospatial Data Stored in TimescaleDB

Grafana includes a WorldMap visualization that will help you see geospatial data overlaid
atop a map of the world. This can be helpful to understand how data changes based on
its location.

### Pre-requisites

To complete this tutorial, you will need a cursory knowledge of the Structured Query 
Language (SQL). The tutorial will walk you through each SQL command, but it will be 
helpful if you've seen SQL before.

* To start, [install TimescaleDB][install-timescale].
* Next [setup Grafana][install-grafana].

Once your installation of TimescaleDB and Grafana are complete, ingest the data found 
in the [Hello, Timescale!][hello-timescale] tutorial and configure Grafana to connect
to that database. Be sure to follow the full tutorial if you’re interested in background 
on how to use TimescaleDB.

<highlight type="tip">
 Be sure to pay close attention to the [geospatial query portion][hello-timescale-geospatial] 
 of the tutorial and complete those steps.
</highlight>

### Build a geospatial query

The NYC Taxi Cab data also contains the location of each ride pickup. In the
[Hello, Timescale! Tutorial][hello-timescale], we examined rides that originated
near Times Square. Let’s build on that query and
**visualize rides whose distance traveled was greater than five miles in Manhattan**.

We can do this in Grafana using the 'Worldmap Panel'. We will start by creating a
new panel, selecting 'New Visualization', and selecting the 'Worldmap Panel'.

Once again, we will edit our query directly. In the Query screen, be sure
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

Let’s dissect this query. First, we’re looking to plot rides with visual markers that
denote the trip distance. Trips with longer distances will get different visual treatments
on our map. We will use the `trip_distance` as the value for our plot. We will store
this result in the `value` field.

In the second and third lines of the `SELECT` statement, we are using the `pickup_longitude`
and `pickup_latitude` fields in the database and mapping them to variables `longitude`
and `latitude`, respectively.

In the `WHERE` clause, we are applying a geospatial boundary to look for trips within
2000m of Times Square.

Finally, in the `GROUP BY` clause, we supply the `trip_distance` and location variables
so that Grafana can plot data properly.

<highlight type="warning">
 This query may take a while, depending on the speed of your Internet connection. This 
 is why we’re using the `LIMIT` statement for demonstration purposes.
</highlight>

### Configure the Worldmap Grafana panel

Now let’s configure our Worldmap visualization. Select the 'Visualization' tab in the far
left of the Grafana user interface. You’ll see options for 'Map Visual Options', 'Map Data Options',
and more.

First, make sure the 'Map Data Options' are set to 'table' and 'current'.  Then in
the 'Field Mappings' section. We will set the 'Table Query Format' to be ‘Table’.
We can map the 'Latitude Field' to our `latitude` variable, the 'Longitude Field' to
our `longitude` variable, and the 'Metric' field to our `value` variable.

In the 'Map Visual Options', set the 'Min Circle Size' to 1 and the 'Max Circle Size' to 5.

In the 'Threshold Options' set the 'Thresholds' to '2,5,10'. This will auto configure a set
of colors. Any plot whose `value` is below 2 will be a color, any `value` between 2 and 5 will
be another color, any `value` between 5 and 10 will be a third color, and any `value` over 10
will be a fourth color.

Your configuration should look like this:

<img class="main-content__illustration" src="https://assets.iobeam.com/images/docs/screenshots-for-grafana-tutorial/grafana-fieldmapping.png" alt="Mapping Worldmap fields to query results in Grafana"/>

At this point, data should be flowing into our Worldmap visualization, like so:

<img class="main-content__illustration" src="https://assets.iobeam.com/images/docs/screenshots-for-grafana-tutorial/grafana_worldmap_query_results.png" alt="Visualizing time series data in PostgreSQL using the Grafana Worldmap"/>

You should be able to edit the time filter at the top of your visualization to see trip pickup data
for different timeframes.

### Summary

Complete your Grafana knowledge by following [all the TimescaleDB + Grafana tutorials][tutorial-grafana].

[install-timescale]: /getting-started/installation
[install-grafana]: /getting-started/installation-grafana
[hello-timescale]: /tutorials/tutorial-hello-timescale
[hello-timescale-geospatial]: /tutorials/tutorial-hello-timescale#postgis
[tutorial-grafana]: /tutorials/tutorial-grafana