---
title: Integrate Managed Service for TimescaleDB as a data source in Grafana
excerpt: Integrate Managed Service for TimescaleDB as a data source in Grafana to visualize your data
products: [mst]
keywords: [Grafana, visualizations, analytics, integration]
---

# Integrate $MST_LONG and Grafana

You can integrate $MST_LONG with Grafana to visualize your
data. Grafana service in MST has built-in Prometheus, PostgreSQL, Jaeger, and
other data source plugins that allow you to query and visualize data from a
compatible database.

## Prerequisites

Before you begin, make sure you have:

*   Created a $MST_SERVICE_SHORT in your $MST_LONG account
*   Created a $MST_SERVICE_SHORT for Grafana

## Configure $MST_LONG as a data source

You can configure a $MST_SERVICE_LONG as a data source to a Grafana service
to query and visualize the data from the database.

<Procedure>

### Configuring $MST_LONG as a data source

1.  In [$MST_CONSOLE_SHORT][mst-login], click the
    $MST_SERVICE_SHORT that you want to add as a data source for the Grafana service.
1.  In the `Overview` tab for the $MST_SERVICE_SHORT go to the `Service Integrations`
    section.
1.  Click the `Set up integration` button.
1.  In the `Available service integrations for TimescaleDB` dialog, click
    the `Use Integration` button for `Datasource`.
1.  In the dialog that appears, choose the Grafana service in the drop-down menu,
    and click the `Enable` button.
1.  In the `Services` view, click the Grafana service to which you added the $MST_SHORT
    $MST_SERVICE_SHORT as a data source.
1.  In the `Overview` tab for the Grafana service, make a note of the `User` and
    `Password` fields.
1.  In the `Overview` tab for the Grafana service, click the link in the
   `Service URI` field to open Grafana.
1.  Log in to Grafana with your service credentials.
1.  Navigate to `Configuration` → `Data sources`. The data sources page lists
    $MST_LONG as a configured data source for the Grafana instance.

</Procedure>

When you have configured $MST_LONG as a data source in
Grafana, you can create panels that are populated with data using SQL.

[mst-login]:https://portal.managed.timescale.com/login