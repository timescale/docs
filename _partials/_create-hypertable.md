import HypertableIntro from "versionContent/_partials/_tutorials_hypertable_intro.mdx";
import CreateHypertablePolicyNote from "versionContent/_partials/_create-hypertable-columnstore-policy-note.mdx";

<Procedure>

<HypertableIntro />

To create a hypertable:

1. **Connect to your service**

    In $CONSOLE, click `Data view`, then select a $SERVICE_SHORT.

1. **Create a $PG table** 

    Copy the following into your query, then click `Run`:

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

   You see the result immediately:

   ![Data view create table](https://assets.timescale.com/docs/images/data-mode-create-table.png)

</Procedure>

[services-portal]: https://console.cloud.timescale.com/dashboard/services
[install-psql]: /integrations/:currentVersion:/psql/
[popsql]: /getting-started/:currentVersion:/run-queries-from-console/#data-view
[run-sqleditor]: /getting-started/:currentVersion:/run-queries-from-console/#sql-editor
[hypertables]: /use-timescale/:currentVersion:/hypertables/#hypertable-partitioning
[hypertable-create-table]: /api/:currentVersion:/hypertable/create_table/
