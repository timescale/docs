# About the observability stack for Kubernetes (tobs)
Kube-Prometheus the Kubernetes monitoring stack
Prometheus to collect metrics
AlertManager to fire the alerts
Grafana to visualize what's going on
Node-Exporter to export metrics from the nodes
Kube-State-Metrics to get metrics from kubernetes api-server
Prometheus-Operator to manage the life-cycle of Prometheus and AlertManager custom resource definitions (CRDs)
Promscale (design doc) to store metrics for the long-term and allow analysis with both PromQL and SQL.
TimescaleDB for long term storage of metrics and provides ability to query metrics data using SQL.
Promlens tool to build and analyse promql queries with ease.
Opentelemetry-Operator to manage the lifecycle of OpenTelemetryCollector Custom Resource Definition (CRDs)
Jaeger Query to visualise the traces
We plan to expand this stack over time and welcome contributions.

Tobs provides a CLI tool to make deployment and operations easier. We also provide Helm charts that can be used directly or as sub-charts for other projects.
