# Query your data

With TimescaleDB, there's no need to learn a custom query language. **TimescaleDB
supports full SQL**. You can use your SQL knowledge along with the rich 
ecosystem of PostgreSQL tools and add the extra features and performance of
TimescaleDB.

Here are some query examples so you can get familiar with using SQL alongside
popular TimescaleDB functions.

## Basic SQL queries

<highlight type="tip">
Many of the queries below show a filter for the last four days of data. This 
accountS for the nuance of stock trade data which only occurs Monday thru Friday
on the New York Stock Exchange.

If you load the data on a Monday, the most recent data that we can provide you
is from Friday afternoon. Therefore, selecting data for the last day would return
no data.

Feel free to adjust the time frame based on the data that you downloaded and to
explore other time-ranges in the data that we provide.
</highlight>

### Select all stock data from the last four days

   To select all the stock data from the previous four days, use the [`WHERE`][clause-expressions] 
   clause to filter the result using a relative time interval. We use an interval of
   four days below in case the

   ```sql
   SELECT * FROM stocks_real_time srt
   WHERE time > now() - INTERVAL '4 days';
   ```

### Select the most recent 10 trades for Amazon in order

   Use the [`ORDER BY`][order-by] clause to define the order of results from your
   query. With stock trade data, there are often multiple trades each second for
   popular stocks like Amazon. Therefore, we cannot order data descending
   by the `time` alone. This is a common problem with high-frequency data like stocks,
   crypto, and IoT metrics. Therefore, we need to order by additional information to correctly display
   the order in which trades were made with the exchange.
   
   For the `stocks_real_time` data, the `day_volume` column serves as additional
   information to help us order the trades correctly, even when there are multiple
   trades per second. The `day_volume` value increases by the number of stocks 
   traded with each tick.

   ```sql
   SELECT * FROM stocks_real_time srt
   WHERE symbol='AMZN'
   ORDER BY time DESC, day_volume desc
   LIMIT 10;  


   time                         |symbol|price    |day_volume|
   -----------------------------+------+---------+----------+
   2022-05-04 14:11:32.000 -0400|AMZN  |2429.1191|   3134115|
   2022-05-04 14:11:28.000 -0400|AMZN  |  2428.53|   3133809|
   2022-05-04 14:11:28.000 -0400|AMZN  |  2428.53|   3133644|
   2022-05-04 14:11:28.000 -0400|AMZN  |  2428.53|   3133638|
   2022-05-04 14:11:28.000 -0400|AMZN  |  2428.53|   3133602|
   2022-05-04 14:11:18.000 -0400|AMZN  |  2426.83|   3132536|
   2022-05-04 14:11:18.000 -0400|AMZN  |  2426.83|   3132009|
   2022-05-04 14:11:18.000 -0400|AMZN  |  2426.83|   3131887|
   2022-05-04 14:11:18.000 -0400|AMZN  |  2426.83|   3131848|
   2022-05-04 14:11:18.000 -0400|AMZN  |  2426.83|   3131844|
   ```

   Notice that there are multiple trades every second, but we know that the order
   of trades is correct because the `day_volume` column is ordered correctly.

### Calculate the average trade price for Apple from the four days

   Use the [`avg()`][average] function with a `WHERE` clause
   to only include trades for Apple stock within the last 4 days. 
   You can use the [`JOIN`][join] operator to fetch results based on the name of 
   a company instead of the symbol.

   ```sql
   SELECT
       avg(price)
   FROM stocks_real_time srt
   JOIN company c ON c.symbol = srt.symbol
   WHERE c.name = 'Apple' AND time > now() - INTERVAL '4 days';
   ```


## Advanced TimescaleDB SQL functions

Timescale has many custom-built SQL functions to help you perform time-series
analysis in fewer lines of code. Here's how to use three of these functions:

 * [first()][first]: find the earliest value based on a time within an aggregate group
 * [last()][last]: find the latest value based on time within an aggregate group
 * [time_bucket()][time-bucket]: bucket data by arbitrary time intervals and calculate aggregates over those intervals

### Get the first and last value with first() and last() functions

   The `first()` and `last()` functions retrieve the first and last value of one
   column when ordered by another. 
   
   For example, our stock data has a timestamp column `time` and numeric column `price`,
   you can use `first(price, time)` to get the first value in the `price` column when ordered 
   with respect to an increasing `time` column. 

   In this query, you use both the `first()` and `last()` functions to find the 
   first and last trading price for each company for the last three days.

   ```sql
   SELECT symbol, first(price,time), last(price, time)
   FROM stocks_real_time srt
   WHERE time > now() - INTERVAL '3 days'
   GROUP BY symbol
   ORDER BY symbol;

   symbol|first   |last    |
   ------+--------+--------+
   AAPL  |  156.26|  160.79|
   ABBV  |  145.38|  150.32|
   ABNB  |  152.08|  148.05|
   ABT   |   113.5|  112.88|
   ADBE  |   391.2|  403.94|
   AMAT  |  109.72|113.0464|
   AMD   |  84.938|  93.585|
   AMGN  |   233.3|  233.11|
   ...   |   ...  |    ... |
   ```

### Aggregate by an arbitrary length of time using time_bucket

   The `time_bucket()` function enables you to take a time column and “bucket” the values 
   based on an interval of your choice. Typically, you _bucket_ time so that you can perform
   an aggregation over the chosen interval. 
   
   For example, consider a table that records incrementing values every hour. To
   aggregate the daily totals of the values, you can
   use the `time_bucket()` function on the `time` column to _bucket_ the hourly 
   data into daily data and then perform a `sum()` on the `value` column to get 
   the total sum of your values across each day. 

   <img class="main-content__illustration"
    src="https://s3.amazonaws.com/assets.timescale.com/docs/images/getting-started/time-bucket.jpg"
    alt="time_bucket() Illustration"/>

   For more information on the `time_bucket()` function, see the [API documentation][time-bucket]. 

   To see `time_bucket()` in action with the stock trade data, let's calculate
   the average daily price of each trading symbol over the last week.
   
   Use the `time_bucket()` function with an interval of `1-day`, the `avg()` 
   function on the price data, select the `symbol`, and finally [`GROUP BY`][clause-expressions]
   the `bucket` and `symbol`. The `WHERE` limits the results to days within the 
   last week. Finally the `ORDER BY` clause orders the results first on the bucketed date, 
   then by symbol. 

   ```sql
   SELECT
      time_bucket('1 day', time) AS bucket,
      symbol,
      avg(price)
   FROM stocks_real_time srt
   WHERE time > now() - INTERVAL '1 week'
   GROUP BY bucket, symbol
   ORDER BY bucket, symbol;

   bucket                       |symbol|avg               |
   -----------------------------+------+------------------+
   2022-04-26 20:00:00.000 -0400|AAPL  |157.16595920217668|
   2022-04-26 20:00:00.000 -0400|ABBV  | 157.8470588235293|
   2022-04-26 20:00:00.000 -0400|ABNB  |152.33858034970868|
   2022-04-26 20:00:00.000 -0400|ABT   |117.13218965517241|
   2022-04-26 20:00:00.000 -0400|ADBE  |398.63256560534745|
   2022-04-26 20:00:00.000 -0400|AMAT  |108.92946602133563|
   ```
   
   In the results above, you may notice that the `bucket` column, which represents
   a `time_bucket()` or one week, starts on the beginning date of the bucket, not
   the current time that you run the query. We provide more details on how buckets
   are calculated in the hyperfunction API documentation.

## Next steps
Now that you're familiar with some TimescaleDB queries and functions, like `time_bucket`, learn about
continuous aggregates in the [next section][create-cagg].

## Learn more about TimescaleDB hyperfunctions
For more information about the functions provided by TimescaleDB and Timescale Toolkit extension,
see the [API Reference for hyperfunctions](/api/:currentVersion:/hyperfunctions).




[average]: https://www.postgresql.org/docs/14/functions-aggregate.html
[filter]: https://www.postgresql.org/docs/14/sql-expressions.html#SYNTAX-AGGREGATES
[order-by]: https://www.postgresql.org/docs/current/queries-order.html
[select-keywords]: https://www.postgresql.org/docs/14/sql-select.html
[clause-expressions]: https://www.postgresql.org/docs/14/queries-table-expressions.html
[time-bucket]: /api/:currentVersion:/hyperfunctions/time_bucket
[last]: /api/:currentVersion:/hyperfunctions/last
[first]: /api/:currentVersion:/hyperfunctions/first
[date-trunc]: https://www.postgresql.org/docs/current/functions-datetime.html
[create-cagg]: /getting-started/create-cagg/
[join]: https://www.postgresql.org/docs/current/tutorial-join.html
