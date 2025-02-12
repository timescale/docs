1.  **Monitor energy consumption on a day-to-day basis**

    1.  Create a continuous aggregate `kwh_day_by_day` for energy consumption:

        ```sql
        CREATE MATERIALIZED VIEW kwh_day_by_day(time, value)
           with (timescaledb.continuous) as
        SELECT time_bucket('1 day', created, 'Europe/Berlin') AS "time",
               round((last(value, created) - first(value, created)) * 100.) / 100. AS value
        FROM metrics
        WHERE type_id = 5
        GROUP BY 1;
        ```

    1.  Add a refresh policy to keep `kwh_day_by_day` up-to-date:

        ```sql
        SELECT add_continuous_aggregate_policy('kwh_day_by_day',
           start_offset => NULL,
           end_offset => INTERVAL '1 hour',
           schedule_interval => INTERVAL '1 hour');
        ```

1.  **Monitor energy consumption on an hourly basis**

    1. Create a continuous aggregate `kwh_hour_by_hour` for energy consumption:

       ```sql
       CREATE MATERIALIZED VIEW kwh_hour_by_hour(time, value)
         with (timescaledb.continuous) as
       SELECT time_bucket('01:00:00', metrics.created, 'Europe/Berlin') AS "time",
              round((last(value, created) - first(value, created)) * 100.) / 100. AS value
       FROM metrics
       WHERE type_id = 5
       GROUP BY 1;
       ```

    1.  Add a refresh policy to keep the continuous aggregate up-to-date:

       ```sql
       SELECT add_continuous_aggregate_policy('kwh_hour_by_hour',
        start_offset => NULL,
           end_offset => INTERVAL '1 hour',
           schedule_interval => INTERVAL '1 hour');
       ```

1.  **Confirm that the continuous aggregates exist in your $SERVICE_SHORT**

    ```sql
    SELECT view_name, format('%I.%I', materialization_hypertable_schema,materialization_hypertable_name) AS materialization_hypertable
    FROM timescaledb_information.continuous_aggregates;
    ```

    You should see:

    ```sql
     view_name     |            materialization_hypertable
    ------------------+--------------------------------------------------
     kwh_day_by_day   | _timescaledb_internal._materialized_hypertable_2
     kwh_hour_by_hour | _timescaledb_internal._materialized_hypertable_3

    ```
