---
title: Integrate Grafana and Timescale Cloud
excerpt: Use Grafana to visualize time-series data stored in a Timescale Cloud service
products: [cloud]
keywords: [Grafana, visualizations, analytics, monitoring]
---

import GrafanaConnect from "versionContent/_partials/_grafana-connect.mdx";

# Integrate Grafana and Timescale Cloud

You can use [Grafana](https://grafana.com/docs/) to monitor, visualize and perform analytics on data stored in your $SERVICE_LONG. 

This page shows you how to connect Grafana with a $SERVICE_LONG, create a dashboard and panel, then visualize geospatial data.

<GrafanaConnect />

## Create a Grafana dashboard and panel

Grafana is organized into dashboards and panels. A dashboard represents a
view into the performance of a system, and each dashboard consists of one or
more panels, which represent information about a specific metric related to
that system.

<Procedure>

1.  **Create a new dashboard**

    1. On the `Dashboards` page, click `New` and select `New dashboard`.

    1. Click `Save dashboard`. Give your dashboard a title, a description, and a folder to store it in, then click **Save**. 
    
    You now have an empty dashboard. 

1.  **Add a new panel**

    1. Open your dashboard and click `Add visualization`.
    
    1. Select from the list of pre-configured data sources or configure a new one.  

    1. Run your queries. You can edit the queries directly or use the built-in query editor. If you are visualizing time-series data, select
       `Time series` in the `Format` drop-down.

    1. Configure a title, a description, and other options for your panel, then click `Save dashboard`. 
    
    You now have a dashboard with one panel. Add more panels to a dashboard by clicking `Add` at the top right and selecting `Vizualization` from the drop-down. 

</Procedure>

## Use the time filter function

Grafana time-series panels include a time filter. 

<Procedure>

1. **Call `$__timefilter()` to link the user interface construct in a Grafana panel with the query.** 

   For example, to set the `pickup_datetime` column as the filtering range for your visualizations:

    ```sql
    SELECT
      --1--
      time_bucket('1 day', pickup_datetime) AS "time",
      --2--
      COUNT(*)
    FROM rides
    WHERE $__timeFilter(pickup_datetime)
    ```

1. **Group your visualizations and order the results by [time buckets][time-buckets].** 

   In this case, the `GROUP BY` and `ORDER BY` statements reference `time`.

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

</Procedure>

## Visualize geospatial data

Grafana includes a WorldMap visualization so you can see geospatial data
overlaid on a map. This can be helpful to understand how data
changes based on its location.

This section visualizes taxi rides in Manhattan, where the distance traveled
was greater than 5 miles. It uses the same query as the [NYC Taxi Cab][nyc-taxi]
tutorial as a starting point.

<Procedure>

1.  **In your Grafana dashboard, click `Add` > `Vizualization`.** 
1.  **Select `Geomap` in the visualization type drop-down.**
1.  **In the `Queries` tab, select your data source**
1.  **In the `Format` drop-down, select `Table`** 
1.  **In the mode switcher toggle `Code` and enter the query you want to use**
 
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

