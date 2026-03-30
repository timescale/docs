---
title: Export metrics to Azure Monitor
excerpt: Azure Monitor is a comprehensive monitoring and observability service. Create an exporter in Tiger Cloud and export telemetry metrics of your service
products: [cloud]
price_plans: [scale, enterprise]
keywords: [integration, metrics, azure monitor, alerting]
tags: [telemetry, monitor]
---

import AzureMonitorExporter from "versionContent/_partials/_azure-monitor-data-exporter.mdx";
import PrereqsCloud from "versionContent/_partials/_prereqs-cloud-no-connection.mdx";
import ManageDataExporter from "versionContent/_partials/_manage-a-data-exporter.mdx";
import NotSupportedAws from "versionContent/_partials/_not-supported-for-aws.mdx";

# Export telemetry data to Azure Monitor

You can export telemetry data from your $SERVICE_LONGs with the time-series and analytics capability enabled to [Azure Monitor][azure-monitor]. See [Exported metrics](/use-timescale/:currentVersion:/metrics-logging/exported-metrics/) for the full list of default and additional metrics you can export.

This page shows you how to create an Azure Monitor exporter in $CONSOLE, and manage the lifecycle of data exporters. This integration is available for [$SCALE or $ENTERPRISE][pricing-plan-features] $PRICING_PLANs.

## Prerequisites

<PrereqsCloud />

- Get an Azure subscription with access to [Azure Monitor][azure-monitor] and [Application Insights][application-insights].

  You need your [Azure Monitor Application Insights connection string][azure-connection-string] to follow this procedure.

<NotSupportedAws />

## Create a data exporter

$CLOUD_LONG data exporters send telemetry data from a $SERVICE_LONG to third-party monitoring tools. You create an exporter on the [$PROJECT_SHORT level][projects]:

<AzureMonitorExporter />

## Manage a data exporter

This section shows you how to attach, edit, and delete a data exporter.

<ManageDataExporter />

[application-insights]: https://learn.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview
[azure-connection-string]: https://learn.microsoft.com/en-us/azure/azure-monitor/app/create-workspace-resource?tabs=cli#get-the-connection-string
[azure-monitor]: https://learn.microsoft.com/en-us/azure/azure-monitor/
[pricing-plan-features]: /about/:currentVersion:/pricing-and-account-management/#features-included-in-each-pricing-plan
[projects]: /use-timescale/:currentVersion:/security/members/