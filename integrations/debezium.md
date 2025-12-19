---
title: Integrate Debezium with Tiger Cloud
excerpt: Integrate Debezium with Tiger Cloud to enable change data capture in your Tiger Cloud service and streaming to Redis Streams
products: [self_hosted]
keywords: [Debezium, integrate]
---

import IntegrationPrereqsSelfOnly from "versionContent/_partials/_integration-prereqs-self-only.mdx";
import IntegrationDebeziumDocker from "versionContent/_partials/_integration-debezium-docker.mdx";
import IntegrationDebeziumSelfHostedConfig from "versionContent/_partials/_integration-debezium-self-hosted-config-database.mdx";

# Integrate Debezium with $CLOUD_LONG

[Debezium][debezium] is an open-source distributed platform for change data capture (CDC). 
It enables you to capture changes in a $SELF_LONG instance and stream them to other systems in real time.

Debezium can capture events about:

- [Hypertables][hypertables-section]: captured events are rerouted from their chunk-specific topics to a single logical topic 
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

<IntegrationPrereqsSelfOnly />

- [Install Docker][install-docker] on your development machine.

## Configure your database to work with Debezium

<Tabs label="Integrate with Debezium" persistKey="source-database">

<Tab title="Self-hosted TimescaleDB" label="self-hosted">

To set up $SELF_LONG to communicate with Debezium:

<Procedure>

<IntegrationDebeziumSelfHostedConfig />

</Procedure>

## Configure Debezium to work with your database

Set up Kafka Connect server, plugins, drivers, and connectors:

<Procedure>

<IntegrationDebeziumDocker />

</Procedure>

</Tab>

<Tab title="Tiger" label="tiger-cloud">

Debezium requires logical replication to be enabled. Currently, this is not enabled by default on $SERVICE_LONGs.
We are working on enabling this feature as you read. As soon as it is live, these docs will be updated.

</Tab>

</Tabs>

And that is it,  you have configured Debezium to interact with $COMPANY products.

[caggs]: /use-timescale/:currentVersion:/continuous-aggregates/
[debezium]: https://debezium.io/
[hypercore]: /use-timescale/:currentVersion:/hypercore/
[hypertables-section]: /use-timescale/:currentVersion:/hypertables/
[install-docker]: https://docs.docker.com/engine/install/
