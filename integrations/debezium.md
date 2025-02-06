---
title: Integrate Debezium with Timescale Cloud
excerpt: Integrate Debezium with Timescale Cloud to enable change data capture for your PostgreSQL workloads
products: [cloud, mst, self_hosted]
keywords: [Debezium, integrate]
---

import IntegrationPrereqs from "versionContent/_partials/_integration-prereqs.mdx";

# Integrate Debezium with $CLOUD_LONG

[Debezium][debezium] is an open-source distributed platform for change data capture (CDC). 
It enables you to capture changes Win your $SERVICE_LONG and stream them to other systems in real time.

This pages explains how to integrate Debezium with $CLOUD_LONG and Kafka 

## Prerequisites

<IntegrationPrereqs />

- Install [Debezium][debezium-install]

## Connect your $SERVICE_LONG

<Tabs label="Integrate with Debezium">

<Tab title="$CLOUD_LONG">

To connect to $CLOUD_LONG:

<Procedure>

1. **Enable logical replication for your $SERVICE_LONG**

     1. Connect to your $SERVICE_SHORT using your [connection details][connection-info].

     1. Run the following command to enable logical replication:

        ```sql
        ALTER SYSTEM SET wal_level = 'logical';
        ALTER SYSTEM SET max_replication_slots = 10;
        ALTER SYSTEM SET max_wal_senders = 10;
        ```
   
     1. Restart your $SERVICE_SHORT.

1. **Create a replication slot**

      ```sql
      SELECT * FROM pg_create_logical_replication_slot('debezium_slot', 'pgoutput');
      ```

1. **Configure Debezium**

     Modify the Debezium connector configuration to point to $CLOUD_LONG using your [connection details][connection-info]:

      ```json
      {
        "name": "timescale-connector",
        "config": {
          "connector.class": "io.debezium.connector.postgresql.PostgresConnector",
          "database.hostname": "<TIMESCALE_CLOUD_HOST>",
          "database.port": "5432",
          "database.user": "<USERNAME>",
          "database.password": "<PASSWORD>",
          "database.dbname": "<DATABASE_NAME>",
          "database.server.name": "timescale-server",
        }
      }
      ```

1. **Test the connection**

    Start the Debezium connector and ensure it connects to your $SERVICE_LONG successfully.

</Procedure>

</Tab>

<Tab title="$SELF_LONG">

To connect to your $SELF_LONG database:

<Procedure>

1. **Enable logical replication in $TIMESCALE_DB**

   1. Modify the following settings in `postgresql.conf`. It is usually located in `/var/lib/postgresql/data/postgresql.conf` or `/etc/postgresql/*/main/postgresql.conf`:

      ```
      wal_level = logical
      max_replication_slots = 10
      max_wal_senders = 10
      ```

   1. Restart PostgreSQL.

1. **Create a replication slot**

   1. Connect to your database using your [connection details][connection-info].
   1. Run the following command: 

      ```sql
      SELECT * FROM pg_create_logical_replication_slot('debezium_slot', 'pgoutput');
      ```
      
   1. Grant replication privileges to the user Debezium will use:

      ```sql
      ALTER ROLE <username> WITH REPLICATION;
      ```

1. **Configure Debezium**

   Create a Debezium connector configuration file `debezium-postgres.json`:

      ```json
      {
        "name": "timescale-connector",
        "config": {
          "connector.class": "io.debezium.connector.postgresql.PostgresConnector",
          "database.hostname": "<TIMESCALEDB_HOST>",
          "database.port": "5432",
          "database.user": "<USERNAME>",
          "database.password": "<PASSWORD>",
          "database.dbname": "<DATABASE_NAME>",
          "database.server.name": "timescale-server",
          "plugin.name": "pgoutput",
          "slot.name": "debezium_slot",
          "publication.name": "debezium_publication"
        }
      }
      ```

1. **Test the connection**

   Start the Debezium connector and ensure it connects to your database successfully.

</Procedure>

</Tab>

</Tabs>

You have successfully integrated Debezium with $CLOUD_LONG.

[connection-info]: /use-timescale/:currentVersion:/integrations/find-connection-details/
[debezium]: https://debezium.io/
[debezium-install]: https://debezium.io/documentation/reference/stable/install.html
[console]: https://console.cloud.timescale.com/dashboard/services
