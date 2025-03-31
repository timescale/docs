---
title: Integrate Datadog with Timescale Cloud
excerpt: Datadog is a cloud-based monitoring and analytics platform. Export telemetry data from your Timescale Cloud service with time-series and analytics capability to Datadog
products: [cloud, mst, self_hosted]
keywords: [integrate]
---

import IntegrationPrereqsCloud from "versionContent/_partials/_integration-prereqs-cloud-only.mdx";
import DataDogExporter from "versionContent/_partials/_datadog-data-exporter.mdx";
import ManageDataExporter from "versionContent/_partials/_manage-data-exporter.mdx";

# Integrate Datadog with $CLOUD_LONG

[Datadog][datadog] is a cloud-based monitoring and analytics platform that provides comprehensive visibility into 
applications, infrastructure, and systems through real-time monitoring, logging, and analytics.

This page explains how to:

- **Monitor Timescale Cloud service metrics with Datadog**

  This integration is available for [Scale and Enterprise][pricing-plan-features] pricing tiers.

- **Configure Datadog Agent to collect metrics for your $SERVICE_LONGs**


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

Datadog Agent includes a [Postgres integration][datadog-postgres] that you use to collect detailed Postgres database 
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

1. **Connect Datadog to your $SERVICE_LONG** 

   Use your [connection details][connection-info] to configure the Datadog [Postgres integration][datadog-postgres-setup]
   to connect to your $SERVICE_LONG. **IAIN**: Validate this step and write from here

   - **host**: `<timescale-service-host>`
   - **port**: `<timescale-service-port>`
   - **username**: `datadog`
   - **password**: `<password>`
   - **dbname**: `tsdb`

1. **Set up tags**

   Set up the following tags to make it easier for build Datadog dashboards that combine metrics from the $CLOUD_LONG data exporter and the Datadog Agent.
   - **project-id**: `<project-id>`
   - **service-id**: `<service-id>`
   - **region**: `<region>`

6. **Restart  Datadog Agent**

Metrics for your $SERVICE_LONG are now visible in Datadog. Check the Datadog Postgres integration documentation for a
comprehensive list of [metrics][datadog-postgres-metrics] collected.


[datadog]: https://www.datadoghq.com/
[datadog-agent-install]: https://docs.datadoghq.com/getting_started/agent/#installation
[datadog-postgres]: https://docs.datadoghq.com/integrations/postgres/
[datadog-postgres-metrics]:https://docs.datadoghq.com/integrations/postgres/?tab=host#metrics
[datadog-postgres-setup]: https://docs.datadoghq.com/integrations/postgres/?tab=host#configuration
[datadog-signup]: https://www.datadoghq.com/
[projects]: /use-timescale/:currentVersion:/members/
[datadog-api-key]: https://docs.datadoghq.com/account_management/api-app-keys/#add-an-api-key-or-client-token
[pricing-plan-features]: /about/:currentVersion:/pricing-and-account-management/#features-included-in-each-plan
[run-queries]: /getting-started/:currentVersion:/run-queries-from-console/
[open-console]: https://console.cloud.timescale.com/dashboard/services
[psql]: /use-timescale/:currentVersion:/integrations/psql/
[connection-info]: /use-timescale/:currentVersion:/integrations/find-connection-details/
