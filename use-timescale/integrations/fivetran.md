---
title: Integrate Fivetran with Timescale Cloud
excerpt: Integrate Fivetran with Timescale Cloud service for seamless data synchronization.
products: [cloud]
keywords: [Fivetran, PostgreSQL, connection, integrate]

---

import IntegrationPrereqs from "versionContent/_partials/_integration-prereqs.mdx";

# Integrate Fivetran with $CLOUD_LONG

[Fivetran][fivetran] is a fully managed data pipeline platform that simplifies ETL (Extract, Transform, Load) processes by automatically syncing data from multiple sources to your data warehouse.

This page shows you how to use Fivetran connectors to integrate Fivetran with $CLOUD_LONG.

## Prerequisites

<IntegrationPrereqs />

* [Sign up for Fivetran][sign-up-fivetran]

## Set up a PostgreSQL destination in Fivetran

To connect $SERVICE_LONG with Fivetran, you would need a PostgreSQL destination:

<Procedure>

1. In the Fivetran dashboard, click on `Destinations`, and then on the `Add destination` button.
1. From `All destinations`, search and select `PostgreSQL` and add the desired Destination name in the popup.
1. Populate your $TIMESCALE_DB `Host`, `Port`, `User`, `Password`, `Database name` using your [connection details][connection-info].
1. Choose `SaaS Deployment` for `Select deployment model`. Ensure that the `Connection method` is `Connect directly`.
1. Populate the desired `Data processing location`, `Cloud service provider` and `Time zone`.
1. Click on `Save & Test`. If a popup appears to validate the TLS certificate, choose the first one which shall look like "CN=GTS Root R1, O=Google Trust Services LLC, C=US".
1. After all the tests run successfully, click on `View Destination`. This will open the `Destination Connection Details` page.

</Procedure>

## Set up a PostgreSQL connector in Fivetran

Select PostgreSQL as the connector as $SERVICE_LONG is built on PostgreSQL:

<Procedure>

1. In the Fivetran dashboard, click `Connections` and then on the `Add Connection` button.
1. From `All connectors`, search and select `PostgreSQL` by clicking the `Set Up` button.
1. Select the destination created in the previous step.
1. Populate the same $TIMESCALE_DB `Host`, `Port`, `User`, `Password`, `Database name` as destination.
1. Select the desried `Connection Method` and `Update method`.
1. Click on `Save & Test`. If a popup appears to validate the TLS certificate, choose the first one which shall look like "CN=GTS Root R1, O=Google Trust Services LLC, C=US".
1. After all the tests run successfully, click on `Continue`.

</Procedure>

## Select the data to be synced with $CLOUD_LONG

To ensure the correct data is being synced, select the table(s) from $CLOUD_LONG:

<Procedure>

1. Select the tables that you wish to sync with Fivetran and click on `Continue`.
1. Select `Allow all` for `How would you like to handle changes?` and click on `Continue`.
1. Once the connection is ready, initiate the first sync with your $SERVICE_LONG by clicking on `Start initial sync` button.

</Procedure>

## Test the integration with $CLOUD_LONG

To ensure the integration is successful,

<Procedure>

1. Monitor the progress on the `Connections` page.
1. Ensure that Fivetran is updating the schema or data types in $CLOUD_LONG:

   ```sql
   SELECT column_name, data_type 
   FROM information_schema.columns 
   WHERE table_name = 'sensor_data';
   ```

   This will show the columns and their types for the table, allowing you to verify that Fivetran has applied the correct changes.

</Procedure>

You have successfully integrated Fivetran with $CLOUD_LONG.

[connection-info]: /use-timescale/:currentVersion:/integrations/find-connection-details/
[fivetran]: https://www.fivetran.com/docs
[sign-up-fivetran]: https://www.fivetran.com/
