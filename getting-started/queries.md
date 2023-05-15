---
title: Queries
excerpt: Query your time-series data
products: [cloud, mst, self_hosted]
keywords: [queries]
---

# Queries

With Timescale, there's no need to learn a custom query language, because
Timescale supports full SQL. You can use your SQL knowledge along with the
rich ecosystem of PostgreSQL tools, and add the extra features and performance of
Timescale.

Here are some query examples so you can get familiar with using SQL alongside
popular Timescale functions.

## Simple SQL queries

Many of the queries below show a filter for the last four days of data. This
accounts for the nuance of stock trade data which only occurs Monday to Friday
on the New York Stock Exchange.

If you load the provided data on a Monday, the most recent data is from Friday
afternoon. Therefore, selecting data for the last day or two would return no
results.

You can adjust the time frame based on the data that you downloaded and to
explore other time-ranges in the provided data.

### Select all stock data from the last four days

To select all the stock data from the previous four days, use the
[`WHERE`][clause-expressions]
clause to filter the result using a relative time interval. This example uses an
interval of four days, so data is displayed even if you run this on a weekend or
a Monday:

```sql
SELECT * FROM stocks_real_time srt
WHERE time > now() - INTERVAL '4 days';
```

### Select the most recent 10 trades for Amazon in order

Use the [`ORDER BY`][order-by] clause to define the order of results from your
query. With stock trade data, there are often multiple trades each second for
popular stocks like Amazon. Therefore, you cannot order data descending by the
`time` alone. This is a common problem with high-frequency data like stocks,
crypto, and IoT metrics. You need to order the results by additional information
to correctly display the order in which trades were made with the exchange.

For the `stocks_real_time` data, the `day_volume` column serves as additional
information to help you order the trades correctly, even when there are multiple
trades per second. The `day_volume` value increases by the number of stocks
traded with each tick.

```sql
SELECT * FROM stocks_real_time srt
WHERE symbol='AMZN'
ORDER BY time DESC, day_volume desc
LIMIT 10;
```

The results look like this:

```sql

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

There are multiple trades every second, but you know that the order of trades is
correct because the `day_volume` column is ordered correctly.

### Calculate the average trade price for Apple from the last four days

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

## Advanced Timescale SQL functions

Timescale has many custom-built SQL functions to help you perform time-series
analysis in fewer lines of code. Here's how to use three of these functions:

*   [first()][first]: find the earliest value based on a time within an aggregate group
*   [last()][last]: find the latest value based on time within an aggregate group
*   [time_bucket()][time-bucket]: bucket data by arbitrary time intervals and calculate
     aggregates over those intervals

### Get the first and last value

The `first()` and `last()` functions retrieve the first and last value of one
column when ordered by another.

For example, the stock data has a timestamp column `time` and numeric column
`price`. You can use `first(price, time)` to get the first value in the `price`
column when ordered with respect to an increasing `time` column.

In this query, you use both the `first()` and `last()` functions to find the
first and last trading price for each company for the last three days.

```sql
SELECT symbol, first(price,time), last(price, time)
FROM stocks_real_time srt
WHERE time > now() - INTERVAL '3 days'
GROUP BY symbol
ORDER BY symbol;
```

The results look like this:

```sql

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

### Aggregate by an arbitrary length of time

The `time_bucket()` function enables you to take a time column and "bucket" the
values based on an interval of your choice. Typically, you bucket time so that
you can perform an aggregation over the chosen interval.

For example, consider a table that records incrementing values every hour. To
aggregate the daily totals of the values, you can use the `time_bucket()`
function on the `time` column to _bucket_ the hourly data into daily data and
then perform a `sum()` on the `value` column to get the total sum of your values
across each day.

<img class="main-content__illustration"
src="https://s3.amazonaws.com/assets.timescale.com/docs/images/getting-started/time-bucket.jpg"
alt="time_bucket() Illustration"/>

For more information on the `time_bucket()` function, see the
[API documentation][time-bucket].

To see `time_bucket()` in action with the stock trade data, you can calculate
the average daily price of each trading symbol over the last week.

Use the `time_bucket()` function with an interval of `1-day`, the `avg()`
function on the price data, select the `symbol`, and finally [`GROUP BY`][clause-expressions]
the `bucket` and `symbol`. The `WHERE` limits the results to days within the
last week. Finally, the `ORDER BY` clause orders the results first on the
bucketed date, then by symbol.

```sql
SELECT
  time_bucket('1 day', time) AS bucket,
  symbol,
  avg(price)
FROM stocks_real_time srt
WHERE time > now() - INTERVAL '1 week'
GROUP BY bucket, symbol
ORDER BY bucket, symbol;
```

The results look like this:

```sql
bucket                       |symbol|avg               |
-----------------------------+------+------------------+
2022-04-26 20:00:00.000 -0400|AAPL  |157.16595920217668|
2022-04-26 20:00:00.000 -0400|ABBV  | 157.8470588235293|
2022-04-26 20:00:00.000 -0400|ABNB  |152.33858034970868|
2022-04-26 20:00:00.000 -0400|ABT   |117.13218965517241|
2022-04-26 20:00:00.000 -0400|ADBE  |398.63256560534745|
2022-04-26 20:00:00.000 -0400|AMAT  |108.92946602133563|
```

In these results, you might notice that the `bucket` column, which represents
a `time_bucket()` of one week, starts on the beginning date of the bucket, not
the current time that you run the query. To learn more about how time buckets
are calculated, see the [how-to guide for time buckets][time-bucket-how-to].

<Video url="https://www.youtube.com/embed/WFg0B1Bihtg"></Video>

## Next steps

Now that you're familiar with some Timescale queries and functions, like
`time_bucket`, learn about continuous aggregates in the
[next section][create-cagg].

## Learn more about Timescale hyperfunctions

For more information about the functions provided by Timescale and Timescale
Toolkit extension, see the
[hyperfunctions section][hyperfunctions].

[average]: https://www.postgresql.org/docs/14/functions-aggregate.html
[clause-expressions]: https://www.postgresql.org/docs/14/queries-table-expressions.html
[create-cagg]: /getting-started/:currentVersion:/create-cagg/
[date-trunc]: https://www.postgresql.org/docs/current/functions-datetime.html
[filter]: https://www.postgresql.org/docs/14/sql-expressions.html#SYNTAX-AGGREGATES
[first]: /api/:currentVersion:/hyperfunctions/first
[join]: https://www.postgresql.org/docs/current/tutorial-join.html
[last]: /api/:currentVersion:/hyperfunctions/last
[order-by]: https://www.postgresql.org/docs/current/queries-order.html
[select-keywords]: https://www.postgresql.org/docs/14/sql-select.html
[time-bucket-how-to]: /use-timescale/:currentVersion:/time-buckets/
[time-bucket]: /api/:currentVersion:/hyperfunctions/time_bucket
[hyperfunctions]: /use-timescale/:currentVersion:/hyperfunctions/
