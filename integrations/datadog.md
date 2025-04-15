---
title: Integrate Datadog with Timescale Cloud
excerpt: Datadog is a cloud-based monitoring and analytics platform. Export telemetry data from your Timescale Cloud service with time-series and analytics capability to Datadog
products: [cloud, mst, self_hosted]
keywords: [integrate]
---

import IntegrationPrereqsCloud from "versionContent/_partials/_integration-prereqs-cloud-only.mdx";
import DataDogExporter from "versionContent/_partials/_datadog-data-exporter.mdx";
import ManageDataExporter from "versionContent/_partials/_manage-a-data-exporter.mdx";

# Integrate Datadog with $CLOUD_LONG

[Datadog][datadog] is a cloud-based monitoring and analytics platform that provides comprehensive visibility into
applications, infrastructure, and systems through real-time monitoring, logging, and analytics.

This page explains how to:

- [Monitor $SERVICE_LONG metrics with Datadog][datadog-monitor-cloud]

  This integration is available for [Scale and Enterprise][pricing-plan-features] pricing plans.

- Configure Datadog Agent to collect metrics for your $SERVICE_LONG

   This integration is available for all pricing plans.


## Prerequisites

<IntegrationPrereqsCloud />

- Sign up for [Datadog][datadog-signup].

  You need your [Datadog API key][datadog-api-key] to follow this procedure.

- Install [Datadog Agent][datadog-agent-install].

## Monitor Timescale Cloud service metrics with Datadog

Export telemetry data from your $SERVICE_LONGs with the time-series and analytics capability enabled to
Datadog using a $CLOUD_LONG data exporter. The available metrics include CPU usage, RAM usage, and storage.

### Create a data exporter

A $CLOUD_LONG data exporter sends telemetry data from a $SERVICE_LONG to a third-party monitoring
tool. You create an exporter on the [project level][projects], in the same AWS region as your $SERVICE_SHORT:

<DataDogExporter />

### Manage a data exporter

This section shows you how to attach, monitor, edit, and delete a data exporter.

<ManageDataExporter />

## Configure Datadog Agent to collect metrics for your $SERVICE_LONGs

Datadog Agent includes a [$PG integration][datadog-postgres] that you use to collect detailed $PG database
metrics about your $SERVICE_LONGs.

1. **Connect to your $SERVICE_LONG**

   For $CLOUD_LONG, open an [SQL editor][run-queries] in [$CONSOLE][open-console]. For self-hosted, use [`psql`][psql].

1. **Add the `datadog` user to your $SERVICE_LONG**

   ```sql
   create user datadog with password '<password>';
   ```

   ```sql
   grant pg_monitor to datadog;
   ```

   ```sql
   grant SELECT ON pg_stat_database to datadog;
   ```

1. **Test the connection and rights for the datadog user**

   Update the following command with your [connection details][connection-info], then run it from the command line:

   ```bash
    psql "postgres://datadog:<datadog password>@<host>:<port>/tsdb?sslmode=require" -c \
    "select * from pg_stat_database LIMIT(1);" \
    && echo -e "\e[0;32mPostgres connection - OK\e[0m" || echo -e "\e[0;31mCannot connect to Postgres\e[0m"
   ```
   You see the output from the `pg_stat_database` table, which means you have given the correct rights to `datadog`.

1. **Connect Datadog to your $SERVICE_LONG**

   1. Open the datadog agent $PG configuration file, usually located at:
      - **Linux**: `/etc/datadog-agent/conf.d/postgres.d/conf.yaml`
      - **MacOS**: `/opt/datadog-agent/etc/conf.d/postgres.d/conf.yaml`
      - **Windows**: `C:\ProgramData\Datadog\conf.d\postgres.d\conf.yaml`

   1. Integrate Datadog Agent with your $SERVICE_LONG

      Use your [connection details][connection-info] to update the following and add it to the datadog agent $PG
      configuration file:

      ```yaml
      init_config:

      instances:
      - host: <host>
        port: <port>
        username: datadog
        password: <datadog's password>>
        dbname: tsdb
        disable_generic_tags: true
      ```

1. **Add $CLOUD_LONG metrics**

   Tags to make it easier for build Datadog dashboards that combine metrics from the $CLOUD_LONG data exporter and
   Datadog Agent. Use your [connection details][connection-info] to update the following and add it to
   `<datadog_home>/datadog.yaml`:

   ```yaml
   tags:
     - project-id:<project-id>
     - service-id:<service-id>
     - region:<region>
   ```

1. **Restart Datadog Agent**

   See how to [Start, stop, and restart Datadog Agent][datadog-agent-restart].

Metrics for your $SERVICE_LONG are now visible in Datadog. Check the Datadog $PG integration documentation for a
comprehensive list of [metrics][datadog-postgres-metrics] collected.

[datadog]: https://www.datadoghq.com/
[datadog-agent-install]: https://docs.datadoghq.com/getting_started/agent/#installation
[datadog-postgres]: https://docs.datadoghq.com/integrations/postgres/
[datadog-postgres-metrics]:https://docs.datadoghq.com/integrations/postgres/?tab=host#metrics
[datadog-postgres-setup]: https://docs.datadoghq.com/integrations/postgres/?tab=host#configuration
[datadog-signup]: https://www.datadoghq.com/
[datadog-monitor-cloud]: /use-timescale/:currentVersion:/integrations/datadog/#monitor-timescale-cloud-service-metrics-with-datadog
[datadog-agent]: /use-timescale/:currentVersion:/integrations/datadog/#configure-datadog-agent-to-collect-metrics-for-your-timescale-cloud-services
[datadog-agent-restart]: https://docs.datadoghq.com/agent/configuration/agent-commands/#start-stop-and-restart-the-agent
[projects]: /use-timescale/:currentVersion:/members/
[datadog-api-key]: https://docs.datadoghq.com/account_management/api-app-keys/#add-an-api-key-or-client-token
[pricing-plan-features]: /about/:currentVersion:/pricing-and-account-management/#features-included-in-each-plan
[run-queries]: /getting-started/:currentVersion:/run-queries-from-console/
[open-console]: https://console.cloud.timescale.com/dashboard/services
[psql]: /use-timescale/:currentVersion:/integrations/psql/
[connection-info]: /use-timescale/:currentVersion:/integrations/find-connection-details/
