# Test Promscale using a pre-built container
If you want to try out Promscale in a test environment before getting started,
you can use a pre-built Docker container.

<highlight type="important">
Using Promscale from a Docker container is for local testing purposes only. Do
not use this installation method in a production environment.
</highlight>

## Install Promscale with Docker
Before you begin, you must have Docker installed on your local system. For
packages and instructions, see the
[Docker installation documentation][docker-install].

<procedure>

### Installing Promscale with Docker
1.  Use Docker to create a network for Promscale and TimescaleDB:
    ```bash
    docker network create --driver bridge promscale-timescaledb
    ```
1.  Install TimescaleDB in a Docker container, and make sure the service is
    running. For instructions, see
    [the TimescaleDB Docker installation section][tsdb-docker]. Promscale stores
    all metrics data scraped from Prometheus targets in this TimescaleDB service.
1.  Run the Promscale Docker container. This example creates a TimescaleDB
    instance called `timescaledb`, on a network named `promscale-timescale`. The
    container runs in the background, and the container ID is shown after it is
    created. It also port forwards to port `5432` on your local system:
    ```bash
    docker run --name timescaledb \
        --network promscale-timescaledb \
        -e POSTGRES_PASSWORD=<password> -d -p 5432:5432 \
        timescaledev/timescaledb-ha:pg12-latest
    ```

</procedure>

## Collect metrics with node_exporter
When you have Promscale running in a container, you can begin collecting metrics. The `node_exporter` tool is a service that exposes hardware and operating systems metrics to Prometheus. For more information about `node_exporter`, see the [node_exporter developer documentation][gh-node-exporter].

<procedure>

### Collecting metrics with node_exporter
1.  Run the `node_exporter` Docker container. This example creates
    a `node_exporter` instance called `node_exporter`, port forwarding output to
    port `9100`, and it runs on the `promscale-timescaledb` network you created
    earlier:
    ```bash
    docker run --name node_exporter -d -p 9100:9100 \
    --network promscale-timescaledb \
    quay.io/prometheus/node-exporter
    ```
1.  Verify that system metrics are being exported, by opening
    `http://localhost:9100/metrics` in your browser. This is the location that
    Prometheus scrapes for metrics data.

</procedure>

## Install Prometheus
When you are succecssdfully receiving metrics from your Promscale instalaltion, you can install Prometheus and configure it to garther the metrics data.

<prcoedure>

### Installing Prometheus

1.  Create a Prometheus configuration file called `prometheus.yml`. You can use
    this example as a starting point. In this example, Prometheus uses Promscale
    as its remote storage endpoint by configuring the `remote_read` and
    `remote_write` settings to the Promscale URLs you set up earlier.
    Additionally, it sets `node_exporter` as the target, and scrapes every
    10&nbsp;seconds:
    ```yaml
    global:
     scrape_interval:     10s
     evaluation_interval: 10s
    scrape_configs:
     - job_name: prometheus
       static_configs:
         - targets: ['localhost:9090']
     - job_name: node-exporter
       static_configs:
         - targets: ['node_exporter:9100']
    remote_write:
      - url: "http://promscale:9201/write"
    remote_read:
      - url: "http://promscale:9201/read"
        read_recent: true
    ```
1.  Start the Prometheus Docker container, using the configuration file you
    created:
    ```bash
    docker run \
        --network promscale-timescaledb \
        -p 9090:9090 \
        -v ${PWD}/prometheus.yml:/etc/prometheus/prometheus.yml \
        prom/prometheus
    ```

## Install Promscale with a Docker compose file
You can use a Docker compose file to create containers for TimescaleDB, Promscale, and the `node_exporter`, using a single command. To help you get started, we have created a sample Docker compose file, available from the [Promscale GitHub repository][promscale-docker-compose].

Before you begin, make sure that you have the `prometheus.yml` configuration file in the same directory as `docker-compose.yml`.

<procedure>

### Installing Promscale with a Docker compose file
1.  Open the `docker-compose.yml` configuration file, and set the password for
    the `postgres` user.
1.  In the directory that conatins the `docker-compose.yml` file, run the
    `docker-compose` command:
    ```bash
    docker-compose up
    ```

[promscale-docker-compose]: https://github.com/timescale/promscale/blob/master/docker-compose/docker-compose.yaml
[docker-install]: https://docs.docker.com/get-docker/
[tsdb-docker]: timescaledb/how-to-guides/install-timescaledb/installation-docker.md
[gh-node-exporter]: https://github.com/prometheus/node_exporter#node-exporter
