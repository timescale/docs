# Ingesting data
By default, TimescaleDB supports standard SQL inserts. Additionally, you can use
third party tools to build data ingest pipelines. A data ingest pipeline can
increase your data ingest rates by using batch writes, instead of inserting data
one row or metric at a time. Any tool that can read or write to PostgreSQL also
works with TimescaleDB.

This section covers some popular frameworks and systems used in conjunction with
TimescaleDB.

For more information about how to use standard SQL insert queries to write data
into TimescaleDB, see the [Writing Data][writing-data] section.

## Prometheus
Prometheus is used to monitor infrastructure metrics. It scrapes any endpoints
that expose metrics in a compatible format. The metrics are stored in
Prometheus, and you can query them using PromQL (Prometheus Query Language). Prometheus
is not intended for long-term metrics storage, but it supports a
variety of remote storage solutions for that purpose.

TimescaleDB can use Prometheus as a remote store for long-term metrics, by using
[Promscale][promscale]. Promscale supports both PromQL and SQL queries. PromQL
queries are directed to the Promscale endpoint or the Prometheus instance. SQL
queries are handled directly by TimescaleDB. Promscale also offers other native
time-series capabilities, such as automatically
[compressing your data][timescale-compression], retention policies, continuous
aggregate views, downsampling, data gap-filling, and interpolation.
Additionally, Promscale supports Grafana using [Prometheus][prometheus-grafana]
and [PostgreSQL][postgres-grafana] data sources.

## Telegraf
Telegraf collects, processes, aggregates, and writes metrics. Telegraf is highly
extensible, and has over 200 plugins for gathering and writing different
types of data.

Timescale provides a downloadable Telegraf binary that includes an output
plugin. This TimescaleDB output plugin is used to send data from Telegraf to a
TimescaleDB hypertable. Telegraf batches, processes, and aggregates the
collected data, and then ingests the data into TimescaleDB.

The output plugin handles schema generation and modification. As metrics are
collected by Telegraf, the plugin checks to see if a table exists, creates it
if necessary, and alters the table if the schema changes.

By default, the plugin uses a [wide data model][wide-model], which is the most
common data model for storing metrics. Alternatively, you can specify a narrow
data model with a separate metadata table and foreign keys, or JSONB, if that
works better for your environment.

For more information about installing the Timescale Telegraf binaries with the
plugin, see the [telegraf-tutorial][telegraf-tutorial].

## PostgreSQL Kafka connector
You can ingest data into TimescaleDB using the Kafka Connect JDBC Sink
connector. The connector  is deployed to a Kafka Connect runtime service, and
ingests change events from  PostgreSQL databases, such as TimescaleDB.

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
production installations, we recommended that you use the Kafka Connect JDBC
Sink connector.

For more information about the Kafka Connect JDBC Sink connector, see the
[Kafka connector GitHub page][postgresql-connector-kafka].

## TimescaleDB parallel copy
For bulk inserting historical data, you can use the TimescaleDB parallel copy
tool, called `timescaledb-parallel-copy`. Install the tool from our repository
with this command:
```bash
go get github.com/timescale/timescaledb-parallel-copy/cmd/timescaledb-parallel-copy
```

For more information about the parallel copy tool, see the
[developer documentation][gh-parallel-copy].


[writing-data]: /how-to-guides/write-data/
[prometheus-grafana]: https://grafana.com/docs/grafana/latest/datasources/prometheus/
[postgres-grafana]: https://grafana.com/docs/grafana/latest/datasources/postgres/
[promscale]: /promscale/:currentVersion:/
[timescale-compression]: https://blog.timescale.com/blog/building-columnar-compression-in-a-row-oriented-database/
[wide-model]: /overview/data-model-flexibility/wide-data-model/
[telegraf-tutorial]: /timescaledb/:currentVersion:/tutorials/telegraf-output-plugin/
[postgresql-connector-kafka]: https://github.com/debezium/debezium/tree/master/debezium-connector-postgres
[gh-parallel-copy]: https://github.com/timescale/timescaledb-parallel-copy
