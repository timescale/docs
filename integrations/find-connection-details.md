---
title: Find your connection details
excerpt: You connect to Tiger Cloud or self-hosted TimescaleDB using your connection details. Learn where to find them
products: [cloud, mst, self_hosted]
keywords: [connect, Managed Service for TimescaleDB, Timescale]
---

# Find your connection details 

To connect to your $SERVICE_LONG or $SELF_LONG, you need at least the following:

- Hostname
- Port
- Username
- Password
- Database name

Find the connection details based on your deployment type:

<Tabs label="Connection details" persistKey="source-database">

<Tab title="Tiger" label="tiger-cloud">

## Connect to your service

Retrieve the connection details for your $SERVICE_LONG:

- **In `<service name>-credentials.txt`**: 

   All connection details are supplied in the configuration file you download when you create a new $SERVICE_SHORT. 

- **In $CONSOLE**:

   Open the [`Services`][console-services] page and select your $SERVICE_SHORT. The connection details, except the password, are available in `Service info` > `Connection info` > `More details`. If necessary, click `Forgot your password?` to get a new one.

   ![$SERVICE_LONG connection details](https://assets.timescale.com/docs/images/tiger-cloud-console/tiger-service-connection-details.png)

## Find your project and service ID

To retrieve the connection details for your $CLOUD_LONG project and $SERVICE_LONG:

<Procedure>

1. **Retreive your project ID**:

   In [$CONSOLE][console-services], click your project name in the upper left corner, then click `Copy` next to the project ID.
   ![Retrive the project id in $CONSOLE](https://assets.timescale.com/docs/images/tiger-cloud-console/tiger-console-project-id.png)

1. **Retrieve your service ID**:

   Click the dots next to the service, then click `Copy` next to the service ID.
   ![Retrive the service id in $CONSOLE](https://assets.timescale.com/docs/images/tiger-cloud-console/tiger-console-service-id.png)

</Procedure>

</Tab>

<Tab title="Self-hosted TimescaleDB" label="self-hosted">

Find the connection details in the [$PG configuration file][postgres-config] or by asking your database administrator. The `postgres` superuser, created during $PG installation, has all the permissions required to run procedures in this documentation. However, it is recommended to create other users and assign permissions on the need-only basis. 

</Tab>

<Tab title="Managed Service for TimescaleDB">

In the `Services` page of the $MST_CONSOLE_LONG, click the service you want to connect to. You see the connection details:

![MST connection details](https://assets.timescale.com/docs/images/mst-connection-info.png)

</Tab>

</Tabs>

[console-services]: https://console.cloud.timescale.com/dashboard/services
[postgres-config]: https://www.postgresql.org/docs/current/runtime-config-file-locations.html
