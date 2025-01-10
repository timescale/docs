---
title: Connecting to Timescale
excerpt: How to connect to a Timescale instance
products: [cloud, mst, self_hosted]
keywords: [connect, Managed Service for TimescaleDB, Timescale]
---

# Find your connection details 

To connect to your $SERVICE_SHORT or self-hosted database, you need at least the following:

- Hostname
- Port
- Username
- Password
- Database name

Find the connection details based on your installation type.

<Tabs label="Connection details">

<Tab title="Timescale Cloud">

The connection details for your $SERVICE_LONG are available in $CONSOLE. Get them in one of the following ways:

- Save the `psql` connection string generated during $SERVICE_SHORT creation. The string follows this format:
    
    ```bash
    postgres://<USERNAME>:<PASSWORD>@<HOST>:<PORT>/<DATABASENAME>?sslmode=require
    ```

    For example:

    ```bash
    postgres://tsdbadmin:krifchuf3r8c5onn@s5pq0es2cy.vfbtkqzhtm.tsdb.cloud.timescale.com:39941/tsdb?sslmode=require
    ```

- Open the [`Services`][console-services] page and select your $SERVICE_SHORT. The connection details, except the password, are available in the `Connect to your service` widget. Get the password by resetting it.

</Tab>

<Tab title="Self-hosted TimescaleDB">

Find the connection details in the [PostgreSQL configuration file][postgres-config] or by asking your database administrator.

</Tab>

<Tab title="Managed Service for TimescaleDB">

In the `Services` page of the $MST_CONSOLE_LONG, click the service you want to connect to. You see the connection details:

![MST connection details](https://assets.timescale.com/docs/images/mst-connection-info.png)

</Tab>

</Tabs>

[about-psql]: /use-timescale/:currentVersion:/integrations/query-admin/psql/
[tsc-portal]: https://console.cloud.timescale.com/
[console-services]: https://console.cloud.timescale.com/dashboard/services
[postgres-config]: https://www.postgresql.org/docs/current/runtime-config-file-locations.html
