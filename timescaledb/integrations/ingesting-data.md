# Ingesting data

TimescaleDB can support standard SQL inserts. Read more about how to use
SQL to write data into TimescaleDB in our [Writing Data][writing-data] section.

Users often choose to leverage existing 3rd party tools to build data ingest pipelines
that increase ingest rates by performing batch writes into TimescaleDB, as opposed
to inserting data one row or metric at a time. At a high-level, TimescaleDB looks just
like PostgreSQL, so any tool that can read and/or write to PostgreSQL also works with
TimescaleDB.

Below, we discuss some popular frameworks and systems used in conjunction with TimescaleDB.

## Prometheus [](prometheus)

Prometheus is a popular tool used to monitor infrastructure metrics. It can scrape any
endpoints that expose metrics in a Prometheus-compatible format. The metrics are stored in
Prometheus and can be queried using PromQL. Prometheus itself is not built for long-term
metrics storage, and instead, supports a variety of remote storage solutions.

We developed a [Promscale][promscale-blog] that allows Prometheus to use TimescaleDB as a
remote store for long-term metrics. Promscale supports both PromQL and SQL, PromQL queries
can be directed to the Promscale endpoint or Prometheus instance and the [SQL
API][promscale-sql] can be accessed by connecting to Timescale directly. It also offers
other native time-series capabilities, such as automatically[compressing your
data][timescale-compression], retention policies, continuous aggregate views,
downsampling, data gap-filling, and interpolation. It is already natively supported by
Grafana via the [Prometheus][prometheus-grafana] and PostgreSQL/TimescaleDB
[postgres-grafana] data sources.

Read more about Promscale and how we designed it to perform well in our [design
doc][design-doc] or check out our [github project][promscale-github].

## PostgreSQL and TimescaleDB output plugin for Telegraf [](postgresql-and-timescaledb-output-plugin-for-telegraf)

Telegraf is an agent that collects, processes, aggregates, and writes metrics. Since it is plugin-driven for both the
collection and the output of data, it is easily extendable. In fact, it already contains over 200 plugins for gathering and
writing different types of data.

We wrote the PostgreSQL output plugin which also has the ability to send data to a TimescaleDB hypertable. Telegraf handles
batching, processing, and aggregating the data collected prior to inserting that data into TimescaleDB.

<!-- -->
>:WARNING: The [pull request][pull-request] is open and currently under review by the Telegraf developers, waiting to be
merged. To give users the opportunity to try this functionality, we built [downloadable binaries][downloadable-binaries] of
Telegraf with our plugin already included.

The PostgreSQL plugin extends the ease of use users get from leveraging Telegraf by handling schema generation and
modification. This means that as metrics are collected by Telegraf, the plugin creates a table if it doesn’t exist and alters
the table if a schema has changed. By default, the plugin leverages a [wide model][wide-model], which is typically the schema
model that TimescaleDB users tend to choose when storing metrics. However, you can specify that you want to store metrics in a
narrow model with a separate metadata table and foreign keys. You can also choose to use JSONB.

To get started with the PostgreSQL and TimescaleDB output plugin, visit the [tutorial][telegraf-tutorial].

## PostgreSQL's Kafka connector [](postgresqls-kafka-connector)

Another popular method of ingesting data into TimescaleDB is through the use of
the [PostgreSQL connector with Kafka Connect][postgresql-connector-with-kafka-connect].
The connector is designed to work with [Kafka Connect][kafka-connect] and to be
deployed to a Kafka Connect runtime service. It’s purpose is to ingest change
events from PostgreSQL databases (i.e. TimescaleDB).

The deployed connector will monitor one or more schemas within a TimescaleDB
server and write all change events to Kafka topics, which can be independently
consumed by one or more clients. Kafka Connect can be distributed to provide
fault tolerance to ensure the connectors are running and continually keeping
up with changes in the database.

>:TIP: The PostgreSQL connector can also be used as a library without Kafka or
Kafka Connect, enabling applications and services to directly connect to
TimescaleDB and obtain the ordered change events. This approach requires the
application to record the progress of the connector so that upon restart,
the connect can continue where it left off. This approach may be useful for
less critical use cases. However, for production use cases, it’s recommended
that you use this connector with Kafka and Kafka Connect.

To start using the PostgreSQL connector, visit the [GitHub page][github-debezium].
If you are interested in an alternative method to ingest data from Kafka to
TimescaleDB, you can download the [StreamSets Data Collector][streamsets-data-collector]
and get started with this [tutorial][tutorial-streamsets].  


[writing-data]: /using-timescaledb/writing-data
[prometheus-grafana]: https://grafana.com/docs/grafana/latest/datasources/prometheus/
[postgres-grafana]: https://grafana.com/docs/grafana/latest/datasources/postgres/
[promscale-blog]: https://blog.timescale.com/blog/promscale-analytical-platform-long-term-store-for-prometheus-combined-sql-promql-postgresql/
[promscale-sql]: https://github.com/timescale/promscale/blob/master/docs/sql_schema.md
[timescale-compression]: https://blog.timescale.com/blog/building-columnar-compression-in-a-row-oriented-database/
[grafana]: /using-timescaledb/visualizing-data#grafana
[other-viz-tools]: /using-timescaledb/visualizing-data#other-viz-tools
[pull-request]: https://github.com/influxdata/telegraf/pull/3428
[downloadable-binaries]: https://docs.timescale.com/tutorials/telegraf-output-plugin#telegraf-installation
[wide-model]: https://docs.timescale.com/introduction/data-model
[telegraf-tutorial]: https://docs.timescale.com/tutorials/telegraf-output-plugin
[postgresql-connector-with-kafka-connect]: https://github.com/debezium/debezium/tree/master/debezium-connector-postgres
[kafka-connect]: http://kafka.apache.org/documentation.html#connect
[github-debezium]: https://github.com/debezium/debezium/tree/master/debezium-connector-postgres
[streamsets-data-collector]: https://streamsets.com/opensource
[tutorial-streamsets]: https://streamsets.com/blog/ingesting-data-apache-kafka-timescaledb/
