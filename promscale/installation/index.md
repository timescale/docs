---
title: Install Promscale
excerpt: Install Promscale on Kubernetes, Docker, virtual machine, or bare metal
product: promscale
keywords: [analytics]
tags: [learn, prometheus]
related_pages:
  - /promscale/:currentVersion:/guides/resource-recomm/
  - /promscale/:currentVersion:/send-data/
---

# Install Promscale

You can install Promscale in several different ways. The method you choose
depends on if your system is instrumented and collecting telemetry, or if you
need to set these up.

Promscale does not, by default, provide instrumentation to collect telemetry
from your applications and infrastructure. It is expected that you use
[Prometheus][prometheus-install] to collect metrics. You can also use
[OpenTelemetry][otel] to collect traces. When you have the
instrumentation set up, you can use Promscale to ingest the metric and
trace data.

## Install Promscale without instrumentation

If you have Prometheus or OpenTelemetry installed, you can install Promscale
on these environments:

*   **Kubernetes**:  use [Helm charts][promscale-install-helm] or [a manifest][promscale-install-k8s-manifest] file.
*   **Docker**: use a [pre-built Docker container][promscale-install-docker].
*   **VM or bare metal**: use the [source][promscale-install-source] file.

You can also use our [prom-migrator tool][promscale-install-prom-migrator] to
migrate your existing Prometheus data into Promscale.

When you have Promscale installed, you can configure
[Prometheus][config-prometheus] and
[OpenTelemetry][config-otel] to send data to Promscale.

## Install Promscale with instrumentation

If you have a Kubernetes environment, you can install a complete, pre-configured
observability stack with Promscale. The observability stack (tobs) for
Kubernetes includes Prometheus, OpenTelemetry, and Promscale.

*   Install [the observability stack (tobs) for Kubernetes][promscale-install-tobs]

[config-otel]: /promscale/:currentVersion:/send-data/opentelemetry/
[config-prometheus]: /promscale/:currentVersion:/send-data/prometheus/
[otel]: https://opentelemetry.io/docs/
[prometheus-install]: https://prometheus.io/docs/prometheus/latest/installation/
[promscale-install-docker]: /promscale/:currentVersion:/installation/docker/
[promscale-install-helm]: https://docs.timescale.com/promscale/latest/installation/kubernetes/#install-promscale-with-helm
[promscale-install-k8s-manifest]: /promscale/:currentVersion:/installation/kubernetes/#install-promscale-with-a-manifest-file
[promscale-install-prom-migrator]: /promscale/:currentVersion:/guides/prom-migrator/
[promscale-install-source]: /promscale/:currentVersion:/installation/binary/
[promscale-install-tobs]: /promscale/:currentVersion:/tobs/
