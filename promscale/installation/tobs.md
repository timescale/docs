# Install Promscale using tobs

Tobs is a tool that aims to make it as easy as possible to install a full observability stack into a Kubernetes cluster. Currently this stack includes:

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/tobs-arch.png" alt="Tobs architecture diagram"/>

 * [Kube-Prometheus][kube-prometheus] the Kubernetes monitoring stack
    * [Prometheus][prometheus] to collect metrics
    * [AlertManager][alert-manager] to fire the alerts
    * [Grafana][grafana] to visualize what's going on
    * [Node-Exporter][node-exporter] to export metrics from the nodes
    * [Kube-State-Metrics][kube-state-metrics] to get metrics from kubernetes api-server
    * [Prometheus-Operator][prometheus-operator] to manage the life-cycle of Prometheus and AlertManager custom resource definitions (CRDs)
 * [Promscale][promscale] ([design doc][design-doc]) to store metrics for the long-term and allow analysis with both PromQL and SQL
 * [TimescaleDB][timescaledb] for long term storage of metrics and provides ability to query metrics data using SQL 
 * [Promlens][promlens] tool to build and analyse promql queries with ease
 * [Opentelemetry-Operator][opentelemetry-operator] to manage the lifecycle of OpenTelemetryCollector Custom Resource Definition (CRDs)
 * [Jaeger Query][jaeger-query] to visualise the traces

### Installing the tobs CLI

<procedure>

1.  To download and install tobs, run the following in your terminal, then follow the on-screen instructions:
    ```bash
    curl --proto '=https' --tlsv1.2 -sSLf  https://tsdb.co/install-tobs-sh |sh
    ```

</procedure>    

### Using the tobs CLI to deploy the stack into your Kubernetes cluster

Tobs CLI instructions to deploy:

<procedure>

1.  Install the tobs helm chart into your Kubernetes cluster
    ```bash
    tobs install
    ```
    **Note**: From 0.7.0 release tobs supports installation of tracing components. To install tracing components use
    ```bash
    tobs install --tracing
    ```

</procedure>

### Configuring the stack

Configuring the tobs helm chart with custom values

<procedure>

1.  All configuration for all components happens through the helm `values.yml` file. You can view the self-documenting default [values.yaml][default-values-yaml] in the repo. We also have additional documentation about individual configuration settings in our [Helm chart docs][helm-chart-docs].
    To modify the settings, first create a values.yaml file:
    ```bash
    tobs helm show-values > values.yaml
    ```
1.  Then modify the values.yaml file using your favorite editor. Finally, deploy with the new settings using:
    ```bash
    tobs install -f values.yaml
    ```

</procedure>

### Tobs CLI usage

The CLI tool provides the seamless experience for interacting with tobs and to manage the components deployed in tobs. This [usage guide][tobs-usage-guide] provides more information on how to use to use tobs CLI more effectively.

### Using the Helm charts without the CLI tool

Users sometimes want to use our Helm charts as sub-charts for other project or integrate them into their infrastructure without using our CLI tool. This is a supported use-case, Below are the instructions to use tobs helm-charts directly.

<procedure>

### Installing the tobs Helm chart
1.  Add the tobs Helm chart repository:
    ```bash
    helm repo add timescale https://charts.timescale.com/
    ```
1.  Check that the repository is up to date:
    ```bash
    helm repo update
    ```
1.  Install the tobs Helm chart:
    ```bash
    helm install <release_name> timescale/tobs
    ```

</procedure>

### Compatibility matrix

Tobs vs. Kubernetes

| Tobs     | Kubernetes           |
|----------|----------------------|
| 0.7.0    | v1.19 to v1.21       | 

[kube-prometheus]: https://github.com/prometheus-operator/kube-prometheus#kube-prometheus
[prometheus]: https://github.com/prometheus/prometheus
[alert-manager]: https://github.com/prometheus/alertmanager#alertmanager-
[grafana]: https://github.com/grafana/grafana
[node-exporter]: https://github.com/prometheus/node_exporter
[kube-state-metrics]: https://github.com/kubernetes/kube-state-metrics
[prometheus-operator]: https://github.com/prometheus-operator/prometheus-operator#prometheus-operator
[promscale]: https://github.com/timescale/promscale
[timescaledb]: https://github.com/timescale/timescaledb
[promlens]: https://promlens.com/
[opentelemetry-operator]: https://github.com/open-telemetry/opentelemetry-operator#opentelemetry-operator-for-kubernetes
[jaeger-query]: https://github.com/jaegertracing/jaeger
[tobs-usage-guide]: https://github.com/timescale/tobs/tree/master/cli#usage-guide
[default-values-yaml]: https://github.com/timescale/tobs/blob/master/chart/values.yaml
[helm-chart-docs]: https://github.com/timescale/tobs/blob/master/chart/README.md#configuring-helm-chart