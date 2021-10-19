# Using Promscale and Prometheus

## Introduction
[Prometheus][prometheus-webpage] is an open-source systems monitoring and alerting toolkit that can be used to easily and cost-effectively monitor infrastructure and applications.
Over the past few years, Prometheus has emerged as the monitoring solution for modern software systems.
The key to Prometheus' success is its pull-based architecture and service discovery, which is able to seamlessly monitor modern, dynamic systems in which (micro-)services startup and shutdown frequently.

### The Problem: Prometheus is not designed for analytics
As organizations use Prometheus to collect data from more and more of their infrastructure, the benefits from mining this data also increase. Analytics becomes critical for auditing, reporting, capacity planning, prediction, root-cause analysis, and more. Prometheus's architectural philosophy is one of simplicity and extensibility. Accordingly, it does not itself provide durable, highly-available long-term storage or advanced analytics, but relies on other projects to implement this functionality.

There are existing ways to durably store Prometheus data, but while these options are useful for long-term storage, they only support the Prometheus data model and query model (limited to the PromQL query language). While these work extremely well for the simple, fast analyses found in dashboarding, alerting, and monitoring, they fall short for more sophisticated analysis capabilities, or for the ability to enrich their dataset with other sources needed for insight-generating cross-cutting analysis.

### Solution: Promscale scales and augments Prometheus for long-term storage and analytics
[Promscale][promscale-github] is an open-source long-term store for Prometheus data, designed for analytics. It is a horizontally scalable and operationally mature platform for Prometheus data. Promscale offers the combined power of PromQL and SQL, enabling you to ask any question, create any dashboard, and achieve greater visibility into your systems.

Promscale is built on top of TimescaleDB, the leading relational database for time-series. Promscale also supports native compression, handles high-cardinality, provides rock-solid reliability, and more. Furthermore, it offers other native time-series capabilities, such as data retention policies, continuous aggregate views, downsampling, data gap-filling, and interpolation. It is already natively supported by Grafana via the Prometheus and PostgreSQL/TimescaleDB data sources.

<highlight type="tip">
For an overview of Promscale, see this short introductory video: [Intro to Promscale - Advanced analytics for Prometheus](https://youtube.com/playlist?list=PLsceB9ac9MHTrmU-q7WCEvies-o7ts3ps).
</highlight>

## Roadmap
In this tutorial you will learn:
1. [The benefits of using Promscale to store and analyze Prometheus metrics][promscale-benefits]
2. [How Promscale works][promscale-how-it-works]
3. [How to install Prometheus, Promscale and TimescaleDB][promscale-install]
4. [How to run queries in PromQL and SQL against Promscale][promscale-run-queries]

Let's get started with the first section, [Why use Promscale & TimescaleDB to store Prometheus metrics?][promscale-benefits]

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
[timescaledb vs]: /introduction/timescaledb-vs-postgres
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
[timescaledb-multinode-docs]:https://docs.timescale.com/latest/getting-started/setup-multi-node-basic
[timescale-analytics]:https://github.com/timescale/timescale-analytics
[hello-timescale]:https://docs.timescale.com/latest/tutorials/tutorial-hello-timescale
[promscale-docker-compose]: https://github.com/timescale/promscale/blob/master/docker-compose/docker-compose.yaml
[promscale-benefits]: /tutorials/promscale/promscale-benefits
[promscale-how-it-works]: /tutorials/promscale/promscale-how-it-works
[promscale-install]: /tutorials/promscale/promscale-install
[promscale-run-queries]: /tutorials/promscale/promscale-run-queries
