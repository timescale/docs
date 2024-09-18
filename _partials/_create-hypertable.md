
<Procedure>

[Hypertables][hypertables] are PostgreSQL tables that automatically partition your data by time. You interact
with hypertables in the same way as regular PostgreSQL tables, but with extra features that makes managing your
time-series data much easier.

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
    );
    ```
    You see the result immediately:

    ![Data mode create table](https://assets.timescale.com/docs/images/data-mode-create-table.png)

1.  **Make a hypertable**

    Copy the following into your SQL editor, then run your query:
    ```sql
    SELECT create_hypertable('stocks_real_time', by_range('time'));
    ```
    In `Data`, you see the result immediately:

    ![Data mode create hypertable](https://assets.timescale.com/docs/images/data-mode-create-hypertable.png)

</Procedure>

[services-portal]: https://console.cloud.timescale.com/dashboard/services
[install-psql]: /use-timescale/:currentVersion:/integrations/query-admin/psql/
[popsql]: /getting-started/:currentVersion:/run-queries-from-console/#popsql
[run-sqleditor]: /getting-started/:currentVersion:/run-queries-from-console/#sql-editor
[install-psql]: /use-timescale/:currentVersion:/integrations/query-admin/psql/
[hypertables]: /use-timescale/:currentVersion:/hypertables/about-hypertables/#hypertable-partitioning
