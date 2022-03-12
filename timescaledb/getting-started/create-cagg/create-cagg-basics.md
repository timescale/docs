# Creating continuous aggregates

Now that you've been introduced to continuous aggregates, let's create one. 

## Step 1: Create aggregate query to use for generating continuous aggregate

In this tutorial, we use stock price data. A popular aggregate pattern many individuals use
for analyzing stock data is called a [candlestick][candlestick]. Generally, candelstick 
charts use four different aggregations over a one day period. 

The breakdown is as follows:
* `high`: highest stock price of the day
* `open`: opening stock price of the day
* `close`: closing stock price of the day
* `low`: lowest stock price of the day 

For this use case, the [`time_bucket()`][time-bucket] function interval will be one day. The 
`high` and `low` values can be found by using the PostgreSQL [`MAX()`][max] and [`MIN()`][min] 
functions. Then finally, the `open` and `close` values can be found by using the [`first()`][first] 
and [`last()`][last] functions respectively.  

```sql
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

## Step 2: Create continuous aggregate from aggregte query

Now that you have the aggregation query, you can use it to create a continuous aggregate. 

The `CREATE MATERIALIZED VIEW` triggers the database to create a materialized view with 
the name specified, in this case being `stock_candlestick_daily`. In the next line, 
`WITH (timescaledb.continuous)` lets the database know that you want to create a continuous 
aggregate and not just a generic materialized view. Then, the `AS` keyword is needed to specify 
the aggregate query you want to use for creating the continuous aggregate. 

To do this, use the following code:

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

By default, this code will create the aggregate **and** materialized the aggregated data. 

  <img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/getting-started/continuous-aggregate.jpg" alt="Continuous aggregate upon creation"/>

This is why the query may take some time to run. From this point on, query the data from the 
continuous aggregate will be much faster. Run the following query to get all the data in your 
continuous aggregate, **note how much faster this is then the simple aggrgetation `SELECT`**
**query from the step before**. 

```sql
SELECT * FROM stock_candlestick_daily
```

<highlight type="tip">
If you ever need to inspect details about a continuous aggregate, such as its 
configuration or the query used to define it, you can use the following 
informational view:
</highlight>

```sql
-- See info about continuous aggregates
SELECT * FROM timescaledb_information.continuous_aggregates;
```

**If you do not set up a continuous aggrgegate refresh policy, your continuous aggregate will**
**not materialized any new data in the `stocks_real_time` table.** This implies that over time, 
querying from your continuous aggregate will get slower. This is due to the fact that by default 
the database will aggregate your unmaterialized data on-the-fly. The more unmaterialized data 
your machine processes, the slower the query will take.

## Learn more about continuous aggregates

See how real TimescaleDB users leverage continuous aggregates in the blog posts
[How FlightAware fuels flight prediction models for global travelers with
TimescaleDB and Grafana][flightaware] and [How I power a (successful) crypto
trading bot with TimescaleDB][crypto-bot].

Detailed information on continuous aggregates and real-time aggregation can be
found in the [continuous aggregates docs][continuous-aggregates].

[flightaware]: https://blog.timescale.com/blog/how-flightaware-fuels-flight-prediction-models-with-timescaledb-and-grafana/
[crypto-bot]: https://blog.timescale.com/blog/how-i-power-a-successful-crypto-trading-bot-with-timescaledb/

[continuous-aggregates]: /how-to-guides/continuous-aggregates
[candlestick]: https://en.wikipedia.org/wiki/Candlestick_chart
[time-bucket]: /api/:currentVersion:/hyperfunctions/time_bucket/
[max]: https://www.postgresql.org/docs/current/tutorial-agg.html
[min]: https://www.postgresql.org/docs/current/tutorial-agg.html
[first]: /api/:currentVersion:/hyperfunctions/first/
[last]: /api/:currentVersion:/hyperfunctions/last/