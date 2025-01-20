---
title: Integrate Power BI with Timescale Cloud
excerpt: Integrate Timescale Cloud with Power BI for advanced data visualization.
products: [cloud, mst, self_hosted]
keywords: [Power BI]
---

import IntegrationPrereqs from "versionContent/_partials/_integration-prereqs.mdx";

# Integrate Power BI with $CLOUD_LONG

[Power BI][power-bi] is a powerful business analytics tool for visualizing and sharing data insights. 

This page explains how to integrate Power BI with your $SERVICE_LONG, enabling you to build interactive dashboards and reports.

## Prerequisites

<IntegrationPrereqs />

- Install Power BI Desktop (Windows) or access [Power BI Service](https://powerbi.microsoft.com/).

## Connect Power BI to your $SERVICE_LONG

To connect Power BI to $CLOUD_LONG:

<Procedure>

1. **Log in to Power BI**
1. **Configure the connection**

    1. On to the `Home` tab click `Get Data`.
    1. In `Get Data`, search for and select `PostgreSQL database`.
    1. Click `Connect`.
    1. Configure the `Server` and `Database` fields using your [connection details][connection-info].
    1. Check `DirectQuery` if you want real-time data queries. Click `OK`.
    1. When prompted, select `Database` authentication.
    1. Configure the username and password fields using your [connection details][connection-info].
    1. Click `Connect`.

After connecting, a Navigator window displays the available schemas and tables. Select the desired tables and click `Load` to import the data into Power BI.

</Procedure>

## Test the integration with $CLOUD_LONG

To test the integration:

<Procedure>

1. Create a simple report in Power BI:
   1. Drag fields from the imported table onto the `Report View` canvas.
   1. Apply filters or use visualization options such as `Bar Chart`, `Pie Chart`, or `Line Chart`.

1. Verify real-time data:
    - If using `DirectQuery`, update data in your $SERVICE_LONG, click `Refresh` in Power BI, and and see the changes in your report. 

</Procedure>

You have successfully integrated Power BI with $CLOUD_LONG. 

[connection-info]: /use-timescale/:currentVersion:/integrations/find-connection-details/
[power-bi]: https://powerbi.microsoft.com/
