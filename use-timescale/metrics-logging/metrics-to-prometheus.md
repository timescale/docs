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

import IntegrationPrereqs from "versionContent/_partials/_integration-prereqs.mdx";

# Export metrics to Prometheus

[Prometheus][prometheus] is an open-source monitoring system with a dimensional data model, flexible query language, and a modern alerting approach.

This page shows you how to export your $SERVICE_SHORT telemetry to Prometheus using [PostgreSQL Exporter][postgresql-exporter].

## Prerequisites

<IntegrationPrereqs />

- [Download and install Prometheus][install-prometheus].

## Export $SERVICE_SHORT telemetry to Prometheus

Take the following steps to export your data:

<Procedure>

1. **Connect to your $SERVICE_LONG**

   For $CLOUD_SHORT, connect from [$CONSOLE][run-queries]. For self-hosted, use [`psql`][psql].

1. **Create a user to scrape the metrics**

   1. Create a user named `monitoring` with a password:

      ```sql
      CREATE USER monitoring WITH PASSWORD '<password>';
      ```

   1. Grant the `pg_read_all_stats` permission to the `monitoring` user:

      ```sql
      GRANT pg_read_all_stats to monitoring;
      ```

1. **Install PostgreSQL Exporter**

   You [install PostgreSQL Exporter][install-exporter] on the machine that you use to connect to your $SERVICE_SHORT and collect telemetry. To reduce latency and potential data transfer costs, run PostgreSQL Exporter in the same AWS region as your $SERVICE_LONG. Use your [connection details][connection-info] to configure the data source during installation.
      
  * If installing with Docker:

    ```bash
    docker run -d --name=postgresql_exporter \
    -e DATA_SOURCE_NAME="postgresql://<username>:<password>@<host>:<port>/<database>?sslmode=require" \
    -p 9187:9187 quay.io/prometheuscommunity/postgres-exporter
    ```

   - `<username>`: `monitoring`
   - `<password>`: the `monitoring` user password
   - `<host>`, `<port>`, and `<database>`: configure using your [connection details][connection-info].

  * If installing with a binary, configure the `DATA_SOURCE_NAME` environment variable similarly. 

  To check the installation, navigate to `http://<exporter-host>:9187/metrics`. You should see PostgreSQL metrics in the Prometheus format.

1. **Configure Prometheus to scrape metrics**

   1. Update the `prometheus.yml` file to include PostgreSQL Exporter as a scrape target. If `prometheus.yml` has not been created during installation, create it manually:

      ```yaml
      global:
        scrape_interval: 15s
      
      scrape_configs:
      - job_name: 'postgresql'
        static_configs:
         - targets: ['<exporter-host>:9187'] 
      ```

      Replace `<exporter-host>` with the hostname or IP address of the PostgreSQL Exporter. 

   1. Restart Prometheus.

   1. Check the Prometheus UI at `http://<prometheus-host>:9090`.

      The PostgreSQL Exporter target under `Status` > `Target health` must be active.

</Procedure>

You can further [visualize your data][grafana-prometheus] with Grafana. Use the [Grafana PostgreSQL dashboard][postgresql-exporter-dashboard] or [create a custom dashboard][grafana] that suits your needs.

[install-exporter]: https://grafana.com/oss/prometheus/exporters/postgres-exporter/?tab=installation
[postgresql-exporter-dashboard]: https://grafana.com/oss/prometheus/exporters/postgres-exporter/?tab=dashboards
[install-prometheus]: https://prometheus.io/download/
[grafana]: /use-timescale/:currentVersion:/integrations/grafana/
[grafana-prometheus]: https://grafana.com/docs/grafana-cloud/send-data/metrics/metrics-prometheus/
[prometheus]: https://prometheus.io/docs/introduction/overview/
[run-queries]: /getting-started/:currentVersion:/run-queries-from-console/
[psql]: /use-timescale/:currentVersion:/integrations/psql/
[connection-info]: /use-timescale/:currentVersion:/integrations/find-connection-details/
[postgresql-exporter]: https://grafana.com/oss/prometheus/exporters/postgres-exporter/