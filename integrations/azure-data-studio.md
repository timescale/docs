---
title: Integrate Azure Data Studio with Timescale Cloud
excerpt: Azure Data Studio is an open-source, cross-platform hybrid data analytics tool designed to simplify the data landscape. Integrate Azure Data Studio with Timescale Cloud
products: [cloud, self_hosted]
keywords: [integrate]
---

import IntegrationPrereqs from "versionContent/_partials/_integration-prereqs.mdx";

# Integrate Azure Data Studio with $CLOUD_LONG 

[Azure Data Studio][azure-data-studio] is an open-source, cross-platform hybrid data analytics tool designed to simplify the data landscape.

This page explains how to integrate Azure Data Studio with $CLOUD_LONG.

## Prerequisites

<IntegrationPrereqs />

*   Download and install [Azure Data Studio][ms-azure-data-studio].
*   Install the [PostgreSQL extension for Azure Data Studio][postgresql-azure-data-studio].

## Connect to your $SERVICE_LONG with Azure Data Studio

To connect to $CLOUD_LONG:

<Procedure>

1. **Start `Azure Data Studio`**
1. **In the `SERVERS` page, click `New Connection`**
1. **Configure the connection**
   1. Select `PostgreSQL` for `Connection type`.
   1. Configure the server name, database, username, port, and password using your [connection details][connection-info].
   1. Click `Advanced`.
   
      If you configured your $SERVICE_LONG to connect using [stricter SSL mode][ssl-mode], set `SSL mode` to the
      configured mode, then type the location of your SSL root CA certificate in `SSL root certificate filename`.
   
   1. In the `Port` field, type the port number and click `OK`.

1. **Click `Connect`**

</Procedure>



You have successfully integrated Azure Data Studio with $CLOUD_LONG.

[ms-azure-data-studio]: https://learn.microsoft.com/en-us/azure-data-studio/download-azure-data-studio?view=sql-server-ver16#install-azure-data-studio
[postgresql-azure-data-studio]: https://learn.microsoft.com/en-us/azure-data-studio/extensions/postgres-extension?view=sql-server-ver16
[connection-info]: /integrations/:currentVersion:/find-connection-details/
[azure-data-studio]: https://azure.microsoft.com/en-us/products/data-studio
[ssl-mode]: /use-timescale/:currentVersion:/security/strict-ssl/
[connection-info]: /integrations/:currentVersion:/find-connection-details/

