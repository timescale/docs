import OldCreateHypertable from "versionContent/_partials/_old-api-create-hypertable.mdx";

## Optimize time-series data in hypertables

Hypertables are the core of Timescale. Hypertables enable Timescale to work
efficiently with time-series data. Because Timescale is PostgreSQL, all the
standard PostgreSQL tables, indexes, stored procedures and other objects can be
created alongside your Timescale hypertables. This makes creating and working
with Timescale tables similar to standard PostgreSQL.

<Procedure>

1.  Create a $HYPERTABLE to store the Bitcoin blockchain data using `CREATE TABLE`:

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
    ) WITH (
       tsdb.hypertable,
       tsdb.time_column='time'
    );
    ```
                
    <OldCreateHypertable />

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
