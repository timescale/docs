# Install Promscale

<highlight type="important"> 
Promscale does not automatically instrument and collect telemetry from your 
applications and infrastructure. Promscale has native support to ingest 
Prometheus metrics and OpenTelemetry traces and you would typically deploy
[Prometheus](https://prometheus.io/docs/prometheus/latest/installation/) and/or the [OpenTelemetry Collector](https://opentelemetry.io/docs/collector/getting-started/) 
and configure them to send telemetry to Promscale.
</highlight>

You can install Promscale in several different ways depending on whether
your system is already instrumented and you are collecting telemetry
or your system is not instrumented and you need to deploy a complete
observability stack.

## Your system is already instrumented

If you already have Prometheus or OpenTelemetry deployed on your system, you only
need to install Promscale. 

Support for OpenTelemetry traces is currently in beta and disabled by default.
If you want to send your OpenTelemetry traces to Promscale follow the instructions
in the [tracing documentation][tracing-documentation].

*   **Docker**: install Promscale from a
    [pre-built Docker container][promscale-install-docker].
*   **Kubernetes**: install Promscale using our [Helm charts][promscale-install-helm]
    or using [a manifest][promscale-install-k8s-manifest].
*   **VM or bare metal**: install Promscale [from source][promscale-install-source].

Use our [prom-migrator tool][promscale-install-prom-migrator] to easily load your
existing Prometheus data into Promscale.

Finally, configure [Prometheus][config-prometheus] and/or the
[OpenTelemetry Collector][config-otel-collector] to send telemetry to Promscale.

## Your system is not yet instrumented

If you have a Kubernetes environment and want to install a complete pre-configured
observability stack on top of Promscale that includes Prometheus and OpenTelemetry, 
use [the observability stack (tobs) for Kubernetes][promscale-install-tobs].

[promscale-install-prom-migrator]: promscale/:currentVersion:/installation/prom-migrator/
[promscale-install-docker]: promscale/:currentVersion:/installation/docker/
[promscale-install-source]: promscale/:currentVersion:/installation/source/
[promscale-install-tobs]: promscale/:currentVersion:/tobs/
[promscale-install-helm]: promscale/:currentVersion:/installation/kubernetes/#install-promscale-with-helm
[promscale-install-k8s-manifest]: promscale/:currentVersion:/installation/kubernetes/#install-promscale-with-a-manifest-file
[gh-tsdb-extensions]: https://github.com/timescale/promscale_extension/blob/master/Readme.md
[tracing-documentation]: https://github.com/timescale/promscale/blob/master/docs/tracing.md
[config-prometheus]: promscale/:currentVersion:/installation/configure-prometheus/
[config-otel-collector]: promscale/:currentVersion:/installation/configure-otel-collector/