---
title: Integrate Airbyte with Timescale Cloud
excerpt: Integrate Airbyte with Timescale Cloud to enable seamless data movement between different sources and your service
products: [cloud, mst, self_hosted]
keywords: [Airbyte, integrate]

---

import IntegrationPrereqs from "versionContent/_partials/_integration-prereqs.mdx";

# Integrate Airbyte with $CLOUD_LONG

[Airbyte][airbyte] is an open-source data integration platform that enables you to sync data from various sources to different destinations, including $CLOUD_LONG. 

This page explains how to integrate Airbyte with your $SERVICE_LONG and move data efficiently for further analysis and storage.

## Prerequisites

<IntegrationPrereqs />

- Install [Airbyte](https://docs.airbyte.com/deploying-airbyte) // Mention both cloud and self-hosted versions, if present. Link to installation pages.
- Ensure you have a running Timescale Cloud instance.
- Retrieve your Timescale Cloud connection details ([Find your connection details][connection-info]).

## Connect Airbyte to Timescale Cloud

To connect Airbyte to $CLOUD_LONG:

<Procedure>

1. **Log in to Airbyte**

    - Open the [Airbyte dashboard](https://cloud.airbyte.com/) or your self-hosted Airbyte instance.
    - Log in to your Airbyte account.

2. **Set up Timescale Cloud as a Destination**

    - Navigate to the `Destinations` tab in Airbyte.
    - Click on **+ New Destination**.
    - Select `PostgreSQL` as the destination type (Timescale Cloud is PostgreSQL-compatible).

3. **Configure the Connection**

    - Enter the following details from your Timescale Cloud instance:

        - **Host**: `<TIMESCALE_CLOUD_HOST>`
        - **Port**: `5432`
        - **Database Name**: `<DATABASE_NAME>`
        - **User**: `<USERNAME>`
        - **Password**: `<PASSWORD>`
        - **Schema**: `public` (or your target schema)

    - Click **Test Connection** to verify the settings.

4. **Set Up a Data Source**

    - Navigate to the `Sources` tab in Airbyte.
    - Click on **+ New Source**.
    - Choose the data source you want to sync (e.g., PostgreSQL, MySQL, API, CSV, etc.).
    - Enter the connection details for your data source.
    - Click **Test Connection**.

5. **Create a Sync Job**

    - Click on **Connections** > **New Connection**.
    - Select your configured source and Timescale Cloud as the destination.
    - Choose the replication mode (`Full Refresh`, `Incremental`, etc.).
    - Configure transformation settings if needed.
    - Click **Save & Run** to start data synchronization.

</Procedure>

You have successfully integrated Airbyte with $CLOUD_LONG.

[connection-info]: /use-timescale/:currentVersion:/integrations/find-connection-details/
[airbyte]: https://airbyte.com/
