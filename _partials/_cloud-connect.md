## Check your service and connect to it

<Procedure>

To ensure a Timescale service is running correctly:

1. **Check your service**

    In [Timescale Console][services-portal], select a service and check that it is marked as `Running`.

   ![Check service is running](https://assets.timescale.com/docs/images/cloud-sql-editors.png)

1. **Connect to your service**

    Use either:
    - A Cloud SQL editor from Timescale Console:
      - [SQL editor][run-sqleditor]: in Timescale Console, click `SQL editor`. You can now run queries for this service.
      - [PopSQL][popsql]:  in Timescale Console, click `PopSQL`, then follow the instructions to easily connect to
        this service with PopSQL.
    - The command line:
      - [psql][install-psql]: connect to your service with the value of `Service URL` from the config file you
        just saved:

        <CodeBlock canCopy={true} showLineNumbers={false} children={`
        psql "postgres://tsdbadmin:<PASSWORD>@<HOST>:<PORT>/tsdb?sslmode=require"
        `} />

    You are connected to your service and can issue commands.

1. **Create a PostgreSQL table**

    Copy the following into your SQL editor, then run your query:

    ```sql
    CREATE TABLE stocks_real_time (
      time TIMESTAMPTZ NOT NULL,
      symbol TEXT NOT NULL,
      price DOUBLE PRECISION NULL,
      day_volume INT NULL
    );
    ```

1.  **Check that the table exists**

    - **SQL editor**: run the following query:

      ```sql
      SELECT * FROM information_schema.tables where table_name = 'stocks_real_time';
      ```

      You see the table listed in the UI.

    - **PopSQL**: the table is automatically displayed when you run the `CREATE` query.
    - **psql**: run the `\dt` command. You see the table listing for your service. To disconnect, type `exit`.


Quick recap, you find configuration information about your
services in [Services section in Timescale Console][tsc-portal], you find configuration and security information in your
config file.

</Procedure>

[tsc-portal]: https://console.cloud.timescale.com/
[account-portal]: https://console.cloud.timescale.com/dashboard/account
[services-portal]: https://console.cloud.timescale.com/dashboard/services
[install-psql]: /use-timescale/:currentVersion:/integrations/query-admin/psql/
[popsql]: /getting-started/:currentVersion:/run-queries-from-console/#popsql
[run-sqleditor]: /getting-started/:currentVersion:/run-queries-from-console/#sql-editor
[install-psql]: /use-timescale/:currentVersion:/integrations/query-admin/psql/
