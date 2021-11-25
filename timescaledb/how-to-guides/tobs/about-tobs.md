# About the observability stack (tobs) for Kubernetes
The observability stack (tobs) is a technology stack that provides a
command-line tool to help you manage your Kubernetes deployments. The stack
consists of:

*   `Kube-Prometheus`: the Kubernetes monitoring stack
*   `Prometheus` to collect metrics
*   `AlertManager` to manage alerts
*   `Grafana` for visualization
*   `Node-Exporter` to export metrics from the nodes
*   `Kube-State-Metrics` to get metrics from the Kubernetes API server
*   `Prometheus-Operator` to manage the Prometheus lifecycle, and AlertManager
    custom resource definitions (CRDs)
*   `Promscale` for data analysis with PromQL and SQL
*   `TimescaleDB` for long term storage of metrics and querying metrics data
    with SQL
*   `Promlens` to build and analyze PromQL queries
*   `Opentelemetry-Operator` to manage OpenTelemetryCollector CRDs
*   `Jaeger Query` to visualize traces

You can also use Helm charts directly with tobs, or as sub-charts for other
projects.
