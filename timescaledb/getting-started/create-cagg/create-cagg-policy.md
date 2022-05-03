# Using and setting up continuous aggregate policies

You now have a continuous aggregate, but you have not updated any data or created an automatic 
policy. There are two ways to update a continuous aggregate: 
1. Automatic continuous aggregate refresh policy
2. Manual refresh

These methods enable you to refresh materialized data in your
continuous aggregates when it's most convenient. For example, you can perform refreshes
during low query-load times on your database.

  <img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/getting-started/continuous-aggregate-policy.jpg" alt="Continuous aggregate with refresh policy"/>

## Automatic continuous aggregate refresh policy

To refresh your continuous aggregate on a schedule, set up an automatic refresh policy. Automatic 
refresh policies are useful for continuous aggregates where data is continually being added to 
the underlying hypertable. For example, stock data often has new records continually added. 
With this refresh policy, the data can be incorporated into your continuous aggregate automatically. 


Using the automated [continuous aggregate policy][auto-refresh] to update continuous 
aggregate data allows you to "set it and forget it." It guarantees that new data will be 
materialized over time.

In the next command, create an auto-updating policy for the continuous aggregate `stock_candlestick_daily`:

```sql
SELECT add_continuous_aggregate_policy('stock_candlestick_daily',
  start_offset => INTERVAL '3 days',
  end_offset => INTERVAL '1 hour',
  schedule_interval => INTERVAL '1 days');
```

This policy runs once a day, as set by `schedule_interval`. When it runs, it
materializes data from between 3 days ago and 1 hour ago, as set by `start_offset`
and `end_offset`. Offset times are calculated relative to query execution time.
The executed query is the one defined in the continuous
aggregate `stock_candlestick_daily`.


## Manual refresh

You can [manually refresh a continuous aggregate][manual-refresh] using a one-time refresh.
You might want to do so if you only need to refresh data for a specific time
period in the past, or if you want to materialize a lot of data at once on a once-off basis.

The example below refreshes the continuous aggregate `stock_candlestick_daily` 
for data within the past week:

```sql
CALL refresh_continuous_aggregate('stock_candlestick_daily',now() - interval '1 week', now());
```
This manual refresh updates your continuous aggregate once only. It doesn't keep the aggregate
up to date automatically. To set up an automatic refresh policy, see the preceding section on continuous
aggregate refresh policies.


## Learn more about continuous aggregates

See how real TimescaleDB users leverage continuous aggregates in the blog posts
[How FlightAware fuels flight prediction models for global travelers with
TimescaleDB and Grafana][flightaware] and [How I power a (successful) crypto
trading bot with TimescaleDB][crypto-bot].

For detailed information on continuous aggregates and real-time aggregation,
see the [continuous aggregates section][continuous-aggregates].

[flightaware]: https://blog.timescale.com/blog/how-flightaware-fuels-flight-prediction-models-with-timescaledb-and-grafana/
[crypto-bot]: https://blog.timescale.com/blog/how-i-power-a-successful-crypto-trading-bot-with-timescaledb/
[continuous-aggregates]: /how-to-guides/continuous-aggregates

[manual-refresh]: /api/:currentVersion:/continuous-aggregates/refresh_continuous_aggregate/
[auto-refresh]: /api/:currentVersion:/continuous-aggregates/add_continuous_aggregate_policy/