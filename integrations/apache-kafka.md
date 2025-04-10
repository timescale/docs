---
title: Integrate Apache Kafka with Timescale Cloud 
excerpt: Apache Kafka is a distributed event streaming platform used for high-performance data pipelines. Learn how to integrate Apache Kafka with Timescale Cloud to manage and analyze streaming data
products: [cloud, self_hosted]
keywords: [Apache Kafka, integrations]
---

import IntegrationPrereqs from "versionContent/_partials/_integration-prereqs.mdx";

# Integrate Apache Kafka with $CLOUD_LONG

[Apache Kafka][apache-kafka] is a distributed event streaming platform used for high-performance data pipelines, 
streaming analytics, and data integration. [Apache Kafka Connect][kafka-connect] is a tool to scalably and reliably 
stream data between Apache Kafka® and other data systems. Kafka Connect is an ecosystem of pre-written and maintained 
Kafka Producers (source connectors) and Kafka Consumers (sink connectors) for data products and platforms like 
databases and message brokers.

This guide explains how to set up Kafka and Kafka Connect to stream data from a Kafka topic into your $SERVICE_LONG.

## Prerequisites

<IntegrationPrereqs />

- [Java8 or higher][java-installers] to run Apache Kafka

## Install and configure Apache Kafka

To install and configure Apache Kafka:

<Procedure>

1. **Extract the Kafka binaries to a local folder**

    ```bash
    curl https://dlcdn.apache.org/kafka/3.9.0/kafka_2.13-3.9.0.tgz | tar -xzf - 
    cd kafka_2.13-3.9.0
    ```
   From now on, the folder where you extracted the Kafka binaries is called `<KAFKA_HOME>`.
   
1. **Configure and run Apache Kafka**

   ```bash
   KAFKA_CLUSTER_ID="$(bin/kafka-storage.sh random-uuid)"
   ./bin/kafka-storage.sh format --standalone -t $KAFKA_CLUSTER_ID -c config/kraft/reconfig-server.properties
   ./bin/kafka-server-start.sh config/kraft/reconfig-server.properties
   ```
    Use the `-daemon` flag to run this process in the background.
   
1. **Create Kafka topics**

   In another Terminal window, navigate to <KAFKA_HOME>, then call `kafka-topics.sh` and create the following topics:
   - `accounts`: publishes JSON messages that are consumed by the timescale-sink connector and inserted into your $SERVICE_LONG. 
   - `deadletter`: stores messages that cause errors and that Kafka Connect workers cannot process. 

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
   
1. **Test that your topics are working correctly**
   1. Run `kafka-console-producer` to send messages to the `accounts` topic:
      ```bash
      bin/kafka-console-producer.sh --topic accounts --bootstrap-server localhost:9092
      ```
   1. Send some events. For example, type the following:
      ```bash
      >Timescale Cloud
      >How Cool
      ```
   2. In another Terminal window, navigate to <KAFKA_HOME>, then run `kafka-console-consumer` to consume the events you just sent:
      ```bash
      bin/kafka-console-consumer.sh --topic accounts --from-beginning --bootstrap-server localhost:9092
      ```
      You see
      ```bash
      Timescale Cloud
      How Cool
     ```
   
</Procedure>

Keep these terminals open, you use them to test the integration later.

## Install the sink connector to communicate with $CLOUD_LONG

To set up Kafka Connect server, plugins, drivers, and connectors:

<Procedure>

1. **Install the PostgreSQL connector**

   In another Terminal window, navigate to <KAFKA_HOME>, then download and configure the PostgreSQL sink and driver.
   ```bash
   mkdir -p "plugins/camel-postgresql-sink-kafka-connector"
   curl https://repo.maven.apache.org/maven2/org/apache/camel/kafkaconnector/camel-postgresql-sink-kafka-connector/3.21.0/camel-postgresql-sink-kafka-connector-3.21.0-package.tar.gz \
   | tar -xzf - -C "plugins/camel-postgresql-sink-kafka-connector" --strip-components=1
   curl  -H "Accept: application/zip" https://jdbc.postgresql.org/download/postgresql-42.7.5.jar -o  "plugins/camel-postgresql-sink-kafka-connector/postgresql-42.7.5.jar"
   echo "plugin.path=`pwd`/plugins/camel-postgresql-sink-kafka-connector" >> "config/connect-distributed.properties"
   echo "plugin.path=`pwd`/plugins/camel-postgresql-sink-kafka-connector" >> "config/connect-standalone.properties" 
   ```
   
1. **Start Kafka Connect**

    ```bash
   export CLASSPATH=`pwd`/plugins/camel-postgresql-sink-kafka-connector/*
   ./bin/connect-standalone.sh config/connect-standalone.properties
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

       1. In the terminal running Kafka Connect, stop the process by pressing `Ctrl+C`.

       1. Write the following configuration to `<KAFKA_HOME>/config/timescale-standalone-sink.properties`, then update the `<properties>` with your [connection details][connection-info].

          ```properties
          name=timescale-standalone-sink
          connector.class=org.apache.camel.kafkaconnector.postgresqlsink.CamelPostgresqlsinkSinkConnector
          errors.tolerance=all
          errors.deadletterqueue.topic.name=deadletter
          tasks.max=10
          value.converter=org.apache.kafka.connect.storage.StringConverter
          key.converter=org.apache.kafka.connect.storage.StringConverter
          topics=accounts
          camel.kamelet.postgresql-sink.databaseName=<dbname>
          camel.kamelet.postgresql-sink.username=<user>
          camel.kamelet.postgresql-sink.password=<password>
          camel.kamelet.postgresql-sink.serverName=<host>
          camel.kamelet.postgresql-sink.serverPort=<port>
          camel.kamelet.postgresql-sink.query=INSERT INTO accounts (name,city) VALUES (:#name,:#city)
          ```
       1. Restart Kafka Connect with the new configuration:
          ```bash
          export CLASSPATH=`pwd`/plugins/camel-postgresql-sink-kafka-connector/*
          ./bin/connect-standalone.sh config/connect-standalone.properties config/timescale-standalone-sink.properties
          ```

1. **Test the connection**

   To see your sink, query the `/connectors` route in a GET request:

   ```bash
   curl -X GET http://localhost:8083/connectors
   ```
   You see:

   ```bash
   #["timescale-standalone-sink"]
   ```

</Procedure>

## Test the integration with $CLOUD_LONG

To test this integration, send some messages onto the `accounts` topic. You can do this using the kafkacat or kcat utility.

<Procedure>

1. **In the terminal running `kafka-console-producer.sh` enter the following json strings**

   ```bash
   {"name":"Lola","city":"Copacabana"} 
   {"name":"Holly","city":"Miami"}
   {"name":"Jolene","city":"Tennessee"}
   {"name":"Barbara Ann ","city":"California"} 
   ```
   Look in your terminal running `kafka-console-consumer` to see the messages being processed.

1. **Query your $SERVICE_LONG for all rows in the `accounts` table**

   ```sql
   SELECT * FROM accounts;
   ```
   You see something like:

   | created_at                    |  name  |      city |
   | -- | --| -- |
   |2025-02-18 13:55:05.147261+00 | Lola | Copacabana |
   |2025-02-18 13:55:05.216673+00 | Holly | Miami |
   |2025-02-18 13:55:05.283549+00 | Jolene | Tennessee |
   |2025-02-18 13:55:05.35226+00 | Barbara Ann | California |

</Procedure>

You have successfully integrated Apache Kafka with $CLOUD_LONG.

[connection-info]: /integrations/:currentVersion:/find-connection-details/
[apache-kafka]: https://kafka.apache.org/documentation/
[install-kafka]: https://kafka.apache.org/quickstart
[java-installers]: https://www.oracle.com/java/technologies/downloads/
[kafka-connect]: https://docs.confluent.io/platform/current/connect/index.html
[kraft]: https://developer.confluent.io/learn/kraft/
[connect]: /getting-started/:currentVersion:/run-queries-from-console/
[kcat]: https://github.com/edenhill/kcat
