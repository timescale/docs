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

[Datadog][datadog] is a cloud-based monitoring and analytics platform that provides comprehensive visibility into applications, infrastructure, and systems through real-time monitoring, logging, and analytics.

You can export telemetry data from your $SERVICE_LONGs with the time-series and analytics capability enabled to Datadog. The available metrics include CPU usage, RAM usage, and storage. This integration is available for [Scale and Enterprise][pricing-plan-features] pricing tiers.

You can also collect Postgres database metrics from your $SERVICE_LONGs using the Datadog agent.

This pages explains how to export telemetry data from your $SERVICE_LONG into Datadog by creating a $CLOUD_LONG data exporter, then attaching it to the $SERVICE_SHORT and how to configure the Datadog Agent to collect Postgres database metrics for those $SERVICE_LONGs.

## Prerequisites

<IntegrationPrereqsCloud />

- Sign up for [Datadog][datadog-signup].

  You need your API key to follow this procedure. [Create one][datadog-api-key] if you haven't yet. 

## Create a data exporter

A $CLOUD_LONG data exporter sends telemetry data from a $SERVICE_LONG to a third-party monitoring
tool. You create an exporter on the [project level][projects], in the same AWS region as your $SERVICE_SHORT: 

<DataDogExporter />

<ManageDataExporter />

## Collect Postgres database metrics with the Datadog agent

The Datadog Agent includes a [Postgres integration][datadog-postgres] that you can use to collect detailed Postgres database metrics for your $SERVICE_LONGs.

1. [Install][datadog-agent-install] the Datadog Agent.
2. Connect to your $SERVICE_LONG with the tsdbadmin user
3. Create a datadog user in your $SERVICE_LONG:
´´´´
create user datadog with password '<password>';
grant pg_monitor to datadog;
grant SELECT ON pg_stat_database to datadog;

´´´´

4. Setup Datadog's Postgres integration to point to your Timescale Service. The setup instructions below depend on how you deploy the agent. See their [documentation][datadog-postgres-setup].
host: <timescale-service-host>
port: <timescale-service-port>
username: datadog
password: <password>
dbname: tsdb

5. Set up the following tags to make it easier for build Datadog dashboards that combine metrics from the $CLOUD_LONG data exporter and the Datadog Agent.
   project-id:<project-id>
   service-id:<service-id>
   region:<region>

6. Restart the Datadog Agent

Postgres database metrics should now be visible in Datadog. Check the Datadog Postgres integration documentation for a comprehensive list of [metrics][datadog-postgres-metrics] collected.

[datadog]: https://www.datadoghq.com/
[datadog-agent-install]: https://docs.datadoghq.com/getting_started/agent/#installation
[datadog-postgres]: https://docs.datadoghq.com/integrations/postgres/
[datadog-postgres-metrics]:https://docs.datadoghq.com/integrations/postgres/?tab=host#metrics
[datadog-postgres-setup]: https://docs.datadoghq.com/integrations/postgres/?tab=host#configuration
[datadog-signup]: https://www.datadoghq.com/
[projects]: /use-timescale/:currentVersion:/members/
[datadog-api-key]: https://docs.datadoghq.com/account_management/api-app-keys/#add-an-api-key-or-client-token
[pricing-plan-features]: /about/:currentVersion:/pricing-and-account-management/#features-included-in-each-plan
