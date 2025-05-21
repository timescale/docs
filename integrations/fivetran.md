---
title: Integrate Fivetran with Timescale Cloud
excerpt: Fivetran is a fully managed data pipeline platform that simplifies extract, transform, and load processes. Integrate Fivetran with Timescale Cloud for seamless data synchronization
products: [cloud, self_hosted]
keywords: [Fivetran, PostgreSQL, connection, integrate]

---

import IntegrationPrereqs from "versionContent/_partials/_integration-prereqs.mdx";

# Integrate Fivetran with $CLOUD_LONG

[Fivetran][fivetran] is a fully managed data pipeline platform that simplifies ETL (Extract, Transform, Load) processes 
by automatically syncing data from multiple sources to your data warehouse.

![Fivetran data in a service](https://assets.timescale.com/docs/images/integrations-fivetran-sync-data.png)

This page shows you how to inject data from data sources managed by Fivetran into a $SERVICE_LONG.

## Prerequisites

<IntegrationPrereqs />

* Sign up for [Fivetran][sign-up-fivetran]

## Set your $SERVICE_LONG as a destination in Fivetran

To be able to inject data into your $SERVICE_LONG, set it as a destination in Fivetran:

![Fivetran data destination](https://assets.timescale.com/docs/images/integrations-fivetran-destination-timescal-cloud.png)

<Procedure>

1. In [Fivetran Dashboard > Destinations][fivetran-dashboard-destinations], click `Add destination`.
1. Search for the `PostgreSQL` connector and click `Select`. Add the destination name and click `Add`.
1. In the `PostgreSQL` setup, add your [$SERVICE_LONG connection details][connection-info], then click `Save & Test`.

   Fivetran validates the connection settings and sets up any security configurations.
1. Click `View Destination`. 

   The `Destination Connection Details` page opens.

</Procedure>

## Set up a Fivetran connection as your data source

In a real world scenario, you can select any of the over 600 connectors available in Fivetran to sync data with your 
$SERVICE_LONG. This section shows you how to inject the logs for your Fivetran connections into your $SERVICE_LONG.

![Fivetran data source](https://assets.timescale.com/docs/images/integrations-fivetran-data-source.png)

<Procedure>

1. In [Fivetran Dashboard > Connections][fivetran-dashboard-connectors], click `Add connector`.
1. Search for the `Fivetran Platform` connector, then click `Setup`.
1. Leave the default schema name, then click `Save & Test`.

   You see `All connection tests passed!`
1. Click `Continue`, enable `Add Quickstart Data Model` and click `Continue`.

   Your Fivetran connection is connected to your $SERVICE_LONG destination. 
1. Click `Start Initial Sync`.

   Fivetran creates the log schema in your $SERVICE_SHORT and syncs the data to your $SERVICE_SHORT.

</Procedure>

## View Fivetran data in your $SERVICE_LONG 

To see data injected by Fivetran into your $SERVICE_LONG:

<Procedure>

1. In [data mode][portal-data-mode] in $CONSOLE, select your $SERVICE_SHORT, then run the following query:
   ```sql
   SELECT *
   FROM fivetran_log.account
   LIMIT 10;
   ```
   You see something like the following:

   ![Fivetran data in a service](https://assets.timescale.com/docs/images/integrations-fivetran-view-data-in-service.png)

</Procedure>

You have successfully integrated Fivetran with $CLOUD_LONG.

[connection-info]: /integrations/:currentVersion:/find-connection-details/
[fivetran]: https://www.fivetran.com/docs
[sign-up-fivetran]: https://www.fivetran.com/
[fivetran-dashboard-destinations]: https://fivetran.com/dashboard/destinations
[fivetran-dashboard-connectors]: https://fivetran.com/dashboard/connectors
[portal-data-mode]: https://console.cloud.timescale.com/dashboard/services?popsql
