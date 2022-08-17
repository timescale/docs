---
title: Build a pie chart in Grafana
excerpt: Plot a pie chart in Grafana to compare values between categories
keywords: [Grafana, visualization, analytics]
tags: [pie chart]
---

import GrafanaVizPrereqs from 'versionContent/_partials/_grafana-viz-prereqs.mdx';

# Build a pie chart in Grafana

Pie charts are mostly used when dealing with group or categorized data.
As the name suggests, the pie-shaped chart represents the whole data,
divided into multiple parts or slices. Each piece of the pie represents
a subcategory of the complete data.

Pie charts can answer questions like:

*   Which was the least traded stock volume last month?
*   Which stock has the highest traded stock today?
*   Who had the highest percentage of accrued votes in the last election?

This tutorial shows you how to:

*   [Create a pie chart](https://docs.timescale.com/timescaledb/latest/tutorials/grafana/visualizations/pie-chart/#create-a-pie-chart-with-preaggregated-data)
  with pre-aggregated data using `time_bucket()`.
*   [Create transaction volume with raw data](https://docs.timescale.com/timescaledb/latest/tutorials/grafana/visualizations/pie-chart/#create-transaction-volume-with-raw-data)
  using a donut chart.

When displaying data using a pie chart, there are two kinds of styles to consider
in Grafana: the pie and the donut display shown in the tutorial.

## Prerequisites

<GrafanaVizPrereqs />

## Create a pie chart with preaggregated data

Create a pie chart visualization using the data in the table `stocks_real_time`.

<procedure>

### Creating a pie chat with preaggregated data

1.  In the query editor, use this SQL to query a pie chart dataset. Use the
    variable `$bucket interval` for the time period covered by the pie chart:

    ```sql
    SELECT
        time_bucket('$bucket_interval', time) AS time,
        symbol,
        AVG(price) AS price
    FROM stocks_real_time srt
    WHERE symbol IN ($symbol)
        AND time >= $__timeFrom()::timestamptz AND time < $__timeTo()::timestamptz
    GROUP BY time_bucket('$bucket_interval', time), symbol
    ORDER BY time_bucket('$bucket_interval', time), symbol;
    ```

1.  Fetch all company symbols from the dataset in the
   [Getting Started Tutorial][gsg-data] with this query:

   ```sql
    SELECT
        DISTINCT symbol FROM company ORDER BY symbol ASC;
    ```

1.  In the Grafana dashboard, navigate to the settings page for your panel. In
   the `Variables` section:

*   In the `Name` field, give your symbol a name.
*   In the `Type` field, select `Query`.
*   In the `Selection options` field, enable `multi-value`.

1.  In the Grafana dashboard, in the `Dashboard variable` field, select the stocks
    to graph. Adjust the time range of the dashboard if needed. Make sure the
    returned data has a column named `time` that contains timestamps. The
    timestamps should be in ascending order. Otherwise, you get an error. The
    returned data looks like this:

    <img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tutorials/visualizations/piechart/tabledata1.png" alt="Screenshot of the table view of valid time-series data for stocks."/>

1.  In the `Visualizations` field, select `Pie chart`. Grafana turns the query
    into a pie chart. This example shows a pie chart price distribution of JPM, IBM, AAPL, AMD, and CVS stocks which has 22%, 23%, 24%, 15%, and 16%, respectively, within a specific period. The returned data had lots of data, but only the lowest values for each stock were displayed because it was the selected option in the calculation field.

    <img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tutorials/visualizations/piechart/pie+chart.png" alt="Screenshot of the pie chart produced by Grafana. The pie chart represents the price and percentage of Google in the past 3 months."/>

1.  How data is displayed depends on how the value options are refined on the dashboard.
    There are two  options for choosing how much information is displayed: Calculate, which reduces each value to a single series, and All values, which shows every value from a single series.
    Displaying all the values from the returned data, select ‘all value’ in the value option, show specific fields to display and the limit of the returned data:

    <img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tutorials/visualizations/piechart/datadisplaytype.png" alt="Screenshot of the all values shown in pie chart produced by Grafana. The pie chart represents the price of selected stocks in the past 3 months."/>

1.  The new chart looks like this, with a limit of 40:

   <img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tutorials/visualizations/piechart/piechart2.png" alt="Screenshot of the all values shown in pie chart produced by Grafana. The pie chart represents the price of selected stocks in the past 3 months."/>

</procedure>

## Create a donut chart with volume transactions

A  donut chart is just a pie chart with the middle cut out. People favor them because the human eye often finds it easier to differentiate when looking at arcs not slices. A donut can help you compare respective categories or dimensions to the larger whole. Each donut arc has the same width but a different length. So when you compare which one is greater, you only have to make one point of comparison—which has a longer length?

In this section, we will display the traded volume of how much the stock is being traded with a bucket interval.
The stock_real_time hypertable contains a column with the daily cumulative traded volume. This helps to calculate the volume of data for each bucket.

To calculate this, find the maximum day_volume value for a symbol within a bucket. Then, subtract each maximum from the previous bucket's maximum. The difference gives the traded volume for that bucket.

<procedure>

### Creating donut chart with volume transactions

1.  At the psql prompt, update the earlier query to find the maximum `day_volume`
   value for a symbol within a bucket. Then, subtract each maximum from the
   previous bucket's maximum. The difference gives the traded volume for that
   bucket:

   ```sql
      SELECT
          time_bucket('$bucket_interval', time) AS time,
          symbol,
          MAX(day_volume) - LAG(MAX(day_volume), 1) OVER(
              PARTITION BY symbol
              ORDER BY time_bucket('$bucket_interval', time)
          ) AS bucket_volume
      FROM stocks_real_time srt
      WHERE symbol = $symbol
          AND time >= $__timeFrom()::timestamptz AND time < $__timeTo()::timestamptz
      GROUP BY time_bucket('$bucket_interval', time), symbol;
      ORDER BY time_bucket('$bucket_interval', time), symbol;
      ```

1.  In the Grafana dashboard, convert your pie chart to a donut
   chart. In the symbol drop-down menu, select all the stocks you want to
   compare. On the right side of the panel, click the pie chart drop-down. In
   the `piechart type` field, select `donut`:

  <img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tutorials/visualizations/piechart/piecharttype.png" alt="Screenshot of Grafana dashboard, showing pie chart."/>

1.  Refresh the panel. The donut chart view shows This shows the percentage of trading volume 
    for a 10-minute bucket, averaged over the entire day. The volume calculation is valid mostly with the trading day:

   <img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tutorials/visualizations/piechart/donutchart.png" alt="Screenshot of Grafana dashboard, showing a donut chart."/>


<highlight type="note">
If you go beyond a single trading day, you might get results that don't look
very good, or you might get no data returned. To fix this, focus your
calculation on a single trading day instead.
</highlight>

</procedure>

Pie charts are a good comparison tool for data visualization. They can be used to convey your data pictorially and aesthetically, but they don’t work well with data with similar-value categories. This is because when we divide the data into many slices, the similarity makes it hard to differentiate them. Also, the more the number of categories increases, the more the number of slices increases and the more complex the chart is to analyze. This makes pie charts unfitting for large amounts of data.

There are plenty of great ways to visualize data using TimescaleDB and Grafana,
check out the other
[Grafana visualization tutorials][grafana-tutorials].

[grafana-tutorials]: /timescaledb/:currentVersion:/tutorials/grafana/
[gsg-data]: /getting-started/:currentVersion:/
