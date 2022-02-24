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
*   [Promlens][promlens] tool to build and analyse promql queries with ease
*   [Opentelemetry-Operator][opentelemetry-operator] to manage the lifecycle of       
    OpenTelemetryCollector Custom Resource Definition (CRDs)
*   [Jaeger Query][jaeger-query] to visualize the traces

You can also use the tobs Helm chart directly, or as sub-charts for other
projects.

[kube-prometheus]: https://github.com/prometheus-operator/kube-prometheus#kube-prometheus
[prometheus]: https://github.com/prometheus/prometheus
[alert-manager]: https://github.com/prometheus/alertmanager#alertmanager-
[grafana]: https://github.com/grafana/grafana
[node-exporter]: https://github.com/prometheus/node_exporter
[kube-state-metrics]: https://github.com/kubernetes/kube-state-metrics
[prometheus-operator]: https://github.com/prometheus-operator/prometheus-operator#prometheus-operator
[promscale]: https://github.com/timescale/promscale
[design-doc]: https://docs.google.com/document/d/1e3mAN3eHUpQ2JHDvnmkmn_9rFyqyYisIgdtgd3D1MHA/edit?usp=sharing
[timescaledb]: https://github.com/timescale/timescaledb
[promlens]: https://promlens.com/
[opentelemetry-operator]: https://github.com/open-telemetry/opentelemetry-operator#opentelemetry-operator-for-kubernetes
[jaeger-query]: https://github.com/jaegertracing/jaeger
