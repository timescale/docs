---
title: Integrate Debezium with Timescale Cloud
excerpt: Integrate Debezium with Timescale Cloud to enable change data capture in your Timescale Cloud service and streaming to Redis Streams
products: [cloud, mst, self_hosted]
keywords: [Debezium, integrate]
---

import IntegrationPrereqs from "versionContent/_partials/_integration-prereqs.mdx";
import IntegrationApacheKafka from "versionContent/_partials/_integration-apache-kafka-install.mdx";
import IntegrationDebeziumSelfHostedConfig from "versionContent/_partials/_integration-debezium-self-hosted-config-database.mdx";

# Integrate Debezium with $CLOUD_LONG

[Debezium][debezium] is an open-source distributed platform for change data capture (CDC). 
It enables you to capture changes in $CLOUD_LONG and stream them to other systems in real time.

Debezium can capture events about:

- [Hypertables][hypertables]: captured events are rerouted from their chunk-specific topics to a single logical topic 
   named according to the following pattern: `<topic.prefix>.<hypertable-schema-name>.<hypertable-name>`
- [Continuous aggregates][caggs]: captured events are rerouted from their chunk-specific topics to a single logical topic
  named according to the following pattern: `<topic.prefix>.<aggregate-schema-name>.<aggregate-name>`
- [Hypercore][hypercore]: If you enable hypercore, the Debezium $TIMESCALE_DB connector does not apply any special 
  processing to data in the columnstore. Compressed chunks are forwarded unchanged to the next downstream job in the 
  pipeline for further processing as needed. Typically, messages with compressed chunks are dropped, and are not 
  processed by subsequent jobs in the pipeline.

   This limitation only affects changes to chunks in the columnstore. Changes to data in the rowstore work correctly. 


This page explains how to capture changes in your database and stream them using Debezium on Apache Kafka.

## Prerequisites

<IntegrationPrereqs />

- [Java8 or higher][java-installers] to run Apache Kafka.

## Configure your database to work with Debezium

<Tabs label="Integrate with Debezium">

<Tab title="Self-hosted TimescaleDB">

To setup $SELF_LONG to communicate with Debezium:

<Procedure>

<IntegrationDebeziumSelfHostedConfig />

</Procedure>

## Install and configure Apache Kafka

To install and configure Apache Kafka:

<Procedure>

<IntegrationApacheKafka />

</Procedure>

Keep these terminals open, you use them to test the integration later.

## Configure Debezium to listen to your database

Set up Kafka Connect server, plugins, drivers, and connectors:

<Procedure>

1. **Install the Debezium connector**

   In another Terminal window, navigate to <KAFKA_HOME>, then download and configure the PostgreSQL sink and driver.
   ```bash
   mkdir -p "plugins/debezium-connector-postgres"
   curl https://repo1.maven.org/maven2/io/debezium/debezium-connector-postgres/3.1.1.Final/debezium-connector-postgres-3.1.1.Final-plugin.tar.gz \
   | tar -xzf - -C "plugins/debezium-connector-postgres" --strip-components=1
   echo "plugin.path=`pwd`/libs,`pwd`/plugins/debezium-connector-postgres" >> "config/connect-distributed.properties"
   echo "plugin.path=`pwd`/libs,`pwd`/plugins/debezium-connector-postgres" >> "config/connect-standalone.properties" 
   ```

1. **Configure Debezium to poll your database**

   Write the following configuration to `<KAFKA_HOME>/config/timescale-debezium-sink.properties`, then update the
   `<properties>` with your [connection details][connection-info].

    ```properties
    name=timescale-debezium-sink
    connector.class=io.debezium.connector.postgresql.PostgresConnector
    database.hostname=<host>
    database.port=<port>
    database.user=<debezium-user>
    database.password=<debezium-password>
    database.dbname=<dbname>
    topic.prefix=accounts
    plugin.name=pgoutput
    transforms=timescaledb
    transforms.timescaledb.type=io.debezium.connector.postgresql.transforms.timescaledb.TimescaleDb
    transforms.timescaledb.database.hostname=<host>
    transforms.timescaledb.database.port=<port>
    transforms.timescaledb.database.user=<debezium-user>
    transforms.timescaledb.database.password=<debezium-password>
    transforms.timescaledb.database.dbname=<dbname>
    publication.autocreate.mode=all_tables
    schema.include.list=public,_timescaledb_internal
    ```

   - The values for the `*.hostname`, `*.port`, `*.user`, `*.password`, and `*.dbname` properties must match. You
     created `<user>` in [Configure your database to work with Debezium][debezium-configure-database]
   - `topic.prefix` is the name of the kafka topic you created in [Install and configure Apache Kafka][kafka-install-configure].

1. **Start Kafka Connect**

    ```bash
   export CLASSPATH=`pwd`/plugins/debezium-connector-postgres/*:`pwd`/libs/*
   ./bin/connect-standalone.sh config/connect-standalone.properties config/timescale-debezium-sink.properties
   ```

   Use the `-daemon` flag to run this process in the background.

1. **Verify Kafka Connect is running**

   In yet another another Terminal window, run the following command:

    ```bash
    curl http://localhost:8083
    ```
   You see something like:
    ```bash
    {"version":"3.9.0","commit":"a60e31147e6b01ee","kafka_cluster_id":"J-iy4IGXTbmiALHwPZEZ-A"}
    ```

   1. **Test the connection**

      1. Connect to your $SELF_LONG instance.

         Use [`psql`][psql-connect].
      1. Insert data into the table you created:

         ```sql
         INSERT INTO accounts (name,city) VALUES ('Lola','Copacabana');
         ```

      2. In another Terminal window, navigate to <KAFKA_HOME>, then run `kafka-console-consumer` to consume the events you just sent:
         ```bash
         bin/kafka-console-consumer.sh --topic accounts --from-beginning --bootstrap-server localhost:9092
         ```
         You see something like:
         ```bash
         {
         "topic": "timescaledb.public.accounts",
         "value": "{\"schema\":{\"type\":\"struct\",\"fields\":[{\"type\":\"struct\",\"fields\":[{\"type\":\"string\",\"optional\":false,\"name\":\"io.debezium.time.ZonedTimestamp\",\"version\":1,\"default\":\"1970-01-01T00:00:00.000000Z\",\"field\":\"created_at\"},{\"type\":\"string\",\"optional\":true,\"field\":\"name\"},{\"type\":\"string\",\"optional\":true,\"field\":\"city\"}],\"optional\":true,\"name\":\"accounts._timescaledb_internal._hyper_1_1_chunk.Value\",\"field\":\"before\"},{\"type\":\"struct\",\"fields\":[{\"type\":\"string\",\"optional\":false,\"name\":\"io.debezium.time.ZonedTimestamp\",\"version\":1,\"default\":\"1970-01-01T00:00:00.000000Z\",\"field\":\"created_at\"},{\"type\":\"string\",\"optional\":true,\"field\":\"name\"},{\"type\":\"string\",\"optional\":true,\"field\":\"city\"}],\"optional\":true,\"name\":\"accounts._timescaledb_internal._hyper_1_1_chunk.Value\",\"field\":\"after\"},{\"type\":\"struct\",\"fields\":[{\"type\":\"string\",\"optional\":false,\"field\":\"version\"},{\"type\":\"string\",\"optional\":false,\"field\":\"connector\"},{\"type\":\"string\",\"optional\":false,\"field\":\"name\"},{\"type\":\"int64\",\"optional\":false,\"field\":\"ts_ms\"},{\"type\":\"string\",\"optional\":true,\"name\":\"io.debezium.data.Enum\",\"version\":1,\"parameters\":{\"allowed\":\"true,first,first_in_data_collection,last_in_data_collection,last,false,incremental\"},\"default\":\"false\",\"field\":\"snapshot\"},{\"type\":\"string\",\"optional\":false,\"field\":\"db\"},{\"type\":\"string\",\"optional\":true,\"field\":\"sequence\"},{\"type\":\"int64\",\"optional\":true,\"field\":\"ts_us\"},{\"type\":\"int64\",\"optional\":true,\"field\":\"ts_ns\"},{\"type\":\"string\",\"optional\":false,\"field\":\"schema\"},{\"type\":\"string\",\"optional\":false,\"field\":\"table\"},{\"type\":\"int64\",\"optional\":true,\"field\":\"txId\"},{\"type\":\"int64\",\"optional\":true,\"field\":\"lsn\"},{\"type\":\"int64\",\"optional\":true,\"field\":\"xmin\"}],\"optional\":false,\"name\":\"io.debezium.connector.postgresql.Source\",\"version\":1,\"field\":\"source\"},{\"type\":\"struct\",\"fields\":[{\"type\":\"string\",\"optional\":false,\"field\":\"id\"},{\"type\":\"int64\",\"optional\":false,\"field\":\"total_order\"},{\"type\":\"int64\",\"optional\":false,\"field\":\"data_collection_order\"}],\"optional\":true,\"name\":\"event.block\",\"version\":1,\"field\":\"transaction\"},{\"type\":\"string\",\"optional\":false,\"field\":\"op\"},{\"type\":\"int64\",\"optional\":true,\"field\":\"ts_ms\"},{\"type\":\"int64\",\"optional\":true,\"field\":\"ts_us\"},{\"type\":\"int64\",\"optional\":true,\"field\":\"ts_ns\"}],\"optional\":false,\"name\":\"accounts._timescaledb_internal._hyper_1_1_chunk.Envelope\",\"version\":2},\"payload\":{\"before\":null,\"after\":{\"created_at\":\"2025-04-22T15:25:29.681517Z\",\"name\":\"sdfg\",\"city\":\"asdf\"},\"source\":{\"version\":\"3.1.0.Final\",\"connector\":\"postgresql\",\"name\":\"accounts\",\"ts_ms\":1745335529692,\"snapshot\":\"false\",\"db\":\"postgres\",\"sequence\":\"[null,\\\"29187960\\\"]\",\"ts_us\":1745335529692108,\"ts_ns\":1745335529692108000,\"schema\":\"public\",\"table\":\"accounts\",\"txId\":769,\"lsn\":29187960,\"xmin\":null},\"transaction\":null,\"op\":\"c\",\"ts_ms\":1745335530172,\"ts_us\":1745335530172473,\"ts_ns\":1745335530172473672}}",
         "headers": [
         {
         "key": "__debezium_timescaledb_chunk_table",
         "value": "_hyper_1_1_chunk"
         },
         {
         "key": "__debezium_timescaledb_chunk_schema",
         "value": "_timescaledb_internal"
         }
         ],
         "timestamp": 1745335530762,
         "partition": 0,
         "offset": 0
         }
         ```

</Procedure>

You have successfully integrated Debezium.


</Tab>

<Tab title="Timescale Cloud">

Debezium requires logical replication to be enabled. Currently, this is not enabled by default on $SERVICE_LONGs.
We are working on enabling this feature as you read. As soon as it is live, these docs will be updated.

</Tab>

</Tabs>


[hypertables]: /use-timescale/:currentVersion:/hypertables/
[hypercore]: /use-timescale/:currentVersion:/hypercore/
[caggs]: /use-timescale/:currentVersion:/continuous-aggregates/
[connection-info]: /integrations/:currentVersion:/find-connection-details/
[debezium]: https://debezium.io/
[java-installers]: https://www.oracle.com/java/technologies/downloads/
[debezium-install]: https://debezium.io/documentation/reference/stable/operations/debezium-server.html#_installation
[console]: https://console.cloud.timescale.com/dashboard/services
[redis-local]: https://redis.io/docs/getting-started/
[redis-cloud]: https://redis.com/try-free/
[connect]: /getting-started/:currentVersion:/run-queries-from-console/
[kafka-install-configure]: /integrations/:currentVersion:/debezium#install-and-configure-apache-kafka
[debezium-configure-database]: /integrations/:currentVersion:/debezium##configure-your-database-to-work-with-debezium
[psql-connect]: /integrations/:currentVersion:/psql/#connect-to-your-service
