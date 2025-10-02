---
title: Integrate Amazon CloudWatch with Tiger Cloud
excerpt: Amazon CloudWatch is a monitoring and observability service. Export telemetry data from your Tiger Cloud service with time-series and analytics capability to Amazon CloudWatch
products: [cloud]
price_plans: [scale, enterprise]
keywords: [integrate]
---

import NotSupportedAzure from "versionContent/_partials/_not-supported-for-azure.mdx";
import IntegrationPrereqsCloud from "versionContent/_partials/_integration-prereqs-cloud-only.mdx";
import CloudWatchExporter from "versionContent/_partials/_cloudwatch-data-exporter.mdx";
import ManageDataExporter from "versionContent/_partials/_manage-a-data-exporter.mdx";

# Integrate Amazon CloudWatch with $CLOUD_LONG


<Tabs label="Tiger Cloud on AWS and Azure" persistKey="tiger-platform-clouds">

<Tab title="Tiger Cloud on AWS" label="aws-cloud">

[Amazon CloudWatch][cloudwatch] is a monitoring and observability service designed to help collect, analyze, and act on data from applications, infrastructure, and services running in AWS and on-premises environments.

You can export telemetry data from your $SERVICE_LONGs with the time-series and analytics capability enabled to CloudWatch. The available metrics include CPU usage, RAM usage, and storage. This integration is available for [Scale and Enterprise][pricing-plan-features] pricing tiers.

This pages explains how to export telemetry data from your $SERVICE_LONG into CloudWatch by creating a $CLOUD_LONG data exporter, then attaching it to the $SERVICE_SHORT.

## Prerequisites

<IntegrationPrereqsCloud />

- Sign up for [Amazon CloudWatch][cloudwatch-signup].

## Create a data exporter

A $CLOUD_LONG data exporter sends telemetry data from a $SERVICE_LONG to a third-party monitoring
tool. You create an exporter on the [project level][projects], in the same AWS region as your $SERVICE_SHORT:

<CloudWatchExporter />

<ManageDataExporter />

</Tab>

<Tab title="Tiger Cloud on Azure" label="azure-cloud">

<NotSupportedAzure />

</Tab>

</Tabs>

[projects]: /use-timescale/:currentVersion:/security/members/
[pricing-plan-features]: /about/:currentVersion:/pricing-and-account-management/#features-included-in-each-plan
[cloudwatch]: https://aws.amazon.com/cloudwatch/
[cloudwatch-signup]: https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/GettingSetup.html

