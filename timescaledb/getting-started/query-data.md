# Query your data

With TimescaleDB, there's no need to learn a custom query language. **TimescaleDB
supports full SQL**. You can use your SQL knowledge along with the rich 
ecosystem of PostgreSQL tools in addition to the extra functionality gained through
TimescaleDB.

<highlight type="tip">
Fun fact: TimescaleDB adds important enhancements to the PostgreSQL query planner
that improve query reusability for INTERVAL predicates, something PostgreSQL does
not have.
</highlight>

Here we provide some query examples so that you can get familiar with using SQL along
with some of TimescaleDB's most popular functions. 

<procedure>

## Basic SQL queries

1. Selecting all stock data from the last day.

   This query utilizes the [`where`][clause-expressions] clause to specify that you only want to see result
   where the `time` column is greater than the timestamp from one day prior. 

   ```sql
   select * from stocks_real_time srt
   where time > now() - interval '1 day';
   ```

1. Selecting the top 10 stock values by price.

   This query utilizes the [`order by`][order-by] keyword to order the results by price descending
   and limit the number of results shown to 10. 

   ```sql
   select * from stocks_real_time srt
   order by price desc
   limit 10;   
   ```

1. The average trade price for Apple from the last day

   This query uses the [`avg()`][average] function along with [`filter`][filter] and `where` 
   to specify that the results should only include 'AAPL' (Apple) trades that were made within the 
   last day. 

   ```sql
   select
   avg(price) filter (where symbol = 'AAPL')
   from stocks_real_time srt
   where time > now() - interval '2 day';
   ```
</procedure>


<procedure>

## Advanced TimescaleDB SQL functions

Timescale has many custom-built SQL functions to help you perform time-series
analysis in fewer lines of code. Let's look at how to use three of these functions. 

Functions covered include:
 * [first()][first]: used for finding the earliest value based on a time within an aggregate group
 * [last()][last]: used for finding the latest value based on time within an aggregate group
 * [time_bucket()][time-bucket]: used for analyzing data over arbitrary time intervals

1. Using `first()` and `last()` functions

   The `first()` and `last()` functions gets you the first and last value respectively that occurs 
   within a column when ordered by another column. 
   
   For example, say you have a table with timestamp column `time`, and numeric column `value`. If you 
   used `first(value, time)`, your results would show the first number in the `value` column when ordered 
   with respect to the `time` column ascending in value. 

   In this query, you will use both the `first()` and `last()` functions in order to find the 
   first and last trading price for each company. With the `where` clause, the interval of time is 
   limited to the last three days. 

   ```sql
   select symbol, first(price,time), last(price, time)
   from stocks_real_time srt
   where time > now() - interval '3 days'
   group by symbol;
   ```

1. Using the `time_bucket()` function

   Before showing the query, let's look at the `time_bucket()` function in a more detail. 

   The `time_bucket()` function allows you to take a time column and “bucket” the values 
   based on an interval of your choice. Often you "bucket" time so that you can perform
   an aggregation over the chosen interval. 
   
   For example, say `time` is a timestamp column that shows values incrementing every hour 
   and `value` is a numeric column. You would like to aggregate `value` using the `sum()` 
   function so that you get summed values over each day. To accomplish this you can
   use the `time_bucket()` function on the `time` column to “bucket” the hourly data into daily data 
   then perform the `sum()` function on the `value` column to get the sum of your values across each day. 

   <img class="main-content__illustration"
    src="https://s3.amazonaws.com/assets.timescale.com/docs/images/getting-started/time-bucket.jpg"
    alt="time_bucket() Illustration"/>

   For more information on the `time_bucket()` function, see the [`time_bucket()` page][time-bucket] within our API 
   Reference section. 

   For this SQL query, you will find the average stock trading price for each company
   over each day. We use the `time_bucket()` function with an interval of one day, include 
   the `avg()` function on price, and include `symbol` so we can group the average 
   price calculations by company. The `where` clause specifies results will be limited to only 
   show days that occur within the last week. The [`group by`][clause-expressions] clause is necessary 
   for aggregation and allows you to group the results by the day and company. And finally the `order by` 
   clause orders the results first on the bucketed date, then by symbol. 

   ```sql
   select
      time_bucket('1 day', time) as bucket,
      symbol,
      avg(price)
   from stocks_real_time srt
   where time > now() - interval '1 week'
   group by bucket, symbol
   order by bucket, symbol;
   ```

</procedure>

<highlight type="note">
For more information about the functions provided by TimescaleDB and Timescale Toolkit extension,
see the [API Reference for hyperfunctions](/api/:currentVersion:/hyperfunctions).
</highlight>

## Next steps

Now that you're familiar with some TimescaleDB queries and functions, like `time_bucket`, let's learn about
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

