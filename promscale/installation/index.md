# Install Promscale

<highlight type="important"> 
Before you can install Promscale, you must have installed and configured
Prometheus. You can install Prometheus within a virtual machine (VM), as a
container, or within Kubernetes. For more information about installing
Prometheus, see the
[Prometheus documentation](https://prometheus.io/docs/prometheus/latest/installation/).
</highlight>

You can install Promscale in several different ways:

*   For trying out Promscale in a test environment, install Promscale from a
    [pre-built Docker container][promscale-install-docker].
*   For new bare metal installations, install Promscale
    [from source][promscale-install-source].
*   If you have an existing Prometheus monitoring environment, you can add
    Promscale with the
    [Prom-migrator migration tool][promscale-install-prommigrator].
*   If you have an existing Kubernetes environment, install Promscale using
    [the observability suite (tobs) for Kubernetes][promscale-install-tobs].
*   If you only need the Promscale Connector, you can install it
    [from a Helm chart][promscale-connector-install-helm].

You can also install Promscale as an extension to your TimescaleDB database,
which can  help to optimize some queries. For more information, see the
[Timescale extensions developer documentation][gh-tsdb-extensions].


[promscale-install-prommigrator]: promscale/installation/prom-migrator/
[promscale-install-docker]: promscale/installation/docker/
[promscale-install-source]: promscale/installation/source/
[promscale-install-tobs]: promscale/installation/tobs/
[promscale-connector-install-helm]: promscale/installation/helm/
[gh-tsdb-extensions]: https://github.com/timescale/promscale_extension/blob/master/Readme.md
