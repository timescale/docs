---
title: Integrate Debezium with Timescale Cloud
excerpt: Integrate Debezium with Timescale Cloud to enable change data capture in your Timescale Cloud service and streaming to Redis Streams
products: [cloud, mst, self_hosted]
keywords: [Debezium, integrate]
---

import IntegrationPrereqs from "versionContent/_partials/_integration-prereqs.mdx";

# Integrate Debezium with $CLOUD_LONG

[Debezium][debezium] is an open-source distributed platform for change data capture (CDC). 
It enables you to capture changes in $CLOUD_LONG and stream them to other systems in real time.

This pages explains how to capture changes in your $SERVICE_LONG and stream them to Redis Streams.

## Prerequisites

<IntegrationPrereqs />

- Install [Debezium Server][debezium-install].
- Install [Redis][redis-local] or sign up for [Redis Cloud][redis-cloud].
- For a self-hosted installation, ensure that your PostgreSQL database is accessible from the Debezium Server instance.

## Connect your $SERVICE_LONG

<Tabs label="Integrate with Debezium">

<Tab title="Timescale Cloud">

To connect to $CLOUD_LONG:

<Procedure>

1. **Enable logical replication for your $SERVICE_LONG**

     1. [Connect][connect] to your $SERVICE_SHORT using your [connection details][connection-info].

     1. Run the following command to enable logical replication:

        ```sql
        ALTER SYSTEM SET wal_level = logical;
        SELECT pg_reload_conf();
        ```
   
     1. Restart your $SERVICE_SHORT.

1. **Create a table**

     Create a table to test the integration. For example: 

     ```sql
     CREATE TABLE sensor_data (
     id SERIAL PRIMARY KEY,
     device_id TEXT NOT NULL, 
     temperature FLOAT NOT NULL,
     recorded_at TIMESTAMPTZ DEFAULT now()
     );
     ```

1. **Configure Debezium**

   1. Navigate to the `conf` directory in your Debezium files. 

   1. Edit `application.properties` using your [connection details][connection-info]. If using Redis Cloud, replace `localhost:6379` with the Redis Cloud endpoint.

      ```properties
      debezium.source.connector.class=io.debezium.connector.postgresql.PostgresConnector
      debezium.source.database.hostname=<TIMESCALE_HOST>
      debezium.source.database.port=<TIMESCALE_PORT>
      debezium.source.database.user=<USERNAME>
      debezium.source.database.password=<PASSWORD>
      debezium.source.database.dbname=<DB_NAME>
      debezium.source.plugin.name=pgoutput
      debezium.source.slot.name=debezium_slot
      debezium.source.publication.autocreate.mode=filtered

      # Define Redis Streams as the sink
      debezium.sink.type=redis
      debezium.sink.redis.address=localhost:6379
      debezium.sink.redis.stream.name=debezium_stream
      debezium.format.value=json
      ```

1. **Start Debezium Server**

   ```sh
   bin/debezium-server-start.sh conf/application.properties
   ```

1. **Test the connection**

    1. Insert data into the table you created in $CLOUD_LONG:

       ```sql
       INSERT INTO sensor_data (device_id, temperature) VALUES ('sensor-001', 22.5);
       ```

    1. Run the following command to check Redis Streams for incoming CDC events:

       ```sh
       redis-cli XREAD STREAMS debezium_stream 0
       ```

       You should see something like this:

       ```json
        {
          "op": "c",
          "ts_ms": 1708000000000,
          "source": {
             "table": "sensor_data",
             "db": "your_database",
             "schema": "public"
           },
          "after": {
             "id": 1,
             "device_id": "sensor-001",
             "temperature": 22.5,
             "recorded_at": "2024-02-15T12:00:00Z"
           }
         }
         ```

You have successfully integrated Debezium with $CLOUD_LONG.

</Procedure>

</Tab>

<Tab title="Self-hosted TimescaleDB">

To connect to your database:

<Procedure>

1. **Enable logical replication in PostgreSQL**

   1. Modify the following settings in `postgresql.conf`:

      ```ini
      wal_level = logical
      max_replication_slots = 10
      max_wal_senders = 10
      ```

   1. Restart PostgreSQL.
   
   1. Add the following to `pg_hba.conf` to allow replication connections:

      ```
      host replication debezium 0.0.0.0/0 md5
      ```

   1. Restart PostgreSQL.

1. **Create a Debezium user in PostgreSQL**

    Create a user with the `LOGIN` and `REPLICATION` permissions:

    ```sql
    CREATE ROLE debezium WITH LOGIN REPLICATION PASSWORD 'your_password';
    ```

1. **Create a table**

    Debezium will stream changes from this table to Redis. For example:

     ```sql
     CREATE TABLE sensor_data (
     id SERIAL PRIMARY KEY,
     device_id TEXT NOT NULL, 
     temperature FLOAT NOT NULL,
     recorded_at TIMESTAMPTZ DEFAULT now()
     );
     ```

1. **Create a replication slot and a publication**

   ```sql
   CREATE PUBLICATION debezium_pub FOR TABLE sensor_data;
   SELECT * FROM pg_create_logical_replication_slot('debezium_slot', 'pgoutput');
   ```
1. **Configure Debezium**

   1. Navigate to the `conf` directory in your Debezium files.

   1. Edit `application.properties` using your [connection details][connection-info]. If using Redis Cloud, replace `localhost:6379` with the Redis Cloud endpoint.

      ```properties
      debezium.source.connector.class=io.debezium.connector.postgresql.PostgresConnector
      debezium.source.database.hostname=<HOST>
      debezium.source.database.port=<PORT>
      debezium.source.database.user=<USERNAME>
      debezium.source.database.password=<PASSWORD>
      debezium.source.database.dbname=<DB_NAME>
      debezium.source.plugin.name=pgoutput
      debezium.source.slot.name=debezium_slot

      # Define Redis Streams as the sink
      debezium.sink.type=redis
      debezium.sink.redis.address=localhost:6379
      debezium.sink.redis.stream.name=debezium_stream
      debezium.format.value=json
      ```

1. **Start Debezium Server**

   ```sh
   bin/debezium-server-start.sh conf/application.properties
   ```

1. **Test the connection**

   1. Insert data into the table you created earlier: 

      ```sql
      INSERT INTO sensor_data (device_id, temperature) VALUES ('sensor-001', 22.5);
      ```

   1. Run the following command to check Redis Streams for incoming CDC events:

      ```sh
      redis-cli XREAD STREAMS debezium_stream 0
      ```

      You should see something like this:

      ```json
        {
          "op": "c",
          "ts_ms": 1708000000000,
          "source": {
             "table": "sensor_data",
             "db": "your_database",
             "schema": "public"
           },
          "after": {
             "id": 1,
             "device_id": "sensor-001",
             "temperature": 22.5,
             "recorded_at": "2024-02-15T12:00:00Z"
           }
         }
      ```

You have successfully integrated Debezium with self-hosted $TIMESCALE_DB.

</Procedure>

</Tab>

</Tabs>

[connection-info]: /use-timescale/:currentVersion:/integrations/find-connection-details/
[debezium]: https://debezium.io/
[debezium-install]: https://debezium.io/documentation/reference/stable/operations/debezium-server.html
[console]: https://console.cloud.timescale.com/dashboard/services
[redis-local]: https://redis.io/docs/getting-started/
[redis-cloud]: https://redis.com/try-free/
[connect]: /getting-started/:currentVersion:/run-queries-from-console/