# Promscale quick start
You can use Docker Compose to easily run Promscale in an isolated environment built
with Docker containers. This quick start guide demonstrates how to use Compose to set
up and run Promscale as a single data store for your metrics and traces with full Prometheus
and OpenTelemetry support. It also includes some additional pre-configured tooling for you
to get familiar with additional Promscale functionality, such as performance monitoring and
visualization tools.

To learn more about how Promscale can improve your observability environment, see
[About Promscale][about-promscale]. For instructions on installing Promscale directly, see
[Installing Promscale][install-promscale].

Before you begin, make sure that you have [installed Docker Compose][docker-compose].

## Install Promscale with Docker Compose
To install Promscale with Docker Compose, you need to start by cloning the Promscale 
[repository][gh-promscale], and then using the Docker Compose tool to install it. The 
`docker-compose` directory contains the services for the following components:
* Promscale for analytics and long term storage of metrics and traces
* Prometheus and Node exporter for metrics
* OpenTelemetry collector, demonstration applications, and Grafana for traces and visualization

### Installing Promscale with Docker Compose

<procedure>

1. Clone the repository that defines the services for Promscale:
   ```bash
   git clone git@github.com:timescale/promscale.git
   ```
1. Change to the `promscale-demo` directory:
   ```bash
   cd docker-compose/promscale-demo
   ```
1. Use Docker Compose to run Promscale:
   ```bash
   docker compose up -d
   ```  

</procedure >

## Explore Promscale
When you have Promscale up and running, you can explore the services installed 
by Docker Compose. For example, you can use Grafana to see the data sources 
that are configured for Promscale, and use Grafana dashboards to visualize trace 
data. Access Grafana by navigating to `http://localhost:3000` in your web browser, 
and log in as `admin` with the password `admin`.

### Data sources
The data sources that are configured for Promscale are:
* Promscale-Metrics: PromQL query endpoint
* Promscale-Traces: Jaeger query endpoint
* Promscale-SQL: SQL query endpoint for both metrics and traces

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/promscale-grafana-datasource-qsg.png" alt="Promscale data sources"/>

### Performance monitoring dashboards
You can use Promscale for performance monitoring using trace data. 
The Docker Compose tool includes some pre-configured dashboards 
for you to explore.
<!--- Add instructions here -->

<!-- <todo-upload-the-image1-to-s3-and-add-it-here>

<todo-upload-the-image2-to-s3-and-add-it-here>

<todo-upload-the-image3-to-s3-and-add-it-here> -->


[gh-promscale]: https://github.com/timescale/promscale
[docker-compose]: https://docs.docker.com/compose/install/
[about-promscale]: /promscale/:currentVersion:/about-promscale
[install-promscale]: /promscale/:currentVersion:/installation
