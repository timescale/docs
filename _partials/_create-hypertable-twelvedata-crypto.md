
## Create a hypertable

Hypertables are the core of Timescale. Hypertables enable Timescale to work
efficiently with time-series data. Because Timescale is PostgreSQL, all the
standard PostgreSQL tables, indexes, stored procedures, and other objects can be
created alongside your Timescale hypertables. This makes creating and working
with Timescale tables similar to standard PostgreSQL.

<Procedure>

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
    column using the `create_hypertable()` function provided by Timescale. You
    must provide the name of the table and the column in that table that holds
    the timestamp data to use for partitioning:

    ```sql
    SELECT create_hypertable('crypto_ticks', 'time');
    ```

</Procedure>

## Create standard PostgreSQL tables for relational data

When you have other relational data that enhances your time-series data, you can
create standard PostgreSQL tables just as you would normally. For this dataset,
there is one other table of data called `crypto_assets`.

<Procedure>

### Creating standard PostgreSQL tables

1.  Add a table to store the company name and symbol for the stock trade data:

    ```sql
    CREATE TABLE crypto_assets (
        symbol TEXT UNIQUE,
        "name" TEXT
    );
    ```

1.  You now have two tables within your Timescale database. One hypertable
    named `crypto_ticks`, and one normal PostgreSQL table named `crypto_assets`.

</Procedure>
