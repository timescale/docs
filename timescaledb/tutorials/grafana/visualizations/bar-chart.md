import GrafanaVizPrereqs from 'versionContent/_partials/_grafana-viz-prereqs.mdx';

# Build a bar chart in Grafana

A bar chart displays data using bars, each representing a specific category. A
bar chart is a great comparison tool for data visualization, as it's easy to see
which item's column or bar is longer or shorter. Bar charts use two axes:
vertical and horizontal. The longer a bar is, the greater its value. A bar chart
is a good way to compare items between different groups.

Bar charts can answer questions like:

* Which stock has the highest traded volume today?
* What was the transaction volume distribution of stocks last week?
* How many students in grade A are above a certain age range?

<!--- Do you have a diagram to use here? --LKB 2022-07-01-->

To plot a bar chart, Grafana requires only one data frame. You need to have at
least one string field, which is used as the category for an X or Y axis, and
one or more numerical fields. You can also provide multiple value columns, if
you want to plot multiple bar charts in a single panel.

This tutorial shows you how to:

* [Create a bar chart](https://docs.timescale.com/timescaledb/latest/tutorials/grafana/visualizations/bar-chart/#create-a-bar-chart-with-preaggregated-data)
  with pre-aggregated data using `time_bucket()`.
* [Create multiple bar charts](https://docs.timescale.com/timescaledb/latest/tutorials/grafana/visualizations/bar-chart/#create-multiple-bar-charts)
  in a single panel.
* [Create a stacked bar chart](https://docs.timescale.com/timescaledb/latest/tutorials/grafana/visualizations/bar-chart/#create-stacked-bar-chart)
  with pre-aggregated data.

There are a few different kinds of bar charts to choose from, including
vertical, horizontal, and stacked bar charts. All of these types are covered in
this tutorial.

## Prerequisites

<GrafanaVizPrereqs />

## Create a bar chart with preaggregated data

Create a bar chart visualization using the data in the table `stocks_real_time`.

<procedure>

### Creating a bar chat with preaggregated data

1. In the query editor, use this SQL to query a bar chart dataset. Use the
    variable `$bucket interval` for the time period covered by the bar chart:

    ```sql
    SELECT
        time_bucket('$bucket_interval', time) AS time,
        symbol,
        AVG(price) as price
    FROM stocks_real_time srt
    WHERE symbol = $symbol
        AND time >= $__timeFrom()::timestamptz AND time < $__timeTo()::timestamptz
    GROUP BY time_bucket('$bucket_interval', time), symbol;
    ```

1. In the Grafana dashboard, in the `Dashboard variable` field, select a stock
    to graph. Adjust the time range of the dashboard if needed. Make sure the
    returned data has column named `time` that contains timestamps. The
    timestamps should be in ascending order, you might get errors otherwise. The
    returned data looks like this:

    <img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tutorials/visualizations/barchart/Tabledataforgoogle.png" alt="Screenshot of the table view of valid time series data for google stock."/>

1. In the `Visualizations` field, select `Bar chart`. Grafana turns the query
    into a bar chart. This example shows a vertical bar chart price distribution
    of Google stock, which ranges between $2836 and $2108 within a specific
    period:

    <img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tutorials/visualizations/barchart/googlebarchart.png" alt="Screenshot of the vertical bar chart produced by Grafana. The vertical bar chart represents the price of Google in the past 2 months."/>

1. You can convert from a vertical bar chart to a horizontal one to get room
    for a longer label along the vertical axis. In the dashboard, navigate to
    the bar chart section. In the `Orientaton` section, click `horizontal`. The
    horizontal bar chart looks like this:

    <img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tutorials/visualizations/barchart/googlebarchart.png" alt="Screenshot of the horizontal bar chart produced by Grafana. The horizontal bar chart represents the price of google in the past 2 months."/>

</procedure>

## Create multiple bar charts

If you want compare the distributions of 4 or more different stocks, you can
create a panel containing multiple bar charts. The database returns the
transactions for all selected values, and Grafana buckets them in separate bar
charts.

<procedure>

### Creating multiple bar chart in a single panel

1. Fetch all company symbols from the dataset in the
   [Getting Started Tutorial][gsg-data] with this query:

   ```sql
    SELECT
        DISTINCT symbol FROM company ORDER BY symbol ASC;
    ```

1. In the Grafana dashboard, navigate to the settings page for your panel. In
   the `Variables` section:
   * In the `Name` field, give your symbol a name.
   * In the `Type` field, select `Query`.
   * In the `Selection options` field, enable `multi-value`.

1. At the psql prompt, update the earlier query to allow you to use multiple
   symbols. You can select as many symbols as you want to compare:

   ```sql
      SELECT
          time_bucket('$bucket_interval', time) AS time,
          symbol,
          AVG(price) as price
      FROM stocks_real_time srt
      WHERE symbol IN ($symbol)
          AND time >= $__timeFrom()::timestamptz AND time < $__timeTo()::timestamptz
      GROUP BY time_bucket('$bucket_interval', time), symbol;
      ```

1. In Grafana, refresh the dashboard. The returned data looks like this:

  <img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tutorials/visualizations/barchart/tableviewfivestockdata.png" alt="Screenshot of the table view of valid time series data for four different stocks."/>

  And the displayed graph looks like this:

  <img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tutorials/visualizations/barchart/multiplebarchart.png" alt="Screenshot of the multiple bar chart produced by Grafana. The multiple bar chart represents the price of four different stocks in the past 1 month."/>

1. In the graph you just created, you can see the 5 different stocks, but it is
   difficult to differentiate them. To tell them apart, you can adjust the color
   of each stock by clicking the legend to the left of each line, and picking a
   color for each bar:

  <img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tutorials/visualizations/barchart/multicoloredbarchart.png" alt="Screenshot of Grafana plot, showing 5 bar chart of stock values in green, blue, red, purple and orange."/>

</procedure>

## Create a stacked bar chart

You can use a stacked bar chart to show how different stock divides into smaller
categories, and what the relationship of each part has on the total amount.

The previous examples used vertical, horizontal, and multiple bar charts with
price transactions. In this section, you see the trading volume of each stock
using a bucket interval.

The `stock_real_time` hypertable contains a column with the daily cumulative
traded volume. This helps to calculate the volume of data for each bucket.

<procedure>

### Creating a stacked bar chart

1. At the psql prompt, update the earlier query to find the maximum `day_volume`
   value for a symbol within a bucket. Then, subtract each maximum from the
   previous bucket's maximum. The difference gives the traded volume for that
   bucket:

   ```sql
      SELECT
          time_bucket('$bucket_interval', time) AS time,
          symbol,
          MAX(day_volume) - LAG(max(day_volume), 1) OVER(
          PARTITION BY symbol
          ORDER BY time_bucket('$bucket_interval', time)
          ) AS bucket_volume
      FROM stocks_real_time srt
      WHERE symbol = $symbol
          AND time >= $__timeFrom()::timestamptz AND time < $__timeTo()::timestamptz
      GROUP BY time_bucket('$bucket_interval', time), symbol;
      ORDER BY time_bucket('$bucket_interval', time), symbol;
      ```

1. In the Grafana dashboard, convert your multiple bar chart to a stacked bar
   chart. In the symbol drop-down menu, select all the stocks you want to
   compare. On the right side of the panel, click the bar chart drop-down. In
   the `stacking` field, select `normal`, and refresh the panel. The stacked bar
   chart view shows a 1-day bucket with a 1-hour bucket interval. The volume
   calculation is valid mostly with the trading day:

  <img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tutorials/visualizations/barchart/stackedbarcharts.png" alt="Screenshot of Grafana dashboard, showing a stacked bar chart."/>

<highlight type="note">
If you go beyond a single trading day, you might get results that don't look
very good, or you might get no data returned. To fix this, focus your
calculation on a single trading day instead.
</highlight>

</procedure>

There are plenty of great ways to visualize data using TimescaleDB and Grafana,
check out the other
[Grafana visualization tutorials][grafana-tutorials].

[grafana-tutorials]: /timescaledb/:currentVersion:/tutorials/grafana/
[gsg-data]: /getting-started/:currentVersion:/
