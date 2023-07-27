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

In this tutorial, you'll build a simple dashboard, connect it to TimescaleDB,
and visualize data.

## Prerequisites

Before you begin, make sure you have:

*   [Installed TimescaleDB][install-timescale].
*   Set up Grafana.

When your installation of TimescaleDB and Grafana are complete, ingest the data
found in the [NYC Taxi Cab][nyc-taxi] tutorial and configure Grafana to connect
to that database.

## Build a new dashboard

Start by creating a new dashboard. In the far left of the Grafana user
interface, you'll see a `+` icon. If you hover over it, you'll see a `Create`
menu, within which is a `Dashboard` option. Select that `Dashboard` option.

After creating a new dashboard, you'll see a `New Panel` screen, with options
for `Add Query` and `Choose Visualization`. In the future, if you already have a
dashboard with panels, you can click the `+` icon at the top of the
Grafana user interface, which enables you to add a panel to an existing
dashboard.

To proceed with the tutorial, add a new visualization by clicking the `Choose
Visualization` option.

At this point, you'll have several options for different Grafana visualizations.
Choose the first option, the `Graph` visualization.

<img class="main-content__illustration" src="https://assets.iobeam.com/images/docs/screenshots-for-grafana-tutorial/grafana_visualizations.png" alt="Grafana visualizations to choose from"/>

There are multiple ways to configure the panel, but you can accept all the
defaults and create a simple `Lines` graph.

In the far left section of the Grafana user interface, select the 'Queries' tab.

<img class="main-content__illustration" src="https://assets.iobeam.com/images/docs/screenshots-for-grafana-tutorial/create_grafana_query.png" alt="How to create a new Grafana query"/>

Instead of using the Grafana query builder, edit the query directly. In the
view, click the `Edit SQL` button at the bottom.

<img class="main-content__illustration" src="https://assets.iobeam.com/images/docs/screenshots-for-grafana-tutorial/edit_sql_in_grafana.png" alt="Edit custom SQL queries in Grafana"/>

Before you can begin authoring your query, you also want to set the query database
to the New York City taxi cab dataset you connected to earlier:

<img class="main-content__illustration" src="https://assets.iobeam.com/images/docs/screenshots-for-grafana-tutorial/set_data_source.png" alt="Switching data sources in Grafana"/>

<Highlight type="note">
If you are visualizing time series data in Grafana, make sure you select
`Time series` from the `Format As` drop down in the query builder.
</Highlight>

### Visualize metrics stored in TimescaleDB

Start by creating a visualization that answers the question "How many
rides took place on each day?" from the [NYC Taxi Cab][nyc-taxi] tutorial.

From the tutorial, you can see the standard SQL syntax for our query:

```sql
SELECT date_trunc('day', pickup_datetime) AS day,
  COUNT(*)
FROM rides
GROUP BY day
ORDER BY day;
```

You need to alter this query to support Grafana's unique query syntax.

#### Modifying the SELECT statement

First, modify the `date_trunc` function to use the TimescaleDB `time_bucket`
function. You can consult the TimescaleDB
[API Reference on time_bucket][time-bucket-reference]
for more information on how to use it properly.

Take a look at the `SELECT` portion of this query. First, bucket the results
into one day groupings using the `time_bucket` function. If you set the `Format`
of a Grafana panel to be `Time series`, for use in the graph panel for example,
then the query must return a column named `time` that returns either an SQL
`datetime` or any numeric datatype representing a Unix epoch.

So, part 1 of this new query is modified so that the output of the `time_bucket`
grouping is labeled `time` as Grafana requires, while part 2 is unchanged:

```sql
SELECT
  --1--
  time_bucket('1 day', pickup_datetime) AS "time",
  --2--
  COUNT(*)
FROM rides
```

#### The Grafana timeFilter function

Grafana time-series panels include a tool that lets you filter on a given time
range, called a time filter. Not surprisingly, Grafana has a way to link the
user interface construct in a Grafana panel with the query itself; in this case,
the `$__timefilter()` function.

In this example of a modified query, use the `$__timefilter()` function to set
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

#### Referencing elements in the query

Finally, you can group your visualizations by the time buckets you've selected,
and order the results by the time buckets as well. So, the `GROUP BY` and
`ORDER BY` statements reference `time`.

With these changes, this is the final Grafana query:

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

<img class="main-content__illustration" src="https://assets.iobeam.com/images/docs/screenshots-for-grafana-tutorial/grafana_query_results.png" alt="Visualizing time-series data in Grafana"/>

<Highlight type="note">
Remember to set the time filter in the upper right corner of your Grafana
dashboard. If you're using the pre-built sample dataset for this example, you
can set your time filter around January 1, 2016.
</Highlight>

Currently, the data is bucketed into 1 day groupings. Adjust the `time_bucket`
function to be bucketed into 5 minute groupings instead and compare the graphs:

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

<img class="main-content__illustration" src="https://assets.iobeam.com/images/docs/screenshots-for-grafana-tutorial/grafana_query_results_5m.png" alt="Visualizing time-series data in Grafana"/>

### Summary

Complete your Grafana knowledge by following all the TimescaleDB + Grafana tutorials.

[install-timescale]: /getting-started/latest/
[nyc-taxi]: /tutorials/:currentVersion:/nyc-taxi-cab
[time-bucket-reference]: /api/:currentVersion:/hyperfunctions/time_bucket
