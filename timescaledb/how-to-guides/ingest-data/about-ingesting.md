# Ingesting data from other sources
By default, TimescaleDB supports standard SQL inserts. Additionally, you can use
third party tools to build data ingest pipelines. A data ingest pipeline can
increase your data ingest rates by using batch writes, instead of inserting data
one row or metric at a time. Any tool that can read or write to PostgreSQL also
works with TimescaleDB.

For more information about how to use standard SQL insert queries to write data
into TimescaleDB, see the [Writing Data][writing-data] section.

[writing-data]: /how-to-guides/write-data/
