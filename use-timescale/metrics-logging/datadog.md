---
title: Export metrics to Datadog
excerpt: Datadog is a cloud-based monitoring, observability, and security platform. Create an exporter in Tiger Cloud and export telemetry metrics of your service
products: [cloud]
price_plans: [scale, enterprise]
keywords: [integration, metrics, datadog, alerting]
tags: [telemetry, monitor]
---

import DataDogExporter from "versionContent/_partials/_datadog-data-exporter.mdx";
import PrereqsCloud from "versionContent/_partials/_prereqs-cloud-no-connection.mdx";
import ManageDataExporter from "versionContent/_partials/_manage-a-data-exporter.mdx";

# Export telemetry data to Datadog

You can export telemetry data from your $SERVICE_LONGs with the time-series and analytics capability enabled to [Datadog][datadog]. The available metrics include CPU usage, RAM usage, and storage. This integration is available for [$SCALE or $ENTERPRISE][pricing-plan-features] $PRICING_PLANs.

This page shows you how to create a Datadog exporter in $CONSOLE, and manage the lifecycle of data exporters.

## Prerequisites

<PrereqsCloud />

## Create a data exporter

$CLOUD_LONG data exporters send telemetry data from a $SERVICE_LONG to third-party monitoring
tools. You create an exporter on the [$PROJECT_SHORT level][projects], in the same AWS region as your $SERVICE_SHORT:

<DataDogExporter />

## Manage a data exporter

This section shows you how to attach, monitor, edit, and delete a data exporter.

<ManageDataExporter />

[datadog]: https://www.datadoghq.com
[datadog-api-key]: https://docs.datadoghq.com/account_management/api-app-keys/#add-an-api-key-or-client-token
[datadog-docs]: https://docs.datadoghq.com/
[datadog-metrics-explorer]: https://app.datadoghq.com/metric/explorer
[console-integrations]: https://console.cloud.timescale.com/dashboard/integrations
[console-services]: https://console.cloud.timescale.com/dashboard/services
[services-portal]: https://console.cloud.timescale.com/dashboard/services
[pricing-plan-features]: /about/:currentVersion:/pricing-and-account-management/#features-included-in-each-pricing-plan
[projects]: /use-timescale/:currentVersion:/security/members/
