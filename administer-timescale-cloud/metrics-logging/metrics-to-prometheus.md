---
title: Export metrics to Prometheus
excerpt: Export telemetry metrics to Prometheus
products: [cloud]
keywords: [integration, metrics, Prometheus, alerting]
tags: [telemetry, monitor]
cloud_ui:
    path:
        - [integrations]
        - [services, :serviceId, operations, integrations]
---

import ExporterRegionNote from 'versionContent/_partials/_cloud-integrations-exporter-region.mdx';


# Export metrics to Prometheus

You can export your Timescale service telemetry to Prometheus.

## Create a monitoring user

1. Connect to the Timescale service as tsdbadmin (using psql or a similar tool).

1. Create a new user to scrape the metrics from the database using the required permissions:

    a. Create a user named `monitoring` with the desired password by replacing `<password>`:
    
    ```sql
    CREATE USER monitoring WITH PASSWORD '<password>';
    ```

    b. Grant `pg_read_all_stats` to the `monitoring` user:

    ```sql
    GRANT pg_read_all_stats to monitoring;
    ```

## Install PostgreSQL exporter

1. Install the postgresql_exporter on a host that you manage to connect to the Timescale service and collect telemetry. Below is an example using Docker to run postgresql_exporter:

    make sure to replace `<PASSWORD>` with the created password and `<TIMESCALE-HOST:PORT>` with the timescale service host and port.

    ```bash
    docker run \
    -p 9187:9187 \
    -e DATA_SOURCE_NAME="postgres://monitoring:<PASSWORD>@<TIMESCALE-HOST:PORT>/tsdb?sslmode=require" \
    quay.io/prometheuscommunity/postgres-exporter
    ```
    To reduce latency and potential data transfer costs,  best practice is to run `postgresql_exporter` in the same AWS region as your Timescale Cloud service.

1. Once the postgresql_exporter is up and running, and successfully connected to the Timescale service, you can configure your Prometheus server to scrape the postgresql_exporter metrics endpoint. This endpoint exposes all the metrics provided by the exporter. 

    To view all the exposed metrics, execute curl on the same host:
    ```bash
    curl localhost:9187/metrics
    ```

## Grafana dashboard for PostgreSQL metrics

Use the [PostgreSQL dashboard][postgresql-exporter-dashboard] to visualize the following metrics:
* Current QPS
* Fetched, Returned, Inserted, Updated, Deleted Rows
* Database Deadlocks and Conflicts
* Cache Hit Ratio
* Number of Active Connections
* Buffers

<Highlight type="note">
Furthermore, you can create custom dashboards tailored to your specific needs using the metrics obtained from the Timescale service.
</Highlight>


[postgresql-exporter-dashboard]: https://grafana.com/oss/prometheus/exporters/postgres-exporter/?tab=dashboards
