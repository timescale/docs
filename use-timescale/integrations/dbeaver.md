---
title: Integrate DBeaver with Timescale Cloud
excerpt: Connect to your Timescale Cloud service with DBeaver
products: [cloud, mst, self_hosted]
keywords: [integrate]
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
1.  **In the toolbar, click the plug+ icon**
1.  **In `Connect to a database` search for `TimescaleDB`**
1.  **Select `TimescaleDB`, then click `Next`**
1.  **Configure the connection** 

    Use your [connection details][connection-info] to add your connection settings.
    ![DBeaver integration](https://assets.timescale.com/docs/images/integrations-dbeaver.png)
    
    If you configured your $SERVICE_SHORT to connect using a [stricter SSL mode][ssl-mode], in the `SSL` tab check 
    `Use SSL` and set `SSL mode` to the configured mode. Then, in the `CA Certificate` field type the location of the SSL 
    root CA certificate.

1.  **Click `Test Connection`. When the connection is successful, click `Finish`**

    Your connection is listed in the `Database Navigator`.

</Procedure>

You have successfully integrated DBeaver with $CLOUD_LONG. 

[dbeaver]: https://dbeaver.io/
[dbeaver-downloads]: https://dbeaver.io/download/
[connection-info]: /use-timescale/:currentVersion:/integrations/find-connection-details/
[ssl-mode]: /use-timescale/:currentVersion:/security/strict-ssl/
