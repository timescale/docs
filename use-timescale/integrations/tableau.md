---
title: Using Tableau to visualize data in TimescaleDB
excerpt: Use Tableau to plot and visualize your data
products: [cloud, mst, self_hosted]
keywords: [visualizations, analytics, Tableau]
---

import IntegrationPrereqs from "versionContent/_partials/_integration-prereqs.mdx";
import ConnectionString from "versionContent/_partials/_connection-string.mdx";

# Integrate Tableau and $CLOUD_LONG

Tableau is a popular analytics platform that helps you gain greater intelligence about your business. You can use it to visualize
data stored in $CLOUD_LONG. 

## Prerequisites

<IntegrationPrereqs />

* Install [Tableau Server][tableau-server] or sign up for [Tableau Cloud][tableau-cloud].

## Add your $SERVICE_LONG as a virtual connection

To connect the data in your $SERVICE_LONG to Tableau:

<Procedure>

1.  **Log in to Tableau**
1.  **In the Tableau dashboard, click the `New` > `Virtual Connection`**
1.  **In the `New Virtual Connection` page, search for and select `PostgreSQL`**
1.  **Configure the connection**

    - `Server`: the host of your $SERVICE_LONG.
    - `Port`: the port of your $SERVICE_SHORT.
    - `Database`: `tsdb`.
    - `Username`: `tsdbadmin` or another privileged user.
    - `Password`: the password for `Username`.
    - `Require SSL`: tick the checkbox.
    
   <ConnectionString />

1.  Click `Sign In` to connect to your $SERVICE_SHORT.

    Your $SERVICE_SHORT is now added as a virtual connection. 

</Procedure>

[tableau-cloud]: https://www.tableau.com/products/trial
[tableau-server]: https://www.tableau.com/support/releases/server/2024.2.6#esdalt
[cloud-login]: https://console.cloud.timescale.com/
