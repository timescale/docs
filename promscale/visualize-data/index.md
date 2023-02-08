---
title: Visualize data in Promscale
excerpt: Learn about data visualization tools you can use with Promscale
product: promscale
keywords: [analytics, Grafana]
tags: [visualize, analytics, jaeger]
---

import PromscaleDeprecation from "versionContent/_partials/_deprecated-promscale.mdx";

# Visualize data in Promscale

<PromscaleDeprecation />

You can visualize data in Promscale using tools such as
[Grafana][grafana-homepage] and [Jaeger][jaeger-homepage].

*   **Grafana** is an interactive visualization web application that allows you to monitor and
  analyze metrics, logs, and traces. It allows you to query, visualize, alert on
  and understand your data no matter where it is stored. You can connect
  Promscale to Grafana [to visualize metrics and traces][grafana-promscale] by
  configuring Promscale as:
    *   [Prometheus data source][promscale-as-prometheus]
    *   [Jaeger data source][promscale-as-jaeger]
    *   [PostgreSQL data source][promscale-as-postgresql]

*   **Jaeger** is an open source distributed tracing system used for monitoring
and troubleshooting microservices-based distributed systems. You can connect
Promscale to `jaeger-query` component [to visualize traces][jaeger-promscale].

*   **APM experience** is a set of connected Grafana dashboards included with
Promscale that provide en experience similar to that of Application Performance
Management (APM) tools. The dashboards use SQL queries on trace data to give
you instant visibility into the performance of your services. You can
[set up the experience][apm-experience] in your own Grafana instance and
customize it to better meet your needs.

[apm-experience]: /promscale/:currentVersion:/visualize-data/apm-experience/
[grafana-homepage]:https://grafana.com
[grafana-promscale]: /promscale/:currentVersion:/visualize-data/grafana
[jaeger-homepage]: https://www.jaegertracing.io/
[jaeger-promscale]: /promscale/:currentVersion:/visualize-data/jaeger
[promscale-as-jaeger]: /promscale/:currentVersion:/visualize-data/grafana/#configure-promscale-as-jaeger-data-source
[promscale-as-postgresql]: /promscale/:currentVersion:/visualize-data/grafana/#configure-promscale-as-a-postgresql-data-source
[promscale-as-prometheus]: /promscale/:currentVersion:/visualize-data/grafana/#configure-promscale-as-prometheus-data-source
