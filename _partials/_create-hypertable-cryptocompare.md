
# Create a hypertable

Hypertables are the core of TimescaleDB. Hypertables enable TimescaleDB to work
efficiently with time-series data. Because TimescaleDB is PostgreSQL, all the
standard PostgreSQL tables, indexes, stored procedures and other objects can be
created alongside your TimescaleDB hypertables. This makes creating and working
with TimescaleDB tables similar to standard PostgreSQL.

<procedure>

### Creating hypertables

1.  Create a standard PostgreSQL table to store Bitcoin price data using
    `CREATE TABLE`:

    ```sql
    CREATE TABLE "btc_prices"(
       time            TIMESTAMP WITH TIME ZONE NOT NULL,
       opening_price   DOUBLE PRECISION,
       highest_price   DOUBLE PRECISION,
       lowest_price    DOUBLE PRECISION,
       closing_price   DOUBLE PRECISION,
       volume_btc      DOUBLE PRECISION,
       volume_currency DOUBLE PRECISION,
       currency_code   VARCHAR (10)
    );
    ```

1.  Create a standard PostgreSQL table to store Ethereum price data using
    `CREATE TABLE`:

    ```sql
    CREATE TABLE "eth_prices"(
       time            TIMESTAMP WITH TIME ZONE NOT NULL,
       opening_price   DOUBLE PRECISION,
       highest_price   DOUBLE PRECISION,
       lowest_price    DOUBLE PRECISION,
       closing_price   DOUBLE PRECISION,
       volume_eth      DOUBLE PRECISION,
       volume_currency DOUBLE PRECISION,
       currency_code   VARCHAR (10)
    );
    ```

1.  Create a standard PostgreSQL table to store price data for other
    cryptocurrencies using `CREATE TABLE`:

    ```sql
    CREATE TABLE "crypto_prices"(
       time            TIMESTAMP WITH TIME ZONE NOT NULL,
       opening_price   DOUBLE PRECISION,
       highest_price   DOUBLE PRECISION,
       lowest_price    DOUBLE PRECISION,
       closing_price   DOUBLE PRECISION,
       volume_crypto   DOUBLE PRECISION,
       volume_btc      DOUBLE PRECISION,
       currency_code   VARCHAR (10)
    );
    ```

1.  Convert the standard tables into hypertables partitioned on the `time`
    column using the `create_hypertable()` function provided by TimescaleDB. You
    must provide the name of the table and the column in that table that holds
    the timestamp data to use for partitioning:

    ```sql
    SELECT create_hypertable('btc_prices', 'time');
    SELECT create_hypertable('eth_prices', 'time');
    SELECT create_hypertable('crypto_prices', 'time');
    ```

</procedure>

## Create standard PostgreSQL tables for relational data

When you have other relational data that enhances your time-series data, you can
create standard PostgreSQL tables just as you would normally. For this dataset,
there is one other table of data called `currency_info`.

<procedure>

### Creating standard PostgreSQL tables

1.  Add a table to store the company name and symbol for the stock trade data:

    ```sql
    CREATE TABLE "currency_info"(
       currency_code   VARCHAR (10),
       currency        TEXT
    );
    ```

1.  You now have four tables within your TimescaleDB database. Three hypertables
    named `btc_prices`, `eth_prices`, and `crypto_prices`, and one standard PostgreSQL table named `currency_info`.

</procedure>
