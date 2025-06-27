import IntegrationPrereqs from "versionContent/_partials/_integration-prereqs.mdx";

[Prometheus][prometheus] is an open-source monitoring system with a dimensional data model, flexible query language, and a modern alerting approach.

This page shows you how to export your $SERVICE_SHORT metrics to Prometheus:

- For $CLOUD_LONG, using a dedicated Prometheus exporter in $CONSOLE or [PostgreSQL Exporter][postgresql-exporter].
- For $SELF_LONG, using [PostgreSQL Exporter][postgresql-exporter].

## Export metrics to Prometheus

To export your data, do the following:

<Tabs label="Export metrics to Prometheus">

<Tab title="Tiger Cloud">

You can export different metrics from your $SERVICE_LONG using the Prometheus exporter in $CONSOLE or PostgreSQL Exporter. 

The Prometheus exporter exposes the metrics related to the $SERVICE_LONG like CPU, memory, and storage. PostgreSQL Exporter exposes metrics that you define, excluding the system metrics available with the $CONSOLE exporter.

### Prerequisites

To follow the steps on this page:

- Create a target [$SERVICE_LONG][create-service] with the time-series and analytics capability enabled. You need your [connection details][connection-info].
- [Download and run Prometheus][install-prometheus] in the same AWS region as your $SERVICE_LONG or database.
- To use PostgreSQL Exporter: [install PostgreSQL Exporter][install-exporter] in the same AWS region as your $SERVICE_SHORT.

<Tabs>

<Tab title="Using Tiger Cloud Console exporter">

<Availability products={['cloud']} price_plans={['enterprise']} />

You create a Prometheus exporter in $CONSOLE, attach it to your $SERVICE_SHORT, then configure Prometheus to scrape metrics using the exposed URL.

<Procedure>

1. **Create a Prometheus exporter**

    1. In [$CONSOLE][open-console], click `Exporters` > `+ New exporter`.

    1. Select `Metrics` for data type and `Prometheus` for provider.

      ![Create a Prometheus exporter in Tiger Cloud](https://assets.timescale.com/docs/images/tiger-cloud-console/tiger-cloud-create-prometheus-exporter.png)

    1. Choose the region for the exporter. Only $SERVICE_SHORTs in the same project and region can be attached to this exporter.

    1. Name your exporter.

    1. Change the auto-generated Prometheus credentials, if needed. See [official documentation][prometheus-authentication] on basic authentication in Prometheus.

      ![Prometheus exporter credentials](https://assets.timescale.com/docs/images/tiger-cloud-console/prometheus-exporter-basic-authentication.png)

1. **Attach the exporter to a $SERVICE_SHORT**

    1. Select a $SERVICE_SHORT, then click `Operations` > `Exporters`.

    1. Select the exporter in the drop-down, then click `Attach exporter`.

      ![Attach a Prometheus exporter to a Tiger Cloud service](https://assets.timescale.com/docs/images/tiger-cloud-console/attach-prometheus-exporter-tiger-cloud.png)

   The exporter is now attached to your $SERVICE_SHORT. To unattach it, click the trash icon in the exporter list.

      ![Unattach a Prometheus exporter from a Tiger Cloud service](https://assets.timescale.com/docs/images/tiger-cloud-console/unattach-prometheus-exporter-tiger-cloud-service.png)

1. **Configure the Prometheus scrape target**

    1. Select your service, then click `Operations` > `Exporters` and click the information icon next to the exporter. You see the exporter details.

      ![Prometheus exporter details in Tiger Cloud](https://assets.timescale.com/docs/images/tiger-cloud-console/prometheus-exporter-details-tiger-cloud.png)

    1. Copy the exporter URL.

    1. In your Prometheus installation, update `prometheus.yml` to point to the exporter URL as a scrape target:

       ```yml
       scrape_configs:
        - job_name: "timescaledb-exporter"
          scheme: https
          static_configs:
            - targets: ["my-exporter-url"]
          basic_auth:
            username: "user"
            password: "pass"
       ```

       See the [Prometheus documentation][scrape-targets] for details on configuring scrape targets.

       You can now monitor your $SERVICE_SHORT metrics. Use the following metrics to check the service is running correctly:

        *   `timescale.cloud.system.cpu.usage.millicores`
        *   `timescale.cloud.system.cpu.total.millicores`
        *   `timescale.cloud.system.memory.usage.bytes`
        *   `timescale.cloud.system.memory.total.bytes`
        *   `timescale.cloud.system.disk.usage.bytes`
        *   `timescale.cloud.system.disk.total.bytes`

       Additionally, use the following labels to filter your results.

       | Label        |Example variable| Description                       |
             |--------------|-|-----------------------------------|
       | `host`       |`us-east-1.timescale.cloud`|                                   |
       | `project-id` ||                                   |
       | `service-id` ||                                   |
       | `region`     |`us-east-1`| AWS region                        |
       | `role`       |`replica` or `primary`| For $SERVICE_SHORTs with replicas |

</Procedure>

</Tab>

<Tab title="Using PostgreSQL Exporter">

You import your $SERVICE_LONG metrics into PostgreSQL Exporter, then configure Prometheus to scrape metrics from it.

<Procedure>

1. **Create a user to access your $SERVICE_LONG metrics**

    1. Connect to your $SERVICE_SHORT using your [connection details][connection-info].

    1. Create a user named `monitoring` with a secure password:

       ```sql
       CREATE USER monitoring WITH PASSWORD '<password>';
       ```

    1. Grant the `pg_read_all_stats` permission to the `monitoring` user:

       ```sql
       GRANT pg_read_all_stats to monitoring;
       ```

1. **Import your $SERVICE_SHORT metrics to PostgreSQL Exporter**

    1. Connect PostgreSQL Exporter to your $SERVICE_SHORT:

       Use your [connection details][connection-info] to import your $SERVICE_SHORT metrics. You connect as
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

    1. Configure at least the following labels for your $SERVICE_SHORT in PostgreSQL Exporter:

       - `project_id`
       - `service_id`
       - `region`
   
       Having the same labels configured in PostgreSQL Exporter as in the $CLOUD_LONG Prometheus exporter helps you correlate metrics from both sources. 

    1. Check the metrics for your $SERVICE_SHORT in the Prometheus format:

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
            labels:
              service_id: '<your-service-id>'
              project_id: '<your-project-id>'
              region: '<your-region>'
       ```

       If `prometheus.yml` has not been created during installation, create it manually. If you are using Docker, you can
       find the IPAddress in `Inspect` > `Networks` for the container running PostgreSQL Exporter.

    1. Restart Prometheus.

    1. Check the Prometheus UI at `http://<prometheus-host>:9090/targets` and `http://<prometheus-host>:9090/tsdb-status`.

       You see the PostgreSQL Exporter target and the metrics scraped from it.

</Procedure>


</Tab>

</Tabs>

</Tab>

<Tab title="Self-hosted TimescaleDB">

You export metrics from $SELF_LONG to PostgreSQL Exporter, then configure Prometheus to scrape metrics from it.

## Prerequisites

To follow the steps on this page:

- Create a target [self-hosted $TIMESCALE_DB][enable-timescaledb] instance. You need your [connection details][connection-info].
- [Install PostgreSQL Exporter][install-exporter] in the same AWS region as your database.
- [Download and run Prometheus][install-prometheus] in the same AWS region as your $SERVICE_LONG or database.

<Procedure>

1. **Create a user to access your database metrics**

    1. Connect to your database in [`psql`][psql] using your [connection details][connection-info].

    1. Create a user named `monitoring` with a secure password:

       ```sql
       CREATE USER monitoring WITH PASSWORD '<password>';
       ```

    1. Grant the `pg_read_all_stats` permission to the `monitoring` user:

       ```sql
       GRANT pg_read_all_stats to monitoring;
       ```

1. **Import your database metrics to PostgreSQL Exporter**

    1. Connect PostgreSQL Exporter to your database:

       Use your [connection details][connection-info] to import your database metrics. You connect as
       the `monitoring` user:
   
        - Local installation:
           ```shell
           export DATA_SOURCE_NAME="postgres://<user>:<password>@<host>:<port>/<database>?sslmode=<sslmode>"
           ./postgres_exporter
           ```
        - Docker:
           ```shell
           docker run -d \ 
              -e DATA_SOURCE_NAME="postgres://<user>:<password>@<host>:<port>/<database>?sslmode=<sslmode>" \
              -p 9187:9187 \ 
              prometheuscommunity/postgres-exporter
           ```

    1. Check your database metrics in the Prometheus format:
   
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
    
</Tab>

</Tabs>

You can further [visualize your data][grafana-prometheus] with Grafana. Use the 
[Grafana PostgreSQL dashboard][postgresql-exporter-dashboard] or [create a custom dashboard][grafana] that suits your needs.

[install-exporter]: https://grafana.com/oss/prometheus/exporters/postgres-exporter/?tab=installation
[postgresql-exporter-dashboard]: https://grafana.com/oss/prometheus/exporters/postgres-exporter/?tab=dashboards
[install-prometheus]: https://prometheus.io/docs/prometheus/latest/installation/
[grafana]: /integrations/:currentVersion:/grafana/
[grafana-prometheus]: https://grafana.com/docs/grafana-cloud/send-data/metrics/metrics-prometheus/
[prometheus]: https://prometheus.io/docs/introduction/overview/
[run-queries]: /getting-started/:currentVersion:/run-queries-from-console/
[psql]: /integrations/:currentVersion:/psql/
[connection-info]: /integrations/:currentVersion:/find-connection-details/
[postgresql-exporter]: https://grafana.com/oss/prometheus/exporters/postgres-exporter/
[open-console]: https://console.cloud.timescale.com/dashboard/services
[connection-info]: /integrations/:currentVersion:/find-connection-details/
[create-service]: /getting-started/:currentVersion:/services/
[enable-timescaledb]: /self-hosted/:currentVersion:/install/
[prometheus-authentication]: https://prometheus.io/docs/guides/basic-auth/
[scrape-targets]: https://prometheus.io/docs/prometheus/latest/configuration/configuration/#scrape_config
[pricing-plan-features]: /about/:currentVersion:/pricing-and-account-management/#features-included-in-each-plan