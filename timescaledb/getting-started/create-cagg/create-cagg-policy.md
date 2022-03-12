# Using and setting up continuous aggregate policies

You've created a continuous aggregate but you have not updated any data or created an automatic 
policy. There are two ways to update a continuous aggregate: 
1. Manual refresh
2. Automatic continuous aggregate refresh policy

These methods enable you to refresh materialized data in your
continuous aggregates when it's most convenient for you (for example, during low
query-load times on your database).

  <img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/getting-started/continuous-aggregate-policy.jpg" alt="Continuous aggregate with refresh policy"/>

Let's look at how to do each one.

## Manual refresh

You can [manually refresh a continuous aggregate][manual-refresh] using a **one-shot refresh**.
This is useful for refreshing data for only a specific time period in the past
or if you want to materialize a lot of data at once on a once-off basis.

The example below refreshes the continuous aggregate `stock_candlestick_daily` 
for data that exists within the past week:

```sql
CALL refresh_continuous_aggregate('stock_candlestick_daily',now() - interval '1 week', now());
```
Once again, remember that this manual refresh policy **will not keep your continuous aggregate** 
**up-to-date automatically**. To set up an automatic refresh policy, you need to follow the section
below. 

## Automatic continuous aggregate refresh policy

The **automatic refresh policy** can also be used to refresh continuous aggregates 
according to a schedule. This type of policy is very useful for continuous aggregates where 
data is continually being added to the underlying hypertable. For stock data, like the kind used in this 
tutorial, an automatic refresh policy is extremely useful. 

Using the automated [continuous aggregate policy][auto-refresh] for updating continuous 
aggregate data allows you to "set it, and forget it" and guaruntees new data will be 
materialized overtime.

Let's create an auto-updating policy for our continuous aggregate `stock_candlestick_daily` 
that runs every three days, and refreshes aggregated data from the past week:

```sql
SELECT add_continuous_aggregate_policy('stock_candlestick_daily',
  start_offset => INTERVAL '1 week',
  end_offset => INTERVAL '1 hour',
  schedule_interval => INTERVAL '3 days');
```

This policy will run every 3 days (`schedule_interval`). When it runs, it
materializes data from between 1 week (`start_offset`) and 1 hour (`end_offset`)
from the time it executes, according to the query which defined the continuous
aggregate `stock_candlestick_daily`.


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

[manual-refresh]: /api/:currentVersion:/continuous-aggregates/refresh_continuous_aggregate/
[auto-refresh]: /api/:currentVersion:/continuous-aggregates/add_continuous_aggregate_policy/