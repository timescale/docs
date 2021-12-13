# Promscale benefits

**Get started in minutes**: deploy a full observability stack for metrics and
traces in your Kubernetes cluster with a single command using [our cli](tobs). Or deploy
the two components that make up Promscale in a container platform or VM using
the provided artifacts. Integrates with Grafana and Jaeger out-of-the-box.

**Easy to operate**: simplify your operations with a single system to setup and
operate for your metrics and traces that uses a simple architecture with just two
components: Promscale Connector and TimescaleDB.

**First-class Prometheus support**: seamlessly integrates with Prometheus as
a long-term storage for metrics with 100% PromQL compliance, multitenancy and
OpenMetrics exemplars support.

**Future-proof with OpenTelemetry**: easily collect your OpenTelemetry traces
with our native OTLP ingest endpoint which has full support for the standard
including events and links.

**Unprecendeted insights**: get true observability with the power and
flexibility of full SQL together with TimescaleDB's advanced analytics functions
to query and correlate metrics, traces and business data to get more value from
your observability data.

**Flexible data management**: per-metric data retention and highly configurable
continuous metric aggregates and rollups.

**A rock-solid foundation**: Built on top of the maturity of Postgres and
TimescaleDB with millions of instances worldwide. A trusted system that offers high
availability, replication, data integrity, backups, authentication, roles and
permissions.

**Massive scale**: store and query terabytes of datapoints with horizontal
scalability, columnar compression and continous aggregates.

**100s of integrations**: access a large ecosystem of integrations available
for Postgres and TimescaleDB: data visualization tools, AI platforms, IDEs, ORMs,
management tools, performance tuning, etc.

## Why use Promscale
This section covers five reasons to use Timescale and Promscale to store
Prometheus metrics:

### Long term data storage
To keep Prometheus simple and easy to operate, its creators intentionally left
out many scaling features. Data in Prometheus is stored locally within the
instance and is not replicated. Having both compute and data storage on one node
may make it easier to operate, but also makes it harder to scale and ensure high
availability.

Prometheus is not arbitrarily scalable or durable in the face of disk or node
outages and should thus be treated as more of an ephemeral sliding window of
recent data. As a result, Prometheus is not designed to be a long-term metrics
store. For more information, see the
[Prometheus documentation][prometheus-storage-docs].

On the other hand, TimescaleDB can handle petabytes of data, and supports high
availability and replication, making it a good fit for long term data storage.
In addition, it provides advanced capabilities and features, such as full SQL,
JOINs and data retention and aggregation policies, all of which are not
available in Prometheus.

Promscale as a long term store for Prometheus metrics works by writing all
scraped metrics from targets to the Prometheus local storage. Metrics are then
written to Promscale using the Prometheus `remote-write` endpoint. This means
that all of your metrics are ingested into TimescaleDB in parallel using
Promscale, making any Prometheus disk failure easier to manage.

TimescaleDB can also store other types of data, such as metrics from other
systems, time-series data, relational data, or metadata. This allows you to
consolidate monitoring data from different sources into one database and
simplify your stack. You can also join different types of data and add context
to your monitoring data for richer analysis, using SQL `JOIN`s.

Additionally, in TimescaleDB 2.0 and above, you can use multi-node functionality to
make it easier to scale horizontally and store data at petabyte scale.

### Operational ease
Promscale operates as a single stateless service. This means that when you have
configured the `remote-write` and `remote-read` endpoints in your Prometheus
configuration file, all samples are forwarded to Promscale. Promscale then
handles the ingestion of samples into TimescaleDB. Promscale exposes all
Prometheus compatible APIs, allowing you to query your data using PromQL
queries.

The only way to scale Prometheus is by [federation][prometheus-federation].
However, there are cases where federation is not a good fit: for example, when
copying large amounts of data from multiple Prometheus instances to be handled
by a single machine. This can result in poor performance, decreased reliability,
and loss of some data. These are all problems you can avoid by using an
operationally simple and mature platform like Promscale combined with
TimescaleDB.

Additionally, with Promscale, it's simple to get a global view of all metrics
data, using both PromQL and SQL queries.

### Queries in SQL and PromQL
Because Promscale allows you to use SQL and PromQL, it empowers you to create
complex analytical queries from your metrics data, and extract more meaningful
insights.

PromQL is the Prometheus native query language. It's a powerful and expressive
query language that allows you to easily slice and dice metrics data and use a
variety of monitoring specific [functions][promql-functions].

However, there may be times where you need greater query flexibility and
expressiveness than what PromQL provides. For example, trying to cross-correlate
metrics with events and incidents that occurred, running more granular queries
for active troubleshooting, or applying machine learning or other forms of
deeper analysis on metrics.

TimescaleDB's full SQL support allows you to apply the full breadth of SQL to
your Prometheus data, joining your metrics data with any other data you might
have, and run more powerful queries.

For more information about using SQL queries in Promscale, see the
[Running queries in Promscale section][promscale-run-queries].

### Per metric retention
Promscale maintains isolation between metrics. This allows you to set retention
periods, downsampling and compression settings on a per metric basis, giving you
more control over your metrics data.

Per metric retention policies, downsampling, aggregation and compression helps
you store only the series data that you require in the long term. This helps you
better trade off the value brought by keeping metrics for the long term with the
storage costs involved, allowing you to keep metrics that matter for as long as
you need and discarding the rest to save on costs.

This isolation extends to query performance, wherein queries for one metric are
not affected by the cardinality, query, or write load of other metrics. This
provides better performance on smaller metrics and in general provides a level
of safety within your metric storage system.

### Ability to push data from custom applications
The Promscale write endpoints also accept data in JSON format from your custom applications that exist outside of Prometheus. You can parse your existing time series data to the object format like this:
```bash
{
    "labels":{"__name__": "cpu_usage", "namespace":"dev", "node": "brain"},
    "samples":[
        [1577836800000, 100],
        [1577836801000, 99],
        [1577836802000, 98],
        ...
    ]
}
```

You can then perform a write request to Promscale, like this:
```bash
curl --header "Content-Type: application/json" \
--request POST \
--data '{"labels":{"__name__":"foo"},"samples":[[1577836800000, 100]]}' \
"http://localhost:9201/write"
```


[prometheus-storage-docs]: https://prometheus.io/docs/prometheus/latest/storage/
[writing-to-promscale]: https://github.com/timescale/promscale/blob/master/docs/writing_to_promscale.md
[multinode-blog]:https://blog.timescale.com/blog/timescaledb-2-0-a-multi-node-petabyte-scale-completely-free-relational-database-for-time-series/
[promscale-run-queries]: /tutorials/promscale/promscale-run-queries/
[prometheus-federation]: https://prometheus.io/docs/prometheus/latest/federation/
[promql-functions]: https://prometheus.io/docs/prometheus/latest/querying/functions/
[promscale-run-queries]: promscale/promscale-run-queries/
