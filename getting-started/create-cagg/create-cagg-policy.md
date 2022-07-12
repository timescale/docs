---
title: Using and setting up continuous aggregate policies
excerpt: Set a policy to refresh your continuous aggregates automatically
keywords: [continuous aggregates, policies]
---

# Using and setting up continuous aggregate policies
You now have a continuous aggregate, but you have not updated any data or
created an automatic policy. There are two ways to update a continuous
aggregate:

1. Automatic continuous aggregate refresh policy
1. Manual refresh

These methods enable you to refresh materialized data in your continuous
aggregates when it's most convenient. For example, you can perform refreshes
during low query-load times on your database.

  <img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/getting-started/continuous-aggregate-policy.jpg" alt="Continuous aggregate with refresh policy"/>

## Create a continuous aggregate refresh policy
To refresh your continuous aggregate on a schedule, set up an automatic refresh
policy. Automatic refresh policies are considered a best practice in TimescaleDB
and should be created for most continuous aggregates. Using the automated
[continuous aggregate policy][auto-refresh]
to update continuous aggregate data allows you to "set it and forget it,"
ensuring that new hypertable data is materialized over time as it is
inserted into the database.

<procedure>

### Creating a continuous aggregate refresh policy

1.  Use this SQL command to create an auto-updating policy for the continuous
    aggregate `stock_candlestick_daily`:

    ```sql
    SELECT add_continuous_aggregate_policy('stock_candlestick_daily',
      start_offset => INTERVAL '3 days',
      end_offset => INTERVAL '1 hour',
      schedule_interval => INTERVAL '1 days');
    ```

1.  This policy runs once a day, as set by `schedule_interval`. When it runs, it
    materializes data from between 3 days ago and 1 hour ago, as set by
    `start_offset` and `end_offset`. Offset times are calculated relative to
    query execution time. The executed query is the one defined in the
    continuous aggregate `stock_candlestick_daily`.

</procedure>

## Manually refresh a continuous aggregate

You can [manually refresh a continuous aggregate][manual-refresh] using a one-time refresh.
This is most useful when data is inserted or modified that is outside of the
refresh policy `start_offset` and `end_offset` interval. This is common in edge
IoT systems where devices lose their internet connection for long periods of time
and eventually send historical readings once they are reconnected.

<procedure>

### Manually refreshing a continuous aggregate

1.  Refresh the continuous aggregate `stock_candlestick_daily` for data within
    the past week:

    ```sql
    CALL refresh_continuous_aggregate(
      'stock_candlestick_daily',
      now() - INTERVAL '1 week',
      now()
    );
    ```

1.  This manual refresh updates your continuous aggregate only once. It doesn't
    keep the aggregate up to date automatically. To set up an automatic refresh
    policy, see the preceding section on continuous aggregate refresh policies.

</procedure>

<video url="https://www.youtube.com/embed/WObBOJlCYVs"></video>

## Next steps
Now that you have a continuous aggregate set up and refreshing automatically,
see how TimescaleDB can save you up to 96% on storage costs while speeding up
historical queries using [native compression][getting-started-compression].

## Learn more about continuous aggregates
See how real TimescaleDB users leverage continuous aggregates in the blog posts
[How FlightAware fuels flight prediction models for global travelers with
TimescaleDB and Grafana][flightaware] and [How I power a (successful) crypto
trading bot with TimescaleDB][crypto-bot].

For detailed information on continuous aggregates and real-time aggregation,
see the [continuous aggregates section][continuous-aggregates].

[getting-started-compression]: /getting-started/:currentVersion:/compress-data/
[flightaware]: https://blog.timescale.com/blog/how-flightaware-fuels-flight-prediction-models-with-timescaledb-and-grafana/
[crypto-bot]: https://blog.timescale.com/blog/how-i-power-a-successful-crypto-trading-bot-with-timescaledb/
[continuous-aggregates]: /timescaledb/:currentVersion:/how-to-guides/continuous-aggregates
[manual-refresh]: /api/:currentVersion:/continuous-aggregates/refresh_continuous_aggregate/
[auto-refresh]: /api/:currentVersion:/continuous-aggregates/add_continuous_aggregate_policy/
