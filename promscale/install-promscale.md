# Install Promscale

## Integrating into your existing stack




## Promscale installation

There are several different methods for installing Promscale. This section
describes installing from a pre-built Docker image. For alternative installation
methods, see the [Promscale GitHub repository][promscale-github].

If you have a Kubernetes cluster with Helm installed, you can use the
observability suite for Kubernetes (tobs) to install a full metric collection
and visualization solution including Prometheus, Grafana, Promscale, and a
preview version of PromLens. To learn how to do this, watch our
[demo video][tobs-demo]. For more information about tobs, see the
[tobs GitHub repository][tobs-gh].

If you want to migrate data from Prometheus into Promscale, you can use
[Prom-migrator][prom-migrator-blog], an open-source, universal Prometheus data
migration tool that can move data from one remote-storage system to another.

## Install Promscale from a Docker image
You can install the Promscale Connector with a Docker image from
[Docker Hub][promscale-docker-hub]. To see the latest available images, see
the [Promscale Releases on GitHub][promscale-releases-github].

<procedure>

### Installing Promscale from a Docker image
1.  Create a network specific to Promscale-TimescaleDB:
    ```bash
    docker network create --driver bridge promscale-timescaledb
    ```
1.  Install and run TimescaleDB with the Promscale extension:
    ```bash
    docker run --name timescaledb -e \
    POSTGRES_PASSWORD=<password> -d -p 5432:5432 \
    --network promscale-timescaledb \
    timescaledev/promscale-extension:latest-pg12 \
    postgres -csynchronous_commit=off
    ```
1.  Run Promscale:
    ```bash
    docker run --name promscale -d -p 9201:9201 \
    --network promscale-timescaledb timescale/promscale:<version-tag> \
    -db-password=<password> -db-port=5432 -db-name=postgres \
    -db-host=timescaledb -db-ssl-mode=allow
    ```
    In this example, we use `db-ssl-mode=allow`, which is suitable for testing
    purposes. For production environments, use `db-ssl-mode=require` instead.

</procedure>

## Configure Prometheus for Promscale
You need to tell Prometheus to use the remote storage connector. By setting
Prometheus to `read_recent` it means that Prometheus queries data from Promscale
for all PromQL queries. You can do that by opening the `prometheus.yml`
configuration file, and adding these lines:
```yaml
remote_write:
  - url: "http://<connector-address>:9201/write"
remote_read:
  - url: "http://<connector-address>:9201/read"
    read_recent: true
```

For more information about configuring Prometheus for Promscale, see the [Promscale documentation][promscale-config-github].

## Configure the Promscale Connector
You can configure the Promscale Connector using flags at the command prompt, environment variables, or a YAML configuration file. When processing commands, precedence is granted in this order:
1. CLI flag
1. Environment variable
1. Configuration file value
1. Default value

All environment variables are prefixed with `PROMSCALE`.

For more information about configuring Promscale, see the [Promscale CLI documentation][promscale-cli-github], or use the `promscale -h` command.
For more documentation, see our [developer documentation][promscale-gh-docs].

[tobs-demo]: https://youtu.be/MSvBsXOI1ks
[tobs-gh]: https://github.com/timescale/tobs
[prom-migrator-blog]: https://blog.timescale.com/blog/introducing-prom-migrator-a-universal-open-source-prometheus-data-migration-tool/
[promscale-github]: https://github.com/timescale/promscale
[promscale-docker-hub]: https://hub.docker.com/r/timescale/promscale/
[promscale-releases-github]: https://github.com/timescale/promscale/releases
[promscale-config-github]: https://github.com/timescale/promscale/blob/master/docs/configuring_prometheus.md
[promscale-cli-github]: https://github.com/timescale/promscale/blob/master/docs/cli.md
[promscale-gh-docs]: https://github.com/timescale/promscale/tree/master/docs
[promscale-gh-releases]: https://github.com/timescale/promscale/releases
[prometheus-installation]: https://prometheus.io/docs/prometheus/latest/installation/
[prom-migrator-readme]: (https://github.com/timescale/promscale/tree/master/cmd/prom-migrator#prom-migrator)
