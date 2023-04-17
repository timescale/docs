---
title: Ingesting data to your Timescale database
excerpt: Use third-party tools to ingest data into TimescaleDB
products: [cloud]
keywords: [ingest, pipelines, Prometheus, Kafka, Telegraf, timescaledb-parallel-copy, csv]
---

# Ingesting data with third-party tools

By default, TimescaleDB supports standard SQL inserts. Additionally, you can use
third-party tools to build data ingest pipelines.

This section covers some popular frameworks and systems used in conjunction with
TimescaleDB:

*   Ingest data using [Prometheus][ingest-prometheus]
*   Ingest data using [Kafka][ingest-kafka]
*   Ingest data using [Telegraf][ingest-telegraf]
*   Ingest data using [TimescaleDB parallel copy][ingest-parallel]
*   Ingest data [from a `.csv` file][ingest-csv]

For more information about how to use standard SQL insert queries to write data
into TimescaleDB, see the [Writing Data][writing-data] section.

[ingest-kafka]: /use-timescale/:currentVersion:/ingest-data/ingest-kafka/
[ingest-parallel]: /use-timescale/:currentVersion:/ingest-data/about-timescaledb-parallel-copy/
[ingest-prometheus]: /use-timescale/:currentVersion:/ingest-data/ingest-prometheus/
[ingest-telegraf]: /use-timescale/:currentVersion:/ingest-data/ingest-telegraf/
[writing-data]: /use-timescale/:currentVersion:/write-data/
[ingest-csv]: /use-timescale/:currentVersion:/ingest-data/import-csv/
