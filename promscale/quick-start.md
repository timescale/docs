# Quick Start with Promscale
You can use Docker Compose to get started with Promscale. Docker Compose is a
tool for running multi-container applications on Docker defined in the compose
file format. A compose file is used to define how the one or more containers
that make up your application are configured. 

## Before you begin
* Ensure that you have [installed Docker Compose][docker-compose].

## Install Promscale with Docker Compose
To install Promscale with Docker Compose you need to clone the compose file and then run the Docker Compose.

### Downloading the Compose file
You need to download the the `docker-compose` directory which contains the services for the following components:
* Promscale for analytics and long term storage of metrics, traces.
* Prometheus and Node exporter for metrics
* OpenTelemetry collector, Demo applications and Grafana for traces and visualisation

<procedure>

1. Define the services for Promscale:
   ```bash
   git clone git@github.com:timescale/promscale.git
   ```
1. Naviagte into Promscale demo docker-compose directory.
   ```bash
   cd docker-compose/promscale-demo
   ```

</procedure >

### Running Promscale on Docker Compose
You can run Promscale on Docker Compose using:
```bash
   docker compose up -d
```

## Exploring the Promscale

By now Promscale should be up and running, Now let's explore the services
installed in docker-compose

### Grafana

Grafana is out of the box configured with datasources and dashboards.

#### Data sources

You can see the below image all three data sources that are configured to Promscale
1. Promscale-Metrics: PromQL query endpoint
2. Promscale-Traces: Jaeger query endpoint
3. Promscale-SQL: SQL query endpoint for both metrics and traces.

<todo-upload-the-image-to-s3-and-add-it-here>

#### APM Dashboards

With Promscale you get the APM like experience from trace data. Below are some 
of the dashboards that are pre-configured in docker-compose.

<todo-upload-the-image1-to-s3-and-add-it-here>

<todo-upload-the-image2-to-s3-and-add-it-here>

<todo-upload-the-image3-to-s3-and-add-it-here>


[gh-promscale]: https://github.com/timescale/promscale
[slack]: https://slack.timescale.com
[promscale-extension]: https://github.com/timescale/promscale_extension#promscale-extension
[Prometheus native format]: https://prometheus.io/docs/instrumenting/exposition_formats/
[query-data]: promscale/:currentVersion:/query-data
[promlabs-test]: https://promlabs.com/promql-compliance-test-results/2021-10-14/promscale
[tsdb-compression]: timescaledb/:currentVersion:/how-to-guides/compression/
[tsdb-hypertables]: timescaledb/:currentVersion:/how-to-guides/hypertables/
[docker-compose]: https://docs.docker.com/compose/install/
