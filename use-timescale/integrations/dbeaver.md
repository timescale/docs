---
title: DBeaver
excerpt: Connect to your Timescale database with DBeaver
products: [cloud, mst, self_hosted]
keywords: [connect]
---

import IntegrationPrereqs from "versionContent/_partials/_integration-prereqs.mdx";

# Integrate DBeaver with $CLOUD_LONG

[DBeaver][dbeaver] is a free cross-platform database tool for developers, database administrators, analysts, and everyone working with data. DBeaver provides an SQL editor, administration features, data and schema migration, and the ability to monitor database connection sessions. 

This page explains how to integrate DBeaver with your $SERVICE_LONG.

## Prerequisites

<IntegrationPrereqs />

* Download and install [DBeaver][dbeaver-downloads].

## Connect DBeaver to your $SERVICE_LONG

To connect to $CLOUD_LONG:

<Procedure>

1.  **Start `DBeaver`**
1.  **In the `Database` menu, click `New Database Connection`**
1.  **In the `Connect to a database` window, search for `TimescaleDB`**
1.  **Select `TimescaleDB` and click `Next` to continue**
1.  **Configure the connection** 
     1. Use your [connection details][connection-info] to configure the connection.
     1. If you configured your $SERVICE_SHORT to connect using a [stricter SSL mode][ssl-mode], then in the `SSL` tab check `Use SSL`, set `SSL mode` to the configured mode, and in the `CA Certificate` field type the location of the SSL root CA certificate to use.
1.  **Click `Test Connection`**
1.  **Click `Finish` to connect to the database server**

    The server is listed in the `Database Navigator` pane.

</Procedure>

You have successfully integrated DBeaver with $CLOUD_LONG. 

[dbeaver]: https://dbeaver.io/
[dbeaver-downloads]: https://dbeaver.io/download/
[connection-info]: /use-timescale/:currentVersion:/integrations/find-connection-details/
[ssl-mode]: /use-timescale/:currentVersion:/security/strict-ssl/