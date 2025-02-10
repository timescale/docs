---
title: Integrate Airbyte with Timescale Cloud  
excerpt: Airbyte is an open-source data integration platform. Integrate Airbyte with Timescale Cloud to enable seamless data movement and analytics.
products: [cloud, mst, self_hosted]  
keywords: [Airbyte, integration]
---

import IntegrationPrereqs from "versionContent/_partials/_integration-prereqs.mdx";

# Integrate Airbyte with $CLOUD_LONG

[Airbyte](https://airbyte.com/) is an open-source data integration platform that enables you to move and consolidate data from various sources to a destination of your choice. Airbyte provides pre-built connectors, simplifying ETL (Extract, Transform, Load) processes. 

[Ubidots][ubidots] is an IoT platform that enables real-time IoT data collection and management.

This page explains how to ingest IoT sensor data from Ubidots into $CLOUD_LONG with Airbyte. 

## Prerequisites

<IntegrationPrereqs />

- Install [Airbyte self-managed][airbyte-server] or sign up for [Airbyte Cloud][airbyte-cloud].
- Sign up for [Ubidots][ubidots-signup].

## Simulate IoT sensor data in Ubidots

To generate simulated IoT data in Ubidots:

<Procedure>

1. **Log in to Ubidots**

1. **Create a new device**

   1. Navigate to `Devices` > `Create Device`.
   1. Select `Blank Device` and name it `airbyte-iot-sensor`.

1. **Add variables to the device**

   1. Click `airbyte-iot-sensor` and select `Add Variable`.
   1. Create the following variables of type `float`:
      - `temperature` 
      - `humidity`
      - `pressure` 

1. **Simulate data for the device**
   
   1. Click `temperature`, then select `Edit Settings` > `Synthetic Data`.
   1. Enable synthetic data and set an update interval. For example, every 5 seconds.
   1. Enable synthetic data for `humidity` and `pressure` variables.

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

1. **Log in to Airbyte**

1. **Configure the Ubidots source**

   1. Click `Sources` > `New source` and select `Ubidots`.
   1. Enter the required connection details:
      - `API Key`: your Ubidots [API key][ubidots-api-key]
      - `Device ID`: `airbyte-iot-sensor`
   1. Click `Test & Save`.

1. **Configure the $CLOUD_LONG destination**

   1. Click `Destinations` > `New Destination` and select `Postgres`.
   1. Enter the required [connection details][connection-info].
   1. Click `Set up destination`.

      Airbyte tests the connection. 

   1. If the connection is successful, click `Save & Continue`.

1. **Create a connection between Ubidots and $CLOUD_LONG**

   1. Click `Connections` > `New Connection`.
   1. Select Ubidots as the source and $CLOUD_LONG as the destination.
   1. Configure the sync mode. For example, `Incremental Append`.
   1. Map Ubidots variables `temperature`, `humidity`, `pressure` to the corresponding columns in `iot_sensor_data`.
   1. Click `Save & Activate`.

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
[airbyte-server]: https://docs.airbyte.com/deploying-airbyte/
[airbyte-cloud]: https://cloud.airbyte.com/signup
[ubidots]: https://ubidots.com/
[ubidots-signup]: https://ubidots.com/#signup-modal
[run-queries]: /getting-started/:currentVersion:/run-queries-from-console/
[console]: https://console.cloud.timescale.com/dashboard/services
[ubidots-api-key]: https://help.ubidots.com/en/articles/570026-api-authentication