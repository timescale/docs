---
title: Create a continuous aggregate
excerpt: Learn to create a continuous aggregate and make sure you always have the latest aggregated data for your analytical queries
products: [cloud, mst, self_hosted]
keywords: [continuous aggregates, create]
---

import Since2220 from "versionContent/_partials/_since_2_22_0.mdx";

# Create continuous aggregates

Creating a continuous aggregate is a two-step process. You need to create the
view first, then enable a policy to keep the view refreshed. You can create the
view on a hypertable, or on top of another continuous aggregate. You can have
more than one continuous aggregate on each source table or view.

Continuous aggregates require a `time_bucket` on the time partitioning column of
the hypertable.

By default, views are automatically refreshed. You can adjust this by setting
the [WITH NO DATA][with-no-data] option. Additionally, the
view can not be a [security barrier view][postgres-security-barrier].

Continuous aggregates use hypertables in the background, which means that they
also use chunk time intervals. By default, the continuous aggregate's chunk time
interval is 10 times what the original hypertable's chunk time interval is. For
example, if the original hypertable's chunk time interval is 7 days, the
continuous aggregates that are on top of it have a 70 day chunk time
interval.

## Create a continuous aggregate

In this example, we are using a hypertable called `conditions`, and creating a
continuous aggregate view for daily weather data. The `GROUP BY` clause must
include a `time_bucket` expression which uses time dimension column of the
hypertable. Additionally, all functions and their arguments included in
`SELECT`, `GROUP BY`, and `HAVING` clauses must be
[immutable][postgres-immutable].

<Procedure>

### Creating a continuous aggregate

1.  At the `psql`prompt, create the materialized view:

    ```sql
    CREATE MATERIALIZED VIEW conditions_summary_daily
    WITH (timescaledb.continuous) AS
    SELECT device,
       time_bucket(INTERVAL '1 day', time) AS bucket,
       AVG(temperature),
       MAX(temperature),
       MIN(temperature)
    FROM conditions
    GROUP BY device, bucket;
    ```
 
    To create a continuous aggregate within a transaction block, use the [WITH NO DATA option][with-no-data]. 

    To improve continuous aggregate performance, [set `timescaledb.invalidate_using = 'wal'`][create_materialized_view] <Since2220 />. 

1.  Create a policy to refresh the view every hour:

    ```sql
    SELECT add_continuous_aggregate_policy('conditions_summary_daily',
      start_offset => INTERVAL '1 month',
      end_offset => INTERVAL '1 day',
      schedule_interval => INTERVAL '1 hour');
    ```
    
</Procedure>

You can use most $PG aggregate functions in continuous aggregations. To
see what $PG features are supported, check the
[function support table][cagg-function-support].

## Choosing an appropriate bucket interval

Continuous aggregates require a `time_bucket` on the time partitioning column of
the hypertable. The time bucket allows you to define a time interval, instead of
having to use specific timestamps. For example, you can define a time bucket as
five minutes, or one day.

You can't use [time_bucket_gapfill][hyperfunctions-api-gapfilling] directly in a
continuous aggregate. This is because you need access to previous data to
determine the gapfill content, which isn't yet available when you create the
continuous aggregate. You can work around this by creating the continuous
aggregate using [`time_bucket`][time_bucket], then querying the continuous
aggregate using `time_bucket_gapfill`.

## Using the WITH NO DATA option

By default, when you create a view for the first time, it is populated with
data. This is so that the aggregates can be computed across the entire
hypertable. If you don't want this to happen, for example if the table is very
large, or if new data is being continuously added, you can control the order in
which the data is refreshed. You can do this by adding a manual refresh with
your continuous aggregate policy using the `WITH NO DATA` option.

The `WITH NO DATA` option allows the continuous aggregate to be created
instantly, so you don't have to wait for the data to be aggregated. Data begins
to populate only when the policy begins to run. This means that only data newer
than the `start_offset` time begins to populate the continuous aggregate. If you
have historical data that is older than the `start_offset` interval, you need to
manually refresh the history up to the current `start_offset` to allow real-time
queries to run efficiently.

<Procedure>

### Creating a continuous aggregate with the WITH NO DATA option

1.  At the `psql` prompt, create the view:

    ```sql
    CREATE MATERIALIZED VIEW cagg_rides_view
    WITH (timescaledb.continuous) AS
    SELECT vendor_id,
    time_bucket('1h', pickup_datetime) AS hour,
      count(*) total_rides,
      avg(fare_amount) avg_fare,
      max(trip_distance) as max_trip_distance,
      min(trip_distance) as min_trip_distance
    FROM rides
    GROUP BY vendor_id, time_bucket('1h', pickup_datetime)
    WITH NO DATA;
    ```

1.  Manually refresh the view:

    ```sql
    CALL refresh_continuous_aggregate('cagg_rides_view', NULL, localtimestamp - INTERVAL '1 week');
    ```

1.  Add the policy:

    ```sql
    SELECT add_continuous_aggregate_policy('cagg_rides_view',
      start_offset => INTERVAL '1 week',
      end_offset   => INTERVAL '1 hour',
      schedule_interval => INTERVAL '30 minutes');
    ```

</Procedure>

## Create a continuous aggregate with a JOIN

In $TIMESCALE_DB V2.10 and later, with $PG v12 or later, you can
create a continuous aggregate with a query that also includes a `JOIN`. For
example:

```sql
CREATE MATERIALIZED VIEW conditions_summary_daily_3
WITH (timescaledb.continuous) AS
SELECT time_bucket(INTERVAL '1 day', day) AS bucket,
   AVG(temperature),
   MAX(temperature),
   MIN(temperature),
   name
FROM devices JOIN conditions USING (device_id)
GROUP BY name, bucket;
```

<Highlight type="note">

For more information about creating a continuous aggregate with a `JOIN`,
including some additional restrictions, see the
[about continuous aggregates section][about-caggs-join-clause].

</Highlight>

## Query continuous aggregates

When you have created a continuous aggregate and set a refresh policy, you can
query the view with a `SELECT` query. You can only specify a single hypertable
in the `FROM` clause. Including more hypertables, tables, views, or subqueries
in your `SELECT` query is not supported. Additionally, make sure that the
hypertable you are querying does not have
[row-level-security policies][postgres-rls]
enabled.

<Procedure>

### Querying a continuous aggregate

1.  At the `psql` prompt, query the continuous aggregate view called
    `conditions_summary_hourly` for the average, minimum, and maximum
    temperatures for the first quarter of 2021 recorded by device 5:

    ```sql
    SELECT *
      FROM conditions_summary_hourly
      WHERE device = 5
      AND bucket >= '2020-01-01'
      AND bucket < '2020-04-01';
    ```

1.  Alternatively, query the continuous aggregate view called
    `conditions_summary_hourly` for the top 20 largest metric spreads in that
    quarter:

    ```sql
    SELECT *
      FROM conditions_summary_hourly
      WHERE max - min > 1800
      AND bucket >= '2020-01-01' AND bucket < '2020-04-01'
      ORDER BY bucket DESC, device DESC LIMIT 20;
    ```

</Procedure>

## Use continuous aggregates with mutable functions: experimental

<Since2200 />

Mutable functions have experimental supported in the $CAGG query definition. Mutable functions are enabled 
by default. However, if you use them in a materialized query a warning is returned.

When using non-immutable functions you have to ensure these functions produce consistent results across 
continuous aggregate refresh runs. For example, if a function depends on the current time zone you have 
to ensure all your $CAGG refreshes run with a consistent setting for this.

## Use $CAGGs with window functions: experimental

<Since2200 />

Window functions have experimental supported in the $CAGG query definition. Window functions are disabled 
 by default. To enable them, set `timescaledb.enable_cagg_window_functions` to `true`.

<Highlight type="info">

Support is experimental, there is a risk of data inconsistency. For example, in backfill scenarios, buckets could be missed.

</Highlight>

### Create a window function 

To use a window function in a $CAGG: 

1. Create a simple table with to store a value at a specific time:

    ```sql
    CREATE TABLE example (
      time       TIMESTAMPZ        NOT NULL,
      value      TEXT              NOT NULL,
    );
    ```

1. Enable window functions.

   As window functions are experimental, in order to create continuous aggregates with window functions. 
   you have to `enable_cagg_window_functions`. 

   ```sql
    SET timescaledb.enable_cagg_window_functions TO TRUE;
    ```

1. Bucket your data by `time` and calculate the delta between time buckets using the `lag` window function:

    Window functions must stay within the time bucket. Any query that tries to look beyond the current 
    time bucket will produce incorrect results around the refresh boundaries. 
   ```sql
   CREATE MATERIALIZED VIEW example_aggregate
     WITH (timescaledb.continuous) AS
       SELECT
         time_bucket('1d', time),
         customer_id,
         sum(amount) AS amount,
         sum(amount) - LAG(sum(amount),1,NULL) OVER (PARTITION BY time_bucket('1d', time) ORDER BY sum(amount) DESC) AS amount_diff,
         ROW_NUMBER() OVER (PARTITION BY time_bucket('1d', time) ORDER BY sum(amount) DESC)
       FROM sales GROUP BY 1,2;
   ```
   Window functions that partition by time_bucket should be safe even with LAG()/LEAD()


### Window function workaround for older versions of $TIMESCALE_DB 

For $TIMESCALE_DB v2.19.3 and below, $CAGGs do not support window functions. To work around this:

1. Create a simple table with to store a value at a specific time:

    ```sql
    CREATE TABLE example (
      time       TIMESTAMPZ        NOT NULL,
      value      TEXT              NOT NULL,
    );
    ```
      
1. Create a continuous aggregate that does not use a window function:

   ```sql
   CREATE MATERIALIZED VIEW example_aggregate
     WITH (timescaledb.continuous) AS
       SELECT
         time_bucket('10 minutes', time) AS bucket,
         first(value, time) AS value
       FROM example GROUP BY bucket;
   ```

1.  Use the `lag`  window function on your continuous aggregate at query time:

    This speeds up your query by calculating the aggregation ahead of time. The
    delta is calculated at query time.

      ```sql
      SELECT
        bucket,
        value - lag(value, 1) OVER (ORDER BY bucket) AS delta
      FROM example_aggregate;
      ```

[hyperfunctions-api-gapfilling]: /api/:currentVersion:/hyperfunctions/gapfilling/time_bucket_gapfill/
[time_bucket]: /api/:currentVersion:/hyperfunctions/time_bucket/
[cagg-function-support]: /use-timescale/:currentVersion:/continuous-aggregates/about-continuous-aggregates/#function-support
[about-caggs-join-clause]: /use-timescale/:currentVersion:/continuous-aggregates/about-continuous-aggregates/#continuous-aggregates-with-a-join-clause
[postgres-immutable]: <https://www.postgresql.org/docs/current/xfunc-volatility.html>
[postgres-rls]: <https://www.postgresql.org/docs/current/ddl-rowsecurity.html>
[postgres-security-barrier]: <https://www.postgresql.org/docs/current/rules-privileges.html>

[create_materialized_view]: /api/:currentVersion:/continuous-aggregates/create_materialized_view/#parameters
[with-no-data]: /use-timescale/:currentVersion:/continuous-aggregates/create-a-continuous-aggregate/#using-the-with-no-data-option
[with-no-data]: /use-timescale/:currentVersion:/continuous-aggregates/create-a-continuous-aggregate/#using-the-with-no-data-option
