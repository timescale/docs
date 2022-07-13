# Promscale quick start
Use Docker Compose to learn how Promscale is a single data store for your
metrics and traces with full Prometheus and OpenTelemetry support, seamless
integration with Grafana and Jaeger.  

## Before you begin
* Ensure that you have [installed Docker Compose][docker-compose].

## Install Promscale with Docker Compose
To install Promscale with Docker Compose clone the Promscale [repository][gh-promscale] and then run the Docker Compose. The `docker-compose` directory contains the services for the following components:
* Promscale for analytics and long term storage of metrics and traces
* Prometheus and Node exporter for metrics
* OpenTelemetry collector, demo applications and Grafana for traces and visualisation

### Installing Promscale with Docker Compose

<procedure>

1. Clone the repository that defines the services for Promscale:
   ```bash
   git clone git@github.com:timescale/promscale.git
   ```
1. Change to `promscale-demo` directory.
   ```bash
   cd docker-compose/promscale-demo
   ```
1. Run Promscale on Docker Compose:
   ```bash
   docker compose up -d
   ```  

</procedure >

## Explore Promscale

After Promscale is up and running you can explore the services installed in
Docker Compose, such as Grafana. View the data sources that are configured to
Promscale and the dashboards for trace data. Access Grafana on the browser
`http://localhost:3000` as `admin` user using the password `admin`.

### Data sources
The three data sources that are configured to Promscale are:
* Promscale-Metrics: PromQL query endpoint
* Promscale-Traces: Jaeger query endpoint
* Promscale-SQL: SQL query endpoint for both metrics and traces

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/promscale-grafana-datasource-qsg.png" alt="Promscale data sources"/>

### Performance monitoring dashboards
With Promscale you get the APM like experience from trace data. View some 
of the dashboards that are pre-configured in docker-compose.

<!-- <todo-upload-the-image1-to-s3-and-add-it-here>

<todo-upload-the-image2-to-s3-and-add-it-here>

<todo-upload-the-image3-to-s3-and-add-it-here> -->


[gh-promscale]: https://github.com/timescale/promscale
[docker-compose]: https://docs.docker.com/compose/install/
