---
title: Integrate Power BI with Timescale Cloud
excerpt: Integrate Timescale Cloud with Power BI for advanced data visualization.
products: [cloud, mst, self_hosted]
keywords: [Power BI, visualizations, analysis, real-time]
---

import IntegrationPrereqs from "versionContent/_partials/_integration-prereqs.mdx";

# Integrate Power BI with $CLOUD_LONG

[Power BI][power-bi] is a business analytics tool for visualizing data, creating interactive reports, and sharing insights across an organization.

This page explains how to integrate Power BI with $CLOUD_LONG using PostgreSQL ODBC Driver, so that you can build interactive reports based on the data in your $SERVICE_LONG. 

## Prerequisites

<IntegrationPrereqs />

- Download [Power BI Desktop][power-bi-install].
- Install [PostgreSQL ODBC Driver][postgresql-odbc-driver].

## Add a data source to PostgreSQL ODBC Driver

Add a $CLOUD_LONG data source to the ODBC driver:

<Procedure>

1. **Launch ODBC Data Sources**
1. **Under `User DSN`, click `Add`**
1. **Choose `PostgreSQL Unicode` and click `Finish`**
1. **Use your [connection details][connection-info] to configure the data source**
1. **Click `Test` to ensure the connection works**
1. **If the connection is successful, click `Save`**

</Procedure>

## Connect your $SERVICE_LONG with Power BI

Establish a connection and import data into Power BI:

<Procedure>

1. **Open Power BI and click `Get data from other sources`**
1. **Search for and select `ODBC`, then click `Connect`**
1. **In the `Data source name (DSN)`, select the $CLOUD_LONG data source and click `OK`**
1. **Use your [connection details][connection-info] to enter your `User Name` and `Password`, then click `Connect`**

    After connecting, `Navigator` displays the available tables and schemas. 

1. **Select the tables and click `Load` to import your data into Power BI**

    The `Data` pane on the right is showing your imported tables. You can now select or drag fields from the tables onto the canvas to vizualize data and build reports. 

</Procedure>

You have successfully integrated Power BI with $CLOUD_LONG.

[timescale-on-windows]: https://docs.timescale.com/self-hosted/latest/install/installation-windows/
[connection-info]: /use-timescale/:currentVersion:/integrations/find-connection-details/
[power-bi]: https://powerbi.microsoft.com/
[power-bi-install]: https://www.microsoft.com/en-us/power-platform/products/power-bi/downloads
[postgresql-odbc-driver]: https://www.postgresql.org/ftp/odbc/releases/