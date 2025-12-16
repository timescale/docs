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

<Tab title="Tiger Cloud" label="tiger-cloud">

## Connect to your service

Retrieve the connection details for your $SERVICE_LONG:

- **In `<service name>-credentials.txt`**: 

   All connection details are supplied in the configuration file you download when you create a new $SERVICE_SHORT. 

- **In $CONSOLE**:

   Open the [`Services`][services-portal] page and select your $SERVICE_SHORT. The connection details, except the password, are available in `Service info` > `Connection info` > `More details`. If necessary, click `Forgot your password?` to get a new one.

   ![$SERVICE_LONG connection details][service_long-connection-details]

## Find your project and service ID

To retrieve the connection details for your $PROJECT_LONG and $SERVICE_LONG:

<Procedure>

1. **Retrieve your project ID**:

   In [$CONSOLE][services-portal], click your project name in the upper left corner, then click `Copy` next to the project ID.
   ![Retrive the project id in $CONSOLE][retrive-the-project-id-in-console]

1. **Retrieve your service ID**:

   Click the dots next to the service, then click `Copy` next to the service ID.
   ![Retrive the service id in $CONSOLE][retrive-the-service-id-in-console]

</Procedure>

## Create client credentials 

You use client credentials to obtain access tokens outside of the user context.

To retrieve the connection details for your $CLOUD_LONG project for programmatic usage 
such as Terraform or the [$CLOUD_LONG REST API][rest-api-reference]:

<Procedure>

1. **Open the settings for your project**:

   In [$CONSOLE][services-portal], click your project name in the upper left corner, then click `Project settings`.

1. **Create client credentials**:
 
   1. Click `Create credentials`, then copy `Public key` and `Secret key` locally.

      ![Retrive the service id in $CONSOLE][retrive-the-service-id-in-console-1]

       This is the only time you see the `Secret key`. After this, only the `Public key` is visible in this page. 

   1. Click `Done`.

</Procedure>

## Create client credentials 

You use client credentials to obtain access tokens outside of the user context.

To retrieve the connection details for your $CLOUD_LONG project for programmatic usage 
such as Terraform or the [$CLOUD_LONG REST API][rest-api-reference]:

<Procedure>

1. **Open the settings for your project**:

   In [$CONSOLE][services-portal], click your project name in the upper left corner, then click `Project settings`.

1. **Create client credentials**:
 
   1. Click `Create credentials`, then copy `Public key` and `Secret key` locally.

      ![Create client credentials in $CONSOLE][retrive-the-service-id-in-console-1]

       This is the only time you see the `Secret key`. After this, only the `Public key` is visible in this page. 

   1. Click `Done`.

</Procedure>

</Tab>

<Tab title="Self-hosted TimescaleDB" label="self-hosted">

Find the connection details in the [$PG configuration file][postgres-config] or by asking your database administrator. The `postgres` superuser, created during $PG installation, has all the permissions required to run procedures in this documentation. However, it is recommended to create other users and assign permissions on the need-only basis. 

</Tab>

<Tab title="Managed Service for TimescaleDB">

In the `Services` page of the $MST_CONSOLE_LONG, click the service you want to connect to. You see the connection details:

![MST connection details][mst-connection-details]

</Tab>

</Tabs>

[create-client-credentials-in-console]: https://assets.timescale.com/docs/images/tiger-cloud-console/tiger-cloud-console-client-credentials.png
[mst-connection-details]: https://assets.timescale.com/docs/images/mst-connection-info.png
[postgres-config]: https://www.postgresql.org/docs/current/runtime-config-file-locations.html
[rest-api-reference]: /api/:currentVersion:/api-reference/
[retrive-the-project-id-in-console]: https://assets.timescale.com/docs/images/tiger-on-azure/tiger-console-project-id.png
[retrive-the-service-id-in-console-1]: https://assets.timescale.com/docs/images/tiger-cloud-console/tiger-cloud-console-client-credentials.png
[retrive-the-service-id-in-console]: https://assets.timescale.com/docs/images/tiger-on-azure/tiger-console-service-id.png
[service_long-connection-details]: https://assets.timescale.com/docs/images/tiger-cloud-console/tiger-service-connection-details.png
[services-portal]: https://console.cloud.timescale.com/dashboard/services
