# 1. Why use Promscale & TimescaleDB to store Prometheus metrics [](why-promscale)

This section details five reasons to use Timescale and Promscale to store Prometheus metrics:

1. Long term data storage
2. Operational ease
3. Queries in SQL and PromQL
4. Per Metric Retention
5. Ability to push data from custom applications

## 1.1 Long term data storage [](data-storage)

In order to keep Prometheus simple and easy to operate, its creators intentionally left out many scaling features one would normally expect. Data in Prometheus is stored locally within the instance and is not replicated. Having both compute and data storage on one node may make it easier to operate, but also makes it harder to scale and ensure high availability.

As a result, Prometheus is not designed to be a long-term metrics store. From the [documentation][prometheus storage docs]:

>Prometheus is not arbitrarily scalable or durable in the face of disk or node outages and should thus be treated as more of an ephemeral sliding window of recent data.

On the other hand, TimescaleDB can easily handle petabytes of data, and supports high availability and replication, making it a good fit for long term data storage. In addition, it provides advanced capabilities and features, such as full SQL, JOINs and data retention and aggregation policies, all of which are not available in Prometheus.

Using Promscale as a long term store for Prometheus metrics works as follows: 
* All metrics that are scraped from targets are first written to the Prometheus local storage. 
* Metrics are then written to Promscale via the Prometheus `remote-write` endpoint. 
* This means that all of your metrics are ingested into TimescaleDB in parallel using Promscale, making any Prometheus disk failure less painful.

TimescaleDB can also store other types of data (metrics from other systems, time-series data, relational data, metadata), allowing you to consolidate monitoring data from different sources into one database and simplify your stack. You can also join different types of data and add context to your monitoring data for richer analysis, using SQL `JOIN`s.

Moreover, the recent release of [TimescaleDB 2.0][multinode-blog] introduces multi-node functionality, making it easier to scale horizontally and store data at petabyte scale.

## 1.2 Operational ease [](operational-ease)

Promscale operates as a single stateless service. This means that once you configure the `remote-write` & `remote-read` endpoints in your prometheus configuration file then all samples are forwarded to Promscale. Promscale then handles the ingestion of samples into TimescaleDB. Promscale exposes all Prometheus compatible APIs, allowing you to query your data using PromQL queries. 

Moreover, the only way to scale Prometheus is by [federation][prometheus-federation]. However, there are cases where federation is not a good fit: for example, when copying large amounts of data from multiple Prometheus instances to be handled by a single machine. This can result in poor performance, decreased reliability (an additional point of failure), and loss of some data. These are all problems you can avoid by using an operationally simple and mature platform like Promscale combined with TimescaleDB.

Furthermore, with Promscale, it's simple to get a global view of all metrics data, using both PromQL and SQL queries.

## 1.3 Queries in SQL and PromQL [](queries)

By allowing you to use SQL, in addition to PromQL, Promscale empowers you to ask complex analytical queries from your metrics data, and thus extract more meaningful insights.

PromQL is the Prometheus native query language. It’s a powerful and expressive query language that allows you to easily slice and dice metrics data and use a variety of monitoring specific [functions][promql-functions].

However, there may be times where you need greater query flexibility and expressiveness than what PromQL provides. For example, trying to cross-correlate metrics with events and incidents that occurred, running more granular queries for active troubleshooting, or applying machine learning or other forms of deeper analysis on metrics.

TimescaleDB's full SQL support is of great help in these cases. It enables you to apply the full breadth of SQL to your Prometheus data, joining your metrics data with any other data you might have, and run more powerful queries.

We detail examples of such SQL queries in [Part 4][promscale-run-queries] of this tutorial. 

## 1.4 Per Metric Retention [](per-metric)

Promscale maintains isolation between metrics. This allows you to set retention periods, downsampling and compression settings on a per metric basis, giving you more control over your metrics data. 

Per metric retention policies, downsampling, aggregation and compression helps you store only series you care about for the long term. This helps you better trade off the value brought by keeping metrics for the long term with the storage costs involved, allowing you to keep metrics that matter for as long as you need and discarding the rest to save on costs.

This isolation extends to query performance, wherein queries for one metric are not affected by the cardinality, query, or write load of other metrics. This provides better performance on smaller metrics and in general provides a level of safety within your metric storage system.

## 1.5 Ability to push data from custom applications [](custom-apps)

The Promscale write endpoints also accept data from your custom applications (i.e data outside of Prometheus) in JSON format. 

All you have to do is parse your existing time series data to the object format below:

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

Then perform a write request to Promscale:

```bash
curl --header "Content-Type: application/json" \
--request POST \
--data '{"labels":{"__name__":"foo"},"samples":[[1577836800000, 100]]}' \
"http://localhost:9201/write"
```

For more details on writing custom time-series data to Promscale can be found in this document: [Writing to Promscale][Writing TO Promscale]

## Next Step
* [How Promscale Works][promscale-how-it-works]: Now that you've learned about the benefits of Promscale, let's look at how Promscale works in more depth.

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
[promscale-benefits]: /tutorials/getting-started-with-promscale/promscale-benefits
[promscale-how-it-works]: /tutorials/getting-started-with-promscale/promscale-how-it-works
[promscale-install]: /tutorials/getting-started-with-promscale/promscale-install
[promscale-run-queries]: /tutorials/getting-started-with-promscale/promscale-run-queries