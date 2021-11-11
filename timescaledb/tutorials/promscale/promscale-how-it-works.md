# How Promscale works

## Promscale architecture [](promscale-architecture)
Unlike some other long-term data stores for Prometheus, the basic Promscale architecture consists of only three components: Prometheus, Promscale, and TimescaleDB.

The diagram below explains the high level architecture of Promscale, including how it reads and writes to Prometheus, and how it can be queried by additional components, like PromLens, Grafana and any other SQL tool.

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/images/misc/promscale-architecture-final-2021.png" alt="Promscale Architecture Diagram"/>

### Ingesting metrics
* Once installed alongside Prometheus, Promscale automatically generates an optimized schema which allows you to efficiently store and query your metrics using SQL.
* Prometheus writes data to the Connector using the Prometheus`remote_write` interface.
* The Connector writes data to TimescaleDB.

### Querying metrics
* PromQL queries can be directed to the Connector, or to the Prometheus instance, which reads data from the Connector using the `remote_read` interface. The Connector, in turn, fetches data from TimescaleDB.
* SQL queries are handled by TimescaleDB directly.

As can be seen, this architecture has relatively few components, enabling simple operations.

### Promscale PostgreSQL extension
Promscale has a dependency on the [Promscale PostgreSQL extension][promscale-extension], which contains support functions to improve the performance of Promscale. While Promscale is able to run without the additional extension installed, adding this extension gets better performance from Promscale.

### Deploying Promscale
Promscale can be deployed in any environment running Prometheus, alongside any Prometheus instance. We provide Helm charts for easier deployments to Kubernetes environments (see [Up and running with Promscale][promscale-install] for more on installation and deployment).

## Promscale schema [](promscale-schema)

To achieve high ingestion, query performance and optimal storage we have designed a schema which takes care of writing the data in the most optimal format for storage and querying in TimescaleDB. Promscale translates data from the [Prometheus data model][Prometheus native format] into a relational schema that is optimized for TimescaleDB.

The basic schema uses a normalized design where the time-series data is stored in compressed hypertables. These tables have a foreign-key to series tables (stored as vanilla PostgreSQL tables), where each series consists of a unique set of labels.

In particular, this schema decouples individual metrics, allowing for the collection of metrics with vastly different cardinalities and retention periods. At the same time, Promscale exposes simple, user-friendly views so that you do not have to understand this optimized schema (see 2.3 for more on views).

<highlight type="tip">
Promscale automatically creates and manages database tables. So, while understanding the schema can be beneficial (and interesting), it is not required to use Promscale. Skip to [Promscale views](#promscale-views) for information how to interact with Promscale using SQL views and to [Run queries with PromQL and SQL](/timescaledb/latest/tutorials/promscale/promscale-run-queries/) to learn using hands on examples.
</highlight>


### 1. Metrics storage schema
Each metric is stored in a separate hypertable.

A hypertable is a TimescaleDB abstraction that represents a single logical SQL table that is automatically physically partitioned into chunks, which are physical tables that are stored in different files in the filesystem. Hypertables are partitioned into chunks by the value of certain columns. In this case, we partition out tables by time (with a default chunk size of 8 hours).

#### Compression
The latest chunk is decompressed to serve as a high-speed query cache. Older chunks are stored as compressed chunks. We configure compression with the `segment_by` column set to the `series_id` and the `order_by` column set to time DESC. These settings control how data is split into blocks of compressed data. Each block can be accessed and decompressed independently.

The settings we have chosen mean that a block of compressed data is always associated with a single series_id and that the data is sorted by time before being split into blocks; thus each block is associated with a fairly narrow time range.  As a result, in compressed form, access by series_id and time range are optimized.

#### Example
The hypertables for each metric use the following schema (using `cpu_usage` as an example metric):

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

In the above table, `series_id` is foreign key to the `series` table described below.

### 2. Series storage schema

Conceptually, each row in the series table stores a set of key-value pairs.

In Prometheus such a series is represented as a one-level JSON string. For example: `{ "key1":"value1", "key2":"value2" }`. But the strings representing keys and values are often long and repeating. So, to save space, we store a series as an array of integer "foreign keys" to a normalized labels table.

The definition of these two tables is shown below:

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

## Promscale views
The good news is that in order to use Promscale well, you do not need to understand the schema design. Users interact with Prometheus data in Promscale through views. These views are automatically created and are used to interact with metrics and labels.

Each metric and label has its own view. You can see a list of all metrics by querying the view named `metric`. Similarly, you can see a list of all labels by querying the view named `label`. These views are found in the `prom_info` schema.

### Metrics information view

Querying the `metric` view returns all metrics collected by Prometheus:
```SQL
SELECT *
FROM prom_info.metric;
```

Here is one row of a sample output for the query above:
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

Each row in the `metric` view, contains fields with the metric `id`, as well as information about the metric, such as its name, table name, retention period, compression status, chunk interval etc.

Promscale maintains isolation between metrics. This allows users to set retention periods, downsampling and, compression settings on a per metric basis, giving users more control over their metrics data.


### Labels information view
Querying the `label` view returns all labels associated with metrics collected by Prometheus:
```SQL
SELECT *
FROM prom_info.label;
```

Here is one row of a sample output for the query above:
```
key               | collector
value_column_name | collector
id_column_name    | collector_id
values            | {arp,bcache,bonding,btrfs,conntrack,cpu,cpufreq,diskstats,edac,entropy,filefd,filesystem,hwmon,infiniband,ipvs,loadavg,mdadm,meminfo,netclass,netdev,netstat,nfs,nfsd,powersupplyclass,pressure,rapl,schedstat,sockstat,softnet,stat,textfile,thermal_zone,time,timex,udp_queues,uname,vmstat,xfs,zfs}
num_values        | 39
```


Each label row contains information about a particular label, such as the label key, the label's value column name, the label's id column name, the list of all values taken by the label and the total number of values for that label.

For examples of querying a specific metric view, see [Querying Promscale in SQL and PromQL][promscale-run-queries].

## Next step
* [Installing Promscale][promscale-install]: Now that you've got a better understanding of how Promscale works, let's get up and running by installing Promscale.


[prometheus-webpage]:https://prometheus.io
[promscale-blog]: https://blog.timescale.com/blog/promscale-analytical-platform-long-term-store-for-prometheus-combined-sql-promql-postgresql/
[promscale-readme]: https://github.com/timescale/promscale/blob/master/README.md
[design-doc]: https://tsdb.co/prom-design-doc
[promscale-github]: https://github.com/timescale/promscale#promscale
[promscale-extension]: https://github.com/timescale/promscale_extension#promscale-extension
[promscale-helm-chart]: https://github.com/timescale/promscale/tree/master/helm-chart
[tobs-github]: https://github.com/timescale/tobs
[promscale-baremetal-docs]: https://github.com/timescale/promscale/blob/master/docs/bare-metal-promscale-stack.md#deploying-promscale-on-bare-metal
[Prometheus]: https://prometheus.io/
[timescaledb vs]: /overview/how-does-it-compare/timescaledb-vs-postgres/
[prometheus storage docs]: https://prometheus.io/docs/prometheus/latest/storage/
[prometheus lts]: https://prometheus.io/docs/operating/integrations/#remote-endpoints-and-storage
[prometheus-federation]: https://prometheus.io/docs/prometheus/latest/federation/
[docker-pg-prom-timescale]: https://hub.docker.com/r/timescale/pg_prometheus
[postgresql adapter]: https://github.com/timescale/prometheus-postgresql-adapter
[Prometheus native format]: https://prometheus.io/docs/instrumenting/exposition_formats/
[docker]: https://docs.docker.com/install
[docker image]: https://hub.docker.com/r/timescale/prometheus-postgresql-adapter
[Node Exporter]: https://github.com/prometheus/node_exporter
[first steps]: https://prometheus.io/docs/introduction/first_steps/#configuring-prometheus
[for example]: https://www.zdnet.com/article/linux-meltdown-patch-up-to-800-percent-cpu-overhead-netflix-tests-show/
[promql-functions]: https://prometheus.io/docs/prometheus/latest/querying/functions/
[promscale-intro-video]: https://youtube.com/playlist?list=PLsceB9ac9MHTrmU-q7WCEvies-o7ts3ps
[Writing to Promscale]: https://github.com/timescale/promscale/blob/master/docs/writing_to_promscale.md
[Node Exporter Github]: https://github.com/prometheus/node_exporter#node-exporter
[promscale-github-installation]: https://github.com/timescale/promscale#-choose-your-own-installation-adventure
[promscale-docker-image]: https://hub.docker.com/r/timescale/promscale
[psql docs]: https://www.postgresql.org/docs/13/app-psql.html
[an Luu's post on SQL query]: https://danluu.com/metrics-analytics/
[grafana-homepage]:https://grafana.com
[promlens-homepage]: https://promlens.com
[multinode-blog]:https://blog.timescale.com/blog/timescaledb-2-0-a-multi-node-petabyte-scale-completely-free-relational-database-for-time-series/
[grafana-docker]: https://grafana.com/docs/grafana/latest/installation/docker/#install-official-and-community-grafana-plugins
[timescaledb-multinode-docs]: /how-to-guides/multi-node-setup/
[timescale-analytics]:https://github.com/timescale/timescale-analytics
[getting-started]: /getting-started/
[promscale-docker-compose]: https://github.com/timescale/promscale/blob/master/docker-compose/docker-compose.yaml
[promscale-benefits]: /tutorials/promscale/promscale-benefits/
[promscale-how-it-works]: /tutorials/promscale/promscale-how-it-works/
[promscale-install]: /tutorials/promscale/promscale-install/
[promscale-run-queries]: /tutorials/promscale/promscale-run-queries/
