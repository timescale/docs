---
title: Ingest real-time financial websocket data - Query the data
excerpt: Create candlestick views and query financial tick data to analyze price changes
products: [cloud, mst, self_hosted]
keywords: [tutorials, finance, learn]
tags: [tutorials, advanced]
---

import GraphOhlcv from "versionContent/_partials/_graphing-ohlcv-data.mdx";

# Query the data

To look at OHLCV values, the most effective way is to create a continuous
aggregate. You can create a continuous aggregate to aggregate data
for each hour, then set the aggregate to refresh every hour, and aggregate
the last two hours' worth of data.

To look at OHLCV values, the most effective way is to create a continuous
aggregate. You can create a continuous aggregate to aggregate data
for each hour, then set the aggregate to refresh every hour, and aggregate
the last two hours' worth of data.

<Procedure>

## Creating a continuous aggregate

1.  Connect to the Timescale database `tsdb` that contains the Twelve Data
    stocks dataset.

1.  At the psql prompt, create the continuous aggregate to aggregate data every
    minute:

    ```sql
    CREATE MATERIALIZED VIEW one_hour_candle
    WITH (timescaledb.continuous) AS
        SELECT
            time_bucket('1 hour', time) AS bucket,
            symbol,
            FIRST(price, time) AS "open",
            MAX(price) AS high,
            MIN(price) AS low,
            LAST(price, time) AS "close",
            LAST(day_volume, time) AS day_volume
        FROM stocks_real_time
        GROUP BY bucket, symbol;
    ```

    When you create the continuous aggregate, it refreshes by default.

1.  Set a refresh policy to update the continuous aggregate every hour,
    if there is new data available in the hypertable for the last two hours:

    ```sql
    SELECT add_continuous_aggregate_policy('one_hour_candle',
        start_offset => INTERVAL '3 hours',
        end_offset => INTERVAL '1 hour',
        schedule_interval => INTERVAL '1 hour');
    ```

</Procedure>

## Query the continuous aggregate

When you have your continuous aggregate set up, you can query it to get the
OHLCV values.

<Procedure>

### Querying the continuous aggregate

1.  Connect to the Timescale database that contains the Twelve Data
    stocks dataset.

1.  At the psql prompt, use this query to select all `AAPL` OHLCV data for the
    past 5 hours, by time bucket:

    ```sql
    SELECT * FROM one_hour_candle
    WHERE symbol = 'AAPL' AND bucket >= NOW() - INTERVAL '5 hours'
    ORDER BY bucket;
    ```

    The result of the query looks like this:

    ```sql
             bucket         | symbol  |  open   |  high   |   low   |  close  | day_volume
    ------------------------+---------+---------+---------+---------+---------+------------
     2023-05-30 08:00:00+00 | AAPL   | 176.31 | 176.31 |    176 | 176.01 |           
     2023-05-30 08:01:00+00 | AAPL   | 176.27 | 176.27 | 176.02 |  176.2 |           
     2023-05-30 08:06:00+00 | AAPL   | 176.03 | 176.04 | 175.95 |    176 |           
     2023-05-30 08:07:00+00 | AAPL   | 175.95 |    176 | 175.82 | 175.91 |           
     2023-05-30 08:08:00+00 | AAPL   | 175.92 | 176.02 |  175.8 | 176.02 |           
     2023-05-30 08:09:00+00 | AAPL   | 176.02 | 176.02 |  175.9 | 175.98 |           
     2023-05-30 08:10:00+00 | AAPL   | 175.98 | 175.98 | 175.94 | 175.94 |           
     2023-05-30 08:11:00+00 | AAPL   | 175.94 | 175.94 | 175.91 | 175.91 |           
     2023-05-30 08:12:00+00 | AAPL   |  175.9 | 175.94 |  175.9 | 175.94 |
    ```

</Procedure>

<GraphOhlcv />
