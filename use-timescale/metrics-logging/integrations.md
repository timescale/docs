---
title: Integrate Timescale services with third-party monitoring
excerpt: Export telemetry metrics to Datadog or Amazon CloudWatch
products: [cloud]
keywords: [integration, metrics, Datadog, Amazon CloudWatch]
tags: [telemetry, monitor]
cloud_ui:
    path:
        - [integrations]
        - [services, :serviceId, operations, integrations]
---

import DataDogExporter from "versionContent/_partials/_datadog-data-exporter.mdx";
import ManageDataExporter from "versionContent/_partials/_manage-data-exporter.mdx";
import IntegrationPrereqsCloud from "versionContent/_partials/_integration-prereqs-cloud-only.mdx";
import CloudWatchExporter from "versionContent/_partials/_cloudwatch-data-exporter.mdx";

# Integrate Timescale Cloud Services with third-party monitoring tools

You can export telemetry data from your $SERVICE_LONGs with the time-series and analytics capability enabled to third-party
monitoring tools such as [Datadog][datadog] or [Amazon CloudWatch][cloudwatch]. Available metrics include
CPU usage, RAM usage, and storage. Third-party monitoring is available for [Scale or Enterprise][pricing-plan-features]
pricing tiers.

This page shows you how to securely connect a data exporter to a monitoring tool, and manage
the lifecycle of data exporters.

## Prerequisites

<IntegrationPrereqsCloud />

## Create a data exporter

A $CLOUD_LONG data exporter sends telemetry data from a $SERVICE_LONG to a third-party monitoring
tool. You create an exporter on the [project level][projects], in the same AWS region as your $SERVICE_SHORT:

<Tabs label="Create a data exporter">

<Tab title="Datadog">

<DataDogExporter />

</Tab>

<Tab title="Amazon CloudWatch">

<CloudWatchExporter />

</Tab>

</Tabs>

<ManageDataExporter />

[attach-exporter]: /use-timescale/:currentVersion:/metrics-logging/integrations/#attach-a-data-exporter-to-a-timescale-cloud-service
[cloudwatch]: https://aws.amazon.com/cloudwatch/
[cloudwatch-docs]: https://docs.aws.amazon.com/cloudwatch/index.html
[create-exporter]: /use-timescale/:currentVersion:/metrics-logging/integrations/#create-a-data-exporter
[datadog]: https://www.datadoghq.com
[datadog-api-key]: https://docs.datadoghq.com/account_management/api-app-keys/#add-an-api-key-or-client-token
[datadog-docs]: https://docs.datadoghq.com/
[datadog-metrics-explorer]: https://app.datadoghq.com/metric/explorer
[console-integrations]: https://console.cloud.timescale.com/dashboard/integrations
[console-services]: https://console.cloud.timescale.com/dashboard/services
[reference]: /use-timescale/:currentVersion:/metrics-logging/integrations/#reference
[services-portal]: https://console.cloud.timescale.com/dashboard/services
[pricing-plan-features]: /about/:currentVersion:/pricing-and-account-management/#features-included-in-each-plan
[projects]: /use-timescale/:currentVersion:/members/
