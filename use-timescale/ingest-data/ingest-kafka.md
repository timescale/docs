---
title: Ingest data using Kafka
excerpt: Ingest data into a Timescale Cloud service using the PostgreSQL Kafka connector
products: [cloud, mst, self_hosted]
keywords: [ingest, Kafka]
tags: [insert]
---

# PostgreSQL Kafka connector

You can ingest data into a $SERVICE_LONG using the Kafka Connect
[JDBC sink connector with a JDBC driver][postgresql-connector-kafka]. 
To provide fault tolerance, and to ensure the connectors are running and continuously
keeping up with changes in the database, you can distribute Kafka Connect.


[postgresql-connector-kafka]: https://docs.confluent.io/kafka-connectors/jdbc/current/sink-connector/overview.html
