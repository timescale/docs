---
title: Create a Grafana dashboard and panel
excerpt: Visualize your data in Grafana
products: [cloud, mst, self_hosted]
keywords: [Grafana, visualizations, analytics]
---

# Creating a Grafana dashboard and panel

Grafana is organized into `Dashboards` and `Panels`. A dashboard represents a
view into the performance of a system, and each dashboard consists of one or
more panels, which represents information about a specific metric related to
that system.

## Create a new Grafana dashboard and panel

Start by creating a new dashboard.

<Procedure>

### Creating a new Grafana dashboard and panel

1.  Hover your mouse over the `+` icon in the far left of the Grafana user
    interface to bring up a `Create` menu. Select `Dashboard`. When you new
    dashboard is created, you'll see a `New Panel` screen, with options for
    `Add Query` and `Choose Visualization`. In the future, if you already have a
    dashboard with panels, you can click the `+` icon at the top of the Grafana
    user interface to add a panel to an existing dashboard.
1.  Click `Choose Visualization` to add a new panel. There are several options
    for different Grafana visualizations. This example uses the `Graph`
    visualization.
1.  There are multiple ways to configure the panel, but you can accept all the
    defaults to create a simple `Lines` graph.
1.  In the far left section of the Grafana user interface, navigate to the
    `Queries` tab.
1.  Set the query database to the dataset you are using.
1.  You can edit the query directly, or use the built-in query editor.

    <Highlight type="note">
    If you are visualizing time series data in Grafana, make sure you select
    `Time series` from the `Format As` drop down in the query builder.
    </Highlight>

</Procedure>

## The time filter function

Grafana time-series panels include a tool that lets you filter on a given time
range, called a time filter. Grafana allows you to link the user interface
construct in a Grafana panel with the query itself using the `$__timefilter()`
function.

This example of a modified query uses the `$__timefilter()` function to set
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

## Referencing elements in the query

You can group your visualizations by the time buckets you've selected,
and order the results by the time buckets as well. So, the `GROUP BY` and
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

You can adjust the `time_bucket` function and compare the graphs, like this:

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
