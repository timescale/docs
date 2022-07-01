# Quick Start with Promscale
You can use Docker Compose to get started with Promscale. Docker Compose is a
tool for running multi-container applications on Docker defined in the compose
file format. A compose file is used to define how the one or more containers
that make up your application are configured. 

## Before you begin
* Ensure that you have [installed Docker Compose][docker-compose].
* Create a directory named `docker-compose`.

## Install Promscale with Docker Compose
To install Promscale with Docker Compose you need to create a compose file and define the services and then run the Docker Compose.

### Creating a compose file and defining the services
You need to create the `docker-compose.yaml` in the `docker-compose` directory and define the services for the following components:
* Promscale for analytics and long term storage of metrics, traces.
* Prometheus and Node exporter for metrics
* OpenTelemetry collector, Demo applications and Grafana for traces and visualisation

<procedure>

1. Define the services for Promscale:
   ```yaml
   version: '3.0'
   services:
     db:
       image: timescale/timescaledb-ha:pg14-latest
       ports:
        - 5432:5432/tcp
       environment:
         POSTGRES_PASSWORD: password
         POSTGRES_USER: postgres
     promscale:
       image: timescale/promscale:latest
       ports:
        - 9201:9201/tcp
        - 9202:9202/tcp
       restart: on-failure
       depends_on:
        - db
       environment:
         PROMSCALE_DB_URI: postgres://postgres:password@db:5432/postgres?sslmode=allow
  ```
1. Define the services for Prometheus and Node Exporter :
    ```yaml
    version: "3.9"
    services:
      prometheus:
        image: prom/prometheus:latest
        depends_on:
        - promscale
        ports:
        - 9090:9090/tcp
       volumes:
        - ${PWD}/prometheus.yml:/etc/prometheus/prometheus.yml
       node_exporter:
        image: quay.io/prometheus/node-exporter
        ports:
        - "9100:9100"
    ```
1. Define the services for OpenTelemetry Collector and Demo applications:
    ```yaml
    version: "3.9"
    services:
      grafana:
        build:
        context: ./instrumented/grafana
      volumes:
        - grafana-data:/var/lib/grafana
      ports:
        - 3000:3000/tcp
      restart: on-failure
      collector:
        build:
        context: ./instrumented/collector
      ports:
        - 4317:4317/tcp
        - 4318:4318/tcp
      restart: on-failure
      depends_on:
        - promscale
      upper:
       build:
       context: ./instrumented/upper
       restart: on-failure
       depends_on:
        - collector
       ports:
        - 5054:5000/tcp
       environment:
        - OTEL_EXPORTER_OTLP_ENDPOINT=collector:4317
      lower:
        build:
        context: ./instrumented/lower
        restart: on-failure
        depends_on:
        - collector
       ports:
         - 5053:5000/tcp
       environment:
         - OTEL_EXPORTER_OTLP_ENDPOINT=http://collector:4318
      special:
        build:
        context: ./instrumented/special
        restart: on-failure
        depends_on:
        - collector
        ports:
        - 5052:5000/tcp
       environment:
        - OTEL_EXPORTER_OTLP_ENDPOINT=collector:4317  
       digit:
         build:
         context: ./instrumented/digit
         restart: on-failure
         depends_on:
         - collector
         ports:
         - 5051:5000/tcp
        environment:
         - OTEL_EXPORTER_OTLP_ENDPOINT=collector:4317
       generator:
         build:
         context: ./instrumented/generator
         restart: on-failure
        depends_on:
         - upper
         - lower
         - special
         - digit
       ports:
         - 5050:5000/tcp
       environment:
         - OTEL_EXPORTER_OTLP_ENDPOINT=collector:4317
      load:
        build:
        context: ./instrumented/load
        restart: on-failure
        depends_on:
         - generator
        deploy:
         mode: replicated
         replicas: 3
         volumes:
       timescaledb-data:
       grafana-data:
  ```
1. Save `docker-compose.yaml` file.

</procedure >

### Running Promscale on Docker Compose
You can run Promscale on Docker Compose using:
```bash
   docker compose up -d
```   

[gh-promscale]: https://github.com/timescale/promscale
[slack]: https://slack.timescale.com
[promscale-extension]: https://github.com/timescale/promscale_extension#promscale-extension
[Prometheus native format]: https://prometheus.io/docs/instrumenting/exposition_formats/
[query-data]: promscale/:currentVersion:/query-data
[promlabs-test]: https://promlabs.com/promql-compliance-test-results/2021-10-14/promscale
[tsdb-compression]: timescaledb/:currentVersion:/how-to-guides/compression/
[tsdb-hypertables]: timescaledb/:currentVersion:/how-to-guides/hypertables/
[docker-compose]: https://docs.docker.com/compose/install/
