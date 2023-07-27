---
title: Build a time-series graph in Grafana
excerpt: Create a time-series graph to show values changing over time
products: [cloud, mst, self_hosted]
keywords: [Grafana, visualizations, analytics]
tags: [time-series]
---

import GrafanaVizPrereqs from 'versionContent/_partials/_grafana-viz-prereqs.mdx';

# Build a time-series graph in Grafana

A time-series graph is a line graph that plots points changing over time. It
allows you to see trends and fluctuations in your data. It's usually plotted in
two dimensions. The x-axis represents time, and the y-axis represents the
value of your data.

Because the time-series graph is the most common graph in Grafana, it's also
the default panel type.

With a time-series graph, you can answer questions like:

*   What is the hourly stock price of AMD today?
*   How many users visited a website page each day in the past week?
*   What was the temperature yesterday?

## Data for Grafana time-series graphs

To plot a time-series graph, Grafana requires you to provide a time column and
a value column. To plot multiple time-series graphs in a single
panel, you need to provide multiple value columns.

This is an example of valid time-series data:

```bash
Time                | Value_1 | Value_2 |
--------------------+---------+---------+
2022-02-08 07:30:01 |      10 |       1 |
2022-02-08 07:31:01 |      15 |       2 |
2022-02-08 07:32:01 |      20 |       3 |
2022-02-08 07:33:01 |      25 |       4 |
2022-02-08 07:34:01 |      30 |       5 |
```

This tutorial shows you how to:

*   Create a time-series graph with raw data
*   Create a time-series graph with pre-aggregated data using time_bucket()
*   Create multiple time-series graphs in a single panel

## Prerequisites

<GrafanaVizPrereqs />

Check out this video for a step-by-step walk-through on creating
time-series graphs in Grafana:
<Video url="https://www.youtube-nocookie.com/embed/uRgKwcL6lDQ"/>

## Create a time-series graph with raw data

A very common use case of the time-series graph is displaying stock data. The
graph makes it easy to see if the value of a stock is going up or down. Also, no
extra calculations are needed to make the graph.

<Procedure>

### Creating a time-series graph with raw data

1.  Add the `$symbol` variable of type `Text box` to the Grafana dashboard.

1.  In Grafana, create a new panel and add this query:

    ```SQL
    SELECT time,
        price
    FROM stocks_real_time
    WHERE symbol = '$symbol'
        AND time >= $__timeFrom()::timestamptz AND time < $__timeTo()::timestamptz
    ORDER BY time;
    ```

1.  Enter `AMD` in the `symbol` variable. Adjust the time range of your
    dashboard if desired. This plot uses a raw query, so if you set a large
    time range, it might take a long time for Grafana to get all the rows and
    display the data.

1.  When 'Table view' is selected, the returned data looks like this:

    ```bash
    time                | price |
    --------------------+--------+
    2022-02-08 06:38:21 |  123  |
    2022-02-08 06:38:28 |  123  |
    2022-02-08 06:39:18 |  123  |
    2022-02-08 06:39:56 |  123  |
                …       |   …   |
    ```

    Check that your data meets Grafana's requirements for graphing time series.
    The data must have a column named `time`, containing timestamps. Other
    columns can be named as you like. For the time-series visualization, the
    timestamps must be in ascending order. Otherwise, you get an error.

1.  Select `Time series` as your visualization type.

    <img class="main-content__illustration" src="https://assets.timescale.com/docs/images/tutorials/visualizations/time-series/time-series-visualization-type.png" alt="Screenshot of the Grafana dashboard. The 'Visualizations' tab is focused. Underneath, 'Time-series' shows as a visualization type."/>

1.  Grafana returns a graph that looks similar to this:

    <img class="main-content__illustration" src="https://assets.timescale.com/docs/images/tutorials/visualizations/time-series/simple-time-series-graph.png" alt="Screenshot of the time-series graph produced by Grafana. The graph represents the price of AMD in the past 6 hours."/>

</Procedure>

## Create a time-series graph from pre-aggregated data using time_bucket()

In the previous example, you queried for all transactions of AMD stock in a 6 -hour period.
This returned approximately 3 800 data points. If you query for all transactions
of AMD stock in a 3-month period, you get approximately 1,500,000 data
points.

Grafana, like many charting tools, doesn't perform well when plotting millions of points.
Also, by default, Grafana refreshes dashboards every 30 seconds. This further strains
CPU, memory, and network bandwidth. In extreme cases, Grafana freezes.

To solve this problem, you can pre-aggregate your data using TimescaleDB's
[`time_bucket`][time_bucket] hyperfunction.

<Procedure>

## Creating a time-series graph from pre-aggregated data using time_bucket()

1.  Add the `$bucket_interval` variable of type `Interval` to the Grafana dashboard.

1.  In Grafana, create a new panel and add this query:

    ```sql
    SELECT time_bucket('$bucket_interval', time) AS time,
     AVG(price) AS price
    FROM stocks_real_time
    WHERE symbol = '$symbol'
        AND time >= $__timeFrom()::timestamptz AND time < $__timeTo()::timestamptz
    GROUP BY time_bucket('$bucket_interval', time)
    ORDER BY time;
    ```

1.  With a `bucket_interval` of 30 minutes and a date range of `Last 30 days`,
    Grafana returns this graph:

    <img class="main-content__illustration" src="https://assets.timescale.com/docs/images/tutorials/visualizations/time-series/time-bucket-graph.png" alt="Screenshot of the time-series graph produced by Grafana using the `time_bucket` hyperfunction. The graph represents the price of AMD stock in the past 30 days with an interval of 30 minutes."/>

    Because the stock market is only open from 9:30&nbsp;AM to 4:00&nbsp;PM on
    weekdays, there are large gaps in the dataset where there is no data.
    Grafana automatically connects the last non-null value to the nearest other
    non-null value. This creates the long, straight, almost-horizontal lines you
    see in the graph.

1.  To circumvent this issue, you can use Grafana's `Connect null values`
    settings. But first, you need rows containing null values wherever you have
    no data. By default, `time_bucket` doesn't return a row if there is no data.
    In your query, replace `time_bucket` with [`time_bucket_gapfill`](/api/latest/hyperfunctions/gapfilling/time_bucket_gapfill/).
    If you don't specify a gapfilling function, `time_bucket_gapfill` returns a
    row with a null value wherever there is no data.

1.  In your query, replace `time_bucket` with `time_bucket_gapfill`.

    ```SQL
    SELECT time_bucket_gapfill('$bucket_interval', time) AS time,
     AVG(price) AS price
    FROM stocks_real_time
    WHERE symbol = '$symbol'
        AND time >= $__timeFrom()::timestamptz AND time < $__timeTo()::timestamptz
    GROUP BY time_bucket_gapfill('$bucket_interval', time)
    ORDER BY time;
    ```

1.  In the options panel, set `Connect null values` to `Threshold`. Give
    `Threshold` a value of `24h`.

    <img class="main-content__illustration" src="https://assets.timescale.com/docs/images/tutorials/visualizations/time-series/connect-null-values.png" alt="Screenshot of the 'Connect null values' in the time-series options panel. The selected value is 'Threshold' and it has a value of less than 24 hours."/>

1.  Grafana returns a graph similar to this one:

    <img class="main-content__illustration" src="https://assets.timescale.com/docs/images/tutorials/visualizations/time-series/time-bucket-gapfill-graph.png" alt="Screenshot of the time-series graph produced by Grafana using the `time_bucket_gapfill` hyperfunction. The graph represents the price of AMD stock in the past 30 days with an interval of 30 minutes and null values for every gap larger than 24 hours"/>

    This graph allows you to better visualize the stock price during the week.
    It bridges the less-than-24-hour gap between 4:00&nbsp;PM and 9:30&nbsp;AM,
    but doesn't connect the values over the weekend.

</Procedure>

## Create multiple time-series graphs in a single panel

If you want to compare the price of two stocks over time, you could make
two separate panels with 2 separate symbol variables. A better alternative is to
combine the two time-series graphs into a single panel. To do this,
change the `$symbol` variable to a multi-value answer and make a slight
change to your query.

<Procedure>

## Creating multiple time-series graphs in a single panel

1.  Change the `$symbol` variable to the `Query` type.

    <img class="main-content__illustration" src="https://assets.timescale.com/docs/images/tutorials/visualizations/time-series/symbol-query-type.png" alt="A screenshot of the 'symbol' variable settings. The variable type option has 'Query' selected."/>

1.  In the query options, add the following query. In the selection options,
    select `Multi-Value`.

    ```SQL
    SELECT DISTINCT(symbol) FROM company ORDER BY symbol ASC;
    ```

1.  Under `Preview of values`, you see a handful of company symbols ordered
    alphabetically.

    <img class="main-content__illustration" src="https://assets.timescale.com/docs/images/tutorials/visualizations/time-series/preview-values.png" alt="A screenshot of the 'Preview of values' in the 'symbol' variable settings. A handful of company symbols are displayed."/>`

1.  In the dashboard panel, change the query to allow for multi-value answers:

    ```SQL
    SELECT time_bucket_gapfill('$bucket_interval', time) AS time,
        AVG(price) AS price,
        symbol
    FROM stocks_real_time
    WHERE symbol IN ($symbol)
        AND time >= $__timeFrom()::timestamptz AND time < $__timeTo()::timestamptz
    GROUP BY time_bucket_gapfill('$bucket_interval', time), symbol
    ORDER BY time;
    ```

1.  Select multiple stocks from the symbol variables

    <img class="main-content__illustration" src="https://assets.timescale.com/docs/images/tutorials/visualizations/time-series/select-stock.png" alt="A screenshot of the symbol variable selector. The symbols 'AAPL' and 'AMD' are selected."/>

1.  Grafana returns a graph similar to this one:

    <img class="main-content__illustration" src="https://assets.timescale.com/docs/images/tutorials/visualizations/time-series/multi-value-graph.png" alt="A screenshot of the multi-value time-series graph produced by Grafana. This graph displays the stock price for 'AAPL' in green and 'AMD' in yellow for the past 30 days."/>

</Procedure>

[time_bucket]: /api/:currentVersion:/hyperfunctions/time_bucket/
