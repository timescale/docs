---
title: Integrate Power BI with Timescale Cloud
excerpt: Integrate Timescale Cloud with Power BI for advanced data visualization.
products: [cloud, self_hosted]
keywords: [Power BI, visualizations, analysis, real-time]
---

import IntegrationPrereqs from "versionContent/_partials/_integration-prereqs.mdx";

# Integrate Power BI with $CLOUD_LONG

[Power BI][power-bi] is a business analytics tool for visualizing data, creating interactive reports, and sharing insights across an organization.

This page explains how to integrate Power BI with $CLOUD_LONG using the PostgreSQL ODBC driver, so that you can build interactive reports based on the data in your $SERVICE_LONG. 

## Prerequisites

<IntegrationPrereqs />

- Download [Power BI Desktop][power-bi-install] on your Microsoft Windows machine.
- Install the [PostgreSQL ODBC driver][postgresql-odbc-driver].

## Add your $SERVICE_LONG as an ODBC data source

Use the PostgreSQL ODBC driver to connect Power BI to $CLOUD_LONG.

<Procedure>

1. **Open the ODBC data sources**

   On your Windows machine, search for and select `ODBC Data Sources`.

1. **Connect to your $SERVICE_LONG**

   1. Under `User DSN`, click `Add`.
   1. Choose `PostgreSQL Unicode` and click `Finish`.
   1. Use your [connection details][connection-info] to configure the data source.
   1. Click `Test` to ensure the connection works, then click `Save`.

</Procedure>

## Import the data from your your $SERVICE_LONG into Power BI  

Establish a connection and import data from your $SERVICE_LONG into Power BI:

<Procedure>

1. **Connect Power BI to your $SERVICE_LONG**

   1. Open Power BI, then click `Get data from other sources`.
   1. Search for and select `ODBC`, then click `Connect`.
   1. In `Data source name (DSN)`, select the $CLOUD_LONG data source and click `OK`.
   1. Use your [connection details][connection-info] to enter your `User Name` and `Password`, then click `Connect`.

   After connecting, `Navigator` displays the available tables and schemas. 

1. **Import your data into Power BI**

   1. Select the tables to import and click `Load`.  

      The `Data` pane shows your imported tables.
   
   1. To visualize your data and build reports, drag fields from the tables onto the canvas. 

</Procedure>

You have successfully integrated Power BI with $CLOUD_LONG.

[timescale-on-windows]: https://docs.tigerdata.com/self-hosted/latest/install/installation-windows/
[connection-info]: /integrations/:currentVersion:/find-connection-details/
[power-bi]: https://powerbi.microsoft.com/
[power-bi-install]: https://www.microsoft.com/en-us/power-platform/products/power-bi/downloads
[postgresql-odbc-driver]: https://www.postgresql.org/ftp/odbc/releases/
