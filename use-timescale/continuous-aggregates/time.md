---
title: Time and continuous aggregates
excerpt: How to work with timezones and continuous aggregates
products: [cloud, mst, self_hosted]
keywords: [continuous aggregates]
---

# Time and continuous aggregates

Functions that depend on a local timezone setting inside a continuous aggregate
are not supported. You cannot adjust to a local time because the timezone setting
changes from user to user.

To manage this, you can use explicit timezones in the view definition.
Alternatively, you can create your own custom aggregation scheme for tables that
use an integer time column.

## Declare an explicit timezone

The most common method of working with timezones is to declare an explicit
timezone in the view query.

<Procedure>

### Declaring an explicit timezone

1.  At the `psql`prompt, create the view and declare the timezone:

    ```sql
    CREATE MATERIALIZED VIEW device_summary
    WITH (timescaledb.continuous)
    AS
    SELECT
      time_bucket('1 hour', observation_time) AS bucket,
      min(observation_time AT TIME ZONE 'EST') AS min_time,
      device_id,
      avg(metric) AS metric_avg,
      max(metric) - min(metric) AS metric_spread
    FROM
      device_readings
    GROUP BY bucket, device_id;
    ```

1.  Alternatively, you can cast to a timestamp after the view using `SELECT`:

    ```sql
    SELECT min_time::timestamp FROM device_summary;
    ```

</Procedure>

## Integer-based time

Date and time is usually expressed as year-month-day and hours:minutes:seconds.
Most Timescale databases use a [date/time-type][postgres-date-time] column to
express the date and time. However, in some cases, you might need to convert
these common time and date formats to a format that uses an integer. The most
common integer time is Unix epoch time, which is the number of seconds since the
Unix epoch of 1970-01-01, but other types of integer-based time formats are
possible.

These examples use a hypertable called `devices` that contains CPU and disk
usage information. The devices measure time using the Unix epoch.

To create a hypertable that uses an integer-based column as time, you need to
provide the chunk time interval. In this case, each chunk is 10 minutes.

<Procedure>

### Creating a table with a custom integer-based time column

1.  At the `psql` prompt, create a table and define the integer-based time column:

    ```sql
    CREATE TABLE devices(
      time BIGINT,        -- Time in minutes since epoch
      cpu_usage INTEGER,  -- Total CPU usage
      disk_usage INTEGER, -- Total disk usage
      PRIMARY KEY (time)
    );
    ```

1.  Define the chunk time interval:

    ```sql
    SELECT create_hypertable('devices', 'time',
      chunk_time_interval => 10);
    ```

</Procedure>

To define a continuous aggregate on a hypertable that uses integer-based time,
you need to have a function to get the current time in the correct format, and
set it for the hypertable. You can do this with the
[`set_integer_now_func`][api-set-integer-now-func]
function. It can be defined as a regular PostgreSQL function, but needs to be
[`STABLE`][pg-func-stable],
take no arguments, and return an integer value of the same type as the time
column in the table. When you have set up the time-handling, you can create the
continuous aggregate.

<Procedure>

### Creating a continuous aggregate with integer-based time

1.  At the `psql` prompt, set up a function to convert the time to the Unix epoch:

    ```sql
    CREATE FUNCTION current_epoch() RETURNS BIGINT
    LANGUAGE SQL STABLE AS $$
    SELECT EXTRACT(EPOCH FROM CURRENT_TIMESTAMP::bigint;$$;

     SELECT set_integer_now_func('devices', 'current_epoch');
     ```

1.  Create the continuous aggregate for the `devices` table:

    ```sql
    CREATE MATERIALIZED VIEW devices_summary
    WITH (timescaledb.continuous) AS
    SELECT time_bucket('500', time) AS bucket,
       avg(cpu_usage) AS avg_cpu,
       avg(disk_usage) AS avg_disk
    FROM devices
    GROUP BY bucket;
    ```

1.  Insert some rows into the table:

    ```sql
    CREATE EXTENSION tablefunc;

    INSERT INTO devices(time, cpu_usage, disk_usage)
    SELECT time,
       normal_rand(1,70,10) AS cpu_usage,
      normal_rand(1,2,1) * (row_number() over()) AS disk_usage
    FROM generate_series(1,10000) AS time;
    ```

    This command uses the `tablefunc` extension to generate a normal
    distribution, and uses the `row_number` function to turn it into a
    cumulative sequence.
1.  Check that the view contains the correct data:

    ```sql
    postgres=# SELECT * FROM devices_summary ORDER BY bucket LIMIT 10;
    bucket |       avg_cpu       |       avg_disk
    --------+---------------------+----------------------
         0 | 63.0000000000000000 |   6.0000000000000000
         5 | 69.8000000000000000 |   9.6000000000000000
        10 | 70.8000000000000000 |  24.0000000000000000
        15 | 75.8000000000000000 |  37.6000000000000000
        20 | 71.6000000000000000 |  26.8000000000000000
        25 | 67.6000000000000000 |  56.0000000000000000
        30 | 68.8000000000000000 |  90.2000000000000000
        35 | 71.6000000000000000 |  88.8000000000000000
        40 | 66.4000000000000000 |  81.2000000000000000
        45 | 68.2000000000000000 | 106.0000000000000000
    (10 rows)
    ```

</Procedure>

[api-set-integer-now-func]: /api/:currentVersion:/hypertable/set_integer_now_func
[pg-func-stable]: https://www.postgresql.org/docs/current/static/sql-createfunction.html
[postgres-date-time]: https://www.postgresql.org/docs/current/datatype-datetime.html
