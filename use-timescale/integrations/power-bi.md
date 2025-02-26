---
title: Integrate Power BI with Timescale Cloud
excerpt: Integrate Timescale Cloud with Power BI for advanced data visualization.
products: [cloud, mst, self_hosted]
keywords: [Power BI, visualizations, analysis, real-time]
---

import IntegrationPrereqs from "versionContent/_partials/_integration-prereqs.mdx";

# Integrate Power BI with $CLOUD_LONG

[Power BI][power-bi] is a collection of software services, apps, and connectors that work together to turn your 
unrelated sources of data into coherent, visually immersive, and interactive insights.

This page explains how to integrate Power BI with your $SERVICE_LONG, enabling you to build interactive dashboards and reports.

## Prerequisites

Note: The Timescale data source for Power BI is currently available only for the desktop application, 
which is supported exclusively on Windows.

<IntegrationPrereqs />

- Install [TimescaleDB on Windows][timescale-on-windows]
- Download [Power BI desktop][power-bi-install] application
- Install [PostgreSQL ODBC Driver][postgresql-odbc-driver]

## Ingest data from your $SERVICE_LONG into Power BI

To import data into Power BI from $CLOUD_LONG for data visualization:

<Procedure>

1. **Add the $COMPANY data source to the ODBC driver**
   1. In Windows search, search for `ODBC Data Sources` and launch it.
   1. Under `User DSN`, click on `Add`.
   1. Choose `PostgreSQL Unicode` and `Finish`. Use your [connection details][connection-info] to configure the DSN.
   1. Click on `Test` to ensure the connection works, then `Save`.

1. **Establish the connection and import data into Power BI**
   1. Launch Power BI desktop app and on `Home`, click on `Get data from other sources`.
   1. Search for and select `ODBC`, then click `Connect`.
   1. In the `Data source name (DSN)`, select the Timescale data source created by you in the previous step, and click on `OK`.
   1. Enter your Timescale database `User Name` and `Password` and click on `Connect`.
   1. After connecting, a Navigator window displays the available schemas and tables. Select the desired tables and click `Load` to import the data into Power BI.

</Procedure>

## Test the integration with $CLOUD_LONG

Test that the data imported from $CLOUD_LONG is available in Power BI and can be used to create reports and visualizations:

<Procedure>

   1. Create a simple report in Power BI.
   1. Drag fields from the imported table onto the `Report View` canvas.
   1. Apply filters or use visualization options such as `Bar Chart`, `Pie Chart`, or `Line Chart`.
   1. Verify real-time data: If using `DirectQuery`, update data in your $SERVICE_LONG, click `Refresh` in Power BI, and see the changes in your report.

</Procedure>

You have successfully integrated Power BI with $CLOUD_LONG.

[timescale-on-windows]: https://docs.timescale.com/self-hosted/latest/install/installation-windows/
[connection-info]: /use-timescale/:currentVersion:/integrations/find-connection-details/
[power-bi]: https://powerbi.microsoft.com/
[power-bi-install]: https://www.microsoft.com/en-us/power-platform/products/power-bi/downloads
[postgresql-odbc-driver]: https://www.postgresql.org/ftp/odbc/releases/