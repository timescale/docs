---
title: Integrate Datadog with Timescale Cloud
excerpt: Export telemetry data from your Timescale Cloud service with time-series and analytics capability to Datadog
products: [cloud, mst, self_hosted]
keywords: [integrate]
---

import IntegrationPrereqs from "versionContent/_partials/_integration-prereqs.md";
import DataDogExporter from "versionContent/_partials/_datadog-data-exporter.md";
import ManageDataExporter from "versionContent/_partials/_manage-data-exporter.md";

# Integrate Datadog with $CLOUD_LONG

[Datadog][datadog] is a cloud-based monitoring and analytics platform that provides comprehensive visibility into applications, infrastructure, and systems through real-time monitoring, logging, and analytics.

This pages explains how to export telemetry data from your $SERVICE_LONG into Datadog using a $CLOUD_LONG data exporter. 

## Prerequisites

<IntegrationPrereqs />

## Create a data exporter

A $CLOUD_LONG data exporter sends telemetry data from a $SERVICE_LONG to a third-party monitoring
tool. You attach each $SERVICE_SHORT to a single data exporter. Create a data exporter for each AWS region where you have $SERVICE_SHORTs running.

<DataDogExporter />

<ManageDataExporter />


[datadog]: https://www.datadoghq.com/

