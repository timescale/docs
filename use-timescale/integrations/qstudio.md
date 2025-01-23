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
1. **Navigate to the `Server` tab, and click `Add Server`**
1. **Configure the connection in `Server Properties`**
    *   For `Server Type`, select `Postgres`.
    *   For `Connect By`, select `Host`.
    *   Configure `Host`, `Port`, `Database`, `Username`, and `Password` using your [connection details][connection-info]. 
1.  **Click `Test` to check the connection**

    qStudio indicates whether the connection works. 

1.  **Click `Add` to add the connection**
    
    The server is listed in the `Server Tree` pane.

</Procedure>

You have successfully integrated qStudio with $CLOUD_LONG.

[qstudio]: https://www.timestored.com/qstudio
[qstudio-downloads]: https://www.timestored.com/qstudio/download
[connection-info]: /use-timescale/:currentVersion:/integrations/find-connection-details/
