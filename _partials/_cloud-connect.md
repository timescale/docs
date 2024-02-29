<Procedure>

### Check your service and connect to it

To check a service associated with your account is running, then connect to it:

1.  In the [Services section in Timescale Console][services-portal], check that your service is marked as `Running`.

1.  In your development environment open [psql][install-psql] and connect to your service with the value of
    `Service URL` in the config file you just saved.

    The command line looks like:
    <CodeBlock canCopy={true} showLineNumbers={false} children={`
    psql "postgres://tsdbadmin:<PASSWORD>@<HOST>:<PORT>/tsdb?sslmode=require"
    `} />

    You are connected to your service and are now able to issue commands. You see something like:

    <CodeBlock canCopy={false} showLineNumbers={true} children={`
    psql (14.5, server 15.3 (Ubuntu 15.3-1.pgdg22.04+1))
    SSL connection (protocol: TLSv1.3, cipher: TLS_AES_256_GCM_SHA384, bits: 256, compression: off)
    Type "help" for help.
    tsdb=>
    `} />

1.  To create a PostgreSQL table, copy the following into the psql prompt and press Enter:

    ```sql
    CREATE TABLE stocks_real_time (
      time TIMESTAMPTZ NOT NULL,
      symbol TEXT NOT NULL,
      price DOUBLE PRECISION NULL,
      day_volume INT NULL
    );
    ```

1.  Check that the table exists in your service with the `\dt` command. In psql:

    <CodeBlock canCopy={true} showLineNumbers={false} children={`
    \\dt
    `} />

    You see the table listing in your service.

1. To disconnect, type `exit`.


Quick recap, you find configuration information about your
services in [Services section in Timescale Console][tsc-portal], you find configuration and security information in your
config file.

</Procedure>

[tsc-portal]: https://console.cloud.timescale.com/
[account-portal]: https://console.cloud.timescale.com/dashboard/account
[services-portal]: https://console.cloud.timescale.com/dashboard/services
[install-psql]: /use-timescale/:currentVersion:/integrations/query-admin/psql/