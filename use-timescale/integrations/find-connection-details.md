---
title: Find your connection details
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

Find the connection details based on your deployment type:

<Tabs label="Connection details">

<Tab title="Timescale Cloud">

Retrieve the connection details for your $SERVICE_LONG:

- **In `<service name>-credentials.txt`**: 

   All connection details are supplied in the configuration file you download when you create a new $SERVICE_SHORT. 

- **In $CONSOLE**:

   Open the [`Services`][console-services] page and select your $SERVICE_SHORT. The connection details, except the password, are available in the `Connect to your service` widget. If necessary, click `Forgot your password?` to get a new one.

   ![Timescale service connection details](https://assets.timescale.com/docs/images/timescale-service-connection-details.png)

</Tab>

<Tab title="Self-hosted TimescaleDB">

Find the connection details in the [PostgreSQL configuration file][postgres-config] or by asking your database administrator.

</Tab>

<Tab title="Managed Service for TimescaleDB">

In the `Services` page of the $MST_CONSOLE_LONG, click the service you want to connect to. You see the connection details:

![MST connection details](https://assets.timescale.com/docs/images/mst-connection-info.png)

</Tab>

</Tabs>

[console-services]: https://console.cloud.timescale.com/dashboard/services
[postgres-config]: https://www.postgresql.org/docs/current/runtime-config-file-locations.html
