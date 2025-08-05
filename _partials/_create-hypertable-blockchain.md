import OldCreateHypertable from "versionContent/_partials/_old-api-create-hypertable.mdx";
import HypertableIntro from "versionContent/_partials/_tutorials_hypertable_intro.mdx";

## Optimize time-series data using hypertables

<HypertableIntro />

<Procedure>

1. Connect to your $SERVICE_LONG

   In [$CONSOLE][services-portal] open an [SQL editor][in-console-editors]. The in-Console editors display the query speed.
   You can also connect to your service using [psql][connect-using-psql].

1. Create a [$HYPERTABLE][hypertables-section] for your time-series data using [CREATE TABLE][hypertable-create-table]. 
   For [efficient queries][secondary-indexes] on data in the columnstore, remember to `segmentby` the column you will 
   use most often to filter your data:

    ```sql
    CREATE TABLE transactions (
       time TIMESTAMPTZ NOT NULL,
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
       tsdb.partition_column='time',
       tsdb.segmentby='block_id', 
       tsdb.orderby='time DESC'
    );
    ```
                
    <OldCreateHypertable />

1.  Create an index on the `hash` column to make queries for individual
    transactions faster:

    ```sql
    CREATE INDEX hash_idx ON public.transactions USING HASH (hash);
    ```

1.  Create an index on the `block_id` column to make block-level queries faster:

   When you create a $HYPERTABLE, it is partitioned on the time column. $TIMESCALE_DB
   automatically creates an index on the time column. However, you'll often filter
   your time-series data on other columns as well. You use [indexes][indexing] to improve
   query performance.

    ```sql
    CREATE INDEX block_idx ON public.transactions (block_id);
    ```

1.  Create a unique index on the `time` and `hash` columns to make sure you
    don't accidentally insert duplicate records:

    ```sql
    CREATE UNIQUE INDEX time_hash_idx ON public.transactions (time, hash);
    ```


</Procedure>

[hypertable-create-table]: /api/:currentVersion:/hypertable/create_table/
[indexing]: /use-timescale/:currentVersion:/schema-management/indexing/
[in-console-editors]: /getting-started/:currentVersion:/run-queries-from-console/
[services-portal]: https://console.cloud.timescale.com/dashboard/services
[connect-using-psql]: /integrations/:currentVersion:/psql#connect-to-your-service
[hypertable-create-table]: /api/:currentVersion:/hypertable/create_table/
[indexing]: /use-timescale/:currentVersion:/schema-management/indexing/
[hypertables-section]: /use-timescale/:currentVersion:/hypertables/
[hypertable-create-table]: /api/:currentVersion:/hypertable/create_table/
[hypercore]: /use-timescale/:currentVersion:/hypercore/
[secondary-indexes]: /use-timescale/:currentVersion:/hypercore/secondary-indexes/
