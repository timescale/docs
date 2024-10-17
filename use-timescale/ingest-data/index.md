---
title: Import and ingest data
excerpt: Use third-party tools to ingest data into a Timescale Cloud service
products: [cloud]
keywords: [ingest, pipelines, Prometheus, Kafka, Telegraf, timescaledb-parallel-copy, csv]
---

# Import and ingest data

By default, you add data to your $SERVICE_LONG using [SQL inserts][writing-data]. You can also 
import data from other tools, and build data ingest pipelines. A data ingest pipeline can
increase your data ingest rates using batch writes, instead of inserting data one row or metric at a time. 

- **Import data**

  You can Import data into your $SERVICE_LONG from:
  * [CSV][import-csv]
  * [Parquet][import-parquet]
  * [MySQL][import-mysql]

- **Ingest data**

  You can ingest data into your $SERVICE_LONG from:
    * [Kafka][ingest-kafka]
    * [Telegraf][ingest-telegraf]

Any tool that can read or write to PostgreSQL also works with $CLOUD_LONG.

[ingest-kafka]: /use-timescale/:currentVersion:/ingest-data/ingest-kafka/
[ingest-telegraf]: /use-timescale/:currentVersion:/ingest-data/telegraf/
[writing-data]: /use-timescale/:currentVersion:/write-data/
[import-csv]: /use-timescale/:currentVersion:/ingest-data/import-csv/
[import-mysql]: /use-timescale/:currentVersion:/ingest-data/import-mysql/
[import-parquet]: /use-timescale/:currentVersion:/ingest-data/import-parquet/
