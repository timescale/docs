import HypertableIntro from "versionContent/_partials/_tutorials_hypertable_intro.mdx";
import CreateHypertablePolicyNote from "versionContent/_partials/_create-hypertable-columnstore-policy-note.mdx";

## Optimize time-series data in a hypertable

<HypertableIntro />

<Procedure>

1. **Connect to your $SERVICE_LONG**

   In [$CONSOLE][services-portal] open an [SQL editor][in-console-editors]. You can also connect to your service using [psql][psql].

1. **Create a $HYPERTABLE to store the real-time cryptocurrency data**

   Create a [$HYPERTABLE][hypertables-section] for your time-series data using [CREATE TABLE][hypertable-create-table].
   For [efficient queries][secondary-indexes] on data in the columnstore, remember to `segmentby` the column you will
   use most often to filter your data:

    ```sql
    CREATE TABLE crypto_ticks (
        "time" TIMESTAMPTZ,
        symbol TEXT,
        price DOUBLE PRECISION,
        day_volume NUMERIC
    ) WITH (
       tsdb.hypertable,
       tsdb.segmentby='symbol', 
       tsdb.orderby='time DESC'
    );
    ```
   <CreateHypertablePolicyNote />
   
</Procedure>

## Create a standard $PG table for relational data

When you have relational data that enhances your time-series data, store that data in
standard $PG relational tables. 

<Procedure>

1.  **Add a table to store the asset symbol and name in a relational table**

    ```sql
    CREATE TABLE crypto_assets (
        symbol TEXT UNIQUE,
        "name" TEXT
    );
    ```

</Procedure>

You now have two tables within your $SERVICE_LONG. A hypertable named `crypto_ticks`, and a normal
$PG table named `crypto_assets`.

[in-console-editors]: /getting-started/:currentVersion:/run-queries-from-console/
[services-portal]: https://console.cloud.timescale.com/dashboard/services
[psql]: /integrations/:currentVersion:/psql
[hypertable-create-table]: /api/:currentVersion:/hypertable/create_table/
[hypertables-section]: /use-timescale/:currentVersion:/hypertables/
[secondary-indexes]: /use-timescale/:currentVersion:/hypercore/secondary-indexes/
