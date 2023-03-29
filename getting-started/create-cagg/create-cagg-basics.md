---
title: Creating continuous aggregates
excerpt: Create a continuous aggregate from your data
products: [cloud, mst, self_hosted]
keywords: [continuous aggregates, create]
---

# Creating continuous aggregates

Now that you've been introduced to continuous aggregates, create your own
continuous aggregate from your data.

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
materializes the aggregated data. That means the view is created *and* populated
with the aggregate calculations from your existing hypertable data.

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/getting-started/continuous-aggregate.jpg" alt="Continuous aggregate upon creation"/>

Run this query to get all the data in your continuous aggregate, and note
how much faster this is than running the aggregate `SELECT` query on the raw hypertable data:

```sql
SELECT * FROM stock_candlestick_daily
  ORDER BY day DESC, symbol;
```

## Real-time continuous aggregates

By default, all continuous aggregates are created as real-time aggregates.
This means that Timescale appends recent data that has not yet been materialized
through a refresh policy to the output of the continuous aggregate. In this
diagram, that corresponds to the last three points of raw data, which belong to
an incomplete bucket.

<Highlight type="note">
If you don't want real-time aggregation, you can disable it. Set the `materialized_only`
parameter to true for your continuous aggregate. For more information, see the
section on [real-time aggregation](/use-timescale/latest/continuous-aggregates/real-time-aggregates/#use-real-time-aggregates).
</Highlight>

To inspect details about a continuous aggregate, such as its
configuration or the query used to define it, use the following
informational view:

```sql
SELECT * FROM timescaledb_information.continuous_aggregates;
```

**Results:**

```bash
hypertable_schema|hypertable_name |view_schema|view_name              |view_owner|materialized_only|compression_enabled|materialization_hypertable_schema|materialization_hypertable_name|view_definition                                                                                                                                                                           |
-----------------+----------------+-----------+-----------------------+----------+-----------------+-------------------+---------------------------------+-------------------------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
public           |stocks_real_time|public     |stock_candlestick_daily|tsdbadmin |f                |f                  |_timescaledb_internal            |_materialized_hypertable_3     | SELECT time_bucket('1 day'::interval, srt."time") AS day,¶    srt.symbol,¶    max(srt.price) AS high,¶    first(srt.price, srt."time") AS open,¶    last(srt.price, srt."time") AS close,|
```

<Video url="https://www.youtube.com/embed/1m9yxpyGrBY"></Video>

## Next steps

Now that your continuous aggregate is created, the next step is to create a [continuous aggregate refresh policy][cagg-policy].

Without an automatic refresh policy, your continuous aggregate won't materialize
new data as it is inserted into the `stocks_real_time` hypertable. As mentioned
before, when you query your continuous aggregate, Timescale performs real-time
aggregation to include any unmaterialized data. As the amount of unmaterialized
data grows, this can slow down your queries.

With a continuous aggregate policy, your new data automatically materializes
into your continuous aggregate, keeping the need for real-time computations low
and your continuous aggregate queries efficient.

## Learn more about continuous aggregates

See how real Timescale users leverage continuous aggregates in the blog posts
[How FlightAware fuels flight prediction models for global travelers with
Timescale and Grafana][flightaware] and [How I power a (successful) crypto
trading bot with Timescale][crypto-bot].

Detailed information on continuous aggregates and real-time aggregation can be
found in the [continuous aggregates docs][continuous-aggregates].

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
