
# Create a hypertable

Hypertables are the core of Timescale. Hypertables enable Timescale to work
efficiently with time-series data. Because Timescale is PostgreSQL, all the
standard PostgreSQL tables, indexes, stored procedures and other objects can be
created alongside your Timescale hypertables. This makes creating and working
with Timescale tables similar to standard PostgreSQL.

<Procedure>

### Creating a hypertable

1.  Create a standard PostgreSQL table to store the real-time stock trade data
    using `CREATE TABLE`:

    ```sql
    CREATE TABLE stocks_real_time (
      time TIMESTAMPTZ NOT NULL,
      symbol TEXT NOT NULL,
      price DOUBLE PRECISION NULL,
      day_volume INT NULL
    );
    ```

1.  Convert the standard table into a hypertable partitioned on the `time`
    column using the `create_hypertable()` function provided by Timescale. You
    must provide the name of the table and the column in that table that holds
    the timestamp data to use for partitioning:

    ```sql
    SELECT create_hypertable('stocks_real_time','time');
    ```

1.  Create an index to support efficient queries on the `symbol` and `time`
    columns:

    ```sql
    CREATE INDEX ix_symbol_time ON stocks_real_time (symbol, time DESC);
    ```

<Highlight type="note">
When you create a hypertable, it is automatically partitioned on the time column
you provide as the second parameter to `create_hypertable()`. Also, Timescale
automatically creates an index on the time column. However, you'll often filter
your time-series data on other columns as well. Using indexes appropriately helps
your queries perform better.

Because you often query the stock trade data by the company symbol, you
should add an index for it. Include the time column because time-series data
typically looks for data in a specific period of time.
</Highlight>

</Procedure>

## Create standard PostgreSQL tables for relational data

When you have other relational data that enhances your time-series data, you can
create standard PostgreSQL tables just as you would normally. For this dataset,
there is one other table of data called `company`.

<Procedure>

### Creating standard PostgreSQL tables

1.  Add a table to store the company name and symbol for the stock trade data:

    ```sql
    CREATE TABLE company (
      symbol TEXT NOT NULL,
      name TEXT NOT NULL
    );
    ```

1.  You now have two tables within your Timescale database. One hypertable
    named `stocks_real_time`, and one normal PostgreSQL table named `company`.

</Procedure>
