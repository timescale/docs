# Ingesting data with third party tools
By default, TimescaleDB supports standard SQL inserts. Additionally, you can use
third party tools to build data ingest pipelines.

This section covers some popular frameworks and systems used in conjunction with
TimescaleDB:

* Ingest data using [Prometheus][ingest-prometheus]
* Ingest data using [Kafka][ingest-kafka]
* Ingest data using [Telegraf][ingest-telegraf]
* Ingest data using [TimescaleDB parallel copy][ingest-parallel]

For more information about how to use standard SQL insert queries to write data
into TimescaleDB, see the [Writing Data][writing-data] section.

[writing-data]: /how-to-guides/write-data/
[ingest-prometheus]: /how-to-guides/ingest-data/ingest-prometheus/
[ingest-kafka]: /how-to-guides/ingest-data/ingest-kafka/
[ingest-telegraf]: /how-to-guides/ingest-data/ingest-telegraf/
[ingest-parallel]: /how-to-guides/ingest-data/ingest-parallel-copy/
