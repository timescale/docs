# Query the candlestick views
In the previous steps you saw how to create the schema to store tick data
and set up multiple candlestick views. In this section, we provide some
example candlestick queries and see how the queries are typically represented
in visualizations.

<highlight type="tip">
The queries below are example queries. The [sample data][sample-download]
provided with this tutorial is updated on a regular basis to have near-time
data, typically no more than a few days old. Our sample queries reflect time
filters that may be longer than you would use in real-time, so feel free to
modify the time filter in the `WHERE` clause as the data ages or you begin
to insert updated tick readings. 
</highlight>

## 1-min BTC/USD candlestick chart
Let’s start with `one_min_candle` continuous aggregate which contains
1-min candlesticks.

```sql
SELECT * FROM one_min_candle
WHERE symbol = 'BTC/USD' AND bucket >= NOW() - INTERVAL '24 hour'
ORDER BY bucket
```

![1-min candlestick](https://s3.amazonaws.com/assets.timescale.com/docs/images/tutorials/candlestick/one_min.png)

## 1-hour BTC/USD candlestick chart
If you find that 1-min candlesticks are too granular for you, you can also query the `one_hour_candle` continuous aggregate containing 1-hour candlesticks.

```sql
SELECT * FROM one_hour_candle
WHERE symbol = 'BTC/USD' AND bucket >= NOW() - INTERVAL '2 day'
ORDER BY bucket
```

![1-hour candlestick](https://s3.amazonaws.com/assets.timescale.com/docs/images/tutorials/candlestick/one_hour.png)

## 1-day BTC/USD candlestick chart
And if you want to zoom out even more, you can query the `one_day_candle` continuous aggregate which has 1-day candlesticks.

```sql
SELECT * FROM one_day_candle
WHERE symbol = 'BTC/USD' AND bucket >= NOW() - INTERVAL '14 days'
ORDER BY bucket
```

![1-day candlestick](https://s3.amazonaws.com/assets.timescale.com/docs/images/tutorials/candlestick/one_day.png)

## BTC vs. ETH 1-day price changes (delta) line chart

You might want to calculate and visualize the price change differences between
two symbols. In a previous example you saw how to do this by comparing the
opening and closing prices. But what if you want to compare today’s closing
price with yesterday’s closing price? Here’s an example how you can achieve
this by using the [`LAG()`][lag] window function on an already existing
candlestick view:

```sql
SELECT *, ("close" - LAG("close", 1) OVER (PARTITION BY symbol ORDER BY bucket)) / "close" AS change_pct
FROM one_day_candle
WHERE symbol IN ('BTC/USD', 'ETH/USD') AND bucket >= NOW() - INTERVAL '14 days'
ORDER BY bucket
```
![btc vs eth](https://s3.amazonaws.com/assets.timescale.com/docs/images/tutorials/candlestick/pct_change.png)


[lag]: https://www.postgresqltutorial.com/postgresql-lag-function/
[sample-download]: https://assets.timescale.com/docs/downloads/crypto_sample.zip