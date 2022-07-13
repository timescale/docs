# Promscale quick start
You can use Docker Compose to easily run Promscale in an isolated environment built
with Docker containers. This quick start guide demonstrates how to use Compose to set
up and run Promscale as a single data store for your metrics and traces with full Prometheus
and OpenTelemetry support. It also includes some additional pre-configured tooling for you
to get familiar with additional Promscale features, such as performance monitoring and
visualization tools.

To learn more about how Promscale can improve your observability environment, see
[About Promscale][about-promscale]. For instructions on installing Promscale directly, see
[Installing Promscale][install-promscale].

Before you begin, make sure that you have [installed Docker Compose][docker-compose].

## Install Promscale with Docker Compose
To install Promscale with Docker Compose, you need to start by cloning the Promscale 
[repository][gh-promscale], and then using the Docker Compose tool to install it. The 
`docker-compose` directory contains services for these components:
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

#### Overview of Services

THe below table lists all the services with service name, number of requests
served per second, average duration per request, p90 latency and error rate.
Clicking on the service name hyperlink will navigate you to the service level
metrics.

<!-- <apm-services-overview-dashboard> <alt-text=APM dashboard representing the overview of services> -->

#### Slowest Requests

The below table lists the top 50 slowest requests across the services with relevant traceID as hyperlink, clicking on it navigates to the trace vilsualization of slowest request.

<!-- <apm-slowest-traces-dashboard> <alt-text=APM dashboard representing the slowest requests across the services> -->

#### RED metrics

The below dashboard illustrates the RED (Rate, Error, Duration) metrics 
specific to a service to understand the number of requests a service
is serving per second, the number of failed requests per second, 
the amount of time it takes to process a request.

<!-- <apm-red-metrics-dashboard> <alt-text=APM dashboard representing the RED metrics graphs specific to a service> -->

#### Upstream Dependencies

The below graph illustrates the upstream dependencies i.e origin of all the requests that are received by a specific service.

<!-- <apm-upstream-dependency-dashboard> <alt-text=APM dashboard representing the upstream dependencies specific to a service> -->

[gh-promscale]: https://github.com/timescale/promscale
[docker-compose]: https://docs.docker.com/compose/install/
[about-promscale]: /promscale/:currentVersion:/about-promscale
[install-promscale]: /promscale/:currentVersion:/installation
