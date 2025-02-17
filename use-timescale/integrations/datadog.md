---
title: Integrate Datadog with Timescale Cloud
excerpt: Export telemetry data from your Timescale Cloud service with time-series and analytics capability to Datadog
products: [cloud, mst, self_hosted]
keywords: [integrate]
---

import IntegrationPrereqsCloud from "versionContent/_partials/_integration-prereqs-cloud-only.mdx";
import DataDogExporter from "versionContent/_partials/_datadog-data-exporter.mdx";
import ManageDataExporter from "versionContent/_partials/_manage-data-exporter.mdx";

# Integrate Datadog with $CLOUD_LONG

[Datadog][datadog] is a cloud-based monitoring and analytics platform that provides comprehensive visibility into applications, infrastructure, and systems through real-time monitoring, logging, and analytics.

You can export telemetry data from your $SERVICE_LONGs with the time-series and analytics capability enabled to Datadog. The available metrics include CPU usage, RAM usage, and storage. This integration is available for [Scale and Enterprise][pricing-plan-features]
pricing tiers.

This pages explains how to export telemetry data from your $SERVICE_LONG into Datadog by creating a $CLOUD_LONG data exporter, then attaching it to the $SERVICE_SHORT. 

## Prerequisites

<IntegrationPrereqsCloud />

- Sign up for [Datadog][datadog-signup].

  You need your API key to follow this procedure. [Create one][datadog-api-key] if you haven't yet. 

## Create a data exporter

A $CLOUD_LONG data exporter sends telemetry data from a $SERVICE_LONG to a third-party monitoring
tool. You create an exporter on the [project level][projects], in the same AWS region as your $SERVICE_SHORT: 

<DataDogExporter />

<ManageDataExporter />

[datadog]: https://www.datadoghq.com/
[datadog-signup]: https://www.datadoghq.com/
[projects]: /use-timescale/:currentVersion:/members/
[datadog-api-key]: https://docs.datadoghq.com/account_management/api-app-keys/#add-an-api-key-or-client-token
[pricing-plan-features]: /about/:currentVersion:/pricing-and-account-management/#features-included-in-each-plan