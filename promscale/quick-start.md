# Quick Start with Promscale

This quick start guide assists the user to deploy Promscale in no time.

In the guide we will be deploying the below components:
1. Promscale for analytics and long term storage of metrics, traces.
2. Prometheus and Node exporter for metrics
3. OpenTelemetry collector, Demo applications and Grafana for traces and visualisation

The quick start guide illustrates the installation instructions using `docker-compose`

## Promscale

```
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

## Prometheus and Node Exporter

```
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

## OpenTelemetry Collector and Demo applications

```
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



[gh-promscale]: https://github.com/timescale/promscale
[slack]: https://slack.timescale.com
[promscale-extension]: https://github.com/timescale/promscale_extension#promscale-extension
[Prometheus native format]: https://prometheus.io/docs/instrumenting/exposition_formats/
[query-data]: promscale/:currentVersion:/query-data
[promlabs-test]: https://promlabs.com/promql-compliance-test-results/2021-10-14/promscale
[tsdb-compression]: timescaledb/:currentVersion:/how-to-guides/compression/
[tsdb-hypertables]: timescaledb/:currentVersion:/how-to-guides/hypertables/
