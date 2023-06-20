---
title: Integrate Managed Service for TimescaleDB as a data source in Grafana
excerpt: Integrate Managed Service for TimescaleDB as a data source in Grafana to visualize your data
products: [mst]
keywords: [Grafana, visualizations, analytics, integration]
---

# Integrate Managed Service for TimescaleDB and Grafana

You can integrate Managed Service for TimescaleDB with Grafana to visualize your
data. Grafana service in MST has built-in Prometheus, PostgreSQL, Jaeger, and
other data source plugins that allow you to query and visualize data from a
compatible database.

## Prerequisites

Before you begin, make sure you have:

*   Created a service in your Managed Service for TimescaleDB account
*   Created a service for Grafana

## Configure Managed Service for TimescaleDB as a data source

You can configure a TimescaleDB service as a data source to a Grafana service
to query and visualize the data from the database.

<Procedure>

### Configuring Managed Service for TimescaleDB as a data source

1.  Sign in to your Managed Service for TimescaleDB portal, and click the
    service that you want to add as a data source for the Grafana service.
1.  In the `Overview` tab for the service go to the `Service Integrations`
    section.
1.  Click the `Set up integration` button.
1.  In the `Available service integrations for TimescaleDB` dialog, click
    the `Use Integration` button for `Datasource`.
1.  In the dialog that appears, choose the Grafana service in the drop-down menu,
    and click the `Enable` button.
1.  In the `Services` view, click the Grafana service to which you added the MST
    service as a data source.
1.  In the `Overview` tab for the Grafana service, make a note of the `User` and
    `Password` fields.
1.  In the `Overview` tab for the Grafana service, click the link in the
   `Service URI` field to open Grafana.
1.  Log in to Grafana with your service credentials.
1.  Navigate to `Configuration` → `Data sources`. The data sources page lists
    Managed Service for TimescaleDB as a configured data source for the Grafana instance.

</Procedure>

When you have configured Managed Service for TimescaleDB as a data source in
Grafana, you can create panels that are populated with data using SQL.
