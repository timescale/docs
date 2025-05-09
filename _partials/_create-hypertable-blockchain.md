
## Optimize time-series data using hypertables

$HYPERTABLE_CAPs are the core of $TIMESCALE_DB. $HYPERTABLE_CAPs enable $TIMESCALE_DB to work
efficiently with time-series data. Because $TIMESCALE_DB is a $PG extension, all the
standard $PG tables, indexes, stored procedures and other objects can be
created alongside your $TIMESCALE_DB $HYPERTABLE. This makes creating and working
with $HYPERTABLEs similar to standard $PG.

<Procedure>

1. Connect to your $SERVICE_LONG

   In [$CONSOLE][services-portal] open an [SQL editor][in-console-editors]. The in-Console editors display the query speed.
   You can also connect to your service using [psql][connect-using-psql].

1.  Create a standard $PG table to store the Bitcoin blockchain data
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

1.  Convert the standard table into a $HYPERTABLE partitioned on the `time`
    column using the `create_hypertable()` function provided by $TIMESCALE_DB. You
    must provide the name of the table and the column in that table that holds
    the timestamp data to use for partitioning:

    ```sql
    SELECT create_hypertable('transactions', by_range('time'));
    ```

	<Highlight type="note">
    
	The `by_range` dimension builder is an addition to $TIMESCALE_DB 2.13.

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

When you create a $HYPERTABLE, it is automatically partitioned on the time column
you provide as the second parameter to `create_hypertable()`. Also, $TIMESCALE_DB
automatically creates an index on the time column. However, you'll often filter
your time-series data on other columns as well. Using indexes appropriately helps
your queries perform better.

</Highlight>

</Procedure>

[in-console-editors]: /getting-started/:currentVersion:/run-queries-from-console/
[services-portal]: https://console.cloud.timescale.com/dashboard/services
[connect-using-psql]: /integrations/:currentVersion:/psql#connect-to-your-service
