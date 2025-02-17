---
title: Using Tableau to visualize data in TimescaleDB
excerpt: Use Tableau to plot and visualize your data
products: [cloud, mst, self_hosted]
keywords: [visualizations, analytics, Tableau]
---

import IntegrationPrereqs from "versionContent/_partials/_integration-prereqs.mdx";

# Integrate Tableau and $CLOUD_LONG

[Tableau][tableau] is a popular analytics platform that helps you gain greater intelligence about your business. You can use it to visualize
data stored in $CLOUD_LONG.

## Prerequisites

<IntegrationPrereqs />

* Install [Tableau Server][tableau-server] or sign up for [Tableau Cloud][tableau-cloud].

## Add your $SERVICE_LONG as a virtual connection

To connect the data in your $SERVICE_LONG to Tableau:

<Procedure>

1.  **Log in to Tableau**
    - Tableau Cloud: [sign in][tableau-login], then click `Explore` and select a project. 
    - Tableau Desktop: sign in, then open a workbook.

1.  **Configure Tableau to connect to your $SERVICE_LONG** 
    1. Add a new data source: 
       - Tableau Cloud: click `New` > `Virtual Connection`.
       - Tableau Desktop: click `Data` > `New Data Source`.
    1. Search for and select `PostgreSQL`.
    
       For Tableau Desktop download the driver and restart Tableau.
    1. Configure the connection:
        - `Server`, `Port`, `Database`, `Username`, `Password`: configure using your [connection details][connection-info].
        - `Require SSL`: tick the checkbox.
    
1.  **Click `Sign In` and connect Tableau to your $SERVICE_SHORT**

</Procedure>

You have successfully integrated Tableau with $CLOUD_LONG.

[tableau-cloud]: https://www.tableau.com/products/trial
[tableau-server]: https://www.tableau.com/support/releases/server/2024.2.6#esdalt
[tableau-login]: http://online.tableau.com/
[cloud-login]: https://console.cloud.timescale.com/
[connection-info]: /use-timescale/:currentVersion:/integrations/find-connection-details/
[tableau]: https://www.tableau.com/
