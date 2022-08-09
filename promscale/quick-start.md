# Promscale quick start
You can use Docker Compose to easily run Promscale in an isolated environment built
with Docker containers. This quick start guide demonstrates how to use Docker Compose to set
up and run Promscale as a unified metric and trace observability backend for Prometheus,
Jaeger and OpenTelemetry. It also includes some additional pre-configured tooling for you
to get familiar with additional Promscale features, such as application performance
monitoring dashboards and visualization tools.

For instructions on installing Promscale in your
production or staging environments, see [Installing Promscale][install-promscale].

Before you begin, make sure that you have [installed Docker Compose][docker-compose].

### Installing Promscale with Docker Compose

<procedure>

1. Clone the repository that defines the services for Promscale, change to
   the `promscale-demo` directory and use docker compose to run Promscale:
   ```bash
   git clone git@github.com:timescale/promscale.git
   cd promscale/docker-compose/promscale-demo
   docker compose up -d
   ```

</procedure >

OR

Run the above specified instructions step by step to understand more context
on the instructions

<procedure>

1. Clone the repository that defines the services for Promscale:
   ```bash
   git clone git@github.com:timescale/promscale.git
   ```
1. Change to the `promscale-demo` directory:
   ```bash
   cd promscale/docker-compose/promscale-demo
   ```
1. Use Docker Compose to run Promscale:
   ```bash
   docker compose up -d
   ```  

</procedure >

The above quick start contains services for these below components:
* Promscale for analytics and long term storage of metrics and traces
* Prometheus with the node exporter to generate and collect metrics
* A microservices application and the OpenTelemetry Collector to generate and collect traces
* Grafana and Jaeger to visualize metrics and traces

## Explore data in Promscale
When you have Promscale up and running, you can explore the services installed 
by Docker Compose. For example, you can use Grafana to see the data sources 
that are configured for Promscale, and use Grafana dashboards to visualize trace 
data. Access Grafana by navigating to `http://localhost:3000` in your web browser, 
and log in as `admin` with the password `admin`. Access Jaeger by navigating to
`http://localhost:16686`.

### Data sources
The data sources that are configured for Promscale are:
* Promscale-PromQL: PromQL query endpoint
* Promscale-Tracing: Jaeger query endpoint
* Promscale-SQL: SQL query endpoint for both metrics and traces

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/promscale-grafana-datasource-qsg.png" alt="Promscale data sources"/>

### Application performance monitoring dashboards
You can use Promscale for application/service performance monitoring using trace data. 
The Docker Compose configuration includes some pre-configured dashboards 
for you to explore.

#### Overview of services
View all the services with service name, number of requests served per second,
average and p90 request duration and error rate. Click the service name
to view the service level metrics.
<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/apm-services-overview-dashboard.png" alt="A dashboard representing the overview of services"/>

#### Slowest requests
View the top 50 slowest requests across all services with their corresponding traceID.
Click the traceID to access the gantt chart view of the corresponding trace.

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/apm-slowest-traces-dashboard.png" alt="A dashboard representing the slowest requests across the services"/>

#### Rate, error, and duration metrics
View the rate, error, and duration (RED) metrics specific to a service to understand
the number of requests per second served by a service, the number of failed
requests per second, and the amount of time it takes to process requests.

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/apm-red-metrics-dashboard.png" alt="A dashboard representing the RED metrics graphs specific to a service"/>

#### Upstream dependencies
You can view the upstream dependencies for the selected service and operation. 
This allows you to see a map of all the services and operations called across all 
requests, before the selected service and operation is called. This helps identify 
unexpected behaviors, such as calls between services and operations that were 
not part of the original design. It also makes it faster to investigate the root cause 
of changes in RED metrics for the selected service and operation. For example, 
if there is a significant increase in the number of requests a particular operation 
called from many different services is receiving, you can track down which 
service and operation is at the origin of that increase.

<img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/apm-upstream-dependency-dashboard.png" alt="A dashboard representing the upstream dependencies specific to a service"/>

[docker-compose]: https://docs.docker.com/compose/install/
[install-promscale]: /promscale/:currentVersion:/installation
