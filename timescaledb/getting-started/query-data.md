# Query your data

With TimescaleDB, there's no need to learn a custom query language. **TimescaleDB
supports full SQL**. You can use your SQL knowledge along with the rich 
ecosystem of PostgreSQL tools, and add the extra features and performance of
TimescaleDB.


Here are some query examples so that you can get familiar with using SQL along
with some of TimescaleDB's most popular functions. 

## Basic SQL queries
### Select all stock data from the last day.

   This query uses the [`WHERE`][clause-expressions] clause to only show results for
   timestamps within the last day. 

   ```sql
   SELECT * from stocks_real_time srt
   WHERE time > now() - INTERVAL '1 day';
   ```

### Select the top 10 stock values by price.

   This query uses the [`ORDER BY`][order-by] keyword to order the results by descending price
   and limit the number of results shown to 10. 

   ```sql
   SELECT * FROM stocks_real_time srt
   ORDER by PRICE desc
   LIMIT 10;   
   ```

### Calculate the average trade price for Apple from the last day

   This query uses the [`avg()`][average] function along with [`FILTER`][filter] and `WHERE` 
   to include only 'AAPL' (Apple) trades made within the 
   last day. 

   ```sql
   SELECT
   avg(price) FILTER (WHERE symbol = 'AAPL')
   FROM stocks_real_time srt
   WHERE time > now() - INTERVAL '2 day';
   ```


## Advanced TimescaleDB SQL functions

Timescale has many custom-built SQL functions to help you perform time-series
analysis in fewer lines of code. Here's how to use three of these functions:

 * [first()][first]: find the earliest value based on a time within an aggregate group
 * [last()][last]: find the latest value based on time within an aggregate group
 * [time_bucket()][time-bucket]: bucket data by arbitrary time intervals and calculate aggregates over those intervals

### Get the first and last value with first() and last()

   The `first()` and `last()` functions gets you the first and last value 
   within a column when ordered by another column. 
   
   For example, say you have a table with timestamp column `time` and numeric column `value`. If you 
   use `first(value, time)`, you get the first number in the `value` column when ordered 
   with respect to an increasing `time` column. 

   In this query, you use both the `first()` and `last()` functions to find the 
   first and last trading price for each company. With the `WHERE` clause, the interval of time is 
   limited to the last three days. 

   ```sql
   SELECT symbol, first(price,time), last(price, time)
   FROM stocks_real_time srt
   WHERE time > now() - INTERVAL '3 days'
   GROUP BY symbol;
   ```

### Aggregate by an arbitrary length of time using time_bucket

   The `time_bucket()` function allows you to take a time column and “bucket” the values 
   based on an interval of your choice. Often you "bucket" time so that you can perform
   an aggregation over the chosen interval. 
   
   For example, say `time` is a timestamp column that shows values incrementing every hour 
   and `value` is a numeric column. You would like to aggregate `value` using the `sum()` 
   function so that you get summed values over each day. To accomplish this you can
   use the `time_bucket()` function on the `time` column to “bucket” the hourly data into daily data, 
   then perform the `sum()` function on the `value` column to get the sum of your values across each day. 

   <img class="main-content__illustration"
    src="https://s3.amazonaws.com/assets.timescale.com/docs/images/getting-started/time-bucket.jpg"
    alt="time_bucket() Illustration"/>

   For more information on the `time_bucket()` function, see the [`time_bucket()` page][time-bucket] within our API 
   Reference section. 

   The next SQL query calculates the average stock trading price for each company
   over each day. Use the `time_bucket()` function with an interval of one day, include 
   the `avg()` function on price, and include `symbol` so you can group the average 
   price calculations by company. The `where` clause specifies results are limited to only 
   show days that occur within the last week. The [`group by`][clause-expressions] clause is necessary 
   for aggregation and allows you to group the results by the day and company. Finally the `order by` 
   clause orders the results first on the bucketed date, then by symbol. 

   ```sql
   SELECT
      time_bucket('1 day', time) as bucket,
      symbol,
      avg(price)
   FROM stocks_real_time srt
   WHERE time > now() - INTERVAL '1 week'
   GROUP BY bucket, symbol
   ORDER BY bucket, symbol;
   ```


For more information about the functions provided by TimescaleDB and Timescale Toolkit extension,
see the [API Reference for hyperfunctions](/api/:currentVersion:/hyperfunctions).

## Next steps
Now that you're familiar with some TimescaleDB queries and functions, like `time_bucket`, learn about
continuous aggregates in the [next section][create-cagg].


[average]: https://www.postgresql.org/docs/14/functions-aggregate.html
[filter]: https://www.postgresql.org/docs/14/sql-expressions.html#SYNTAX-AGGREGATES
[order-by]: https://www.postgresql.org/docs/current/queries-order.html
[select-keywords]: https://www.postgresql.org/docs/14/sql-select.html
[clause-expressions]: https://www.postgresql.org/docs/14/queries-table-expressions.html
[time-bucket]: /api/:currentVersion:/hyperfunctions/time_bucket
[last]: /api/:currentVersion:/hyperfunctions/last
[first]: /api/:currentVersion:/hyperfunctions/first
[date-trunc]: https://www.postgresql.org/docs/current/functions-datetime.html

