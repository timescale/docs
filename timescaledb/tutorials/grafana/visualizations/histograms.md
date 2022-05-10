# How to build a histogram in Grafana

Histograms are a great way to graphically represent a distribution of discrete or  continuous data at a specific time or interval. However, they are unable to represent the change of data overtime (See [heatmaps](https://grafana.com/docs/grafana/latest/visualizations/heatmap/)). Histograms are very often used to analyze the spread/distribution of financial instruments and answer questions like:
- *"What is the distribution of the Meta stock price today?"*
- *"What was the transaction volume distribution of AMD stock last week?"* 
- *""What was the distribution of daily returns of the S&P in the past year?"*

Grafana has the ability to convert 3 distinct formats of data delivery into histograms.
Each comes with its own benefits and challenges.

1. **Raw data**
This method involves not pre-bucketing or aggregating data but instead returning all raw data points in a certain window. While this will increase the accuracy of the histogram, it requires more CPU and memory and network usage as all bucketing is done in the browser. This could lead to severe performance issues. 

2. **Pre-bucketed data**
This format contains data that has been pre-bucketed by the data-source. The grafana documentation refers to features built into Elasticsearch's histogram bucket aggregation or Prometheus' histogram metric as examples. The grafana documentation states that any data-source can output pre-bucketed data as long as it meets the data format requirements. 

<highlight type="important">
 Unfortunately, because the histogram panel is still in Beta, the documentation on what the data format looks like is currently unclear.
</highlight>

3. **Aggregated data**
Grafana also accepts aggregated time bucket data. Such data can be easily queried using Timescales time_bucket() hyperfunction. But it's worth noting this will also work with the date_trunc postgres function. Grafana will automatically select a bucket size (~10% of the total range of data) and bucket the aggregated data appropriately. 

## Prerequisites
In order to follow along with the examples below, you will need the following tools and datasets, all freely available with the provided links.

- Grafana v8.5.x or higher
- TimescaleDB (see [install options](https://docs.timescale.com/install/latest/))
- Import the stock trade data from the [TimescaleDB Getting Started Tutorial](https://docs.timescale.com/timescaledb/latest/getting-started/)

<highlight type="tip">
In the charting examples below we refer to Grafana features such as variables, time filters, and panel options. If you are new to Grafana, please see [our tutorials](https://docs.timescale.com/timescaledb/latest/tutorials/grafana/) to get familiar with creating your first dashboard and visualizations before using the examples below.
</highlight>

## Grafana Setup
In the queries below, we use the following Grafana variables and functions:
 - `$symbol`: a variable to filter results by a selected set of stock symbols
 - `$bucket_interval`: the interval size to pass to the `time_bucket()` function when aggregating data
 - `$__timeFrom()::timestamptz` & `$__timeTo()::timestamptz`: Grafana variables bound to the date chooser of a dashboard used to filter the overall results


## Price/Transactions Histogram with Raw Data
A common histogram for evaluating stock trade data is known as a Price/Transaction volume histogram. This helps us visualize the number of trades that occurred at a given price within a given time interval. The simplest way to do this is by selecting the raw transactions data from the `stocks_real_time` hypertable. 

Using the following query, we can select a specific stock from the dashboard variable using the specified time range of the dashboard.
```sql
SELECT time, 
    price
FROM stocks_real_time srt
WHERE symbol = '$symbol'
    AND time >= $__timeFrom()::timestamptz and time < $__timeTo()::timestamptz
ORDER BY time;
```
**Results:**
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
The key feature with any time-series data used by Grafana is that it must have a column named `time` with timestamp data. The other columns used for graphing data can have different names, but each time-series chart must have a `time` column in the results. For the Histogram visualization, the timestamp values must be in ascending order or you will receive an error.

Make sure to select "Histogram" as your visualization type.
<img class="main-content__illustration" src="https://assets.timescale.com/docs/images/tutorials/visualizations/histograms/histogram_panel_selection.png" alt="histogram panel selection"/>
Then Grafana should turn the query into a histogram similar to the one below:
<img class="main-content__illustration" src="https://assets.timescale.com/docs/images/tutorials/visualizations/histograms/simple_histogram.png" alt="simple histogram"/>
As you can see, the price of $AAPL ranges between $154 and $176 in this histogram.
Grafana automatically picks a bucket size for us, in this case $2.
What if we want to increase the granularity of our histogram? We can do that very easily by decreasing the bucket size in the panel options. 
<img class="main-content__illustration" src="https://assets.timescale.com/docs/images/tutorials/visualizations/histograms/bucket_size_option.png" alt="bucket size option"/>
Changing the bucket size from 2 to 0.1 results in the following histogram:
<img class="main-content__illustration" src="https://assets.timescale.com/docs/images/tutorials/visualizations/histograms/simple_histogram_with_bucket_size.png" alt="simple histogram with bucket size"/>
The histogram resembles the one with a bucket size of 2, but with much greater detail.

## Price/Transactions Histogram with aggregated data

In the previous example we queried raw data for Apple stock, which often trades ~40K times a day. This means our query returns more than 40k rows of data for Grafana to bucket every 30 seconds (the default Grafana refresh interval). This uses excessive CPU, memory, and network bandwidth. In extreme cases Grafana will show you the following message.
<img class="main-content__illustration" src="https://assets.timescale.com/docs/images/tutorials/visualizations/histograms/results_have_been_limited.png" alt="results have been limited"/>
This means Grafana has decided not to display all rows returned by the query. To solve this problem we can aggregate the time series data using the TimescaleDB `time_bucket()` hyperfunction. Notice that we need to add a new variable called `$bucket_interval` of type interval. 
<img class="main-content__illustration" src="https://assets.timescale.com/docs/images/tutorials/visualizations/histograms/bucket_interval_variable_options.png" alt="bucket interval variable options"/>
This query uses the $bucket_interval variable to aggregate the price for the selected interval:

```sql
SELECT time_bucket('$bucket_interval',time) as time,
    AVG(price) avg_price
FROM stocks_real_time srt
WHERE symbol = '$symbol'
    AND time >= $__timeFrom()::timestamptz and time < $__timeTo()::timestamptz
GROUP BY time_bucket('$date_range',time);
```

This query yields the following histogram:
<img class="main-content__illustration" src="https://assets.timescale.com/docs/images/tutorials/visualizations/histograms/time_bucket_histogram.png" alt="time bucket histogram"/>
The second histogram looks similar in shape to the example that uses raw transaction data, but
the query returns only around ~1k rows of data with each request. This reduces the amount of
data over the network and processing time in Grafana.

## Price/Transactions Multiple histograms in one panel
In this example we want to compare the distributions of two or more different stocks.
To get the desired effect we need to change our symbol variable from a text variable to a query variable with the multi-value option enabled.

Use this query to fetch all the companies in our dataset: 
```sql
SELECT DISTINCT symbol FROM company ORDER BY asc;
```
<img class="main-content__illustration" src="https://assets.timescale.com/docs/images/tutorials/visualizations/histograms/symbol_variable_query.png" alt="symbol variable query"/>
If we select more than one value, TimescaleDB returns the transactions for all selected values.
Grafana buckets those in separate histograms.

```sql
SELECT time_bucket('$bucket_interval',time) AS time, 
    symbol,
    AVG(price) AS avg_price
FROM stocks_real_time srt
WHERE symbol in ($symbol)
    AND time >= $__timeFrom()::timestamptz AND time < $__timeTo()::timestamptz
GROUP BY time_bucket('$bucket_interval',time), symbol;
```
When we visualize this query, we get the following histogram:
<img class="main-content__illustration" src="https://assets.timescale.com/docs/images/tutorials/visualizations/histograms/multiple_histograms.png" alt="multiple histograms"/>
We can clearly see the 3 distinct histograms but it's impossible to tell them apart from each
other. Click on the green line left of the legend and pick a color.
<img class="main-content__illustration" src="https://assets.timescale.com/docs/images/tutorials/visualizations/histograms/color_options.png" alt="color options"/>
Doing so results in the following panel:
<img class="main-content__illustration" src="https://assets.timescale.com/docs/images/tutorials/visualizations/histograms/colored_in_histogram.png" alt="colored in histogram"/>
Here we can clearly see the 3 different price distributions for each stock.

## Price/Volume Histogram
An interesting metric to investigate is the trade volume distribution. This distribution gives us
insight into the volume at which people buy a stock. The dataset has a column with the daily
cumulative volume which we can use to determine the individual transaction volume.
To calculate the volume of data for each bucket, we need to find the maximum `day_volume`
value for the symbol and then subtract each value from the previous bucket maximum value.
The difference of these two rows produces the volume within the bucket of time.
We can accomplish this with a slightly more complex query that pre-aggregates our data using
the TimescaleDB `time_bucket()` hyperfunction and the standard PostgreSQL `MAX()` function,
and then use the PostgresSQL `LAG()` window function to subtract each row from the previous,
ordered by `time` descending.
```sql
WITH buckets AS (
    SELECT time_bucket('$bucket_interval', time) AS time,
        symbol,
        MAX(day_volume) AS dv_max
    FROM stocks_real_time
    WHERE time >= $__timeFrom()::timestamptz AND time < $__timeTo()::timestamptz
        AND day_volume IS NOT NULL
        AND symbol in ($symbol)
    GROUP BY time_bucket('$bucket_interval', time), symbol
)
SELECT TIME,
    symbol,
    CASE WHEN lag(dv_max ,1) OVER (PARTITION BY symbol ORDER BY time) IS    NULL THEN dv_max
    WHEN (dv_max - lag(dv_max, 1) OVER (PARTITION BY symbol ORDER BY time)) < 0 THEN dv_max 
    ELSE (dv_max - lag(dv_max, 1) OVER (PARTITION BY symbol ORDER BY time)) END vol
FROM buckets;
```
This query results in the following histogram:
<img class="main-content__illustration" src="https://assets.timescale.com/docs/images/tutorials/visualizations/histograms/volume_distribution.png" alt="volume distribution"/>
As you can see, we get a left-skewed distribution for the AMZN symbol. In many cases there will
be outliers that represent a few very large volume transactions that distort the distribution. One
solution to this problem is to only look at transactions with a volume less than a certain threshold.
But that is outside the scope of this example.