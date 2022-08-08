---
title: PostgreSQL Kafka connector
excerpt: Ingest data into TimescaleDB using the PostgreSQL Kafka connector
keywords: [ingest, Kafka]
tags: [insert]
---

# PostgreSQL Kafka connector
You can ingest data into TimescaleDB using the Kafka Connect JDBC sink
connector. The connector is deployed to a Kafka Connect runtime service, and
ingests change events from PostgreSQL databases, such as TimescaleDB.

The deployed connector monitors one or more schemas within a TimescaleDB server
and writes all change events to Kafka topics, which can be independently consumed
by one or more clients. Kafka Connect can be distributed to provide fault
tolerance to ensure the connectors are running and continually keeping up with
changes in the database.

You can also use the PostgreSQL connector as a library without Kafka, which
allows applications and services to connect directly to TimescaleDB and retrieve
change events. This approach requires the application to record the progress of
the connector so that if the connection is reset, it can continue where it left
off. This approach is useful for less critical use cases. However, for
production installations, you can use the Kafka Connect JDBC
sink connector.

For more information about the Kafka Connect JDBC Sink connector, see the
[Kafka connector GitHub page][postgresql-connector-kafka].

[postgresql-connector-kafka]: https://github.com/debezium/debezium/tree/master/debezium-connector-postgres
