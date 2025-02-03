import IntegrationPrereqs from "versionContent/_partials/_integration-prereqs.mdx";

[Prometheus][prometheus] is an open-source monitoring system with a dimensional data model, flexible query language, and a modern alerting approach.

This page shows you how to export your $SERVICE_SHORT telemetry to Prometheus using [PostgreSQL Exporter][postgresql-exporter].

## Prerequisites

<IntegrationPrereqs />

- [Download and run Prometheus][install-prometheus].
- [Install PostgreSQL Exporter][install-exporter].

To reduce latency and potential data transfer costs, install Prometheus and PostgreSQL Exporter on a machine in the 
same AWS region as your $SERVICE_LONG.

## Export $SERVICE_SHORT telemetry to Prometheus

To export your data, do the following:

<Procedure>

1. **Create a user to access telemetry data about your $SERVICE_LONG**

   1. Connect to your $SERVICE_LONG:

      For $CLOUD_LONG, open an [SQL editor][run-queries] in [$CONSOLE][open-console]. For self-hosted, use [`psql`][psql].  

   1. Create a user named `monitoring` with a secure password:

      ```sql
      CREATE USER monitoring WITH PASSWORD '<password>';
      ```

   1. Grant the `pg_read_all_stats` permission to the `monitoring` user:

      ```sql
      GRANT pg_read_all_stats to monitoring;
      ```

1. **Import telemetry data about your $SERVICE_LONG to PostgreSQL Exporter**

   1. Connect PostgreSQL Exporter to your $SERVICE_LONG:

      Use your [connection details][connection-info] to import telemetry data about your $SERVICE_LONG. You connect as 
      the `monitoring` user: 
      - Local installation:
         ```shell
         export DATA_SOURCE_NAME="postgres://monitoring:<password>@<host>.tsdb.cloud.timescale.com:<port>/tsdb?sslmode=require"
         ./postgres_exporter
         ```
      - Docker:
        ```shell
        docker run -d \ 
           -e DATA_SOURCE_NAME="postgres://monitoring:<password>@<host>.tsdb.cloud.timescale.com:<port>/tsdb?sslmode=require" \ 
           -p 9187:9187 \ 
           prometheuscommunity/postgres-exporter
        ```
      
   1. Check the metrics for your $SERVICE_LONG in the Prometheus format:
      - Browser: 
      
        Navigate to `http://<exporter-host>:9187/metrics`. 
      - Command line:
         ```shell
         curl http://<exporter-host>:9187/metrics
         ```        

1. **Configure Prometheus to scrape metrics**

    1. In your Prometheus installation, update `prometheus.yml` to point to your PostgreSQL Exporter instance as a scrape
       target. In the following example, you replace `<exporter-host>` with the hostname or IP address of the PostgreSQL 
       Exporter.

       ```yaml
       global:
         scrape_interval: 15s
       
       scrape_configs:
       - job_name: 'postgresql'
         static_configs:
          - targets: ['<exporter-host>:9187'] 
       ```

       If `prometheus.yml` has not been created during installation, create it manually. If you are using Docker, you can
       find the IPAddress in `Inspect` > `Networks` for the container running PostgreSQL Exporter. 

    1. Restart Prometheus.

    1. Check the Prometheus UI at `http://<prometheus-host>:9090/targets` and `http://<prometheus-host>:9090/tsdb-status`.

       You see the PostgreSQL Exporter target and the metrics scraped from it.

</Procedure>

You can further [visualize your data][grafana-prometheus] with Grafana. Use the 
[Grafana PostgreSQL dashboard][postgresql-exporter-dashboard] or [create a custom dashboard][grafana] that suits your needs.

[install-exporter]: https://grafana.com/oss/prometheus/exporters/postgres-exporter/?tab=installation
[postgresql-exporter-dashboard]: https://grafana.com/oss/prometheus/exporters/postgres-exporter/?tab=dashboards
[install-prometheus]: https://prometheus.io/docs/prometheus/latest/installation/
[grafana]: /use-timescale/:currentVersion:/integrations/grafana/
[grafana-prometheus]: https://grafana.com/docs/grafana-cloud/send-data/metrics/metrics-prometheus/
[prometheus]: https://prometheus.io/docs/introduction/overview/
[run-queries]: /getting-started/:currentVersion:/run-queries-from-console/
[psql]: /use-timescale/:currentVersion:/integrations/psql/
[connection-info]: /use-timescale/:currentVersion:/integrations/find-connection-details/
[postgresql-exporter]: https://grafana.com/oss/prometheus/exporters/postgres-exporter/
[open-console]: https://console.cloud.timescale.com/dashboard/services
