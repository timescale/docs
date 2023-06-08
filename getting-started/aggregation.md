---
title: Aggregation
excerpt: Create an aggregate and query it
products: [cloud]
keywords: [continuous aggregates, create]
layout_components: [next_prev_large]
content_group: Getting started
---

import CaggsIntro from "versionContent/_partials/_caggs-intro.mdx";
import CaggsTypes from "versionContent/_partials/_caggs-types.mdx";

# Aggregation

Aggregation refers to a number of different calculations that you can perform on
your data. For example, if you have data showing temperature changes over time,
you can calculate an average of those temperatures, or a count of how many
readings have been taken. Average, sum, and count are all example of simple
aggregates.

<CaggsIntro />

<CaggsTypes />

In this section, you create a simple aggregation by finding the average trade
price for a single stock over several days. Then, you create a materialized
view, transform it into a continuous aggregate, and query it for more
information about the trading data.

## Find average stock prices for the last week

Timescale has custom SQL functions that can help make time-series analysis
easier and faster. In this procedure, you'll learn about another common
Timescale function, `time_bucket` which allows you to take a time column and
"bucket" the values based on an interval of your choice.

Time bucketing is useful for data like stock data which has a lot of
information. Instead of looking at each trade individually, you can combine the
data into bigger buckets and look at, for example, the data for each day. You
can then perform an aggregation and, for example, get the average of the
values for each day.

In this procedure, you time bucket the entire dataset for the last week into
days, and calculate the average of each bucket:

```sql
SELECT
  time_bucket('1 day', time) AS bucket,
  symbol,
  avg(price)
FROM stocks_real_time srt
WHERE time > now() - INTERVAL '1 week'
```

Then, you organize the results by bucket and symbol:

```sql
GROUP BY bucket, symbol
ORDER BY bucket, symbol
```

<procedure>

### Finding average stock prices for the last week

1.  At the command prompt, use the `psql` connection string from the cheat sheet
    you downloaded to connect to your database.
1.  At the `psql` prompt, type this query:

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

    The data you get back looks a bit like this:

    ```sql
             bucket         | symbol |        avg
    ------------------------+--------+--------------------
     2023-06-01 00:00:00+00 | AAPL   |  179.3242530284364
     2023-06-01 00:00:00+00 | ABNB   | 112.05498586371293
     2023-06-01 00:00:00+00 | AMAT   | 134.41263567849518
     2023-06-01 00:00:00+00 | AMD    | 119.43332772033834
     2023-06-01 00:00:00+00 | AMZN   |  122.3446364966392
    ```

</procedure>

You might notice that the `bucket` column doesn't start at the time that you run
the query. To learn more about how time buckets are calculated, see the [time bucketing section][time-bucket-how-to].

<!--- Lana, you're up to here! 2023-06-08-->
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

## Create an aggregate query to use in your continuous aggregate

The data used in this tutorial is second-by-second, or tick, data for stock trades.
A popular aggregate pattern used for analyzing stock data is called a
[candlestick][candlestick]. Generally, candlestick charts use 4 different
aggregations over a specific interval of time (for example, 1-minute, 5-minute,
or 1-day aggregates):

*   `high`: highest stock price per interval
*   `open`: opening stock price per interval
*   `close`: closing stock price per interval
*   `low`: lowest stock price per interval

For this example query, the [`time_bucket()`][time-bucket] interval is 1 day.
The `high` and `low` values can be found by using the PostgreSQL [`MAX()`][max]
and [`MIN()`][min] functions. Finally, the `open` and `close` values can be
found by using the [`first()`][first] and [`last()`][last] functions.

<Procedure>

### Creating an aggregate query

1.  Use a `SELECT` command to find the daily candlestick values for each stock
    in the entire 1-month dataset. This may take a few seconds to process all of
    the raw data into 1-day buckets:

    ```sql
    SELECT
      time_bucket('1 day', "time") AS day,
      symbol,
      max(price) AS high,
      first(price, time) AS open,
      last(price, time) AS close,
      min(price) AS low
    FROM stocks_real_time srt
    GROUP BY day, symbol
    ORDER BY day DESC, symbol;
    ```

1.  The results of the command look like this:

    ```bash
    day                          |symbol|high    |open    |close   |low     |
    -----------------------------+------+--------+--------+--------+--------+
    2022-05-03 20:00:00.000 -0400|AAPL  |164.9799|  159.32| 164.545|  159.25|
    2022-05-03 20:00:00.000 -0400|ABBV  |   151.7|  150.99|  151.32|  147.59|
    2022-05-03 20:00:00.000 -0400|ABNB  |158.7158|  148.84|  153.58|  145.88|
    2022-05-03 20:00:00.000 -0400|ABT   |   115.2|  111.64|  115.08|  111.14|
    2022-05-03 20:00:00.000 -0400|ADBE  |  421.93|  407.61|  419.53|  395.06|
    2022-05-03 20:00:00.000 -0400|AMAT  |  118.47| 114.279|  117.95|  112.04|
    ```

</Procedure>

## Create a continuous aggregate from aggregate query

Now that you have the aggregation query, you can use it to create a continuous
aggregate.

The `CREATE MATERIALIZED VIEW` command triggers the database to create a
materialized view with the given name, in this case `stock_candlestick_daily`.
In the next line, `WITH (timescaledb.continuous)` instructs Timescale to
create a continuous aggregate and not just a generic materialized view. Finally,
the query from earlier is added after the `AS` keyword.

<Procedure>

### Creating a continuous aggregate from an aggregate query

1.  Using the aggregate query from the previous procedure, create a continuous
    aggregate for daily candlestick data:

    ```sql
    CREATE MATERIALIZED VIEW stock_candlestick_daily
    WITH (timescaledb.continuous) AS
    SELECT
      time_bucket('1 day', "time") AS day,
      symbol,
      max(price) AS high,
      first(price, time) AS open,
      last(price, time) AS close,
      min(price) AS low
    FROM stocks_real_time srt
    GROUP BY day, symbol;
    ```

1.  The query might take some time to run because it needs to perform these
    calculations across all of your stock trade data the first time. After the
    calculation results are stored, querying the data from the continuous
    aggregate is much faster.

</Procedure>

The `SELECT` statement is the same query you wrote earlier, without the
`ORDER BY` clause. By default, this code both creates the aggregate and
materializes the aggregated data. That means the view is created _and_ populated
with the aggregate calculations from your existing hypertable data.

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/getting-started/continuous-aggregate.jpg" alt="Continuous aggregate upon creation"/>

Run this query to get all the data in your continuous aggregate, and note
how much faster this is than running the aggregate `SELECT` query on the raw hypertable data:

```sql
SELECT * FROM stock_candlestick_daily
  ORDER BY day DESC, symbol;
```

[cagg-policy]: /getting-started/:currentVersion:/create-cagg/create-cagg-policy/
[candlestick]: https://en.wikipedia.org/wiki/Candlestick_chart
[continuous-aggregates]: /use-timescale/:currentVersion:/continuous-aggregates
[crypto-bot]: https://blog.timescale.com/blog/how-i-power-a-successful-crypto-trading-bot-with-timescaledb/
[first]: /api/:currentVersion:/hyperfunctions/first/
[flightaware]: https://blog.timescale.com/blog/how-flightaware-fuels-flight-prediction-models-with-timescaledb-and-grafana/
[last]: /api/:currentVersion:/hyperfunctions/last/
[max]: https://www.postgresql.org/docs/current/tutorial-agg.html
[min]: https://www.postgresql.org/docs/current/tutorial-agg.html
[time-bucket]: /api/:currentVersion:/hyperfunctions/time_bucket/
