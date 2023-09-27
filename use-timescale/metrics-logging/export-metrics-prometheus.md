---
title: Export Timescale service metrics into Prometheus
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


# Export Timescale service metrics to Prometheus

<ExporterRegionNote />

## Setup Postgres exporter to scrape metrics from Timescale service

1. Connect to the Timescale service as tsdbadmin (using psql or a similar tool).

2. Create a new user to scrape the metrics from the database using the right permissions:

    a. Create a user named 'monitoring' with the desired password by replacing `<password>`:
    
    ```sql
    CREATE USER monitoring WITH PASSWORD '<password>';
    ```

    b. Grant pg_read_all_stats to the 'monitoring' user:

    ```sql
    GRANT pg_read_all_stats to monitoring;
    ```

3. Run the postgresql_exporter on a host that you manage to connect to the Timescale service and collect telemetry. Make sure to run the exporter in the same region as your database. Here's an example using Docker to run postgresql_exporter:

    make sure to replace `<PASSWORD>` with the created password and `<TIMESCALE-HOST:PORT>` with the timescale service host and port.

    ```bash
    docker run \\
    -p 9187:9187 \\
    -e DATA_SOURCE_NAME="postgres://monitoring:<PASSWORD>@<TIMESCALE-HOST:PORT>/tsdb?sslmode=require" \\
    quay.io/prometheuscommunity/postgres-exporter
    ```

4. Once the postgresql_exporter is up and running and successfully connected to the Timescale service, you can configure your Prometheus server to scrape the postgresql_exporter metrics endpoint. This endpoint exposes all the metrics provided by the exporter. To view all the exposed metrics, execute `curl localhost:9187/metrics` on the same host.


## Grafana dashboard for PostgreSQL metrics

[Here][postgresql-exporter-dashboard] is a Grafana dashboard that you can import to visualize the following metrics:
* Current QPS
* Fetched, Returned, Inserted, Updated, Deleted Rows
* Database Deadlocks and Conflicts
* Cache Hit Ratio
* Number of Active Connections
* Buffers

Additionally, you have the option to create custom dashboards based on your specific requirements using the metrics scraped from the Timescale service.


[postgresql-exporter-dashboard]: https://grafana.com/oss/prometheus/exporters/postgres-exporter/?tab=dashboards