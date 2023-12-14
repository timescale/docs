
## Create a hypertable

Hypertables are the core of Timescale. Hypertables enable Timescale to work
efficiently with time-series data. Because Timescale is PostgreSQL, all the
standard PostgreSQL tables, indexes, stored procedures and other objects can be
created alongside your Timescale hypertables. This makes creating and working
with Timescale tables similar to standard PostgreSQL.

<Procedure>

### Creating a hypertable

1.  Create a standard PostgreSQL table to store the Bitcoin blockchain data
    using `CREATE TABLE`:

    ```sql
    CREATE TABLE transactions (
       time TIMESTAMPTZ,
       block_id INT,
       hash TEXT,
       size INT,
       weight INT,
       is_coinbase BOOLEAN,
       output_total BIGINT,
       output_total_usd DOUBLE PRECISION,
       fee BIGINT,
       fee_usd DOUBLE PRECISION,
       details JSONB
    );
    ```

1.  Convert the standard table into a hypertable partitioned on the `time`
    column using the `create_hypertable()` function provided by Timescale. You
    must provide the name of the table and the column in that table that holds
    the timestamp data to use for partitioning:

    ```sql
    SELECT create_hypertable('transactions', by_range('time'));
    ```

	<Highlight type="note">
	The `by_range` dimension info constructor is an addition to TimescaleDB 2.13.
	</Highlight>

1.  Create an index on the `hash` column to make queries for individual
    transactions faster:

    ```sql
    CREATE INDEX hash_idx ON public.transactions USING HASH (hash);
    ```

1.  Create an index on the `block_id` column to make block-level queries faster:

    ```sql
    CREATE INDEX block_idx ON public.transactions (block_id);
    ```

1.  Create a unique index on the `time` and `hash` columns to make sure you
    don't accidentally insert duplicate records:

    ```sql
    CREATE UNIQUE INDEX time_hash_idx ON public.transactions (time, hash);
    ```

<Highlight type="note">
When you create a hypertable, it is automatically partitioned on the time column
you provide as the second parameter to `create_hypertable()`. Also, Timescale
automatically creates an index on the time column. However, you'll often filter
your time-series data on other columns as well. Using indexes appropriately helps
your queries perform better.
</Highlight>

</Procedure>
