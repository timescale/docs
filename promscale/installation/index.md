# Install Promscale
Promscale allows you to extract more meaningful insights from your metrics data.
It is an open source long-term store for Prometheus data designed for analytics.
Promscale is built on top of TimescaleDB, and is a horizontally scalable and
operationally mature platform for Prometheus data that uses PromQL and SQL to
allow you to ask any question, create any dashboard, and achieve greater
visibility into your systems.

<highlight type="important">
Before you can install Promscale, you must have installed and configured
Prometheus. You can install Prometheus within a virtual machine (VM), as a
container, or within Kubernetes. For more information about installing
Prometheus, see the
[Prometheus documentation](https://prometheus.io/docs/prometheus/latest/installation/).
</highlight>

You can install Promscale in several different ways:

*   If you have an existing Prometheus monitoring environment, you can add
    Promscale with the
    [Prom-migrator migration tool][promscale-install-prommigrator].
*   For new installations, install Promscale from a
    [pre-built Docker container][promscale-install-docker].
*   For new bare metal installations, install Promscale
    [from source][promscale-install-source].
*   If you have an existing Kubernetes environment, install Promscale using
    [the observability suite (tobs) for Kubernetes][promscale-install-tobs].
*   If you only need the Promscale Connector, you can install it
    [from a Helm chart][promscale-connector-install-helm].


[promscale-install-prommigrator]: promscale/installation/prom-migrator/
[promscale-install-docker]: promscale/installation/docker/
[promscale-install-source]: promscale/installation/source/
[promscale-install-tobs]: promscale/installation/tobs/
[promscale-connector-install-helm]: promscale/installation/helm/
