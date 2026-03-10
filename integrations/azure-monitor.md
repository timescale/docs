---
title: Integrate Azure Monitor with Tiger Cloud
excerpt: Azure Monitor is a comprehensive monitoring and observability service. Export telemetry data from your Tiger Cloud service with time-series and analytics capability to Azure Monitor
products: [cloud]
price_plans: [scale, enterprise]
keywords: [integrate]
---

import IntegrationPrereqsCloud from "versionContent/_partials/_integration-prereqs-cloud-only.mdx";
import AzureMonitorExporter from "versionContent/_partials/_azure-monitor-data-exporter.mdx";
import ManageDataExporter from "versionContent/_partials/_manage-a-data-exporter.mdx";
import NotSupportedAws from "versionContent/_partials/_not-supported-for-aws.mdx";

# Integrate Azure Monitor with $CLOUD_LONG

[Azure Monitor][azure-monitor] is a comprehensive monitoring and observability service designed to help you maximize the availability and performance of your applications and services. It collects, analyzes, and acts on telemetry data from your cloud and on-premises environments.

You can export telemetry data from your $SERVICE_LONGs with the time-series and analytics capability enabled to Azure Monitor. This integration is available for [Scale and Enterprise][pricing-plan-features] pricing tiers.

This page explains how to export telemetry data from your $SERVICE_LONG into Azure Monitor by creating a $CLOUD_LONG data exporter, then attaching it to the $SERVICE_SHORT.

## Prerequisites

<IntegrationPrereqsCloud />

- Get an Azure subscription with access to [Azure Monitor][azure-monitor] and [Application Insights][application-insights].

  You need your [Azure Monitor Application Insights connection string][azure-connection-string] to follow this procedure.

<NotSupportedAws />

## Create a data exporter

A $CLOUD_LONG data exporter sends telemetry data from a $SERVICE_LONG to third-party monitoring tools. You create an exporter on the [project level][projects]:

<AzureMonitorExporter />

## Manage a data exporter

This section shows you how to attach, edit, and delete a data exporter.

<ManageDataExporter />

[application-insights]: https://learn.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview
[azure-connection-string]: https://learn.microsoft.com/en-us/azure/azure-monitor/app/sdk-connection-string
[azure-monitor]: https://learn.microsoft.com/en-us/azure/azure-monitor/
[pricing-plan-features]: /about/:currentVersion:/pricing-and-account-management/#features-included-in-each-pricing-plan
[projects]: /use-timescale/:currentVersion:/security/members/