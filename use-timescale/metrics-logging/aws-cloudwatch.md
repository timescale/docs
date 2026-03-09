---
title: Export metrics to Amazon Cloudwatch
excerpt: Amazon Cloudwatch is a monitoring and observability service. Create an exporter in Tiger Cloud and export telemetry metrics of your service
products: [cloud]
price_plans: [scale, enterprise]
keywords: [integration, metrics, Cloudwatch, alerting]
tags: [telemetry, monitor]
---

import ManageDataExporter from "versionContent/_partials/_manage-a-data-exporter.mdx";
import PrereqsCloud from "versionContent/_partials/_prereqs-cloud-no-connection.mdx";
import CloudWatchExporter from "versionContent/_partials/_cloudwatch-data-exporter.mdx";
import NotSupportedAzure from "versionContent/_partials/_not-supported-for-azure.mdx";
import ExporterRegion from "versionContent/_partials/_iam-oidc-exporter-region.mdx";

# Export telemetry data to AWS Cloudwatch

You can export telemetry data from your $SERVICE_LONGs with the time-series and analytics capability enabled to [Amazon CloudWatch][cloudwatch]. Available metrics include CPU usage, RAM usage, and storage. This integration is available for [$SCALE or $ENTERPRISE][pricing-plan-features]
$PRICING_PLANs.

This page shows you how to create an Amazon CloudWatch exporter in $CONSOLE, and manage the lifecycle of data exporters.

## Prerequisites

<PrereqsCloud />

<NotSupportedAzure />

## Create a data exporter

$CLOUD_LONG data exporters send telemetry data from a $SERVICE_LONG to a third-party monitoring
tools. You create an exporter on the [$PROJECT_SHORT level][projects], in the same AWS region as your $SERVICE_SHORT:

<CloudWatchExporter />

## Manage a data exporter

This section shows you how to attach, edit, and delete a data exporter.

<ManageDataExporter />

## Reference

<ExporterRegion />

[cloudwatch]: https://aws.amazon.com/cloudwatch/
[pricing-plan-features]: /about/:currentVersion:/pricing-and-account-management/#features-included-in-each-pricing-plan
[projects]: /use-timescale/:currentVersion:/security/members/
