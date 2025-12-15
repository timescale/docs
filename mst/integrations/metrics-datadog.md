---
title: Metrics and Datadog
excerpt: Collect Datadog metrics on your Managed Service for TimescaleDB service
products: [mst]
keywords: [integration, metrics]
tags: [datadog]
---

# Metrics and Datadog

Datadog is a popular cloud-based monitoring service. You can send metrics to
Datadog using a metrics collection agent for graphing, service dashboards,
alerting, and logging. $MST_LONG ($MST_SHORT) can send data
directly to Datadog for monitoring. Datadog integrations are provided free of
charge on $MST_LONG.

You need to create a Datadog API key, and use the key to enable metrics for your
$MST_SERVICE_LONG.

<Highlight type="note">

Datadog logging is not currently supported on $MST_SHORT.

</Highlight>

## Prerequisites

Before you begin, make sure you have:

*   Created a $MST_SERVICE_LONG.
*   Signed up for [Datadog][datadog-login], and can log in to your Datadog
    dashboard.
*   Created an API key in your Datadog account. For more information
    about creating a Datadog API key, see [Datadog API and Application Keys](https://docs.datadoghq.com/account_management/api-app-keys/).

## Upload a Datadog API key

To integrate $MST_SHORT with Datadog you need to upload the
API key that you generated in your Datadog account to $MST_SHORT.

### Uploading a Datadog API key to $MST_SHORT

<Procedure>

1.  In [$MST_CONSOLE_SHORT][mst-login], choose the project you want to connect to Datadog,
    and click `Integration Endpoints`.
1.  Select `Datadog`, then choose `Create new`. 
2.  In `Add new Datadog service integration`. complete these details:
    *   In the `Endpoint integration` section, give your endpoint a name, and
        paste the API key from your Datadog dashboard. Ensure you choose the
        site location that matches where your Datadog service is hosted.
    *   _Optional_: In the `Endpoint tags` section, you can add custom tags
        to help you manage your integrations.
1.  Click `Add endpoint` to save the integration.
    <img class="main-content__illustration"
    src="https://assets.timescale.com/docs/images/mst/add-datadog-integration.png"
    alt="Add Datadog endpoint"/>

</Procedure>

## Activate Datadog integration for a $MST_SERVICE_SHORT

When you have successfully added the endpoint, you can set up one of your
$MST_SERVICE_SHORT to send data to Datadog.

<Procedure>

### Activating Datadog integration for a $MST_SERVICE_SHORT

1.  Sign in to $MST_CONSOLE_SHORT, navigate to `Services`, and select the $MST_SERVICE_SHORT you want to monitor.
1.  In the `Integrations` tab, go to `External integrations` section and select
    `Datadog Metrics`.
1.  In the `Datadog integration` dialog, select the Datadog endpoint
    that you created.
1.  Click `Enable`.

    The Datadog endpoint is listed under `Enabled integrations` for the
    $MST_SERVICE_LONG.

</Procedure>

## Datadog dashboards

When you have your Datadog integration set up successfully, you can use the
Datadog dashboard editor to configure your visualizations. For more information,
see the [Datadog Dashboard documentation][datadog-dashboard-docs].

[datadog-dashboard-docs]: https://docs.datadoghq.com/dashboards/
[datadog-login]: https://app.datadoghq.com/
[mst-login]:https://portal.managed.timescale.com/login
