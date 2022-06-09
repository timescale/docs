# Build a candlestick chart in Grafana
Candlestick charts help you visualize the opening, closing, high, and low prices 
of securities, currencies, and other financial assets for the given time period. 
It is mainly used in technical analysis. 

They can answer questions like 

* What is the relationship between opening and closing prices of an asset in a given time frame?
* How can one identify patterns in the changing price of an asset?
* What is the open, close, high, and low price of an asset today? 
* How to determine whether an asset is entering bearish or bullish territory?

   <img class="main-content__illustration" src="https://assets.timescale.com/docs/images/tutorials/visualizations/candlestick/candlestick_fig.png" alt="Screenshot of candlestick description."/>

Candlestick charts use 4 different aggregations over a specific time interval: open, high, low, and close values. 

* **Open**: The starting value of a given period.

* **High**: The highest value of a given period.

* **Low**: The lowest value of a given period.

* **Close**: The final value of a given period.

These values are used by the candlestick panel to visualize your data. 

A candlestick chart shows a clear relationship between the opening and closing prices in a given time frame: 5-minute, 10-minute, 1-hour, etc.  Within a given time period, candlestick charts enable people to quickly identify patterns in the changing price of an asset. 
For example, candlestick charts can identify whether an asset is entering the bullish or bearish territory, if the market activity for an asset is topping or bottoming out, or other characteristics that can help traders identify trends.  

## What you will learn
This tutorial shows you how to:

*   [Create candlestick aggregates with raw data](#create-a-candlestick-with-raw-data)
*   [Include volume when querying with raw data](#include-volume-when-querying-from-raw-data)

## Prerequisites
Before you begin, make sure you have:

* Installed [Grafana][install-grafana] version&nbsp;8.5 or higher
* Installed [TimescaleDB][install-timescale]
* Imported the stock trade data from the [Getting Started Tutorial][gsg-data]

If you are new to Grafana, see the
[Grafana tutorials][grafana-tutorials]
to get familiar with creating your first dashboard and visualizations before you
start.

The examples in this section use these variables and Grafana functions:
* `$symbol`: a variable used to filter results by stock symbols.
* `$__timeFrom()::timestamptz` & `$__timeTo()::timestamptz`:
  Grafana variables. You change the values of these variables by
  using the dashboard's date chooser when viewing your graph.
* `$bucket_interval`: the interval size to pass to the `time_bucket`
  function when aggregating data.

To learn more about adding variables to Grafana, be sure to check out this tutorial

## Create a candlestick with raw data
Once you have the data and completed the prerequisites, we can create a Candlestick visualization using the raw stock tick data in the table `stocks_real_time`.

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

<highlight type="note">
To add variables to Grafana and set up new panel, see this [tutorial](https://www.youtube.com/watch?v=h1eTIYOFplA)
instead.
</highlight>


## Include volume when querying from raw data

In addition to querying the transaction price of each stock, you can look at the traded volumes of the stock. This shows you how much people are trading a stock in a specified period. 

The `stock_real_time` hypertable contains a column with the daily cumulative traded volume. You can use this to calculate the volume of data for each bucket. 

Firstly, you find the maximum `day_volume` value for a symbol within a bucket, then subtract each maximum from the previous bucket's maximum. The difference gives the traded volume for that bucket.

<procedure>

### Include volume when querying from raw data

1.  Create a new candlestick panel with the following query:
    ```sql
    SELECT
    time_bucket('$bucket_interval', time) AS time,
    symbol,
    FIRST(price, time) AS "open",
    MAX(price) AS high,
    MIN(price) AS low,
    LAST(price, time) AS "close",
    MAX(day_volume) - LAG(max(day_volume), 1) over (partition by symbol order by time_bucket('$bucket_interval', time)) AS bucket_volume
    FROM stocks_real_time
    WHERE symbol =  $symbol
    AND time > $__timeFrom()::timestamptz and time < $__timeTo()::timestamptz
    GROUP BY time_bucket('$bucket_interval', time), symbol;
    ```

1.  Refresh the dashboard to get the updated chart
    
     <img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tutorials/visualizations/candlestick/volume_Distribution.png" alt="Screenshot of Grafana candlestick showing the stock volume distribution and price for $AMZN."/>

    From the image, we can see the traded volume for this particular time bucket for AMZN stock.

</procedure>

Candlestick charts are a great way to visualize financial data. This tutorial showed you how to use TimescaleDB to generate the candlestick values (open, high, low, close) from the raw hypertable. Also, how you can query the traded volume of a particular time bucket. 

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
