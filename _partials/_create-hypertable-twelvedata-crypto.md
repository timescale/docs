
## Create a hypertable

Hypertables are the core of TimescaleDB. Hypertables enable TimescaleDB to work
efficiently with time-series data. Because TimescaleDB is PostgreSQL, all the
standard PostgreSQL tables, indexes, stored procedures, and other objects can be
created alongside your TimescaleDB hypertables. This makes creating and working
with TimescaleDB tables similar to standard PostgreSQL.

<procedure>

### Creating a hypertable

1.  Create a standard PostgreSQL table to store the real-time cryptocurrency data
    using `CREATE TABLE`:

    ```sql
    CREATE TABLE crypto_ticks (
        "time" TIMESTAMPTZ,
        symbol TEXT,
        price DOUBLE PRECISION,
        day_volume NUMERIC
    );
    ```

1.  Convert the standard table into a hypertable partitioned on the `time`
    column using the `create_hypertable()` function provided by TimescaleDB. You
    must provide the name of the table and the column in that table that holds
    the timestamp data to use for partitioning:

    ```sql
    SELECT create_hypertable('crypto_ticks', 'time');
    ```

</procedure>

## Create standard PostgreSQL tables for relational data

When you have other relational data that enhances your time-series data, you can
create standard PostgreSQL tables just as you would normally. For this dataset,
there is one other table of data called `crypto_assets`.

<procedure>

### Creating standard PostgreSQL tables

1.  Add a table to store the company name and symbol for the stock trade data:

    ```sql
    CREATE TABLE crypto_assets (
        symbol TEXT UNIQUE,
        "name" TEXT
    );
    ```

1.  You now have two tables within your TimescaleDB database. One hypertable
    named `crypto_ticks`, and one normal PostgreSQL table named `crypto_assets`.

</procedure>
