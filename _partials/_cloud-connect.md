<Procedure>

### Check your service and connect to it

To ensure a Timescale service is running correctly:

1.  In the [Services section in Timescale Console][services-portal], check that your service is marked as `Running`.

1. Use PopSQL or psql to connect to your service:
    - [Setup PopSQL][popsql]: Follow the instructions to easily connect to your service in the UI.
    - [psql][install-psql]: Connect to your service with the value of `Service URL` from the config file you 
      just saved.

      <CodeBlock canCopy={true} showLineNumbers={false} children={`
      psql "postgres://tsdbadmin:<PASSWORD>@<HOST>:<PORT>/tsdb?sslmode=require"
      `} />

    You are connected to your service and are now able to issue commands. 

1.  Create a PostgreSQL table, copy the following into [PopSQL][popsql] or psql, then run your query:

    ```sql
    CREATE TABLE stocks_real_time (
      time TIMESTAMPTZ NOT NULL,
      symbol TEXT NOT NULL,
      price DOUBLE PRECISION NULL,
      day_volume INT NULL
    );
    ```

1.  Check that the table exists.
    - In PopSQL, you see the table in the UI. 
    - In psql, run the `\dt` command, You see the table listing in your service. To disconnect, type `exit`.


Quick recap, you find configuration information about your
services in [Services section in Timescale Console][tsc-portal], you find configuration and security information in your
config file.

</Procedure>

[tsc-portal]: https://console.cloud.timescale.com/
[account-portal]: https://console.cloud.timescale.com/dashboard/account
[services-portal]: https://console.cloud.timescale.com/dashboard/services
[install-psql]: /use-timescale/:currentVersion:/integrations/query-admin/psql/
[popsql]: /use-timescale/:currentVersion:/popsql/