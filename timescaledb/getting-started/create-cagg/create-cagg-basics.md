# Creating continuous aggregates

Now that you've been introduced to continuous aggregates, create your own continuous
aggregate from your data. 

## Step 1: Create an aggregate query to use in your continuous aggregate

The data we are using for this tutorial is second-by-second (tick) data for stock trades. 
A popular aggregate pattern used for analyzing stock data is called a [candlestick][candlestick]. 
Generally, candlestick charts use 4 different aggregations over a specific interval 
of time (for example, 1-minute, 5-minute, or 1-day aggregates):

* `high`: highest stock price per interval
* `open`: opening stock price per interval
* `close`: closing stock price per interval
* `low`: lowest stock price per interval 

For this example query, the [`time_bucket()`][time-bucket] interval is 1 day. The 
`high` and `low` values can be found by using the PostgreSQL [`MAX()`][max] and [`MIN()`][min] 
functions. Finally, the `open` and `close` values can be found by using the [`first()`][first] 
and [`last()`][last] functions.  

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

## Step 2: Create continuous aggregate from aggregate query

Now that you have the aggregation query, you can use it to create a continuous aggregate. 

The `CREATE MATERIALIZED VIEW` command triggers the database to create a materialized view with 
the given name, in this case `stock_candlestick_daily`. In the next line, 
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

Notice that the `SELECT` statement is the same query you wrote earlier without the `ORDER BY` clause.
By default, this code both creates the aggregate *and* materializes the aggregated data.
That means the view is created *and* populated with the aggregate calculations from
your existing hypertable data. 

  <img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/getting-started/continuous-aggregate.jpg" alt="Continuous aggregate upon creation"/>

The query may take some time to run because it needs to perform these calculations. 
After the calculation results are stored, querying the data from the 
continuous aggregate is much faster. Run the following query to get all the data in your 
continuous aggregate, and note how much faster this is than running the aggregate `SELECT` 
query on the raw hypertable data.

```sql
SELECT * FROM stock_candlestick_daily
ORDER BY day DESC, symbol;
```

By default, when you query a continuous aggregate, TimescaleDB also includes recent
data that hasn't yet been materialized. In the diagram above, that corresponds to the last
three points of raw data, which belong to an incomplete bucket. This unmaterialized data
is aggregated in real time to provide the most up-to-date results for your query.

<highlight type="note">
To inspect details about a continuous aggregate, such as its 
configuration or the query used to define it, use the following 
informational view:

```sql
SELECT * FROM timescaledb_information.continuous_aggregates;
```
</highlight>

Results:

```bash
|hypertable_schema|hypertable_name |view_schema|view_name              |view_owner|materialized_only|compression_enabled|materialization_hypertable_schema|materialization_hypertable_name|view_definition|
|-|-|-|-|-|-|-|-|-|-|
|public|stocks_real_time|public|stock_candlestick_daily|tsdbadmin |false|false|_timescaledb_internal        |_materialized_hypertable_11|SELECT time_bucket('1 day'::interval, srt."time") AS day,srt.symbol, max(srt.price) AS high, first(srt.price, srt."time") AS open, last(srt.price, srt."time") AS close, min(srt.price) AS low FROM stocks_real_time srt GROUP BY day, srt.symbol|


Now that your continuous aggregate is created, the next step is to create a [continuous aggregate refresh policy][cagg-policy].

Without an automatic refresh policy, your continuous aggregate won't materialize new data as it is 
inserted into the `stocks_real_time` hypertable. As mentioned before, when you query your continuous
aggregate, TimescaleDB performs real-time aggregation to include any unmaterialized
data. As the amount of unmaterialized data grows, this can slow down your queries.

With a continuous aggregate policy, your new data automatically materializes into your continuous aggregate,
keeping the need for real-time computations low and your continuous aggregate queries efficient.


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
[cagg-policy]: /getting-started/create-cagg/create-cagg-policy/