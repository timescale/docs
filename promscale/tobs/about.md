---
title: About the observability stack (tobs) for Kubernetes
excerpt: Install the observability stack for Kubernetes (tobs)
product: promscale
keywords: [tobs, Kubernetes, install]
tags: [k8s, monitor]
---

# About the observability stack (tobs) for Kubernetes
The observability stack (tobs) for Kubernetes is a tool that aims to make it
simpler to install a full observability stack into a Kubernetes cluster.
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
*   [Opentelemetry-Operator][opentelemetry-operator] to manage the lifecycle of       
    OpenTelemetryCollector Custom Resource Definition (CRDs)

You can also use the tobs Helm chart directly, or as sub-charts for other
projects.

[alert-manager]: https://github.com/prometheus/alertmanager#alertmanager-
[design-doc]: https://docs.google.com/document/d/1e3mAN3eHUpQ2JHDvnmkmn_9rFyqyYisIgdtgd3D1MHA/edit?usp=sharing
[grafana]: https://github.com/grafana/grafana
[kube-prometheus]: https://github.com/prometheus-operator/kube-prometheus#kube-prometheus
[kube-state-metrics]: https://github.com/kubernetes/kube-state-metrics
[node-exporter]: https://github.com/prometheus/node_exporter
[opentelemetry-operator]: https://github.com/open-telemetry/opentelemetry-operator#opentelemetry-operator-for-kubernetes
[prometheus]: https://github.com/prometheus/prometheus
[prometheus-operator]: https://github.com/prometheus-operator/prometheus-operator#prometheus-operator
[promscale]: https://github.com/timescale/promscale
[timescaledb]: https://github.com/timescale/timescaledb
