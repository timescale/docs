---
title: Build a candlestick chart in Grafana
excerpt: Create a candlestick chart in Grafana to visualize opening, closing, high, and low prices of financial assets
keywords: [Grafana, visualization, analytics, finance]
tags: [candlestick]
seo:
  metaImage: https://s3.amazonaws.com/assets.timescale.com/docs/images/meta-images/meta-image-grafana-candlestick.png
---

import GrafanaVizPrereqs from 'versionContent/_partials/_grafana-viz-prereqs.mdx';

# Build a candlestick chart in Grafana
Candlestick charts show the opening, closing, high, and low prices
of financial assets, such as stocks, currencies, and securities.
They are mainly used in technical analysis, to predict how prices will change.

They can answer questions like:

*   What are the open, close, high, and low prices of an asset on this day?
*   What is the spread between opening and closing prices over this time?
*   How is the price of this asset changing over time?
*   Is this asset entering bearish or bullish territory?

<img class="main-content__illustration" src="https://assets.timescale.com/docs/images/tutorials/visualizations/candlestick/candlestick_fig.png" alt="Diagram of a candlestick. The open and close prices define the ending positions of a central box. Lines extend from the box to show the high and low prices. The distance between open and close prices is called the real body. The distance between the central box and the high price is the upper shadow, and the distance between the box and the low price is the lower shadow."/>

The figure above shows the structure of a candlestick. A candlestick covers a
specific time interval, for example 5 minutes, 10 minutes, or 1 hour. For this
period, it plots four values:

* **Open**: The starting price
* **Close**: The closing price
* **High**: The highest price
* **Low**: The lowest price

A candlestick chart can show many candlesticks over time. This helps you see
patterns in the changing price of an asset. For example, you can tell whether an
asset is entering bullish or bearish territory, or whether its market activity is
topping or bottoming out.

This tutorial shows you how to:

*   [Create candlestick aggregates with raw data](#create-a-candlestick-with-raw-data)
*   [Show transaction volume when querying with raw data](#show-transaction-volumes-in-a-candlestick-plot)

## Prerequisites

<GrafanaVizPrereqs />

Check out this video for a step-by-step walk-through on creating
candlestick visualizations in Grafana:
<video url="https://www.youtube-nocookie.com/embed/08CydeL9lIk"/>

## Create a candlestick with raw data
Create a candlestick visualization using the raw data in the table `stocks_real_time`.

<procedure>

### Creating a candlestick with raw data

  1.  In the query editor, use this SQL to query a Candlestick dataset. Use the variable `$bucket interval`
      for the time period covered by each candlestick.
      ```sql
      SELECT
          time_bucket($bucket_interval, time) AS time,
          symbol,
          FIRST(price, time) AS "open",
          MAX(price) AS high,
          MIN(price) AS low,
          LAST(price, time) AS "close",
      FROM stocks_real_time
      WHERE symbol =  $symbol
          AND time > $__timeFrom()::timestamptz and time < $__timeTo()::timestamptz
      GROUP BY symbol;
      ```
  1.  Click outside of the query editor, or click the refresh icon to
      update the Grafana chart.

  1.  Select `candlestick` as your visualization type:

       <img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tutorials/visualizations/candlestick/candlestick_visualization.png" alt="Screenshot of the Grafana dashboard. The 'Visualizations' tab is focused. Underneath, 'Candlestick' shows as a visualization type."/>

  1.  Grafana turns the query into a candlestick chart that
      looks like this:

       <img class="main-content__illustration" src="https://assets.timescale.com/docs/images/tutorials/visualizations/candlestick/1_min.png" alt="Screenshot of a candlestick chart in Grafana, showing the price distribution of $AMZN."/>

       In this first example, with the `$bucket_interval` set to 1 minute, you
       can see the price of `AMZN` ranges between $2120 and $2200. This chart uses
       hyperfunctions to query the `stock_real_time` table, with a bucket
       interval of 1 minute.

</procedure>

Retrieving this data took about 7+ seconds, over two weeks of data which is
probably slower than most users would expect when analyzing data. This is where
continuous aggregates are particularly useful for data-intensive, time-series
applications.

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tutorials/visualizations/candlestick/raw_data_exec_time.png" alt="Screenshot of the Grafana query response."/>

<procedure>

  When you use the `$bucket_interval` variable, you can switch intervals. For
  example, switching to a 15 minute bucket interval gives you this data.

  1.  Switch your bucket interval to 15-min from the dropdown

      <img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tutorials/visualizations/candlestick/timebucket_dropdown.png" alt="Screenshot of the Grafana variable dropdown."/>

  1.  Refresh the dashboard to get the updated chart

      <img class="main-content__illustration" src="https://assets.timescale.com/docs/images/tutorials/visualizations/candlestick/15_min.png" alt="Screenshot of the Grafana variable dropdown."/>

The query execution took more than 6 seconds. To decrease query execution time to sub-seconds, use continuous aggregates. See the how-to guide on [continuous aggregrates][continuous-aggregrate] to learn more.

</procedure>

## Show transaction volumes in a candlestick plot

In addition to looking at the price changes for each stock, you can look at its traded volumes.
This shows you how much the stock is being traded during the bucket interval.

The `stock_real_time` hypertable contains a column with the daily cumulative traded volume. You can use this to calculate the volume of data for each bucket.

First, find the maximum `day_volume` value for a symbol within a bucket.
Then, subtract each maximum from the previous bucket's maximum. The
difference gives the traded volume for that bucket.

<procedure>

### Showing transaction volumes in a candlestick plot

1.  Create a new candlestick panel with the following query:
    ```sql
    SELECT
        time_bucket('$bucket_interval', time) AS time,
        symbol,
        FIRST(price, time) AS "open",
        MAX(price) AS high,
        MIN(price) AS low,
        LAST(price, time) AS "close",
        MAX(day_volume) - LAG(max(day_volume), 1) OVER(
          PARTITION BY symbol
          ORDER BY time_bucket('$bucket_interval', time)
        ) AS bucket_volume
    FROM stocks_real_time
    WHERE symbol =  $symbol
        AND time > $__timeFrom()::timestamptz and time < $__timeTo()::timestamptz
    GROUP BY time_bucket('$bucket_interval', time), symbol;
    ```

1.  Refresh the dashboard to get the updated chart.

     <img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tutorials/visualizations/candlestick/volume_Distribution.png" alt="Screenshot of Grafana candlestick showing the stock volume distribution and price for $AMZN."/>

    At the bottom of the plot, you see the trade volume for each time bucket.

</procedure>

In conclusion, candlestick charts are a great way to visualize financial data.
This tutorial shows you how to use TimescaleDB to generate candlestick values
that includes open, high, low, and close, from raw data in a hypertable. It also
shows you how to query the traded volume for each time interval.

To see other examples of how you can use TimescaleDB and Grafana, check out
all the [Grafana tutorials][grafana-tutorials].

[continuous-aggregrate]: /timescaledb/:currentVersion:/tutorials/financial-candlestick-tick-data/create-candlestick-aggregates/#create-candlestick-aggregates
[grafana-tutorials]: /timescaledb/:currentVersion:/tutorials/grafana/
