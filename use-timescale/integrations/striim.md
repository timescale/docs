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
1. **Publish sample data**

   Run the following command to publish data to the `sensor/data` MQTT topic:

   ```bash
   mosquitto_pub -t sensor/data -m '{"temperature": 22.5, "humidity": 60}'
   ```

1. **Subscribe to topic** 

   Run the following command to subscribe to the `sensor/data` topic:

   ```bash
   mosquitto_sub -t sensor/data
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

   1. Navigate to `Applications` > `Create Application` > `Data Flow`.
   1. Name your application, for example, `MosquittoToTimescale`.

1. **Configure the source**

    1. Drag the `MQTT Source` component into the data flow.
    1. Enter the connection details for your Eclipse Mosquitto broker: `host`, `port`, and `sensor/data` for `topic`.
    1. Click `Test Connection`.

1. **Configure the target**

    1. Drag the `PostgreSQL Writer` component into the data flow.
    1. Enter the [connection details][connection-info] for your $SERVICE_SHORT.
    1. Choose `sensor_data` as the table name.
    1. Use the dropdowns in the `Field Mapping` section to map source fields to the destination columns.

1. **Add a continuous query**

   1. Drag the `Continuous Query` component between `MQTT Source` and `PostgreSQL Writer`.
   1. Open the continuous query configuration panel and write an SQL query to transform and map the data:

      ```sql
      SELECT 
      jsonextractstring(payload, '$.time') AS time,
      jsonextractfloat(payload, '$.temperature') AS temperature,
      jsonextractfloat(payload, '$.humidity') AS humidity
      FROM mqtt_source_stream;
      ```

1. **Connect the source and the target**

   Draw a line from `MQTT Source` to `PostgreSQL Writer`.

1. **Test the data flow**

    1. Publish more sample data to the MQTT broker:
   
       ```bash
       mosquitto_pub -t sensor/data -m '{"temperature": 24.3, "humidity": 55}'
       ```
    
    1. Verify the data is streamed to your $SERVICE_LONG:
   
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
