# Create a continuous aggregate
Creating a continuous aggregate is a two-step process. You need to create the
view first, then enable a policy to keep the view refreshed. You can have more
than one continuous aggregate on a single hypertable.

Continuous aggregates require a `time_bucket` on the time partitioning column of
the hypertable. The time bucket allows you to define a time interval, instead of
having to use specific timestamps. For example, you can define a time bucket as
five minutes, or one day. You can read more about the time bucket function in
our [API Guide][api-time-bucket].

## Create a continuous aggregate
In this  example, we are using a hypertable called `conditions`, and creating a
continuous aggregate view for daily weather data.

### Procedure: Creating a continuous aggregate
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
1.  Create a policy to refresh the view every hour:
    ```sql
    SELECT add_continuous_aggregate_policy('conditions_summary_daily',
	     start_offset => INTERVAL '1 month',
	     end_offset => INTERVAL '1 day',
	     schedule_interval => INTERVAL '1 hour');
    ```

Continuous aggregates are supported for most aggregate functions that can
be [parallelized by PostgreSQL][postgres-parallel-agg], including the standard
aggregates like `SUM` and `AVG`. However, aggregates using `ORDER BY` and
`DISTINCT` cannot be used with continuous aggregates since they are not possible
to parallelize by PostgreSQL. TimescaleDB does not currently support the
`FILTER` clause.

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

### Procedure: Creating a continuous aggregate with the WITH NO DATA option
1.  At the `psql` prompt, create the view:
    ```sql
    CREATE MATERIALIZED VIEW cagg_rides_view
    WITH (timescaledb.continuous) AS
    SELECT vendor_id,
    time_bucket('1h', pickup_datetime) AS day,
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

[api-time-bucket]: api/time_bucket
[postgres-parallel-agg]: https://www.postgresql.org/docs/current/parallel-plans.html#PARALLEL-AGGREGATION
