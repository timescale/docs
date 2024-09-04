---
title: Build a histogram in Grafana
excerpt: Create a histogram in Grafana to visualize the distribution of data
products: [cloud, mst, self_hosted]
keywords: [Grafana, visualization, analytics]
tags: [histogram]
---

import GrafanaVizPrereqs from 'versionContent/_partials/_grafana-viz-prereqs.mdx';

# Build a histogram in Grafana

Histograms show how data is distributed. You can use one to graph the number of
data points that fall into buckets on some scale. For example, histograms are
often used to show the spread of financial instruments.

They can answer questions like:

*   What is the distribution of the Meta stock price today?
*   What was the transaction volume distribution of AMD stock last week?
*   What was the distribution of daily returns of the S&P500 in the past year?

## Data for Grafana histograms

With Grafana, you can plot a histogram by providing data in 1 of 3
formats. Each comes with its own benefits and challenges:

*   **Raw data**: This method does not require you to pre-bucket
  or pre-aggregate the data.
  It increases histogram accuracy. But it requires more CPU,
  memory, and network usage, because all bucketing is done in the
  browser. This could lead to severe
  performance issues.
*   **Pre-bucketed data**: You need to configure the data source to
  pre-bucket your data. According to the Grafana documentation, any
  source can output pre-bucketed data for a histogram, as long as it
  meets the data format requirements. For example, it suggests that you
  can use Elastic Search's histogram bucket aggregation or
  Prometheus' histogram metric.
*   **Aggregated data**: Grafana also accepts pre-aggregated
  time-bucket data. You can aggregate your data using
  TimescaleDB's `time_bucket` function or PostgreSQL's
  `date_trunc` function. To create the histogram, Grafana further
  buckets the aggregated data. It automatically selects a bucket size,
  which is about 10% of your data's total range.

<Highlight type="note">
Histograms are great for analyzing the spread or distribution of data, but they
don't show the change of data over time. If you need to see the distribution of
your data over time, try a heatmap instead.
</Highlight>

## What you'll learn

This tutorial shows you how to:

*   Create a price/transaction histogram from raw data
*   Create a price/transaction histogram from pre-aggregated data
*   Create a panel showing multiple histograms
*   Create a price/volume histogram

## Prerequisites

<GrafanaVizPrereqs />

Check out this video for a step-by-step walk-through on creating
histograms in Grafana:
<Video url="https://www.youtube-nocookie.com/embed/h1eTIYOFplA"/>

## Create a price/transaction histogram with raw data

A common histogram for evaluating stock trade data is a price/transaction volume
histogram. This shows the number of trades occurring at a
given price range, within some time interval. To make this
histogram, select the raw
transactions data from the `stocks_real_time` hypertable.

<Procedure>

### Creating a price/transaction histogram with raw data

1.  Add this query to a Grafana dashboard:

    ```sql
    SELECT time,
        price
    FROM stocks_real_time srt
    WHERE symbol = '$symbol'
        AND time >= $__timeFrom()::timestamptz AND time < $__timeTo()::timestamptz
    ORDER BY time;
    ```

1.  Select a stock from the dashboard variable. Adjust the time range of
    your dashboard if desired.

1.  The returned data looks like this:

    ```bash
    time                         |price   |
    -----------------------------+--------+
    2022-03-02 17:01:07.000 -0700|  166.33|
    2022-03-02 17:01:26.000 -0700|165.8799|
    2022-03-02 17:01:31.000 -0700|165.8799|
    2022-03-02 17:01:46.000 -0700|  166.43|
    2022-03-02 17:02:22.000 -0700|  166.49|
    2022-03-02 17:02:40.000 -0700|166.6001|
                 …               |   …    |
    ```

    The key feature with any time-series data used by Grafana is that it must
    have a column named `time` with timestamp data. The other columns used for
    graphing data can have different names, but each time-series chart must have
    a `time` column in the results. For the Histogram visualization,
    the timestamp values must be in ascending order or you will receive an error.

1.  Select "Histogram" as your visualization type.

    <img class="main-content__illustration" src="https://assets.timescale.com/docs/images/tutorials/visualizations/histograms/histogram_panel_selection.png" alt="Screenshot of the Grafana dashboard. The 'Visualizations' tab is focused. Underneath, 'Histogram' shows as a visualization type."/>

1.  Grafana turns the query into a histogram that looks like this:

    <img class="main-content__illustration" src="https://assets.timescale.com/docs/images/tutorials/visualizations/histograms/simple_histogram.png" alt="Screenshot of a histogram in Grafana, showing the price distribution of $AAPL."/>

    The histogram shows that the price of $AAPL ranges between $154 and $176.
    Grafana automatically picks a bucket size for us, in this case $2.

1.  To increase the granularity of the histogram, change the bucket size from 2 to 0.1.

    <img class="main-content__illustration" src="https://assets.timescale.com/docs/images/tutorials/visualizations/histograms/bucket_size_option.png" alt="Screenshot of the histogram drop-down menu in Grafana. The 'bucket size' input field has a value of 0.1."/>

1.  The histogram now looks similar, but shows more detail.

    <img class="main-content__illustration" src="https://assets.timescale.com/docs/images/tutorials/visualizations/histograms/simple_histogram_with_bucket_size.png" alt="Screenshot of a histogram in Grafana, showing the price distribution of $AAPL in buckets of $1."/>

</Procedure>

## Create a price/transaction histogram with aggregated data

The previous example queried raw data for Apple stock, which often trades around
40,000 times a day. The query returns more than 40,000 rows of data for Grafana
to bucket every refresh interval, which is 30 seconds by default. This uses a
lot of CPU, memory, and network bandwidth. In extreme cases, Grafana shows the
message:
`Results have been limited to 1000000 because the SQL row limit was reached`

This means Grafana is not displaying all rows returned by the query. To
solve this problem, pre-aggregate the data in your query using the TimescaleDB
`time_bucket` function. With `time_bucket`, you need to add a new variable
called `bucket_interval`.

<Procedure>

### Creating a price/transaction histogram with pre-aggregated data

1.  In Grafana, add a new variable called `$bucket_interval`, of type `INTERVAL`.

    {/* vale Google.Units = NO */}

    <img class="main-content__illustration" src="https://assets.timescale.com/docs/images/tutorials/visualizations/histograms/bucket_interval_variable_options.png" alt="Grafana screenshot showing the Variables > Edit dialog. The variable name is 'bucket_interval', the type is 'interval', and values for interval options have been given from 10s to 30d."/>

    {/* vale Google.Units = YES */}

1.  Use the `$bucket_interval` variable to aggregate the price for
    the selected interval:

    ```sql
    SELECT time_bucket('$bucket_interval', time) AS time,
        AVG(price) avg_price
    FROM stocks_real_time srt
    WHERE symbol = '$symbol'
        AND time >= $__timeFrom()::timestamptz AND time < $__timeTo()::timestamptz
    GROUP BY time_bucket('$bucket_interval', time);
    ```

1.  This query yields the following histogram:

    <img class="main-content__illustration" src="https://assets.timescale.com/docs/images/tutorials/visualizations/histograms/time_bucket_histogram.png" alt="Screenshot of a histogram in Grafana, showing the price distribution of $AAPL."/>

    This second histogram looks similar to the example that uses raw
    transaction data. But the query returns only around 1000 rows of data with
    each request. This reduces the network load and Grafana processing time.

</Procedure>

## Create a panel with multiple price/transaction histograms

To compare the distributions of 2 or more different stocks, create a panel with
multiple histograms. Change the `$symbol` variable from a text variable to a
query variable, and enable the multi-value option. This allows you to select
more than one value for `$symbol`. The database returns the transactions for all
selected values, and Grafana buckets them in separate histograms.

<Procedure>

### Creating a panel with multiple price/transaction histograms

1.  Fetch all company symbols from the dataset:

    ```sql
    SELECT DISTINCT symbol FROM company ORDER BY symbol ASC;
    ```

1.  Create a new dashboard variable with the previous query:

    <img class="main-content__illustration" src="https://assets.timescale.com/docs/images/tutorials/visualizations/histograms/symbol_variable_query.png" alt="Screenshot of Grafana showing the Variables > Edit dialog. The variable name is 'symbol', and its type is 'Query'. The Query input field has been filled out with the query from Step 1."/>

1.  Update the main query to the following:

    ```sql
    SELECT time_bucket('$bucket_interval', time) AS time,
        symbol,
        AVG(price) AS avg_price
    FROM stocks_real_time srt
    WHERE symbol IN ($symbol)
        AND time >= $__timeFrom()::timestamptz AND time < $__timeTo()::timestamptz
    GROUP BY time_bucket('$bucket_interval', time), symbol
    ORDER BY time;
    ```

1.  This query results in the following histograms:

    <img class="main-content__illustration" src="https://assets.timescale.com/docs/images/tutorials/visualizations/histograms/multiple_histograms.png" alt="Screenshot of overlaid Grafana histograms, showing the price distributions of 3 stocks. All 3 histograms are in green."/>

    You can clearly see the 3 distinct histograms but it's impossible to tell
    them apart from each other.

1.  Click the green line at the left side of the legend and pick a color:

    <img class="main-content__illustration" src="https://assets.timescale.com/docs/images/tutorials/visualizations/histograms/color_options.png" alt="Screenshot of the Grafana color picker."/>

1.  The plot clearly shows the 3 price distributions in different colors:

    <img class="main-content__illustration" src="https://assets.timescale.com/docs/images/tutorials/visualizations/histograms/colored_in_histogram.png" alt="Screenshot of Grafana plot, showing 3 histograms of stock values in blue, red, and green."/>

</Procedure>

## Create a price/volume histogram

Besides transaction price, you can also look at trade volumes. The distribution
of trade volume shows you how often and how much people are buying a stock.

The `stocks_real_time` hypertable contains a column with the daily cumulative
volume. You can use this to calculate the volume of data for each bucket. First,
find the maximum `day_volume` value for a symbol within a bucket. Then subtract
each maximum from the previous bucket's maximum. The difference equals the
volume for that bucket.

You can do this with a pre-aggregation query, using:

*   TimescaleDB's [`time_bucket`][time_bucket] function.
*   PostgreSQL's [`max`][max] function.
*   PostgreSQL's [`lag`][lag] function. Use this to subtract each from the
    previous, when the rows are ordered by descending `time`.

<Procedure>

### Creating a price/volume histogram

1.  Create a new histogram panel with the following query:

    ```sql
    WITH buckets AS (
        SELECT time_bucket('$bucket_interval', time) AS time,
            symbol,
            MAX(day_volume) AS dv_max
        FROM stocks_real_time
        WHERE time >= $__timeFrom()::timestamptz AND time < $__timeTo()::timestamptz
            AND day_volume IS NOT NULL
            AND symbol IN ($symbol)
        GROUP BY time_bucket('$bucket_interval', time), symbol
    )
    SELECT TIME,
        symbol,
        CASE WHEN lag(dv_max ,1) OVER (PARTITION BY symbol ORDER BY time) IS NULL THEN dv_max
        WHEN (dv_max - lag(dv_max, 1) OVER (PARTITION BY symbol ORDER BY time)) < 0 THEN dv_max
        ELSE (dv_max - lag(dv_max, 1) OVER (PARTITION BY symbol ORDER BY time)) END vol
    FROM buckets
    ORDER BY time;
    ```

1.  This query results in the following histogram:

    <img class="main-content__illustration" src="https://assets.timescale.com/docs/images/tutorials/visualizations/histograms/volume_distribution.png" alt="Screenshot of Grafana histogram showing the stock volume distribution for $AMZN."/>

    The plot shows a left-skewed distribution for the AMZN symbol. For many
    symbols, you might see a distorted distribution, due to outliers
    representing a few very large volume transactions. There are 2 solutions:
    *   Limit your query to transactions with volumes less than a certain
        threshold.
    *   Use a logarithmic scale. Unfortunately these are not yet supported in
        Grafana histogram panels.

</Procedure>

[lag]: <https://www.postgresql.org/docs/14/functions-window.html>
[max]: <https://www.postgresql.org/docs/current/tutorial-agg.html>
[time_bucket]: /api/:currentVersion:/hyperfunctions/time_bucket/
