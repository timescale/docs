# About Promscale
Promscale is an open source observability backend for metrics and traces
powered by SQL.

It's built on the robust and high-performance foundation of PostgreSQL and
TimescaleDB. It has native support for Prometheus metrics and OpenTelemetry
traces as well as many other formats like StatsD, Jaeger and Zipkin through the
OpenTelemetry Collector and is [100% PromQL compliant][promlabs-test]. Its full
SQL capabilities enable developers to correlate metrics, traces and also
business data to derive new valuable insights not possible when data is siloed
in different systems. It easily integrates with Grafana and Jaeger for
visualizing metrics and traces.

Built on top of PostgreSQL and TimescaleDB, it inherits rock-solid reliability,
native compression up to 90%, continuous aggregates, and the operational
maturity of a system that is run on millions of instances worldwide.

For the Promscale source code, see our [GitHub repository][gh-promscale].

If you have any questions, join the `#promscale` channel on the
[TimescaleDB Community Slack][slack].

## Architecture
Promscale includes two components:

**Promscale Connector**: a stateless service that provides the ingest interfaces
for observability data, processes that data and stores it in TimescaleDB. It
also provides an interface to query the data with PromQL. The Promscale
Connector automatically sets up the data structures in TimescaleDB to store the
data and handles changes in those data structures if required for upgrading to
newer versions of Promscale. 

The Promscale Connector is a translator that natively support integrations with OSS
standards such as Prometheus and OpenTelemetry. It includes features that are native
to an observability ecosystem. Promscale connector creates schemas to store metrics
and traces. It offers a Prometheus endpoint for metrics reads and writes,
an OpenTelemetry Line Protocol endpoint to write traces, and a Jaeger query endpoint to
query traces. Promscale connector manages the complete lifecycle of data stored
in the database with operations such as compression and retention.

**Promscale Database**:  the database where all the observability data is stored
that combines PostgreSQL with TimescaleDB and the Promscale extension.
It offers a full SQL interface for querying the data, advanced capabilities like
analytical functions, columnar compression and continuous aggregates as well
as specific performance and query experience improvements for observability
data.

TimecaleDB stores the data and offers the TimescaleDB functionalities to the Promscale
connector. If you have custom metrics data, that is not in the Prometheus 
data model format, you can use the Promscale JSON streaming format
to store data in Promscale. This offers PromQL for querying metrics from
the connector, and SQL querying from the database.

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/promscale-arch.png" alt="Promscale architecture diagram"/>

The Promscale Connector ingests Prometheus metrics, metadata and OpenMetrics
exemplars using the Prometheus `remote_write` interface. It also ingests
OpenTelemetry traces using the OpenTelemetry protocol (OTLP). It can also ingest
metrics and traces in other formats using the OpenTelemetry Collector to process
and send them over the Prometheus `remote_write` interface and the OpenTelemetry
protocol. For example, you can use the OpenTelemetry Collector to ingest Jaeger
traces and StatsD metrics into Promscale.

For Prometheus metrics, the Promscale Connector exposes Prometheus API endpoints
for running PromQL queries and reading metadata. This allows you to connect
tools that support the Prometheus API, such as Grafana, directly to Promscale
for querying. It's also possible to send queries to Prometheus and have
Prometheus read data from Promscale using the Promscale Connector on the
`remote_read` interface.

For OpenTelemetry traces, there is a Jaeger storage plugin that implements the
interface for querying and retrieving traces. This allows you to visualize
traces stored in Promscale in Jaeger as well as Grafana by configuring a Jaeger
data source. In this case, Grafana queries Jaeger, which then queries Promscale.

You can also query metrics and traces in Promscale using SQL which allows you to
use many different visualization tools that integrate with PostgreSQL. For
example, Grafana supports querying data in Promscale using SQL out of the box
through the PostgreSQL data source.

## Promscale PostgreSQL extension
Promscale has a dependency on the
[Promscale PostgreSQL extension][promscale-extension], which contains support
functions to improve the performance of Promscale. While Promscale is able to
run without the additional extension installed, adding this extension gets
better performance from Promscale.

## Promscale schema for metric data
To achieve high ingestion, query performance, and optimal storage the Promscale
schema writes the data in the most optimal format for storage and querying in
TimescaleDB. Promscale translates data from the
[Prometheus data model][Prometheus native format] into a relational schema that
is optimized for TimescaleDB.

The basic schema uses a normalized design where time-series data is stored in
compressed hypertables. These tables have a foreign key to series tables that
are stored as regular PostgreSQL tables, and each series consists of a unique
set of labels.

For more information about compression, see the
[compression section][tsdb-compression]. For more information about hypertables,
see the [hypertables section][tsdb-hypertables].

### Metrics storage schema
Each metric is stored in a separate hypertable. In particular, the schema
decouples individual metrics, allowing for the collection of metrics with vastly
different cardinalities and retention periods. At the same time, Promscale
exposes simple, user-friendly views so that you do not have to understand this
optimized schema.

The latest chunk is decompressed to serve as a high-speed query cache. Older
chunks are stored as compressed chunks. We configure compression with the
`segment_by` column set to the `series_id` and the `order_by` column set to time
DESC. These settings control how data is split into blocks of compressed data.
Each block can be accessed and decompressed independently.

These settings mean that a block of compressed data is always associated with a
single `series_id` and that the data is sorted by time before being split into
blocks. This means each block is associated with a fairly narrow time range. As
a result, in compressed form, access by `series_id` and time range are
optimized.

For example, the hypertables for each metric use the following schema, using `cpu_usage` as an example metric:

The `cpu_usage` table schema:
```sql
CREATE TABLE cpu_usage (
	time 		TIMESTAMPTZ,
	value 	DOUBLE PRECISION,
	series_id 	BIGINT,
)
CREATE INDEX ON cpu_usage (series_id, time) INCLUDE (value)
```

```sql
 Column   |           Type           | Modifiers
-----------+--------------------------+-----------
time      | TIMESTAMPTZ              |
value     | DOUBLE PRECISION         |
series_id | BIGINT                   |
```

In this example, `series_id` is a foreign key to the `series` table described in the next section.

### Series storage schema
Conceptually, each row in the series table stores a set of key-value pairs. In
Prometheus, a series like this is represented as a one-level JSON string, such
as `{ "key1":"value1", "key2":"value2" }`. But the strings representing keys and
values are often long and repeating. So, to save space, we store a series as an
array of integer `foreign keys` to a normalized labels table.

The definition of these two tables is:
```sql
CREATE TABLE _prom_catalog.series (
    id serial,
    metric_id int,
    labels int[],
    UNIQUE(labels) INCLUDE (id)
);
CREATE INDEX series_labels_id ON _prom_catalog.series USING GIN (labels);

CREATE TABLE _prom_catalog.label (
    id serial,
    key TEXT,
    value text,
    PRIMARY KEY (id) INCLUDE (key, value),
    UNIQUE (key, value) INCLUDE (id)
);
```

### Promscale views
You interact with Prometheus data in Promscale through views. These views are
automatically created and are used to interact with metrics and labels.

Each metric and label has its own view. You can see a list of all metrics by
querying the view named `metric`. Similarly, you can see a list of all labels by
querying the view named `label`. These views are found in the `prom_info`
schema.

Querying the `metric` view returns all metrics collected by Prometheus:
```SQL
SELECT *
FROM prom_info.metric;
```

Here is one row of a sample output for the query shown earlier:
```
id                | 16
metric_name       | process_cpu_seconds_total
table_name        | process_cpu_seconds_total
retention_period  | 90 days
chunk_interval    | 08:01:06.824386
label_keys        | {__name__,instance,job}
size              | 824 kB
compression_ratio | 71.60883280757097791800
total_chunks      | 11
compressed_chunks | 10
```

Each row in the `metric` view contains fields with the metric `id`, as well as
information about the metric, such as its name, table name, retention period,
compression status, chunk interval etc.

Promscale maintains isolation between metrics. This allows you to set retention
periods, downsampling, and compression settings on a per metric basis, giving
you more control over your metrics data.

Querying the `label` view returns all labels associated with metrics collected
by Prometheus:
```SQL
SELECT *
FROM prom_info.label;
```

Here is one row of a sample output for the query shown earlier:
```
key               | collector
value_column_name | collector
id_column_name    | collector_id
values            | {arp,bcache,bonding,btrfs,conntrack,cpu,cpufreq,diskstats,edac,entropy,filefd,filesystem,hwmon,infiniband,ipvs,loadavg,mdadm,meminfo,netclass,netdev,netstat,nfs,nfsd,powersupplyclass,pressure,rapl,schedstat,sockstat,softnet,stat,textfile,thermal_zone,time,timex,udp_queues,uname,vmstat,xfs,zfs}
num_values        | 39
```

Each label row contains information about a particular label, such as the label
key, the label's value column name, the label's ID column name, the list of all
values taken by the label,and the total number of values for that label.

For examples of querying a specific metric view, see
[Query data in Promscale][query-data].


[gh-promscale]: https://github.com/timescale/promscale
[slack]: https://slack.timescale.com
[promscale-extension]: https://github.com/timescale/promscale_extension#promscale-extension
[Prometheus native format]: https://prometheus.io/docs/instrumenting/exposition_formats/
[query-data]: /promscale/:currentVersion:/query-data
[promlabs-test]: https://promlabs.com/promql-compliance-test-results/2021-10-14/promscale
[tsdb-compression]: /timescaledb/:currentVersion:/how-to-guides/compression/
[tsdb-hypertables]: /timescaledb/:currentVersion:/how-to-guides/hypertables/
