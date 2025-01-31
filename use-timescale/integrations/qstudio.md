---
title: Integrate qStudio with Timescale Cloud
excerpt: Connect to your Timescale Cloud service or self-hosted TimescaleDB with qStudio
products: [cloud, mst, self_hosted]
keywords: [integrate]
---

import IntegrationPrereqs from "versionContent/_partials/_integration-prereqs.mdx";

# Integrate qStudio with $CLOUD_LONG

[qStudio][qstudio] is a modern free SQL editor that provides syntax highlighting, code-completion, excel export, charting, and much more. You can use it to run queries, browse tables, and create charts for your $SERVICE_LONG.

This page explains how to integrate qStudio with $CLOUD_LONG.

## Prerequisites

<IntegrationPrereqs />

*   [Download][qstudio-downloads] and install qStudio.

## Connect qStudio to your $SERVICE_LONG

To connect to $CLOUD_LONG:

<Procedure>

1. **Start qStudio**
1. **Click `Server` > `Add Server`**
1. **Configure the connection**

    *   For `Server Type`, select `Postgres`.
    *   For `Connect By`, select `Host`.
    *   For `Host`, `Port`, `Database`, `Username`, and `Password`, use
        your [connection details][connection-info].

  ![qStudio integration](https://assets.timescale.com/docs/images/integrations-qstudio.png)

1.  **Click `Test`**

    qStudio indicates whether the connection works. 

1.  **Click `Add`**
    
    The server is listed in the `Server Tree`.

</Procedure>

You have successfully integrated qStudio with $CLOUD_LONG.

[qstudio]: https://www.timestored.com/qstudio
[qstudio-downloads]: https://www.timestored.com/qstudio/download
[connection-info]: /use-timescale/:currentVersion:/integrations/find-connection-details/
