---
title: Analyze financial tick data - Query the data
excerpt: Create candlestick views and query financial tick data to analyze price changes
keywords: [tutorials, finance, learn]
tags: [tutorials, intermediate]
---

# Query the data

Turning raw, real-time tick data into aggregated candlestick views is a common
task for users who work with financial data. TimescaleDB includes
[hyperfunctions][hyperfunctions]
that you can use to store and query your financial data more easily.
Hyperfunctions are SQL functions within TimescaleDB that make it easier to
manipulate and analyze time-series data in PostgreSQL with fewer lines of code.

There are three hyperfunctions that are essential for calculating candlestick
values: [`time_bucket()`][time-bucket], [`FIRST()`][first], and [`LAST()`][last].
The `time_bucket()` hyperfunction helps you aggregate records into buckets of
arbitrary time intervals based on the timestamp value. `FIRST()` and `LAST()`
help you calculate the opening and closing prices. To calculate highest and
lowest prices, you can use the standard PostgreSQL aggregate functions `MIN` and
`MAX`.

In TimescaleDB, the most efficient way to create candlestick views is to use
[continuous aggregates][caggs].
In this tutorial, you'll create a continuous aggregate for a candlestick time
bucket, and then query the aggregate with different refresh policies.

## Create a continuous aggregate

To look at 1 minute OHLCV values, the most effective way is to create a
continuous aggregate. The continuous aggregate can then be set to refresh every
two minutes, so that you have updated data to access.

<procedure>

### Creating a continuous aggregate

1.  Connect to the Timescale Cloud database that contains the Twelve Data
    cryptocurrency dataset.

1.  At the psql prompt, create the continuous aggregate to aggregate data every
    minute:

    ```sql
    CREATE MATERIALIZED VIEW one_min_candle
    WITH (timescaledb.continuous) AS
        SELECT
            time_bucket('1 min', time) AS bucket,
            symbol,
            FIRST(price, time) AS "open",
            MAX(price) AS high,
            MIN(price) AS low,
            LAST(price, time) AS "close",
            LAST(day_volume, time) AS day_volume
        FROM crypto_ticks
        GROUP BY bucket, symbol;
    ```

1.  Set a refresh policy to update the continuous aggregate every two minutes, if there is new data available in the hypertable:

    ```sql
    SELECT add_continuous_aggregate_policy('one_min_candle',
        start_offset => INTERVAL '2 hour',
        end_offset => INTERVAL '10 sec',
        schedule_interval => INTERVAL '2 min');
    ```

</procedure>

## Query the continuous aggregate

When you have your continuous aggregate set up, you can query it to get the
OHLCV values.

<procedure>

### Querying the continuous aggregate

1.  Connect to the Timescale Cloud database that contains the Twelve Data
    cryptocurrency dataset.

1.  At the psql prompt, use this query to select all Bitcoin OHLCV data for the
    past 24 hours, by time bucket:

    ```sql
    SELECT * FROM one_min_candle
    WHERE symbol = 'BTC/USD' AND bucket >= NOW() - INTERVAL '24 hour'
    ORDER BY bucket;
    ```

    The result of the query looks like this:

    ```sql
             bucket         | symbol  |  open   |  high   |   low   |  close  | day_volume
    ------------------------+---------+---------+---------+---------+---------+------------
     2022-11-26 03:58:00+00 | BTC/USD | 16615.4 | 16617.1 | 16615.1 | 16615.4 |      20729
     2022-11-26 03:59:00+00 | BTC/USD | 16617.1 | 16617.1 | 16611.7 | 16615.4 |      20739
     2022-11-26 04:00:00+00 | BTC/USD | 16611.7 | 16616.6 | 16611.7 | 16616.6 |      19040
     2022-11-26 04:01:00+00 | BTC/USD | 16615.4 | 16619.8 | 16615.4 | 16617.5 |      19055
    ```

</procedure>

## Graph OHLCV data

When you have extracted the raw OHLCV data, you can use it to graph the result
in a candlestick chart, using Grafana. To do this, you need to have Grafana set up to connect to your TimescaleDB database.

<procedure>

### Graphing OHLCV data

1.  Ensure you have Grafana installed, and you are using the TimescaleDB
    database that contains the Twelve Data cryptocurrency dataset set up as a
    data source. For more information about how to do this, see [Grafana setup instructions][grafana-setup].
1.  In Grafana, from the `Dashboards` menu, click `New Dashboard`. In the
    `New Dashboard` page, click `Add a new panel`.
1.  In the `Visualizations` menu in the top right corner, select `Candlestick`
    from the list.
1.  Ensure you have the Twelve Data cryptocurrency dataset as your data source.
    You can use the query builder to input your query, or click `Edit SQL` and
    past in the query you used earlier:

    ```sql
    SELECT * FROM one_min_candle
    WHERE symbol = 'BTC/USD' AND bucket >= NOW() - INTERVAL '24 hour'
    ORDER BY bucket;
    ```

1.  In the `Format as` section, select `Table`.
1.  Adjust elements of the table as required.

![1-min candlestick](https://s3.amazonaws.com/assets.timescale.com/docs/images/tutorials/candlestick/FIXME.png)

## BTC vs. ETH 1-day price changes delta line chart

You can calculate and visualize the price change differences between
two symbols. In a previous example, you saw how to do this by comparing the
opening and closing prices. But what if you want to compare today's closing
price with yesterday's closing price? Here's an example how you can achieve
this by using the [`LAG()`][lag] window function on an already existing
candlestick view:

```sql
SELECT *, ("close" - LAG("close", 1) OVER (PARTITION BY symbol ORDER BY bucket)) / "close" AS change_pct
FROM one_day_candle
WHERE symbol IN ('BTC/USD', 'ETH/USD') AND bucket >= NOW() - INTERVAL '14 days'
ORDER BY bucket
```

![btc vs eth](https://s3.amazonaws.com/assets.timescale.com/docs/images/tutorials/candlestick/pct_change.png)

## Using multiple continuous aggregates

You cannot currently create a continuous aggregate on top of another continuous aggregate.
However, this is not necessary in most cases. You can get a similar result and performance by
creating multiple continuous aggregates for the same hypertable. Due
to the efficient materialization mechanism of continuous aggregates, both
refresh and query performance should work well.

[caggs]: /timescaledb/:currentVersion:/how-to-guides/continuous-aggregates/
[first]: /api/:currentVersion:/hyperfunctions/first/
[hyperfunctions]: /api/:currentVersion:/hyperfunctions/
[intraday-tutorial]: /timescaledb/:currentVersion:/tutorials/analyze-intraday-stocks/
[last]: /api/:currentVersion:/hyperfunctions/last/
[time-bucket]: /api/:currentVersion:/hyperfunctions/time_bucket/
[lag]: https://www.postgresqltutorial.com/postgresql-lag-function/
[grafana-setup]: FIXME
