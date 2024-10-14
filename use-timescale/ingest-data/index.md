---
title: Import and ingest data
excerpt: Use third-party tools to ingest data into TimescaleDB
products: [cloud]
keywords: [ingest, pipelines, Prometheus, Kafka, Telegraf, timescaledb-parallel-copy, csv]
---

# Import and ingest data



## Import data

Import data into Timescale from various formats and databases:
*   Import data from a [`.csv` file][import-csv]
*   Import data from a [`.parquet` file][import-parquet]
*   Import data from a [MySQL database][import-mysql]

## Ingest data

By default, Timescale supports standard SQL inserts. Additionally, you can use
third-party tools to build data ingest pipelines. A data ingest pipeline can
increase your data ingest rates by using batch writes, instead of inserting data
one row or metric at a time. Any tool that can read or write to PostgreSQL also
works with Timescale.

For more information about how to use standard SQL insert queries to write data
into Timescale, see the [Writing Data][writing-data] section.

Ingest data from the following sources:
*   Ingest data using [Kafka][ingest-kafka]
*   Ingest data using [Telegraf][ingest-telegraf]

[ingest-kafka]: /use-timescale/:currentVersion:/ingest-data/ingest-kafka/
[ingest-telegraf]: /use-timescale/:currentVersion:/ingest-data/telegraf/
[writing-data]: /use-timescale/:currentVersion:/write-data/
[import-csv]: /use-timescale/:currentVersion:/ingest-data/import-csv/
[import-mysql]: /use-timescale/:currentVersion:/ingest-data/import-mysql/
[import-parquet]: /use-timescale/:currentVersion:/ingest-data/import-parquet/
