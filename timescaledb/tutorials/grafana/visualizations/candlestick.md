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

## What you will learn
This tutorial shows you how to:

*   [Create candlestick aggregates with raw data](#create-a-candlestick-with-raw-data)
*   [Include volume when querying with raw data](#include-volume-when-querying-from-raw-data)

## Prerequisites
Before you begin, make sure you have:

* Installed [Grafana][install-grafana] version&nbsp;8.5 or higher
* Installed [TimescaleDB][install-timescale]
* Imported the stock trade data from the [Getting Started Tutorial][gsg-data]

If you are new to Grafana, see the [Grafana tutorials][grafana-tutorials]
to get familiar with creating your first dashboard and visualizations. Also
see [this tutorial on adding variables to Grafana][variables-tutorial].

The examples in this section use these variables and Grafana functions:
* `$symbol`: a variable used to filter results by stock symbols.
* `$__timeFrom()::timestamptz` & `$__timeTo()::timestamptz`:
  Grafana variables. You change the values of these variables by
  using the dashboard's date chooser when viewing your graph.
* `$bucket_interval`: the interval size to pass to the `time_bucket`
  function when aggregating data.

## Create a candlestick with raw data
Create a candlestick visualization using the raw data in the table `stocks_real_time`.

<procedure>

### Create a candlestick with raw data

  1.  In the query editor, use this SQL to query a Candlestick dataset using specified bucket interval:
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
  1.  Click outside of the query editor/the refresh icon to 
      update the Grafana chart.

  1.  Select the candlestick as your visualization type
      
      <img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tutorials/visualizations/candlestick/candlestick_visualization.png" alt="Screenshot of the Grafana dashboard. The 'Visualizations' tab is focused. Underneath, 'Candlestick' shows as a visualization type."/>

  1.  Grafana turns the query into a candlestick chart that 
      looks like this:

      <img class="main-content__illustration" src="https://assets.timescale.com/docs/images/tutorials/visualizations/candlestick/1_min.png" alt="Screenshot of a candlestick chart in Grafana, showing the price distribution of $AMZN."/>

      In this first example, we set the $bucket_interval to 1-min, you can see the price of AMZN ranges between $2120 and $2200. This chart uses hyperfunctions to query the `stock_real_time` table, with a bucket interval of 1 minute. 

  </procedure>

  Retrieving this data took about 7+ seconds, over two weeks of data which is probably slower than most users would expect when analyzing data. This is where continuous aggregates are particularly useful for data-intensive, time-series applications. 

  <img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tutorials/visualizations/candlestick/raw_data_exec_time.png" alt="Screenshot of the Grafana query response."/>

  <procedure>

  With the use of the $bucket_interval variable, we are able to switch intervals. For example, switching to a 15-minute bucket interval gives you this data. 

  1.  Switch your bucket interval to 15-min from the dropdown
      
      <img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tutorials/visualizations/candlestick/timebucket_dropdown.png" alt="Screenshot of the Grafana variable dropdown."/>

  1.  Refresh the dashboard to get the updated chart
      
      <img class="main-content__illustration" src="https://assets.timescale.com/docs/images/tutorials/visualizations/candlestick/15_min.png" alt="Screenshot of the Grafana variable dropdown."/>

  These queries execution took about 6+ seconds, to decrease query execution time to sub-seconds it's suggested to use the continuous aggregates, which we will cover in a different section.

</procedure>

## Show transaction volumes in a candlestick plot

In addition to querying the transaction price of each stock, you can look at the traded volumes of the stock. This shows you how much people are trading a stock in a specified period. 

The `stock_real_time` hypertable contains a column with the daily cumulative traded volume. You can use this to calculate the volume of data for each bucket. 

Firstly, you find the maximum `day_volume` value for a symbol within a bucket, then subtract each maximum from the previous bucket's maximum. The difference gives the traded volume for that bucket.

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

Candlestick charts are a great way to visualize financial data. This tutorial shows you how to u
se TimescaleDB to generate candlestick values (open, high, low, close) from raw data in a
hypertable. It also shows you how to query the traded volume for each time interval. 

To see other examples of how you can use TimescaleDB and Grafana, check out
all the [Grafana tutorials][grafana-tutorials].

[install-grafana]: https://grafana.com/get/
[install-timescale]: /install/:currentVersion:/
[gsg-data]: /getting-started/:currentVersion:/add-data/
[grafana-tutorials]: /tutorials/grafana/
[max]: https://www.postgresql.org/docs/current/tutorial-agg.html
[lag]: https://www.postgresql.org/docs/current/functions-window.html
[time_bucket]: /api/:currentVersion:/hyperfunctions/time_bucket/
[variables-tutorial]: https://www.youtube.com/watch?v=h1eTIYOFplA
