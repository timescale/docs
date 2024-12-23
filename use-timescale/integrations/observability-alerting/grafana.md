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

1. **On the `Dashboards` page, click `New` and select `New dashboard`**

1. **Click `Add visualization`**

1. **Select the data source**

   Select your $SERVICE_LONG from the list of pre-configured data sources or configure a new one.

1. **Configure your panel** 

   Select the visualization type. The type defines specific fields to configure in addition to standard ones, such as the panel name. 

1. **Run your queries** 

   You can edit the queries directly or use the built-in query editor. If you are visualizing time-series data, select `Time series` in the `Format` drop-down.

1. **Click `Save dashboard`**
    
   You now have a dashboard with one panel. Add more panels to a dashboard by clicking `Add` at the top right and selecting `Visualization` from the drop-down. 

</Procedure>

## Use the time filter function

Grafana time-series panels include a time filter. 

<Procedure>

1. **Call `$__timefilter()` to link the user interface construct in a Grafana panel with the query** 

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

1. **Group your visualizations and order the results by [time buckets][time-buckets]** 

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

    ![Timescale and Grafana query results](https://assets.timescale.com/docs/images/grafana_query_results.png)

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

   ![Timescale and Grafana query results in time buckets](https://assets.timescale.com/docs/images/grafana_query_results_5m.png)

</Procedure>

## Visualize geospatial data

Grafana includes a Geomap panel so you can see geospatial data
overlaid on a map. This can be helpful to understand how data
changes based on its location.

This section visualizes taxi rides in Manhattan, where the distance traveled
was greater than 5 miles. It uses the same query as the [NYC Taxi Cab][nyc-taxi]
tutorial as a starting point.

<Procedure>

1. **Add a geospatial visualization**

   1.  In your Grafana dashboard, click `Add` > `Visualization`.

   1.  Select `Geomap` in the visualization type drop-down.

1. **Configure the data format**

   1.  In the `Queries` tab, select your data source.

   1.  In the `Format` drop-down, select `Table`.

   1.  In the mode switcher, toggle `Code` and enter the query, then click `Run`.
 
       For example:

       ```sql
       SELECT time_bucket('5m', rides.pickup_datetime) AS time,
              rides.trip_distance AS value,
              rides.pickup_latitude AS latitude,
              rides.pickup_longitude AS longitude
       FROM rides
       WHERE rides.trip_distance > 5
       GROUP BY time,
                rides.trip_distance,
                rides.pickup_latitude,
                rides.pickup_longitude
       ORDER BY time
       LIMIT 500;
       ```

1.  **Customize the Geomap settings** 
    
    With default settings, the visualization uses green circles of the fixed size. Configure at least the following for a more representative view:

    -`Map layers` > `Styles` > `Size` > `value`.

       This changes the size of the circle depending on the value, with bigger circles representing bigger values.

    - `Map layers` > `Styles` > `Color` > `value`.

    - `Thresholds` > Add `threshold`.

       Add thresholds for 7 and 10, to mark rides over 7 and 10 miles in different colors, respectively. 
    
       You now have a visualization that looks like this: 

       ![Timescale and Grafana integration](https://assets.timescale.com/docs/images/timescale-grafana-integration.png)
       

</Procedure>

[nyc-taxi]: /tutorials/:currentVersion:/nyc-taxi-cab
[grafana-website]: https://www.grafana.com
[install-grafana]: /use-timescale/:currentVersion:/integrations/observability-alerting/grafana/installation
[tutorial-grafana-dashboards]: /use-timescale/:currentVersion:/integrations/observability-alerting/grafana/#create-a-grafana-dashboard-and-panel
[tutorial-grafana-geospatial]: /use-timescale/:currentVersion:/integrations/observability-alerting/grafana/#visualize-geospatial-data
[time-buckets]: /use-timescale/:currentVersion:/time-buckets/

