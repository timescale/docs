---
title: Integrate Airbyte with Timescale Cloud  
excerpt: Airbyte is an open-source data integration platform. Integrate Airbyte with Timescale Cloud to enable seamless data movement and analytics.
products: [cloud, mst, self_hosted]  
keywords: [Airbyte, integration]
---

import IntegrationPrereqs from "versionContent/_partials/_integration-prereqs.mdx";

# Integrate Airbyte with $CLOUD_LONG

[Airbyte](https://airbyte.com/) is an open-source data integration platform that enables you to move and consolidate data from various sources to a destination of your choice. Airbyte provides pre-built connectors, simplifying ETL (Extract, Transform, Load) processes.

This pages explains how to integrate Airbyte with $CLOUD_LONG to facilitate efficient data ingestion and analysis in a $SERVICE_LONG.

## Prerequisites

<IntegrationPrereqs />

- Install [Airbyte Self-Managed Community][airbyte-server] or sign up for [Airbyte Cloud][airbyte-cloud].

## Connect Airbyte to $CLOUD_LONG

To connect Airbyte to $CLOUD_LONG:

<Procedure>

1. **Log in to Airbyte**

1. **Configure the $CLOUD_LONG destination**

   1. Open the `Destinations` tab. 
   1. Click `New Destination` and select `Postgres` as the destination connector.
   1. Configure the destination using your [connection details][connection-info].
   1. Click `Set up destination`.

      Airbyte tests the connection. 

1. **Test the connection**

   1. Click `Test Connection` to verify connectivity.
   1. If successful, click `Save & Continue`.

</Procedure>

You have successfully added $CLOUD_LONG as a destination in Airbyte. You can now add a source and link the source to the destination to move your data. 

[connection-info]: /use-timescale/:currentVersion:/integrations/find-connection-details/
[airbyte-server]:
[airbyte-cloud]: 