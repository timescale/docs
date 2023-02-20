---
title: Install Promscale Connector with Timescale Cloud
excerpt: Install Promscale with Timescale cloud on Kubernetes, Docker, virtual machine, or bare metal
product: promscale
keywords: [analytics]
tags: [learn, prometheus]
related_pages:
  - /promscale/:currentVersion:/guides/resource-recomm/
  - /promscale/:currentVersion:/send-data/
---

import Install from "versionContent/_partials/_cloud-installation.mdx";
import CreateServicePromscale from "versionContent/_partials/_cloud-create-service-promscale.mdx";
import CloudIntro from "versionContent/_partials/_cloud-intro.mdx";
import PromscaleDeprecation from "versionContent/_partials/_deprecated-promscale.mdx";

# Install Promscale with Timescale cloud

<PromscaleDeprecation />

You can install Promscale with Timescale Cloud by running Promscale Connector.
This allows you to use Timescale Cloud as the storage layer for your
observability data. To get started with Promscale on Timescale Cloud, create a
Timescale Cloud service, and then install Promscale Connector.

## Install Timescale Cloud

<CloudIntro />

<Install />

## Create a service on Timescale Cloud

<CreateServicePromscale />

## Install Promscale Connector with Timescale cloud

You can install Promscale Connector with Timescale Cloud in these environments:

*   **Kubernetes**: use [Helm charts][promscale-install-helm] or
    [a manifest][promscale-install-k8s-manifest] file.
*   **Docker**: use a [pre-built Docker container][promscale-install-docker].
*   **VM or bare metal**: use the [source][promscale-install-source] file.

You can also use the [prom-migrator tool][promscale-install-prom-migrator] to
migrate your existing Prometheus data into Promscale.

When you have Promscale installed, you can configure
[Prometheus][config-prometheus], [OpenTelemetry][config-otel] and
[Jaeger][config-jaeger] to send data to Promscale.

[config-jaeger]: /promscale/:currentVersion:/send-data/jaeger/
[config-otel]: /promscale/:currentVersion:/send-data/opentelemetry/
[config-prometheus]: /promscale/:currentVersion:/send-data/prometheus/
[promscale-install-docker]: /promscale/:currentVersion:/installation/promscale-with-timescale-cloud/docker/
[promscale-install-helm]: https://docs.timescale.com/promscale/latest/installation/promscale-with-timescale-cloud/kubernetes/#install-promscale-with-helm
[promscale-install-k8s-manifest]: /promscale/:currentVersion:/installation/promscale-with-timescale-cloud/kubernetes/#install-promscale-with-a-manifest-file
[promscale-install-prom-migrator]: /promscale/:currentVersion:/guides/prom-migrator/
[promscale-install-source]: /promscale/:currentVersion:/installation/promscale-with-timescale-cloud/binary/
[timescale-features]: https://www.timescale.com/products/#Features
[sign-up]: https://www.timescale.com/timescale-signup
