# Build a histogram in Grafana
You can use a histogram to graphically represent a distribution of discrete or
continuous data at a specific time or interval. Histograms are often used to
analyze the spread or distribution of financial instruments.

You can use a histogram to answer questions like:

* What is the distribution of the Meta stock price today?
* What was the transaction volume distribution of AMD stock last week?
* What was the distribution of daily returns of the S&P in the past year?

You can use Grafana to convert 3 distinct formats of data delivery into
histograms. Each comes with its own benefits and challenges:

* Raw data: This method does not require pre-bucketing or aggregating of data.
  Instead, it returns all raw data points in a certain window. This increases
  the accuracy of the histogram, but requires more CPU, memory, and network
  usage, because all bucketing is done in the browser. This could lead to severe
  performance issues.
* Pre-bucketed data: This format contains data that has been pre-bucketed by the
  data source. The Grafana documentation refers to features built into Elastic
  Search's histogram bucket aggregation, or Prometheus' histogram metric as
  examples. The Grafana documentation states that any data source can output
  pre-bucketed data as long as it meets the data format requirements.
* Aggregated data: Grafana also accepts aggregated time bucket data. Such data
  can be easily queried using Timescale's `time_bucket()` hyperfunction. However, this also works with the `date_trunc` postgres function.
  Grafana will automatically select a bucket size (~10% of the total range of
  data) and bucket the aggregated data appropriately.

<highlight type="note">
Histograms are great for analyzing the spread or distribution of data, but they
don't show the change of data over time. If you need to see the distribution of your data over time, try a
[heatmap](https://grafana.com/docs/grafana/latest/visualizations/heatmap/)
instead.
</highlight>

## Prerequisites
Before you begin, make sure you have:

* Installed Grafana version&nbsp;8.5 or higher
* Installed [TimescaleDB][install-timescale]
* Imported the stock trade data from the [Getting Started Tutorial][gsg-data](https://docs.timescale.com/timescaledb/latest/getting-started/)

The examples in this section use these Grafana features and functions:
* `$symbol` is a variable to filter results by a selected set of stock symbols.
* `$bucket_interval` is the interval size to pass to the `time_bucket()`
  function when aggregating data.
* `$__timeFrom()::timestamptz` & `$__timeTo()::timestamptz` are Grafana
  variables bound to the date chooser of a dashboard used to filter the overall
  results.

If you are new to Grafana, see the
[Grafana tutorials][grafana-tutorials]
to get familiar with creating your first dashboard and visualizations before you
start.
## Create a price/transaction histogram with raw data
A common histogram for evaluating stock trade data is a price/transaction volume
histogram. This helps you visualize the number of trades that occurred at a
given price, within a given time interval. You can do this by selecting the raw
transactions data from the `stocks_real_time` hypertable.

<procedure>

### Creating a price/transaction histogram with raw data

1.  Select a specific stock from the dashboard variable, using the specified time range of the dashboard:

    ```sql
    SELECT time,
        price
    FROM stocks_real_time srt
    WHERE symbol = '$symbol'
        AND time >= $__timeFrom()::timestamptz and time < $__timeTo()::timestamptz
    ORDER BY time;
    ```

1.  The results look like this:

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

</procedure>

<!--- Lana, you're up to here! --LKB 2022-05-10 -->

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

[install-timescale]: /install/:currentVersion:/
[gsg-data]: /getting-started/:currentVersion:/
[grafana-tutorials]: /timescaledb/:currentVersion:/tutorials/grafana/
