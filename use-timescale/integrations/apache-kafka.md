---
title: Integrate Apache Kafka with Timescale Cloud 
excerpt: Learn how to integrate Apache Kafka with Timescale Cloud to manage and analyze streaming data efficiently.
products: [cloud, self_hosted]
keywords: [Apache Kafka, integrations]
---

import IntegrationPrereqs from "versionContent/_partials/_integration-prereqs.mdx";

# Integrate Apache Kafka with $CLOUD_LONG

[Apache Kafka][apache-kafka] is a distributed event streaming platform used for high-performance data pipelines, 
streaming analytics, and data integration. [Apache Kafka Connect][kafka-connect] is a tool for scalably and reliably 
streaming data between Apache Kafka® and other data systems. Kafka Connect an ecosystem of pre-written and maintained 
Kafka Producers (source connectors) and Kafka Consumers (sink connectors) for data products and platforms like 
databases and message brokers.

This guide explains how to set up Kafka and Kafka Connect to stream data from a Kafka topic into a $SERVICE_LONG.

## Prerequisites

<IntegrationPrereqs />

- [Java8 or higher][java-installers] to run Apache Kafka   
- [kcat][kcat] to pipe messages into kafka topics

## Install and configure Apache Kafka

To install and configure Apache Kafka:

<Procedure>

1. **Extract the Kafka binaries to a local folder**

    ```bash
    curl https://downloads.apache.org/kafka/3.9.0/kafka_2.13-3.9.0.tgz | tar -xzf -
    cd kafka_2.13-3.9.0
    ```
   
1. **Configure and run Apache Kafka**

   ```bash
   KAFKA_CLUSTER_ID="$(bin/kafka-storage.sh random-uuid)"
   ./bin/kafka-storage.sh format --standalone -t $KAFKA_CLUSTER_ID -c config/kraft/reconfig-server.properties
   ./bin/kafka-server-start.sh config/kraft/reconfig-server.properties
   ```
    Use the `-daemon` flag to run this process in the background.
   
1. **Create some topics**

   In another Terminal window, call `kafka-topics.sh` and create the following topics:
   - `mytopic`: publishes JSON messages that are consumed by the timescale-sink connector and inserted into your $SERVICE_LONG. 
   - `deadletter`: a dead letter queue stores messages that cause errors and Kafka Connect workers cannot process. 

   ```bash
   ./bin/kafka-topics.sh \
        --create \
        --topic accounts \
        --bootstrap-server localhost:9092 \
        --partitions 10
        
   ./bin/kafka-topics.sh \
        --create \
        --topic deadletter \
        --bootstrap-server localhost:9092 \
        --partitions 10
   ```

</Procedure>

## Install the PostgreSQL sink connector

To set up Kafka Connect server, plugins, drivers, and connectors:

<Procedure>

1. **Setup the plugins folders**

   1. In Terminal, in the root folder of your Kafka deployment, download and configure the PostgreSQL sink and driver.
      ```bash
      mkdir -p "plugins/camel-postgresql-sink-kafka-connector"
      curl https://repo.maven.apache.org/maven2/org/apache/camel/kafkaconnector/camel-postgresql-sink-kafka-connector/3.18.2/camel-postgresql-sink-kafka-connector-3.18.2-package.tar.gz \
      | tar -xzf - -C "plugins/camel-postgresql-sink-kafka-connector" --strip-components=1
      curl https://jdbc.postgresql.org/download/postgresql-42.6.0.jar > "plugins/camel-postgresql-sink-kafka-connector"
      curl https://jdbc.postgresql.org/download/postgresql-42.6.0.jar > "plugins/camel-postgresql-sink-kafka-connector/postgresql-42.6.0.jar"
      echo "plugin.path=`pwd`/plugins" >> "config/connect-distributed.properties" 
      ```
   
1. **Start Kafka Connect**

    ```bash
   ./bin/connect-distributed.sh config/connect-distributed.properties
   ```

   Use the `-daemon` flag to run this process in the background.

1. **In another Terminal window, verify Kafka Connect is running on port 8083**

    ```bash
    curl http://localhost:8083
    ```
    You see something like:
    ```bash
    {"version":"3.9.0","commit":"a60e31147e6b01ee","kafka_cluster_id":"J-iy4IGXTbmiALHwPZEZ-A"}
    ```

</Procedure>

## Create a table in your $SERVICE_LONG to ingest Kafka events

To prepare your $SERVICE_LONG for Kafka integration:

<Procedure>

1. ** [Connect][connect] to your $SERVICE_LONG **

1. **Create a table to ingest Kafka events**

   ```sql
   CREATE TABLE accounts (created_at TIMESTAMPTZ DEFAULT NOW(),
    name TEXT,
    city TEXT);
   ```

1. **Turn the table into a hypertable**

   ```sql
   SELECT create_hypertable('accounts', 'created_at');
   ```

</Procedure>

## Create the $CLOUD_LONG sink

To create a $CLOUD_LONG sink in Apache Kafka: 

<Procedure>


1.  **Create the connection configuration**

    Update the following JSON object with your [connection details][connection-info] and write it to the 
    `timescale-sink.properties` file. In this example, the sink connector writes messages from the `accounts` topic to 
    the `accounts` hypertable in your $SERVICE_LONG.
    ```bash
     {
     "name": "timescale-sink",
     "config": {
       "connector.class": "org.apache.camel.kafkaconnector.postgresqlsink.CamelPostgresqlsinkSinkConnector",
       "errors.tolerance": "all",
       "errors.deadletterqueue.topic.name": "deadletter",
       "tasks.max": 10,
       "value.converter": "org.apache.kafka.connect.storage.StringConverter",
       "key.converter": "org.apache.kafka.connect.storage.StringConverter",
       "topics": "accounts",
       "camel.kamelet.postgresql-sink.databaseName": "tsdb",
       "camel.kamelet.postgresql-sink.username": "tsdbadmin",
       "camel.kamelet.postgresql-sink.password": "<the password for tsdbadmin>",
       "camel.kamelet.postgresqlsink.serverName": "<host.name>.tsdb.cloud.timescale.com",
       "camel.kamelet.postgresql-sink.serverPort": "<host.port>",
       "camel.kamelet.postgresql-sink.query": "INSERT INTO accounts (name,city) VALUES (:#name,:#city)"
     }
    }
    ```

1. Upload your configuration to Kafka Connect:

   ```bash
   curl -X POST -H "Content-Type: application/json" \
    --data @timescale-sink.properties \
    http://localhost:8083/connectors
   ```

1. **Test the connection**

   To see your sink, query the `/connectors` route in a GET request:

   ```bash
   curl -X GET http://localhost:8083/connectors
   ```
   You see:

   ```bash
   #["timescale-sink"]
   ```

</Procedure>

## Test the integration with $CLOUD_LONG

To test this integration, send some messages onto the `mytopic` topic. You can do this using the kafkacat or kcat utility.

<Procedure>

1. **Pipe a JSON string containing a name and city into kafka using kcat**

   ```bash
   echo '{"name":"Mathis","city":"Salt Lake City"}' | kcat -P -b localhost:9092 -t accounts
   echo '{"name":"Oliver","city":"Moab"}' | kcat -P -b localhost:9092 -t accounts
   echo '{"name":"Lauren","city":"Park City"}' | kcat -P -b localhost:9092 -t accounts
   ```

1. **Query your $SERVICE_LONG for all rows in the `accounts` table**

   You see all messages appear:

   ```sql
   SELECT * FROM accounts;
   ```
   You see something like
   ```sql
   created_at                    |  name  |      city
   ------------------------------+--------+----------------
   2023-08-23 18:04:51.101906+00 | Mathis | Salt Lake City
   2023-08-23 18:04:54.856341+00 | Oliver | Moab
   2023-08-23 18:04:58.217255+00 | Lauren | Park City
   ```

</Procedure>

You have successfully integrated Apache Kafka with $CLOUD_LONG.

[connection-info]: /use-timescale/:currentVersion:/integrations/find-connection-details/
[apache-kafka]: https://kafka.apache.org/documentation/
[install-kafka]: https://kafka.apache.org/quickstart
[java-installers]: https://www.oracle.com/java/technologies/downloads/
[kafka-connect]: https://docs.confluent.io/platform/current/connect/index.html
[kraft]: https://developer.confluent.io/learn/kraft/
[connect]: /getting-started/:currentVersion:/run-queries-from-console/
[kcat]: https://github.com/edenhill/kcat
