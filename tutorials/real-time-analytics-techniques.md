---
title: Real-time analytics with Timescale Cloud and Grafana
excerpt: Simulate an IOT dataset in your Timescale Cloud service
products: [cloud, mst, self_hosted]
keywords: [IoT, simulate]
---


import GrafanaConnect from "versionContent/_partials/_grafana-connect.mdx";
import ImportData from "versionContent/_partials/_import-data-nyc-taxis.mdx";

# Real-time analytics with Timescale Cloud and Grafana

A popular data visualization tool, [Grafana][grafana-docs] enables you to create customizable dashboards 
and effectively monitor your systems and applications.

![Grafana real-time analytics](https://assets.timescale.com/docs/images/rta-create-dashboard-and-panel-time-series-line-graph.webp)

Grafana is organized into:
- Dashboards: a view into the performance of a system. Each dashboard consists of one or more panels.
- Panels: represent information about a specific metric related to that system.

Grafana enables you to query, visualize, alert on, and explore your metrics, logs, and traces wherever they’re 
stored.

This page shows you how to integrate Grafana with a $SERVICE_LONG, create a dashboard and panel, then visualize taxi 
data.

## Prerequisites

import IntegrationPrereqs from "versionContent/_partials/_integration-prereqs.mdx";

<IntegrationPrereqs />

* Install and run [self-managed Grafana][grafana-self-managed], or sign up for [Grafana Cloud][grafana-cloud].

## Optimize time-series data in hypertables

<ImportData />

<GrafanaConnect />

## Create a Grafana dashboard and panel

A Grafana dashboard represents a view into the performance of a system, and each dashboard consists of one or
more panels, which represent information about a specific metric related to that system.

To create a new dashboard:

<Procedure>

1. **Create the dashboard**

    1. On the `Dashboards` page, click `New` and select `New dashboard`.

    1. Click `Add visualization`

1. **Select the data source**

   Select your $SERVICE_SHORT from the list of pre-configured data sources or configure a new one.

1. **Configure your panel**

   Select the visualization type. The type defines specific fields to configure in addition to standard ones, such as the panel name.

1. **Run your queries**

   You can edit the queries directly or use the built-in query editor. If you are visualizing time-series data, select `Time series` in the `Format` drop-down.

1. **Click `Save dashboard`**

   You now have a dashboard with one panel. Add more panels to a dashboard by clicking `Add` at the top right and selecting `Visualization` from the drop-down.

</Procedure>


[grafana-docs]: https://grafana.com/docs/
[grafana-self-managed]: https://grafana.com/get/?tab=self-managed
[grafana-cloud]: https://grafana.com/get/
