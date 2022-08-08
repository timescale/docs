---
title: PostgreSQL Kafka connector
excerpt: Ingest data into TimescaleDB using the PostgreSQL Kafka connector
keywords: [ingest, Kafka]
tags: [insert]
---

# PostgreSQL Kafka connector
You can ingest data into TimescaleDB using the Kafka Connect JDBC sink
connector with a JDBC driver. Kafka Connect can be distributed to provide fault tolerance to ensure
the connectors are running and continually keeping up with changes in the
database.

For more information about the Kafka Connect JDBC sink connector, see the
[JDBC Connector documentation][postgresql-connector-kafka].

[postgresql-connector-kafka]: https://docs.confluent.io/5.4.1/connect/kafka-connect-jdbc/index.html
