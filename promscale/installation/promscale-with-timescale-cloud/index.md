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
# Install Promscale with Timescale cloud

You can install Promscale with Timescale cloud by running Promscale Connector on your end and by leveraging the Timescale cloud as the storage layer for your observability data. To get started 
with Promscale with Timescale cloud first you have to create a Timescale cloud service and next install Promscale Connector on the desired environment.

## Create a Timescale cloud managed service

Before diving into the Promscale Connector, let’s first create a Timescale Cloud service  (i.e., a TimescaleDB instance) to store our observability data: 

1. If you are new to Timescale Cloud, create an account (**free for 30 days, no credit card required**) and log in. 
2. Once you’re in the Services page, click on “Create service” in the top right, and select “Advanced options”. 
3. A configuration screen will appear, in which you will be able to select the compute and storage of your new service. To store your observability data, we recommend that you allocate a minimum of 4 CPUs, 16GB of Memory, and 50GB of disk (equivalent to 840GB of uncompressed data) as a starting point. You can scale up this setup as you need it, once your data ingestion and query rate increase. 
4. Once you’re done, click on “Create service”.
5. Wait for the service creation to complete, and copy the service URL highlighted with the red rectangle in the screenshot below. You will need it later! 


## Install Promscale Connector with Timescale cloud

You can install Promscale Connector with Timescale cloud in below environments:
* **Kubernetes**: use [Helm charts][promscale-install-helm] or [a manifest][promscale-install-k8s-manifest] file.
* **Docker**: use a [pre-built Docker container][promscale-install-docker].
* **VM or bare metal**: use the [source][promscale-install-source] file.

You can also use our [prom-migrator tool][promscale-install-prom-migrator] to
migrate your existing Prometheus data into Promscale.

When you have Promscale installed, you can configure
[Prometheus][config-prometheus], [OpenTelemetry][config-otel] and 
[Jaeger][config-jaeger] to send data to Promscale.

[config-jaeger]: /promscale/:currentVersion:/send-data/jaeger/
[config-otel]: /promscale/:currentVersion:/send-data/opentelemetry/
[config-prometheus]: /promscale/:currentVersion:/send-data/prometheus/
[otel]: https://opentelemetry.io/docs/
[prometheus-install]: https://prometheus.io/docs/prometheus/latest/installation/
[promscale-install-docker]: /promscale/:currentVersion:/installation/promscale-with-timescale-cloud/docker/
[promscale-install-helm]: https://docs.timescale.com/promscale/latest/installation/promscale-with-timescale-cloud/kubernetes/#install-promscale-with-helm
[promscale-install-k8s-manifest]: /promscale/:currentVersion:/installation/promscale-with-timescale-cloud/kubernetes/#install-promscale-with-a-manifest-file
[promscale-install-prom-migrator]: /promscale/:currentVersion:/guides/prom-migrator/
[promscale-install-source]: /promscale/:currentVersion:/installation/promscale-with-timescale-cloud/binary/
