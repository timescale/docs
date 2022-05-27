# Creating a Grafana dashboard and panel

Grafana is organized into 'Dashboards' and 'Panels'. A dashboard represents a view
onto the performance of a system, and each dashboard consists of one or more panels,
which represents information about a specific metric related to that system.

In this tutorial, you'll build a simple dashboard, connect it to TimescaleDB, and visualize
data.

### Prerequisites

To complete this tutorial, you need a cursory knowledge of the Structured Query
Language (SQL). The tutorial walks you through each SQL command, but it is
helpful if you've seen SQL before.

* To start, [install TimescaleDB][install-timescale].
* Next [setup Grafana][install-grafana].

Once your installation of TimescaleDB and Grafana are complete, ingest the data found
in the [NYC Taxi Cab][nyc-taxi] tutorial and configure Grafana to connect
to that database. Be sure to follow the full tutorial if you're interested in background
on how to use TimescaleDB.

### Build a new dashboard

Start by creating a new dashboard. In the far left of the Grafana user
interface, you'll see a '+' icon. If you hover over it, you'll see a 'Create' menu,
within which is a 'Dashboard' option. Select that 'Dashboard' option.

After creating a new dashboard, you'll see a 'New Panel' screen, with options
for 'Add Query' and 'Choose Visualization'. In the future, if you already have a
dashboard with panels, you can click on the '+' icon at the **top** of the Grafana user
interface, which enables you to add a panel to an existing dashboard.

To proceed with our tutorial, let's add a new visualization by clicking on the 'Choose
Visualization' option.

At this point, you'll have several options for different Grafana visualizations.
Choose the first option, the 'Graph' visualization.

<img class="main-content__illustration" src="https://assets.iobeam.com/images/docs/screenshots-for-grafana-tutorial/grafana_visualizations.png" alt="Grafana visualizations to choose from"/>

There are multiple ways to configure our panel, but you can accept all the defaults
and create a simple 'Lines' graph.

In the far left section of the Grafana user interface, select the 'Queries' tab.

<img class="main-content__illustration" src="https://assets.iobeam.com/images/docs/screenshots-for-grafana-tutorial/create_grafana_query.png" alt="How to create a new Grafana query"/>

Instead of using the Grafana query builder, edit the query directly. In the
view, click on the 'Edit SQL' button at the bottom.

<img class="main-content__illustration" src="https://assets.iobeam.com/images/docs/screenshots-for-grafana-tutorial/edit_sql_in_grafana.png" alt="Edit custom SQL queries in Grafana"/>

Before we can begin authoring our query, we also want to set the Query database to the New
York City taxi cab datasource we connected to earlier:

<img class="main-content__illustration" src="https://assets.iobeam.com/images/docs/screenshots-for-grafana-tutorial/set_data_source.png" alt="Switching data sources in Grafana"/>

### Visualize metrics stored in TimescaleDB

Let's start by creating a visualization that answers the question **How many rides took place on each day?**
from the [NYC Taxi Cab][nyc-taxi] tutorial.

From the tutorial, you can see the standard SQL syntax for our query:

```sql
SELECT date_trunc('day', pickup_datetime) AS day,
  COUNT(*)
FROM rides
GROUP BY day
ORDER BY day;
```

We need to alter this query to support Grafana's unique query syntax.

#### Modifying the SELECT statement

First, modify the `date_trunc` function to use the TimescaleDB `time_bucket`
function. You can consult the TimescaleDB [API Reference on time_bucket][time-bucket-reference]
for more information on how to use it properly.

Let's examine the `SELECT` portion of this query. First, bucket the results into
one day groupings using the `time_bucket` function. If you set the 'Format' of a Grafana
panel to be 'Time series', for use in Graph panel for example, then the query must return
a column named `time` that returns either a SQL `datetime` or any numeric datatype
representing a Unix epoch.

So, part 1 of this new query is modified so that the output of the `time_bucket` grouping
is labeled `time` as Grafana requires, while part 2 is unchanged:

```sql
SELECT
  --1--
  time_bucket('1 day', pickup_datetime) AS "time",
  --2--
  COUNT(*)
FROM rides
```

#### The Grafana \_\_timeFilter function

Grafana time-series panels include a tool that enables the end-user to filter on a given
time range, like a "time filter". Not surprisingly, Grafana has a way to link the
user interface construct in a Grafana panel with the query itself. In this case,
the `$__timefilter()` function.

In the modified query below, use the `$__timefilter()` function
to set the `pickup_datetime` column as the filtering range for our visualizations.

```sql
SELECT
  --1--
  time_bucket('1 day', pickup_datetime) AS "time",
  --2--
  COUNT(*)
FROM rides
WHERE $__timeFilter(pickup_datetime)
```

#### Referencing elements in our query

Finally, we want to group our visualization by the time buckets we've selected,
and we want to order the results by the time buckets as well. So, our `GROUP BY`
and `ORDER BY` statements reference `time`.

With these changes, this is our final Grafana query:

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

When we visualize this query in Grafana, we see the following:

<img class="main-content__illustration" src="https://assets.iobeam.com/images/docs/screenshots-for-grafana-tutorial/grafana_query_results.png" alt="Visualizing time-series data in Grafana"/>

<highlight type="tip">
 Remember to set the time filter in the upper right corner of your Grafana dashboard.
 If you're using the pre-built sample dataset for this example, you can set
 your time filter around January 1st, 2016.
</highlight>

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

Complete your Grafana knowledge by following [all the TimescaleDB + Grafana tutorials][tutorial-grafana].

[install-timescale]: /install/latest/
[install-grafana]: /tutorials/grafana/installation
[nyc-taxi]: /tutorials/nyc-taxi-cab
[time-bucket-reference]: /api/:currentVersion:/hyperfunctions/time_bucket
[tutorial-grafana]: /tutorials/grafana
