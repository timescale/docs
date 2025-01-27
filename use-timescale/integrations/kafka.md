---
title: Integrate Apache Kafka with Timescale Cloud 
excerpt: Learn how to integrate Apache Kafka with Timescale Cloud to manage and analyze streaming data efficiently.
products: [cloud, self_hosted]
keywords: [Apache Kafka, integrations]
---

import IntegrationPrereqs from "versionContent/_partials/_integration-prereqs.mdx";

# Integrate Apache Kafka with $CLOUD_LONG

[Apache Kafka][apache-kafka] is a distributed event streaming platform used for high-performance data pipelines, streaming analytics, and data integration.

[Apache Kafka Connect][kafka-connect] is an ecosystem of pre-written and maintained Kafka Producers (source connectors) and Kafka Consumers (sink connectors) for various other data products and platforms like databases and message brokers.

This guide explains how to set up Kafka and Kafka Connect to stream data from a Kafka topic into a $SERVICE_LONG.

## Prerequisites

<IntegrationPrereqs />

- Download [Apache Kafka][install-kafka]. 

## Install and configure Apache Kafka

To install and configure Apache Kafka:

<Procedure>

1. **Create a directory called `/usr/local/kafka` to store everything related to Kafka**

1. **Call `chown` to change the directory ownership to you** 

    For production, create a separate user to launch the binaries and scripts from, for added security.

1. **Extract the compressed archive into the `/usr/local/kafka` directory**

    ```bash
    wget https://downloads.apache.org/kafka/3.5.1/kafka_2.13-3.5.1.tgz
    sudo mkdir /usr/local/kafka
    sudo chown -R $(whoami) /usr/local/kafka

    tar \
    -xzf kafka_2.13-3.5.1.tgz \
    -C /usr/local/kafka \
    --strip-components=1
    ```
   
1. **Generate a random UUID and format the storage for [KRaft][kraft]**

    This procedure uses the KRaft consensus algorithm that removes the need to run a separate Zookeeper process alongside Kafka.

1. **Start Kafka with the `kafka-server-start.sh` script**

    Use the `-daemon` flag to run this process in the background. Alternatively, use `tmux` to temporarily run Kafka in a separate terminal. The second argument in the start command is the configuration file, which is the default configuration file used when running Kafka with KRaft:

    ```bash
    export uuid=$(/usr/local/kafka/bin/kafka-storage.sh random-uuid)

    /usr/local/kafka/bin/kafka-storage.sh format \
    -t $uuid \
    -c /usr/local/kafka/config/kraft/server.properties

    /usr/local/kafka/bin/kafka-server-start.sh \
    -daemon \
    /usr/local/kafka/config/kraft/server.properties
    ```
   
1. **Create topics with the `kafka-topics.sh` script**

   Create `mytopic` to publish JSON messages that will be consumed by the sink connector and inserted into your $SERVICE_LONG. Then create the `deadletter` topic to be used as a dead letter queue. A dead letter queue stores messages that your Kafka Connect workers couldn’t process, so you can see what messages are causing errors.

    ```bash
    /usr/local/kafka/bin/kafka-topics.sh \
        --create \
        --topic mytopic \
        --bootstrap-server localhost:9092 \
        --partitions 10
        
    /usr/local/kafka/bin/kafka-topics.sh \
        --create \
        --topic deadletter \
        --bootstrap-server localhost:9092 \
        --partitions 10
    ```

</Procedure>

## Install Kafka Connect

To set up Kafka Connect server, plugins, drivers, and connectors:

<Procedure>

1. **Create a `/usr/local/kafka/plugins` path**

    ```bash
    mkdir /usr/local/kafka/plugins 
    /usr/local/kafka/plugins/camel-postgresql-sink-kafka-connector
    ```
   
1. **Add a single configuration line to the `config/connect-distributed.properties` file** 

   This line points the Kafka Connect process to the directory of plugins it can use:

    ```bash
    echo "plugin.path=/usr/local/kafka/plugins" >> /usr/local/kafka/config/connect-distributed.properties
    ```
   
1. **Download the camel PostgreSQL sink connector and extract it in the plugins directory**

    ```bash
    wget https://repo.maven.apache.org/maven2/org/apache/camel/kafkaconnector/camel-postgresql-sink-kafka-connector/3.18.2/camel-postgresql-sink-kafka-connector-3.18.2-package.tar.gz

    tar \
    -xzf camel-postgresql-sink-kafka-connector-3.18.2-package.tar.gz \
    -C /usr/local/kafka/plugins/camel-postgresql-sink-kafka-connector \
    --strip-components=1
    ```
   
1. **Download the PostgreSQL driver and move it to the plugins directory**

    ```bash
    wget https://jdbc.postgresql.org/download/postgresql-42.6.0.jar

    mv postgresql-42.6.0.jar /usr/local/kafka/plugins/camel-postgresql-sink-kafka-connector
    ```
   
1. **Start the Kafka Connect process**

    ```bash
   /usr/local/kafka/bin/connect-distributed.sh
   -daemon \
   /usr/local/kafka/config/connect-distributed.properties
   ```

   Alternatively, omit the `-daemon` flag and start the process in a `tmux` window to see the output.

</Procedure>

## Create the $CLOUD_LONG sink

To create a sink: 

<Procedure>

1. **Verify Kafka Connect is running on port 8083**

    ```bash
    curl http://localhost:8083
    ```

1. **Send a POST request to the Kafka Connect REST API on port 8083** 

    The body of this POST request contains your connector configuration in JSON format. Configure the connection fields using your [connection details][connection-info]. For example: 

   ```bash
   echo '{
     "name": "timescale-sink",
     "config": {
       "connector.class": "org.apache.camel.kafkaconnector.postgresqlsink.CamelPostgresqlsinkSinkConnector",
       "errors.tolerance": "all",
       "errors.deadletterqueue.topic.name": "deadletter",
       "tasks.max": 10,
       "value.converter": "org.apache.kafka.connect.storage.StringConverter",
       "key.converter": "org.apache.kafka.connect.storage.StringConverter",
       "topics": "mytopic",
       "camel.kamelet.postgresql-sink.databaseName": "tsdb",
       "camel.kamelet.postgresql-sink.username": "tsdbadmin",
       "camel.kamelet.postgresql-sink.password": "password",
       "camel.kamelet.postgresqlsink.serverName": "service_id.project_id.tsdb.cloud.timescale.com",
       "camel.kamelet.postgresql-sink.serverPort": "5432",
       "camel.kamelet.postgresql-sink.query": "INSERT INTO accounts (name,city) VALUES (:#name,:#city)"
     }
   }' > timescale-sink.properties
   ```

   To send the POST request to Kafka Connect's REST API (on port 8083), you can use the following `curl` command:

   ```bash
   curl -X POST -H "Content-Type: application/json" \
    --data @timescale-sink.properties \
    http://localhost:8083/connectors
   ```

1. **Test the connection**

   Query the `/connectors` route in a GET request to see your sink:

   ```bash
   curl -X GET http://localhost:8083/connectors
   #["timescale-sink"]
   ```
   
</Procedure>

## Test the integration with $CLOUD_LONG

To test this integration, send some messages onto the `mytopic` topic. You can do this using the kafkacat or kcat utility.

<Procedure>

1. **[Connect][connect] to your $SERVICE_LONG**

1. **Create an `accounts` hypertable**

   ```sql
   CREATE TABLE accounts (created_at TIMESTAMPTZ DEFAULT NOW(),
    name TEXT,
    city TEXT);
    
   SELECT create_hypertable('accounts', 'created_at');
   ```
   
1. **Install kafkacat**

   ```bash
   sudo apt install kafkacat
   ```

1. **Pipe a JSON string containing a name and city into kafkacat**

   ```bash
   echo '{"name":"Mathis","city":"Salt Lake City"}' | kafkacat -P -b localhost:9092 -t mytopic
   echo '{"name":"Oliver","city":"Moab"}' | kafkacat -P -b localhost:9092 -t mytopic
   echo '{"name":"Lauren","city":"Park City"}' | kafkacat -P -b localhost:9092 -t mytopic
   ```
   
   This command uses the following flags:

   - `-P`: tells Kafkacat that you want to produce messages
   - `-b`: defines bootstrap brokers' location
   - `-t`: defines topics on which to publish

1. **Query your $SERVICE_LONG for all rows in the `accounts` table**

   You see all messages appear:

   ```sql
   tsdb=> SELECT * FROM accounts;
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
[install-kafka]: https://kafka.apache.org/downloads
[kafka-connect]: https://docs.confluent.io/platform/current/connect/index.html
[kraft]: https://developer.confluent.io/learn/kraft/
[connect]: /getting-started/:currentVersion:/run-queries-from-console/
