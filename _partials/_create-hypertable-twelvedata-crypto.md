
## Optimize time-series data in a hypertable

Hypertables are the core of $TIMESCALE_DB, they enable $CLOUD_LONG to work
efficiently with time-series data. Hypertables are PostgreSQL tables that automatically 
partition your time-series data by time. When you run a query, $CLOUD_LONG identifies the 
correct partition and runs the query on it, instead of going through the entire table.

Because $TIMESCALE_DB is 100% PostgreSQL, you can create standard PostgreSQL tables, indexes, stored 
procedures, and other objects alongside your Timescale hypertables. This makes creating and working
with hypertables similar to standard PostgreSQL.

<Procedure>

1. Connect to your $SERVICE_LONG.

   In [$CONSOLE][services-portal] open an [SQL editor][in-console-editors]. You can also connect to your service using [psql][connect-using-psql].

1.  Create a standard PostgreSQL table to store the real-time cryptocurrency data:

    ```sql
    CREATE TABLE crypto_ticks (
        "time" TIMESTAMPTZ,
        symbol TEXT,
        price DOUBLE PRECISION,
        day_volume NUMERIC
    );
    ```

1.  Convert the standard table into a hypertable partitioned on the `time`
    column using the `create_hypertable()` function provided by Timescale. You
    must provide the name of the table and the column in that table that holds
    the timestamp data to use for partitioning:

    ```sql
    SELECT create_hypertable('crypto_ticks', by_range('time'));
    ```

</Procedure>

## Create a standard PostgreSQL table for relational data

When you have relational data that enhances your time-series data, store that data in
standard PostgreSQL relational tables. 

<Procedure>

1.  Add a table to store the asset symbol and name in a relational table:

    ```sql
    CREATE TABLE crypto_assets (
        symbol TEXT UNIQUE,
        "name" TEXT
    );
    ```

</Procedure>

You now have two tables within your $SERVICE_LONG. A hypertable named `crypto_ticks`, and a normal 
PostgreSQL table named `crypto_assets`.

[in-console-editors]: /getting-started/:currentVersion:/run-queries-from-console/
[services-portal]: https://console.cloud.timescale.com/dashboard/services
[connect-using-psql]: /integrations/:currentVersion:/psql
