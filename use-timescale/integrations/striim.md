---
title: Integrate Striim with Timescale Cloud
excerpt: Striim is a real-time data integration platform that enables you to ingest, process, and deliver data with minimal latency. Integrate Striim with Timescale Cloud 
products: [cloud, mst, self_hosted]
keywords: [Eclipse Mosquitto, Striim, IoT, MQTT, integrate]
---

import IntegrationPrereqs from "versionContent/_partials/_integration-prereqs.mdx";

# Integrate Striim with $CLOUD_LONG

[Striim][striim] is a real-time data integration platform that enables you to ingest, process, and deliver streaming data across various systems with minimal latency. It connects data sources with targets and transforms the data on the fly.

[Eclipse Mosquitto][mosquitto] is an open-source MQTT broker widely used for lightweight messaging in IoT and mobile applications.

This page explains how to stream real-time IoT data from Eclipse Mosquitto to Timescale Cloud using Striim.

## Prerequisites

<IntegrationPrereqs />

- Install [Eclipse Mosquitto][mosquitto-install].
- Install [Striim Platform][striim-platform] or sign up for [Striim Cloud][striim-cloud].

## Simulate IoT data in Eclipse Mosquitto

To prepare sample IoT data to stream to $CLOUD_LONG:

<Procedure>

1. **Start Eclipse Mosquitto**

   Run the following command: 

   ```bash
   mosquitto -v
   ```

1. **Verify the data**

   Subscribe to the `sensor/data` MQTT topic:

   ```bash
   mosquitto_sub -t sensor/data
   ```

1. **Publish sample data**

   In a new terminal, run the following command to publish data to the `sensor/data` topic:

   ```bash
   mosquitto_pub -t sensor/data -m '{"temperature": 22.5, "humidity": 60}'
   ```

1. **Verify the data** 

   Subscribe to the topic to verify the data:

   ```bash
   mosquitto_sub -t sensor/data
   ```
   
   You should see this:

   ```json
   {"temperature": 22.5, "humidity": 60}
   ```
   
</Procedure>

## Prepare your $SERVICE_LONG to ingest data

Create a table in $SERVICE_LONG to store IoT readings from Eclipse Mosquitto:

<Procedure>

1. **Connect to your $SERVICE_LONG**

   Use an [SQL editor][run-queries] in $CONSOLE. For self-hosted $TIMESCALE_DB, use [`psql`][psql].  

1. **Create a hypertable in your $SERVICE_SHORT**

   ```sql
   CREATE TABLE sensor_data (
       time TIMESTAMPTZ NOT NULL,
       temperature FLOAT,
       humidity FLOAT
   );
   ```

1. **Convert the table into a hypertable**

   ```sql
   SELECT create_hypertable('sensor_data', 'time');
   ```

</Procedure>

## Create and test a data flow in Striim

Configure Eclipse Mosquitto as the source and $CLOUD_LONG as the target, then connect them into a data flow:

<Procedure>

1. **Log in to Striim**

1. **Create a data flow**

   1. Navigate to `Apps` > `Create An App` > `Start from Scratch`.
   2. Name your application, for example, `MosquittoToTimescale`.

1. **Configure the source**

    1. Drag the `MQTT Source` component into the data flow.
    2. Enter the connection details for your Eclipse Mosquitto broker, and `sensor/data` for `topic`.
    3. Create a New Output Stream and name it `mqtt_sensor_stream`.

1. **Configure the target**

    1. Drag the `PostgreSQL` component into the data flow.
    2. Choose Input Stream as `mqtt_sensor_stream`.
    3. Enter the [connection details][connection-info] for your $SERVICE_SHORT.
    4. Choose `sensor_data` as the table name.

1. **Deploy and start the application**

    1. Deploy the app by clicking on the dropdown at the top of the data flow window and selecting `Deploy App`.
    2. After the app is deployed successfully, from the same drop down, click on `Start App`.

NOTE: Please take a look, after this setup and deploying the app, there are a few errors.

1. **Test the data flow**

    1. Publish more sample data to the MQTT broker:
   
       ```bash
       mosquitto_pub -t sensor/data -m '{"temperature": 24.3, "humidity": 55}'
       ```
    
    2. Verify the data is streamed to your $SERVICE_LONG:
   
       ```sql
       SELECT * FROM sensor_data;
       ```
       
       You should see your `sensor_data` hypertable now populated with sample readings from Eclipse Mosquitto. 

</Procedure>

You have successfully created a data flow from Eclipse Mosquitto to $CLOUD_LONG using Striim.

[connection-info]: /use-timescale/:currentVersion:/integrations/find-connection-details/
[striim]: https://www.striim.com/
[mosquitto]: https://mosquitto.org/documentation/
[mosquitto-install]: https://mosquitto.org/download/
[striim-platform]: https://www.striim.com/striim-platform/
[striim-cloud]: https://www.striim.com/striim-cloud/
[run-queries]: /getting-started/:currentVersion:/run-queries-from-console/
[psql]: /use-timescale/:currentVersion:/integrations/psql/
