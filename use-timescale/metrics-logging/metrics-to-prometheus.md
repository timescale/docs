---
title: Export metrics to Prometheus
excerpt: Prometheus is an open-source monitoring system. Learn to integrate Prometheus with Tiger Cloud and export telemetry metrics of your service
products: [cloud, self_hosted]
price_plans: [scale, enterprise]
keywords: [integration, metrics, Prometheus, alerting]
tags: [telemetry, monitor]
cloud_ui:
    path:
        - [integrations]
        - [services, :serviceId, operations, integrations]
---

import PrometheusIntegrate from "versionContent/_partials/_prometheus-integrate.mdx";
import NotSupportedAzure from "versionContent/_partials/_not-supported-for-azure.mdx";

# Export metrics to Prometheus

<Tabs label="Tiger Cloud on AWS and Azure" persistKey="tiger-platform-clouds">

<Tab title="Tiger Cloud on AWS" label="aws-cloud">

<PrometheusIntegrate />

</Tab>

<Tab title="Tiger Cloud on Azure" label="azure-cloud">

<NotSupportedAzure />

</Tab>

</Tabs>
