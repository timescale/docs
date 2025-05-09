import HypertableIntro from "versionContent/_partials/_tutorials_hypertable_intro.mdx";
import OldCreateHypertable from "versionContent/_partials/_old-api-create-hypertable.mdx";

<Procedure>

<HypertableIntro />

To create a hypertable:

1. **Connect to your service**

    In Timescale Console, click `Data`, then select a service.

1. **Create a PostgreSQL table** 

    Copy the following into your query, then click `Run`:

    ```sql
    CREATE TABLE stocks_real_time (
      time TIMESTAMPTZ NOT NULL,
      symbol TEXT NOT NULL,
      price DOUBLE PRECISION NULL,
      day_volume INT NULL
    ) WITH (
       tsdb.hypertable,
       tsdb.partition_column='time'
    );
    ```
   <OldCreateHypertable />

   You see the result immediately:

   ![Data mode create table](https://assets.timescale.com/docs/images/data-mode-create-table.png)

</Procedure>

[services-portal]: https://console.cloud.timescale.com/dashboard/services
[install-psql]: /integrations/:currentVersion:/psql/
[popsql]: /getting-started/:currentVersion:/run-queries-from-console/#data-mode
[run-sqleditor]: /getting-started/:currentVersion:/run-queries-from-console/#sql-editor
[hypertables]: /use-timescale/:currentVersion:/hypertables/#hypertable-partitioning

[hypertable-create-table]: /api/:currentVersion:/hypertable/create_table/
