# Build a time-series graph in Grafana 
A time-series graph is a line graph consisting series of data points in order on
cartesian coordinates. The X axis represents time and the Y axis represents the 
value of the data point. They are useful for visualizing trends and fluctuations 
in the data. The time-series graph is the most common type of graph in Grafana
and is therefore the default panel type.

They answer questions like:

* What is the hourly stock price of AMD today?
* How many users visited a website page each day in the past week?
* What was the temperature in yesterday?

## Data for Grafana time-series graphs 
To plot a time-series graph, Grafana requires you to provide a time column and 
the respective value column. To plot multiple time-series graphs in a single 
panel you need to provide multiple value columns.

This is an example of valid time-series data:
```bash
Time                | Value 1 | Value 2 |
--------------------+---------+---------+
2022-02-08 07:30:01 |      10 |       1 |
2022-02-08 07:31:01 |      15 |       2 |
2022-02-08 07:32:01 |      20 |       3 |
2022-02-08 07:33:01 |      25 |       4 |
2022-02-08 07:34:01 |      30 |       5 |
```

This tutorial shows you how to:
* Create a time-series graph from raw data
* Create a time-series graph from pre-aggregated data
* Create multiple time-series graphs in a single panel

## Prerequisites
Before you begin, make sure you have:
* Installed Grafana version&nbsp;8.5 or higher
* Installed [TimescaleDB][install-timescale]
* Imported the stock trade data from the [Getting Started Tutorial][gsg-data]

<highlight type="note">
    If you are new to Grafana, see the
    [Grafana tutorials](https://docs.timescale.com/timescaledb/latest/tutorials/grafana/)
    to get familiar with creating your first dashboard and visualizations before you
    start.
</highlight>


The examples in this section use these variables and Grafana functions:
* `$symbol`: a variable used to filter results by stock symbols.
* `$bucket_interval`: the interval size to pass to the `time_bucket`
  function when aggregating data.
* `$__timeFrom()::timestamptz` & `$__timeTo()::timestamptz`:
  Grafana variables. You change the values of these variables by
  using the dashboard's date chooser when viewing your graph.


## Create a time-series graph with raw data

A very common use-case of the time-series graph is displaying stock data. It 
lends itself well to this use-case as no additional computation is required to 
visualize the data. A time-series graph makes it easy to see if the value of a
stock is going up or down. 

<procedure>

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
    dashboard if desired. Keep in mind that we use a raw query, therefore large
    time ranges can be computationally expensive.

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

    The key feature with any time-series data used by Grafana is that it must 
    have a column named `time` with timestamp data. The other columns used for 
    graphing data can have different names, but each time-series chart must have 
    a `time` column in the results. For the Histogram visualization,
    the timestamp values must be in ascending order or you may receive an error.

1.  Select 'time series' as your visualization type.

    <img class="main-content__illustration" src="https://assets.timescale.com/docs/images/tutorials/visualizations/time-series/time-series-visualization-type.png" alt="Screenshot of the Grafana dashboard. The 'Visualizations' tab is focused. Underneath, 'Time-series' shows as a visualization type."/>

1.  Grafana returns this graph:

    <img class="main-content__illustration" src="https://assets.timescale.com/docs/images/tutorials/visualizations/time-series/simple-time-series-graph.png" alt="Screenshot of the time-series graph produced by Grafana. The graph represents the price of AMD in the past 6 hours."/>

</procedure>

## Create a time-series graph from pre-aggregated data
In the previous example, we queried for all transactions of AMD stock in a 6 
hour period which resulted in ~3 800 data points. If you query for transactions 
of AMD stock in a 3 month period, you get around 1,500,000 data points. It's not smart 
to graph this amount of rows every 30 seconds, which is the refresh interval 
default. This uses a lot of CPU, memory, and network bandwidth. In extreme cases
Grafana will freeze and require a restart.

To solve this problem you can pre-aggregate your data using TimescaleDB's 
[`time_bucket`][time_bucket] hyperfunction.

<procedure>

## Create a time-series graph from pre-aggregated data

1.  Add the `$bucket_interval` variable of type `Interval` to the Grafana dashboard

1.  In Grafana, create a new panel and add this query:

    ```sql
    SELECT time_bucket('$bucket_interval', time) AS time,
    	AVG(price) AS price
    FROM stocks_real_time
    WHERE symbol = '$symbol'
        AND time >= $__timeFrom()::timestamptz AND time < $__timeTo()::timestamptz
    GROUP BY time_bucket('$bucket_interval', time);
    ```   

1.  With a `bucket_interval` of 30 minutes and a date range of `Last 30 days`, Grafana
    returns this graph:

    <img class="main-content__illustration" src="https://assets.timescale.com/docs/images/tutorials/visualizations/time-series/time-bucket-graph.png" alt="Screenshot of the time-series graph produced by Grafana using the `time_bucket` hyperfunction. The graph represents the price of AMD stock in the past 30 days with an interval of 30 minutes."/>

    Because the stock market is only open from 9:30 AM to 4:00 PM on weekdays, 
    there are large gaps in our dataset where no data is present. Grafana 
    automatically connects the last non null to the nearest other non null value.
    In this case, the `time_bucket` hyperfunction doesn't return a row if there 
    is no data in the bucket. This stops you from using the `Connect null values`
    option in the options panel.

1.  In your query, replace `time_bucket` with `time_bucket_gapfill`.
   
    ```SQL
    SELECT time_bucket_gapfill('$bucket_interval', time) as time,
	    AVG(price) as price 
    FROM stocks_real_time
    WHERE symbol = '$symbol'
        AND time >= $__timeFrom()::timestamptz AND time < $__timeTo()::timestamptz
    GROUP BY time_bucket_gapfill('$bucket_interval', time);
    ```

    You can use [`time_bucket_gapfill`][time-bucket-gapfill] to circumvent the 
    issue of `time_bucket` not returning rows when the bucket is empty. Usually,
    `time_bucket_gapfill` is used in combination with [`LOCF`][locf] 
    ("Last Observation Carried Forward") but if you omit this function, 
    `time_bucket_gapfill` returns a null value which you can use to connect 
    values based on a threshold in Grafana.

1.  Set `Connect null values` in the options panel to `Threshold` with a value
    of `24h`.

    <img class="main-content__illustration" src="https://assets.timescale.com/docs/images/tutorials/visualizations/time-series/connect-null-values.png" alt="Screenshot of the 'Connect null values' in the time-series options panel. The selected value is 'Threshold' and it has a value of 24 h."/>

1. Grafana returns this graph:

    <img class="main-content__illustration" src="https://assets.timescale.com/docs/images/tutorials/visualizations/time-series/time-bucket-gapfill-graph.png" alt="Screenshot of the time-series graph produced by Grafana using the `time_bucket_gapfill` hyperfunction. The graph represents the price of AMD stock in the past 30 days with an interval of 30 minutes and null values for every gap larger than 24 hours"/>

    This graph allows you to better visualize the stock price during the week where
    it bridges the gap between 4 PM and 9:30 AM, but doesn't connect the values in
    the 48+ hour period during the weekend where there is no data present in the
    dataset.


</procedure>

[install-timescale]: /install/:currentVersion:/
[gsg-data]: /timescaledb/:currentVersion:/getting-started/
[time_bucket]: https://docs.timescale.com/api/latest/hyperfunctions/time_bucket/
[time-bucket-gapfill]: https://docs.timescale.com/api/latest/hyperfunctions/gapfilling-interpolation/time_bucket_gapfill/
[locf]: https://docs.timescale.com/api/latest/hyperfunctions/gapfilling-interpolation/locf/

