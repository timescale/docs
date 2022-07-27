---
title: Install Promscale on Kubernetes
excerpt: Install Promscale on Kubernetes using instrumentation and without using instrumentation
product: promscale
keywords: [analytics]
tags: [learn, prometheus]
related_pages:
  - /promscale/:currentVersion:/installation/resource-recomm/
  - /promscale/:currentVersion:/send-data/
---
# Install Promscale on Kubernetes
By default, Promscale does not provide instrumentation to collect telemetry
from your applications on Kubernetes. You need to install [Prometheus][prometheus-install] to collect metrics and [OpenTelemetry][otel] to collect traces.
You can install Promscale on Kubernetes with or without instrumentation.

## Install Promscale on Kubernetes without instrumentation
If you already have Prometheus or OpenTelemetry installed, you can install Promscale
on Kubernetes using [Helm charts][promscale-install-helm] or [a manifest][promscale-install-k8s-manifest] file.

After you have installed Promscale, migrate your existing Prometheus data into
Promscale using the [prom-migrator tool][promscale-install-prom-migrator], then
configure [Prometheus][config-prometheus] and [OpenTelemetry][config-otel] to
send data to Promscale.

## Install Promscale on Kubernetes with instrumentation
If you have a Kubernetes environment, you can install a complete, pre-configured
observability stack with Promscale. The observability stack (tobs) for
Kubernetes includes Prometheus, OpenTelemetry, and Promscale.
Currently this stack includes:

*   [Kube-Prometheus][kube-prometheus] the Kubernetes monitoring stack
    *   [Prometheus][prometheus] to collect metrics
    *   [AlertManager][alert-manager] to trigger the alerts
    *   [Grafana][grafana] for visualization
    *   [Node-Exporter][node-exporter] to export metrics from the nodes
    *   [Kube-State-Metrics][kube-state-metrics] to get metrics from Kubernetes
        API server
    *   [Prometheus-Operator][prometheus-operator] to manage the life-cycle of
        Prometheus and AlertManager custom resource definitions (CRDs)
*   [Promscale][promscale] ([design doc][design-doc]) to store metrics for the
    long-term and allow analysis with both PromQL and SQL
*   [TimescaleDB][timescaledb] for long term storage of metrics and provides
    ability to query metrics data using SQL
*   [Promlens][promlens] tool to build and analyse promql queries with ease
*   [Opentelemetry-Operator][opentelemetry-operator] to manage the lifecycle of       
    OpenTelemetryCollector Custom Resource Definition (CRDs)
*   [Jaeger Query][jaeger-query] to visualize the traces

[alert-manager]: https://github.com/prometheus/alertmanager#alertmanager-
[design-doc]: https://docs.google.com/document/d/1e3mAN3eHUpQ2JHDvnmkmn_9rFyqyYisIgdtgd3D1MHA/edit?usp=sharing
[grafana]: https://github.com/grafana/grafana
[jaeger-query]: https://github.com/jaegertracing/jaeger
[kube-prometheus]: https://github.com/prometheus-operator/kube-prometheus#kube-prometheus
[kube-state-metrics]: https://github.com/kubernetes/kube-state-metrics
[node-exporter]: https://github.com/prometheus/node_exporter
[opentelemetry-operator]: https://github.com/open-telemetry/opentelemetry-operator#opentelemetry-operator-for-kubernetes
[promlens]: https://promlens.com/
[prometheus]: https://github.com/prometheus/prometheus
[prometheus-operator]: https://github.com/prometheus-operator/prometheus-operator#prometheus-operator
[promscale]: https://github.com/timescale/promscale
[timescaledb]: https://github.com/timescale/timescaledb
[helm-charts]: /promscale/:currentVersion:/installation/kubernetes/helm
[manifest-file]: /promscale/:currentVersion:/installation/kubernetes/manifest
[config-otel]: /promscale/:currentVersion:/send-data/opentelemetry/
[config-prometheus]: /promscale/:currentVersion:/send-data/prometheus/
[otel]: https://opentelemetry.io/docs/
[prometheus-install]: https://prometheus.io/docs/prometheus/latest/installation/
[promscale-install-docker]: /promscale/:currentVersion:/installation/docker/
[promscale-install-helm]: https://docs.timescale.com/promscale/latest/installation/kubernetes/#install-promscale-with-helm
[promscale-install-k8s-manifest]: /promscale/:currentVersion:/installation/kubernetes/#install-promscale-with-a-manifest-file
[promscale-install-prom-migrator]: /promscale/:currentVersion:/guides/prom-migrator/
[promscale-install-source]: /promscale/:currentVersion:/installation/binary/
