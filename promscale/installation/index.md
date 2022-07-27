---
title: Install Promscale
excerpt: Install Promscale on Kubernetes, Docker, virtual machine, or bare metal
product: promscale
keywords: [analytics]
tags: [learn, prometheus]
related_pages:
  - /promscale/:currentVersion:/installation/resource-recomm/
  - /promscale/:currentVersion:/send-data/
---

# Install Promscale
By default, Promscale does not provide instrumentation to collect telemetry
from your applications and infrastructure. You can use [Prometheus][prometheus-install] to collect metrics and [OpenTelemetry][otel] to collect traces. After you have the instrumentation set up, you can use Promscale to ingest the metric and trace data. 

<highlight type="note">
The PostgreSQL `search_path` variable determines in what order schemas are
searched and which objects such as tables, views, functions, and others do not
require schema qualification to use. When you install Promscale, the Promscale
extension modifies the `search_path` of the database that it is connected to
and adds its public schemas to the search path. This makes querying Promscale
data easier. The public schemas that Promscale adds are: `ps_tag`, `prom_api`,
`prom_metric`, `ps_trace`. 
</highlight>
 

## Install Promscale without instrumentation
If you want to install Promscale on your infrastructure where you have already installed Prometheus or OpenTelemetry, you can do that on:

* Kubernetes using [helm charts][helm-charts], or a [manifest file][manifest-file]
* [Pre-built containers][docker]
* [Debian/Ubuntu][debain-ubuntu]
* [RHEL/CentOS][rhel-centos]
* [Binary][binary]

After you have installed Promscale, migrate your existing Prometheus data into
Promscale using the [prom-migrator tool][promscale-install-prom-migrator], then
configure [Prometheus][config-prometheus] and [OpenTelemetry][config-otel] to
send data to Promscale.

## Install Promscale with instrumentation
If you do not have Prometheus or OpenTelemetry installed on Kubernetes, you can use [the observability stack (tobs)][tobs] to install a complete, pre-configured observability stack with Promscale. It includes Prometheus, OpenTelemetry, and Promscale.

[helm-charts]: /promscale/:currentVersion:/installation/kubernetes/helm
[manifest-file]: /promscale/:currentVersion:/installation/kubernetes/manifest
[tobs]: /promscale/:currentVersion:/installation/kubernetes/tobs
[promscale-install-prom-migrator]: /promscale/:currentVersion:/guides/prom-migrator/
[config-otel]: /promscale/:currentVersion:/send-data/opentelemetry/
[config-prometheus]: /promscale/:currentVersion:/send-data/prometheus/
[prometheus-install]: https://prometheus.io/docs/prometheus/latest/installation/
[otel]: https://opentelemetry.io/docs/
[helm-charts]: /promscale/:currentVersion:/installation/docker
[debian-ubuntu]: /promscale/:currentVersion:/installation/debian-ubuntu
[rhel-centos]: /promscale/:currentVersion:/installation/rhel-centos
[binary]: /promscale/:currentVersion:/installation/binary

