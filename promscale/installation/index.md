# Install Promscale
You can install Promscale in several different ways. The method you choose
depends on if your system is instrumented and collecting telemetry, or if you
need to set these up.

Promscale does not, by default, provide instrumentation to collect telemetry
from your applications and infrastructure. It is expected that you use
[Prometheus][prometheus-install] to collect metrics. You can also use the
[OpenTelemetry Collector][otel-install] to collect traces. When you have the
instrumentation set up, you can use Promscale to ingest the metrics and
telemetry data.

## Install Promscale without instrumentation
If you have Prometheus or OpenTelemetry installed, you can install Promscale
using one of these methods:

*   Install Promscale from a [pre-built Docker container][promscale-install-docker]
*   Install Promscale using [Helm charts][promscale-install-helm]
*   Install Promscale using [a manifest][promscale-install-k8s-manifest]
*   Install Promscale [from source][promscale-install-source]

You can also use our [prom-migrator tool][promscale-install-prom-migrator] to
migrate your existing Prometheus data into Promscale.

When you have Promscale installed, you can configure
[Prometheus][config-prometheus] and the
[OpenTelemetry Collector][config-otel-collector] to send telemetry to Promscale.

<highlight="important">
Support for OpenTelemetry traces is currently in beta and is disabled by default.
If you want to send your OpenTelemetry traces to Promscale, see the
instructions in the
[tracing documentation](https://github.com/timescale/promscale/blob/master/docs/tracing/).
</highlight>

## Install Promscale with instrumentation
If you have a Kubernetes environment, you can install a complete, pre-configured
observability stack with Promscale. The observability stack (tobs) for
Kubernetes includes Prometheus, OpenTelemetry, and Promscale.

*   Install [the observability stack (tobs) for Kubernetes][promscale-install-tobs]

[promscale-install-prom-migrator]: /installation/prom-migrator/
[promscale-install-docker]: /installation/docker/
[promscale-install-source]: /installation/source/
[promscale-install-tobs]: /tobs/
[promscale-install-helm]: /installation/kubernetes/#install-promscale-with-helm
[promscale-install-k8s-manifest]: /installation/kubernetes/#install-promscale-with-a-manifest-file
[config-prometheus]: /configuration/configure-prometheus/
[config-otel-collector]: /configuration/configure-otel-collector/
[prometheus-install]: https://prometheus.io/docs/prometheus/latest/installation/
[otel-install]: https://opentelemetry.io/docs/collector/getting-started/
