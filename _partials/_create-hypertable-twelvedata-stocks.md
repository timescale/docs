import HypertableIntro from "versionContent/_partials/_tutorials_hypertable_intro.mdx";
import CreateHypertablePolicyNote from "versionContent/_partials/_create-hypertable-columnstore-policy-note.mdx";

## Optimize time-series data in hypertables

<HypertableIntro />

<Procedure>

1. **Connect to your $SERVICE_LONG**

   In [$CONSOLE][services-portal] open an [SQL editor][in-console-editors]. You can also connect to your service using [psql][connect-using-psql].

1. **Create a $HYPERTABLE to store the real-time stock data**

    ```sql
    CREATE TABLE stocks_real_time (
      time TIMESTAMPTZ NOT NULL,
      symbol TEXT NOT NULL,
      price DOUBLE PRECISION NULL,
      day_volume INT NULL
    ) WITH (
       tsdb.hypertable
    );
    ```
   <CreateHypertablePolicyNote />

1.  **Create an index to support efficient queries** 

    Index on the `symbol` and `time` columns:

    ```sql
    CREATE INDEX ix_symbol_time ON stocks_real_time (symbol, time DESC);
    ```

</Procedure>

## Create standard $PG tables for relational data

When you have other relational data that enhances your time-series data, you can
create standard $PG tables just as you would normally. For this dataset,
there is one other table of data called `company`.

<Procedure>

1.  **Add a table to store the company data**

    ```sql
    CREATE TABLE company (
      symbol TEXT NOT NULL,
      name TEXT NOT NULL
    );
    ```

</Procedure>

You now have two tables in your $SERVICE_LONG. One hypertable
named `stocks_real_time`, and one regular $PG table named `company`.

[connect-using-psql]: /integrations/:currentVersion:/psql/#connect-to-your-service
[in-console-editors]: /getting-started/:currentVersion:/run-queries-from-console/
[services-portal]: https://console.cloud.tigerdata.com/dashboard/services
