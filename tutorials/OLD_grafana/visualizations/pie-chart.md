---
title: Build a pie chart in Grafana
excerpt: Plot a pie chart in Grafana to compare values between categories
products: [cloud, mst, self_hosted]
keywords: [Grafana, visualization, analytics]
tags: [pie chart]
---

import GrafanaVizPrereqs from 'versionContent/_partials/_grafana-viz-prereqs.mdx';

# Build a pie chart in Grafana

Pie charts are used to plot categorized data. The chart presents each
category as a slice of a pie, so you can see its contribution to the total.
It is good to note that, with more slices, the chart becomes harder to analyze, and
with very similar, small slices, it becomes harder to compare slice sizes. Use
pie charts for a small number of categories, and consider another chart type when
you have large amounts of data.

Pie charts can answer questions like:

*   Which was the least traded stock volume last month?
*   Which stock has the highest traded stock today?
*   Who had the highest percentage of accrued votes in the last election?

This tutorial shows you how to:

*   Create a pie chart with pre-aggregated data using
    `time_bucket()`.
*   Create a donut chart to show volume of stock transactions.

A pie chart can be in the traditional pie style or in donut style. Both display the
same information. This tutorial shows you how to create both.

## Prerequisites

<GrafanaVizPrereqs />

## Create a pie chart with pre-aggregated data

Create a pie chart visualization using the data in the table `stocks_real_time`.

<Procedure>

### Creating a pie chat with pre-aggregated data

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

    <img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tutorials/visualizations/piechart/piecharttabledata2.png" alt="Screenshot of the table view of valid time-series data for stocks."/>

1.  In the `Visualizations` field, select `Pie chart`. Grafana turns the query
    into a pie chart. This example shows a pie chart price distribution of
    JPM, IBM, AAPL, AMD, and CVS stocks which has 20%, 23%, 25%,
    15%, and 17%, respectively, within a specific period. The returned data
    has lots of information, but only the first values for each stock are
    displayed, because of the options selected in the calculation field.

    <img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tutorials/visualizations/piechart/piecharttable2view.png" alt="Screenshot of the pie chart produced by Grafana. The pie chart represents the price of five different stocks in 3 months, and the percentage of each makes up of the total sum."/>

1.  You can change how your data is displayed by changing the value options for `Show`.
    The `Calculate` option, used in the previous step, reduces each time series to a single
    value. The `All values` option shows every value from every series. Select `All values`
    to see the difference.

    <img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tutorials/visualizations/piechart/datadisplaytype.png" alt="Screenshot of the all values shown in pie chart produced by Grafana. The pie chart represents the price of selected stocks in the past 3 months."/>

1.  The new chart looks like this. Note that each stock has multiple slices to
    represent it, corresponding to each row in your table. The number of slices
    is limited to 40:

   <img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tutorials/visualizations/piechart/piechart2.png" alt="Screenshot of the all values shown in pie chart produced by Grafana. The pie chart represents the price of selected stocks in the past 3 months."/>

</Procedure>

## Create a donut chart with volume transactions

A donut chart is a pie chart with the middle cut out. Compared to a pie chart,
it can be easier to compare segments on a donut chart because the human eye
is better at comparing the lengths of arcs. Otherwise, they're exactly the same.

Follow this section to create a donut chart displaying the average transaction
volume of each stock within a bucket interval. The transaction volume per
bucket is calculated from the daily cumulative traded volume, which is available
in the `stocks_real_time` hypertable.

<Procedure>

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

1.  Refresh the panel. The donut chart view shows the percentage of trading volume
    for a 10-minute bucket, averaged over the entire day:

   <img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tutorials/visualizations/piechart/donutchart.png" alt="Screenshot of Grafana dashboard, showing a donut chart."/>


<Highlight type="note">
If you go beyond a single trading day, you might get results that don't look
very good, or you might get no data returned. To fix this, focus your
calculation on a single trading day instead.
</Highlight>

</Procedure>

Pie charts are a great tool for comparing categorized data. They're especially good
for visualizing percentages. But they don't work as well if you have too many categories
with similar percentages or large amount of data.

[gsg-data]: https://docs.timescale.com/getting-started/latest/time-series-data/
