---
title: Integrate Airbyte with Timescale Cloud  
excerpt: Airbyte is an open-source data integration platform. Integrate Airbyte with Timescale Cloud to enable seamless data movement and analytics.
products: [cloud, mst, self_hosted]  
keywords: [Airbyte, integration]
---

import IntegrationPrereqs from "versionContent/_partials/_integration-prereqs.mdx";

# Integrate Airbyte with $CLOUD_LONG

[Airbyte][airbyte] is an open-source data integration platform that enables you to move and consolidate
data from various sources to a destination of your choice. Airbyte provides pre-built connectors, 
simplifying ETL (Extract, Transform, Load) processes.

[Ubidots][ubidots] is an IoT platform that enables real-time IoT data collection and management.

This page explains how to ingest IoT sensor data from Ubidots into $CLOUD_LONG with Airbyte. 

## Prerequisites

<IntegrationPrereqs />

- Install [Airbyte self-managed][airbyte-server] or sign up for [Airbyte Cloud][airbyte-cloud].
- Sign up for [Ubidots][ubidots-signup].

## Simulate IoT sensor data in Ubidots

To generate simulated IoT data in Ubidots:

<Procedure>

1. **Log in to [Ubidots][ubidots-signup]**

1. **Create a new device**

   1. Navigate to `Devices` > `Create a device`.
   1. Select `Blank Device` and name it `airbyte-iot-sensor`.

1. **Add variables to the device**

   1. Click `airbyte-iot-sensor` and select `Add Variable`.
   1. Create the following variables:
      - `temperature`
      - `humidity`
      - `pressure`
   1. Note the `variable-id` for each

1. **Simulate data for the device**

   1. In a terminal window, run the following command separately for each variable using the `variable-id` and [Default Token][ubidots-token]:

      ```bash
      curl -X POST 'https://industrial.api.ubidots.com/api/v1.6/variables/<variable_id>/values' \
      -H 'Content-Type: application/json' \
      -H 'X-Auth-Token: <your-default-token>' \
      -d '[
            {"value": 25.4},
            {"value": 26.1},
            {"value": 24.9}
         ]'
      ```

   You may change the values for `pressure` and `humidity`.

</Procedure>

## Create a table to store IoT sensor data in $CLOUD_LONG

To store IoT data in $CLOUD_LONG, create a table:

<Procedure>

1. **Connect to your $SERVICE_LONG**

   For $CLOUD_LONG, open an [SQL editor][run-queries] in [$CONSOLE][console]. For self-hosted, use `psql`.

1. **Create a table**

   Run the following query:

      ```sql
      CREATE TABLE iot_sensor_data (
            time TIMESTAMPTZ DEFAULT now(),
            device_id TEXT,
            temperature DOUBLE PRECISION,
            humidity DOUBLE PRECISION,
            pressure DOUBLE PRECISION
      );
      SELECT create_hypertable('iot_sensor_data', 'time');
      ```

</Procedure>

## Connect Ubidots to $CLOUD_LONG using Airbyte

To connect Ubidots to $CLOUD_LONG:

<Procedure>

1. **Log in to [Airbyte][airbyte-cloud]**

1. **Configure the Ubidots source**

   1. Click `Sources` > `New source` and select `Ubidots`.
   2. Enter the `API Key` which is your Ubidots `airbyte-iot-sensor` device [Token][ubidots-device-token].
   3. Click `Set up source`.

1. **Configure the $CLOUD_LONG destination**

   1. Click `Destinations` > `New destination` and select `Postgres`.
   2. Enter the Destination name as $CLOUD_LONG and populate the required [connection details][connection-info].
   3. Click `Set up destination`.

1. **Create a connection between Ubidots and $CLOUD_LONG**

   1. Click `Connections` > `New connection`.
   2. Select Ubidots as the source and $CLOUD_LONG as the destination.
   3. Select the sync mode and select the schema to sync with $CLOUD_LONG and click on `Next`.
   4. Configure the connection for with desired settings.
   5. Click on `Finish & Sync`.
   
   **// PLEASE TEST FROM HERE.**
    
   6. Map Ubidots variables `temperature`, `humidity`, `pressure` to the corresponding columns in `iot_sensor_data`.

</Procedure>

## Check the connection 

To check if the data is successfully ingested:

<Procedure>

1. **Connect to your $SERVICE_LONG**
1. **Query data from the table**

   Run the following SQL query:

   ```sql
   SELECT * FROM iot_sensor_data ORDER BY time DESC LIMIT 10;
   ```

   You should now see simulated IoT data from Ubidots appear in the table.

</Procedure>

You have successfully ingested data from Ubidots into $CLOUD_LONG using Airbyte!

[connection-info]: /use-timescale/:currentVersion:/integrations/find-connection-details/
[airbyte]: https://airbyte.com/
[airbyte-server]: https://docs.airbyte.com/deploying-airbyte/
[airbyte-cloud]: https://cloud.airbyte.com/signup
[ubidots]: https://ubidots.com/
[ubidots-signup]: https://ubidots.com/#signup-modal
[ubidots-token]: https://docs.ubidots.com/v1.6/reference/authentication?utm_source=api_docs&utm_medium=internal_referral&utm_campaign=Send%20data%20to%20a%20Variable
[run-queries]: /getting-started/:currentVersion:/run-queries-from-console/
[ubidots-device-token]: https://help.ubidots.com/en/articles/3832305-security-managing-device-tokens
[console]: https://console.cloud.timescale.com/dashboard/services
[ubidots-api-key]: https://help.ubidots.com/en/articles/570026-api-authentication