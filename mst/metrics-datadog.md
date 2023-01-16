---
title: Metrics and Datadog
excerpt: Collect Datadog metrics on your Managed Service for TimescaleDB instance
product: mst
keywords: [integration, metrics]
tags: [datadog]
---

# Metrics and Datadog

Datadog is a popular cloud-based monitoring service. You can send metrics to
Datadog using a metrics collection agent for graphing, service dashboards,
alerting, and logging. Managed Service for TimescaleDB can send data
directly to Datadog for monitoring. Datadog integrations are provided free of
charge on Managed Service for TimescaleDB.

You need to create a Datadog API key, and use the key to enable metrics for your
Managed Service for TimescaleDB service.

<highlight type="note">
We do not currently support Datadog logging on Managed Service for TimescaleDB.
</highlight>

## Create and upload a Datadog API key

You can create an API key in your Datadog account, and upload it to your Managed
Service for TimescaleDB account.

<highlight type="important">
Before you begin, you need to have signed up for both Datadog and Managed
Service for TimescaleDB, and be able to log in to your Datadog and Managed
Service for TimescaleDB dashboards. You also need a running Managed Service for
TimescaleDB service.
</highlight>

<procedure>

### Creating a Datadog API key

1.  Log in to your [Datadog dashboard][datadog-login] and navigate to
    `Integrations → APIs`. Click `API Keys`.
1.  In the `New API key` field, type a name for your new key. For example,
    `TimescaleDB`. Click `Create API Key`.
    <img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/datadog-createapi.png" alt="Create a new Datadog API key"/>
1.  Hover your mouse over the purple bar in the `Key` field to see the key, and
    copy it to use later.

</procedure>

<procedure>

### Uploading a Datadog API key to MST

1.  [Log in to your Managed Service for TimescaleDB][mst-login]. By default, you start in the
    `Services` view, showing any services you currently have in your project.
1.  Check that you are in the project that you want to connect to Datadog,
    and click `Service Integrations`.
1.  In the `Datadog` section, click `Add endpoint`, and complete these details:
    *   In the `Endpoint integration` section, give your endpoint a name, and
        paste the API key from your Datadog dashboard. Ensure you choose the
        site location that matches where your Datadog service is hosted.
    *   _Optional_: In the `Endpoint tags` section, you can add custom tags
        to help you manage your integrations.
1.  Click `Add endpoint` to save the integration.
    <img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/add-datadog-integration.png" alt="Add Datadog endpoint"/>

</procedure>

## Activate Datadog integration for a service

When you have successfully added the endpoint, you can set up one of your services to send data to Datadog.

<procedure>

### Activating Datadog integration for a service

1.  In the Managed Service for TimescaleDB `Services` view, click the name of the service that you want to
    connect to Datadog.
1.  In the `Service integrations` section, click `Manage integrations`. Locate
    the Datadog integration, and click `Use integration`.
1.  In the `Datadog integration` dialog, select the Datadog endpoint you created
    earlier, and click `Enable`. If the connection is successful, the Datadog
    integration shows with a green `active` symbol.  
    <img class="main-content__illustration" src="https://s3.amazonaws.com/assets.timescale.com/docs/images/active-datadog-integration.png" alt="Successful Datadog integration"/>

</procedure>

## Datadog dashboards

When you have your Datadog integration set up successfully, you can use the
Datadog dashboard editor to configure your visualizations. See the
[Datadog Dashboard documentation][datadog-dashboard-docs] for more information.

[datadog-login]: https://app.datadoghq.com/
[mst-login]: https://portal.managed.timescale.com
[datadog-dashboard-docs]: https://docs.datadoghq.com/dashboards/
