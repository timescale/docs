---
title: Analyze financial tick data - Query the data
excerpt: Create candlestick views and query financial tick data to analyze price changes
products: [cloud, mst, self_hosted]
keywords: [tutorials, finance, learn]
tags: [tutorials, beginner]
layout_components: [next_prev_large]
content_group: Analyze financial tick data
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
In this tutorial, you create a continuous aggregate for a candlestick time
bucket, and then query the aggregate with different refresh policies. Finally,
you can use Grafana to visualize your data as a candlestick chart.

## Create a continuous aggregate

To look at OHLCV values, the most effective way is to create a continuous
aggregate. In this tutorial, you create a continuous aggregate to aggregate data
for each day. You then set the aggregate to refresh every day, and to aggregate
the last two days' worth of data.

<Procedure>

### Creating a continuous aggregate

1.  Connect to the Timescale database that contains the Twelve Data
    cryptocurrency dataset.

2.  At the psql prompt, create the continuous aggregate to aggregate data every
    minute:

    ```sql
    CREATE MATERIALIZED VIEW one_day_candle
    WITH (timescaledb.continuous) AS
        SELECT
            time_bucket('1 day', time) AS bucket,
            symbol,
            FIRST(price, time) AS "open",
            MAX(price) AS high,
            MIN(price) AS low,
            LAST(price, time) AS "close",
            LAST(day_volume, time) AS day_volume
        FROM crypto_ticks
        GROUP BY bucket, symbol;
    ```

    When you create the continuous aggregate, it refreshes by default.

3.  Set a refresh policy to update the continuous aggregate every day,
    if there is new data available in the hypertable for the last two days:

    ```sql
    SELECT add_continuous_aggregate_policy('one_day_candle',
        start_offset => INTERVAL '3 days',
        end_offset => INTERVAL '1 day',
        schedule_interval => INTERVAL '1 day');
    ```

</Procedure>

## Query the continuous aggregate

When you have your continuous aggregate set up, you can query it to get the
OHLCV values.

<Procedure>

### Querying the continuous aggregate

1.  Connect to the Timescale database that contains the Twelve Data
    cryptocurrency dataset.

2.  At the psql prompt, use this query to select all Bitcoin OHLCV data for the
    past 14 days, by time bucket:

    ```sql
    SELECT * FROM one_day_candle
    WHERE symbol = 'BTC/USD' AND bucket >= NOW() - INTERVAL '14 days'
    ORDER BY bucket;
    ```

    The result of the query looks like this:

    ```sql
             bucket         | symbol  |  open   |  high   |   low   |  close  | day_volume
    ------------------------+---------+---------+---------+---------+---------+------------
     2022-11-24 00:00:00+00 | BTC/USD |   16587 | 16781.2 | 16463.4 | 16597.4 |      21803
     2022-11-25 00:00:00+00 | BTC/USD | 16597.4 | 16610.1 | 16344.4 | 16503.1 |      20788
     2022-11-26 00:00:00+00 | BTC/USD | 16507.9 | 16685.5 | 16384.5 | 16450.6 |      12300
    ```

</Procedure>

## Graph OHLCV data

When you have extracted the raw OHLCV data, you can use it to graph the result
in a candlestick chart, using Grafana. To do this, you need to have Grafana set
up to connect to your TimescaleDB database. For more information about how to do
this, see the [Grafana setup instructions][grafana-setup].

<Procedure>

### Graphing OHLCV data

1.  Ensure you have Grafana installed, and you are using the TimescaleDB
    database that contains the Twelve Data cryptocurrency dataset set up as a
    data source. For more information about how to do this, see the
    [Grafana setup instructions][grafana-setup].
1.  In Grafana, from the `Dashboards` menu, click `New Dashboard`. In the
    `New Dashboard` page, click `Add a new panel`.
1.  In the `Visualizations` menu in the top right corner, select `Candlestick`
    from the list. Ensure you have set the Twelve Data cryptocurrency dataset as
    your data source.
1.  Click `Edit SQL` and paste in the query you used earlier:

    ```sql
    SELECT * FROM one_day_candle
    WHERE symbol = 'BTC/USD' AND bucket >= NOW() - INTERVAL '14 days'
    ORDER BY bucket;
    ```

1.  In the `Format as` section, select `Table`.
1.  Adjust elements of the table as required, and click `Apply` to save your
    graph to the dashboard.

<img class="main-content__illustration"
    src="https://s3.amazonaws.com/assets.timescale.com/docs/images/Grafana_candlestick_1day.png"
    alt="Creating a candlestick graph in Grafana using 1-day OHLCV tick data"
/>

</Procedure>

[caggs]: /use-timescale/:currentVersion:/continuous-aggregates/
[first]: /api/:currentVersion:/hyperfunctions/first/
[hyperfunctions]: /api/:currentVersion:/hyperfunctions/
[intraday-tutorial]: /tutorials/:currentVersion:/analyze-intraday-stocks/
[last]: /api/:currentVersion:/hyperfunctions/last/
[time-bucket]: /api/:currentVersion:/hyperfunctions/time_bucket/
[lag]: https://www.postgresqltutorial.com/postgresql-lag-function/
[grafana-setup]: /tutorials/:currentVersion:/grafana/grafana-timescalecloud/
