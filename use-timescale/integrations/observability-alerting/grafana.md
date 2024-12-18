---
title: Integrate Grafana and Timescale Cloud
excerpt: Use Grafana to visualize time-series data stored in Timescale
products: [cloud]
keywords: [Grafana, visualizations, analytics, monitoring]
---

import GrafanaConnect from "versionContent/_partials/_grafana-connect.mdx";

# Get started with Grafana and Timescale

Grafana is an analytics and monitoring tool that you can use to visualize time-series data. This page shows you how to set up Grafana with Timescale and create a dashboard and panel. It also provides an example of how to visualize geospatial data.

<GrafanaConnect />

## Create a Grafana dashboard and panel

Grafana is organized into dashboards and panels. A dashboard represents a
view into the performance of a system, and each dashboard consists of one or
more panels, which represent information about a specific metric related to
that system.

<Procedure>

1.  **Create a new dashboard**

    Hover your mouse over the `+` icon in the far left of the Grafana user
    interface to bring up a `Create` menu, then select `Dashboard`. When your new
    dashboard is created, you'll see a `New Panel` screen, with options for
    `Add Query` and `Choose Visualization`. In the future, if you already have a
    dashboard with panels, you can click the `+` icon at the top of the Grafana
    user interface to add a panel to an existing dashboard.
1.  **Click `Choose Visualization` to add a new panel**

    There are several options for different Grafana visualizations. This example uses the `Graph`
    visualization.
1.  **Configure the panel**

    There are multiple ways to configure, but you can accept all the defaults to create a simple `Lines` graph.
1.  **Navigate to the `Queries` tab and set the query database to the dataset you are using**
1.  **Run your queries**

    You can edit the queries directly or use the built-in query editor. If you are visualizing time-series data, select
    `Time series` in the `Format As` drop-down.

</Procedure>

### Use the time filter function

Grafana time-series panels include a time filter. You can link the user interface
construct in a Grafana panel with the query itself using the `$__timefilter()`
function.

This example uses the `$__timefilter()` function to set
the `pickup_datetime` column as the filtering range for your visualizations:

```sql
SELECT
  --1--
  time_bucket('1 day', pickup_datetime) AS "time",
  --2--
  COUNT(*)
FROM rides
WHERE $__timeFilter(pickup_datetime)
```

### Reference elements in the query

You can group your visualizations and order the results by [time buckets][time-buckets]. In this case, the `GROUP BY` and
`ORDER BY` statements reference `time`.

For example:

```sql
SELECT
  --1--
  time_bucket('1 day', pickup_datetime) AS time,
  --2--
  COUNT(*)
FROM rides
WHERE $__timeFilter(pickup_datetime)
GROUP BY time
ORDER BY time
```

When you visualize this query in Grafana, you see this:

<img class="main-content__illustration"
width={1375} height={944}
src="https://assets.iobeam.com/images/docs/screenshots-for-grafana-tutorial/grafana_query_results.png" alt="Visualizing time-series data in Grafana"/>

You can adjust the `time_bucket` function and compare the graphs:

```sql
SELECT
  --1--
  time_bucket('5m', pickup_datetime) AS time,
  --2--
  COUNT(*)
FROM rides
WHERE $__timeFilter(pickup_datetime)
GROUP BY time
ORDER BY time
```

When you visualize this query, it looks like this:

<img class="main-content__illustration"
width={1375} height={944}
src="https://assets.iobeam.com/images/docs/screenshots-for-grafana-tutorial/grafana_query_results_5m.png"
alt="Visualizing time-series data in Grafana"/>

## Visualize geospatial data

Grafana includes a WorldMap visualization so you can see geospatial data
overlaid on a map. This can be helpful to understand how data
changes based on its location.

This section visualizes taxi rides in Manhattan, where the distance traveled
was greater than 5 miles. It uses the same query as the [NYC Taxi Cab][nyc-taxi]
tutorial as a starting point.

<Procedure>

1.  **In your Grafana dashboard, create a new panel** 
1.  **Select `New Visualization` >`Worldmap Panel`**
1.  **Navigate to the `Queries` tab and select your data source**
1.  **In the `Format as` dropdown, select `Table`** 
1.  **Click `Edit SQL` and enter the query you want to use**
 
    This procedure uses the following query:

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

1.  **Configure the visualization by navigating to the `Visualization` tab** 
    
    Make sure the `Map Data Options` are set to `table` and `current`.
1.  **In the `Field Mappings` section, set the `Table Query Format` to `Table`**
1.  **Map fields to variables** 
    
    Map the `Latitude Field` to the `latitude` variable, the `Longitude Field`
    to the `longitude` variable, and the `Metric` field to the `value` variable.
1.  **In the `Map Visual Options` section, set the `Min Circle Size` to `1`, and
    the `Max Circle Size` to `5`**
1.  **In the `Threshold Options` section, set the `Thresholds` to `2,5,10`** 
    
    This automatically configures a set of colors, which you can adjust later.

    <img class="main-content__illustration"
    width={1375} height={944}
    src="https://assets.iobeam.com/images/docs/screenshots-for-grafana-tutorial/grafana_worldmap_query_results.png"
    alt="Visualizing time series data in PostgreSQL using the Grafana Worldmap"/>

</Procedure>

[nyc-taxi]: /tutorials/:currentVersion:/nyc-taxi-cab
[grafana-website]: https://www.grafana.com
[install-grafana]: /use-timescale/:currentVersion:/integrations/observability-alerting/grafana/installation
[tutorial-grafana-dashboards]: /use-timescale/:currentVersion:/integrations/observability-alerting/grafana/create-dashboard-and-panel/
[tutorial-grafana-geospatial]: /use-timescale/:currentVersion:/integrations/observability-alerting/grafana/geospatial-dashboards/
[time-buckets]: /use-timescale/:currentVersion:/time-buckets/

