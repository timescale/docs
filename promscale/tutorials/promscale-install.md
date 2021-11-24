# Up and running: Install Prometheus, Promscale, and TimescaleDB

We recommend four methods to setup and install Promscale:
1. [TOBS - The Observability Stack for Kubernetes ][tobs-github] (recommended for kubernetes deployments)
2. Docker (instructions detailed below)
3. [Helm][promscale-helm-chart]
4. [Bare Metal][promscale-baremetal-docs]

<highlight type="tip">
See the [Promscale github installation guide](https://github.com/timescale/promscale#-choose-your-own-installation-adventure) for more information on installation options.
</highlight>

For demonstration purposes, we use Docker to get up and running with Promscale.

The easiest way to get started is by using Docker images. Make sure you have Docker installed on your local machine ([Docker installation instructions][docker]).

The instructions below have 4 steps:
1. [Install TimescaleDB](#install-timescaledb)
2. [Install Promscale](#install-promscale)
3. [Install node_exporter](#start-collecting-metrics-using-node-exporter)
4. [Install Prometheus](#install-prometheus)

Alternatively, you can skip to the bonus section which contains a `docker-compose` file for four components above: [Skip to docker-compose file](#bonus-docker-compose-file)

<highlight type="warning">
The instructions below are local testing purposes only and should not be used to set up a production environment.
</highlight>

## Install TimescaleDB [](install-timescaledb)

First, let's create a network specific to Promscale and TimescaleDB:

``` bash
docker network create --driver bridge promscale-timescaledb
```


Secondly, let's install and spin up an instance of TimescaleDB in a docker container.  This is where Promscale stores all metrics data scraped from Prometheus targets.

We use a Docker image which has the`promscale` PostgreSQL extension already pre-installed:

```bash
docker run --name timescaledb \
    --network promscale-timescaledb \
    -e POSTGRES_PASSWORD=<password> -d -p 5432:5432 \
    timescaledev/timescaledb-ha:pg12-latest
```
The above commands create a TimescaleDB instanced named `timescaledb` (via the `--name` flag), on the network named `promscale-timescale` (via the `--network` flag), whose container runs in the background with the container ID printed after created (via the `-d` flag), with port-forwarding it to port `5432` on your machine (via the `-p` flag).

<highlight type="warning">
We set the `POSTGRES_PASSWORD` environment variable (using the `-e` flag) in the command above. Please ensure to replace `[password]` with the password of your choice for the `postgres` superuser.

For production deployments, you want to fix the Docker tag to a particular version instead of `pg12-latest`
</highlight>

## Install Promscale [](install-promscale)

Since we have TimescaleDB up and running, let's spin up a [Promscale instance][promscale-github], using the [Promscale docker image][promscale-docker-image] available on Docker Hub:

```bash
docker run --name promscale -d -p 9201:9201 \
--network promscale-timescaledb \
timescale/promscale:latest
-db-uri postgres://postgres:<password>@timescaledb:5432/postgres?sslmode=allow
```

In the `-db-uri` flag above, the second mention of `postgres` after the double backslash refers to the the user we're logging into the database as, `<password>` is the password for user `postgres`, and `timescaledb` is the name of the TimescaleDB container, installed in step 3.1. We can use the name `timescaledb` to refer to the database, rather than using its host address, as both containers are on the same docker network `promscale-timescaledb`.

Furthermore, note that the value `<password>` should be replaced with the password you set up for TimescaleDB in step 3.1 above.

<highlight type="warning">
The setting `ssl-mode=allow` is for testing purposes only. For production deployments, we advise you to use `ssl-mode=require` for security purposes.
</highlight>


## Start collecting metrics using node_exporter [](install-node-exporter)

`node_exporter` is a Prometheus exporter for hardware and OS metrics exposed by *NIX kernels, written in Go with pluggable metric collectors. To learn more about it, refer to the [Node Exporter Github][].

For the purposes of this tutorial, we need a service that exposes metrics to Prometheus. We use the `node_exporter` for this purpose.

Install the the `node_exporter` on your machine by running the docker command below:

```bash
docker run --name node_exporter -d -p 9100:9100 \
--network promscale-timescaledb \
quay.io/prometheus/node-exporter
```
The command above creates a node exporter instanced named `node_exporter`, which port-forwards its output to port `9100` and runs on the `promscale-timescaledb` network created in Step 3.1.

Once the Node Exporter is running, you can verify that system metrics are being exported by visiting its `/metrics` endpoint at the following URL: `http://localhost:9100/metrics`. Prometheus scrapes this `/metrics` endpoint to get metrics.

## Install Prometheus [](install-prometheus)

All that's left is to spin up Prometheus.

First we need to ensure that our Prometheus configuration file `prometheus.yml` is pointing to Promscale and that we've properly set the scrape configuration target to point to our `node_exporter` instance, created in Step 3.3.

Here is a basic `prometheus.yml` configuration file that we'll use for this tutorial. ([More information on Prometheus configuration][first steps])

**A basic `prometheus.yml` file for Promscale:**
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
In the file above, we configure Prometheus to use Promscale as its remote storage endpoint by pointing both its `remote_read` and `remote_write` to Promscale URLs. Moreover, we set node-exporter as our target to scrape every 10s.

Next, let's spin up a Prometheus instance using the configuration file above (assuming it's called `prometheus.yml` and is in the current working directory), using the following command:

```bash
docker run \
    --network promscale-timescaledb \
    -p 9090:9090 \
    -v ${PWD}/prometheus.yml:/etc/prometheus/prometheus.yml \
    prom/prometheus
```

## BONUS: Docker compose file [](promscale-docker-compose)
To save time spinning up and running each docker container separately, here is a sample`docker-compose.yml` file that spins up docker containers for TimescaleDB, Promscale, node_exporter and Prometheus using the configurations mentioned in Steps 1-4 above.

<highlight type="warning">
Ensure you have the Prometheus configuration file `prometheus.yml` in the same directory as `docker-compose.yml`
</highlight>

**A sample `docker-compose.yml` file to spin up and connect TimescaleDB, Promscale, node_exporter and Prometheus:** is available in the [Promscale Github repo][promscale-docker-compose].

To use the docker-compose file above method, follow these steps:
1. In `docker-compose.yml`, set `<PASSWORD>`, the password for superuser `postgres` in TimescaleDB, to a password of your choice.
2. Run the command `docker-compose up` in the same directory as the `docker-compose.yml` file .
3. That's it! TimescaleDB, Promscale, Prometheus, and node-exporter should now be up and running.



## Next step
* [Run queries with PromQL and SQL][promscale-run-queries]: Now that you've installed Promscale, let's query Promscale in SQL and PromQL

[prometheus-webpage]:https://prometheus.io
[promscale-blog]: https://blog.timescale.com/blog/promscale-analytical-platform-long-term-store-for-prometheus-combined-sql-promql-postgresql/
[promscale-readme]: https://github.com/timescale/promscale/blob/master/README.md
[design-doc]: https://tsdb.co/prom-design-doc
[promscale-github]: https://github.com/timescale/promscale#promscale
[promscale-extension]: https://github.com/timescale/promscale_extension#promscale-extension
[promscale-helm-chart]: https://github.com/timescale/promscale/tree/master/helm-chart
[tobs-github]: https://github.com/timescale/tobs
[promscale-baremetal-docs]: https://github.com/timescale/promscale/blob/master/docs/bare-metal-promscale-stack.md#deploying-promscale-on-bare-metal
[Prometheus]: https://prometheus.io/
[timescaledb vs]: /overview/how-does-it-compare/timescaledb-vs-postgres/
[prometheus storage docs]: https://prometheus.io/docs/prometheus/latest/storage/
[prometheus lts]: https://prometheus.io/docs/operating/integrations/#remote-endpoints-and-storage
[prometheus-federation]: https://prometheus.io/docs/prometheus/latest/federation/
[docker-pg-prom-timescale]: https://hub.docker.com/r/timescale/pg_prometheus
[postgresql adapter]: https://github.com/timescale/prometheus-postgresql-adapter
[Prometheus native format]: https://prometheus.io/docs/instrumenting/exposition_formats/
[docker]: https://docs.docker.com/install
[docker image]: https://hub.docker.com/r/timescale/prometheus-postgresql-adapter
[Node Exporter]: https://github.com/prometheus/node_exporter
[first steps]: https://prometheus.io/docs/introduction/first_steps/#configuring-prometheus
[for example]: https://www.zdnet.com/article/linux-meltdown-patch-up-to-800-percent-cpu-overhead-netflix-tests-show/
[promql-functions]: https://prometheus.io/docs/prometheus/latest/querying/functions/
[promscale-intro-video]: https://youtube.com/playlist?list=PLsceB9ac9MHTrmU-q7WCEvies-o7ts3ps
[Writing to Promscale]: https://github.com/timescale/promscale/blob/master/docs/writing_to_promscale.md
[Node Exporter Github]: https://github.com/prometheus/node_exporter#node-exporter
[promscale-github-installation]: https://github.com/timescale/promscale#-choose-your-own-installation-adventure
[promscale-docker-image]: https://hub.docker.com/r/timescale/promscale
[psql docs]: https://www.postgresql.org/docs/13/app-psql.html
[an Luu's post on SQL query]: https://danluu.com/metrics-analytics/
[grafana-homepage]:https://grafana.com
[promlens-homepage]: https://promlens.com
[multinode-blog]:https://blog.timescale.com/blog/timescaledb-2-0-a-multi-node-petabyte-scale-completely-free-relational-database-for-time-series/
[grafana-docker]: https://grafana.com/docs/grafana/latest/installation/docker/#install-official-and-community-grafana-plugins
[timescaledb-multinode-docs]: /how-to-guides/multi-node-setup/
[timescale-analytics]:https://github.com/timescale/timescale-analytics
[getting-started]: /getting-started/
[promscale-docker-compose]: https://github.com/timescale/promscale/blob/master/docker-compose/docker-compose.yaml
[promscale-benefits]: /tutorials/promscale/promscale-benefits/
[promscale-how-it-works]: /tutorials/promscale/promscale-how-it-works/
[promscale-install]: /tutorials/promscale/promscale-install/
[promscale-run-queries]: /tutorials/promscale/promscale-run-queries/
