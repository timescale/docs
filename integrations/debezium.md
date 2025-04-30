---
title: Integrate Debezium with Timescale Cloud
excerpt: Integrate Debezium with Timescale Cloud to enable change data capture in your Timescale Cloud service and streaming to Redis Streams
products: [cloud, mst, self_hosted]
keywords: [Debezium, integrate]
---

import IntegrationPrereqs from "versionContent/_partials/_integration-prereqs.mdx";
import IntegrationDebeziumDocker from "versionContent/_partials/_integration-debezium-docker.mdx";
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

## Configure Debezium to listen to your database

Set up Kafka Connect server, plugins, drivers, and connectors:

<Procedure>

<IntegrationDebeziumDocker />

</Procedure>

You have successfully integrated Debezium.


</Tab>

<Tab title="Timescale Cloud">

Debezium requires logical replication to be enabled. Currently, this is not enabled by default on $SERVICE_LONGs.
We are working on enabling this feature as you read. As soon as it is live, these docs will be updated.

</Tab>

</Tabs>

And that is it,  you have configured debezium to interact with $

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
