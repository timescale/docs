# About Promscale
Promscale is an open source observability backend for metrics and traces
powered by SQL.

It's built on the robust and high-performance foundation of PostgreSQL and
TimescaleDB. It has native support for Prometheus metrics and OpenTelemetry
traces as well as many other formats like StatsD, Jaeger and Zipkin through the
OpenTelemetry Collector and is [100% PromQL compliant](promlabs-test). It's full
SQL capabilities enable developers to correlate metrics, traces and also
business data to derive new valuable insights not possible when data is siloed
in different systems. It easily integrates with Grafana and Jaeger for
visualizing metrics and traces.

Built on top of PostgreSQL and TimescaleDB it inherits rock-solid reliability,
native compression up to 90%, continuous aggregates and the operational maturity
of a system that is run on millions of instances worldwide.

For the Promscale source code, see our [GitHub repository][gh-promscale].

If you have any questions, join the `#promscale` channel on the
[TimescaleDB Community Slack][slack].

## Benefits

* **Get started in minutes**: deploy a full observability stack for metrics and
traces in your Kubernetes cluster with a single command using [our cli](tobs). Or deploy
the two components that make up Promscale in a container platform or VM using
the provided artifacts. Integrates with Grafana and Jaeger out-of-the-box.

* **Easy to operate**: simplify your operations with a single system to setup and
operate for your metrics and traces that uses a simple architecture with just two
components: Promscale Connector and TimescaleDB.

* **First-class Prometheus support**: seamlessly integrates with Prometheus as
a long-term storage for metrics with 100% PromQL compliance, multitenancy and
OpenMetrics exemplars support.

* **Future-proof with OpenTelemetry**: easily collect your OpenTelemetry traces
with our native OTLP ingest endpoint which has full support for the standard
including events and links.

* **Unprecendeted insights**: get true observability with the power and
flexibility of full SQL together with TimescaleDB's advanced analytics functions
to query and correlate metrics, traces and business data to get more value from
your observability data.

* **Flexible data management**: per-metric data retention and highly configurable
continuous metric aggregates and rollups.

* **A rock-solid foundation**: Built on top of the maturity of Postgres and
TimescaleDB with millions of instances worldwide. A trusted system that offers high
availability, replication, data integrity, backups, authentication, roles and
permissions.

* **Massive scale**: store and query terabytes of datapoints with horizontal
scalability, columnar compression and continous aggregates.

* **100s of integrations**: access a large ecosystem of integrations available
for Postgres and TimescaleDB: data visualization tools, AI platforms, IDEs, ORMs,
management tools, performance tuning, etc.

## Architecture

Promscale includes two components:
* **Promscale Connector**: a stateless service that provides the ingest
interfaces for observability data, processes that data and stores it in TimescaleDB.
It also provides an interface to query the data with PromQL. The Promscale Connector
automatically sets up the data structures in TimescaleDB to store the data and
handles changes in those data structures required if required for upgrading to newer
versions of Promscale.
* **TimescaleDB**: the Postgres-based database where all the observability data is
stored. It offers a full SQL interface for querying the data as well as advanced
capabilities like analytical functions, columnar compression and continuous
aggregates. TimescaleDB offers a lot of  flexibility to also store business
and other types of data that you can then use to correlate with observability
data.

The Promscale Connector can ingest Prometheus metrics, metadata and OpenMetrics
exemplars via the Prometheus `remote_write` interface and OpenTelemetry traces via
the OpenTelemetry protocol (OTLP). It's possible to ingest metrics and traces in
other formats by using the [OpenTelemetry Collector](otel-collector) to process and
send them via the Prometheus `remote_write` interface and the OpenTelemetry protocol.
For example, you can use the OpenTelemetry Collector to ingest Jaeger
traces and StatsD metrics into Promscale.

For Prometheus metrics, the Promscale Connector exposes Prometheus API endpoints
for running PromQL queries and reading metadata which allows to connect tools that
support that API, like Grafana, directly to Promscale for querying. It's also
possible to send queries to Prometheus and have Prometheus read data from
Promscale via the Promscale Connector using the `remote_read` interface.

For OpenTelemetry traces, we have built a Jaeger storage plugin that implements
the interface for querying and retrieving traces. This allows you to visualize
traces stored in Promscale in Jaeger as well as Grafana by configuring
a Jaeger data source (Grafana would query Jaeger which would query Promscale).

You can also query metrics and traces in Promscale using SQL which allows you to
use many different visualization tools that integrate with PostgreSQL. For
example, Grafana supports querying data in Promscale using SQL out-of-the-box
through the PostgreSQL data source.


<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/promscale-arch.png" alt="Promscale architecture diagram"/>


[gh-promscale]: https://github.com/timescale/promscale
[slack]: https://slack.timescale.com
[promlabs-test]: https://promlabs.com/promql-compliance-test-results/2021-10-14/promscale
[otel-collector] https://github.com/open-telemetry/opentelemetry-collector
[tobs] https://github.com/timescale/tobs
