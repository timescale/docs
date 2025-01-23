---
title: Integrate pgAdmin with Timescale Cloud
excerpt: Steps to connect to your Timescale Cloud service using pgAdmin
products: [cloud, mst, self_hosted]
keywords: [integrate]
---

import IntegrationPrereqs from "versionContent/_partials/_integration-prereqs.mdx";

# Integrate pgAdmin with $CLOUD_LONG

[pgAdmin][pgadmin] is a feature-rich open-source administration and development platform for PostgreSQL. It is available for Chrome, Firefox, Edge, and
Safari browsers, or can be installed on Microsoft Windows, Apple macOS, or various Linux flavors.

![Timescale Cloud pgadmin](https://assets.timescale.com/docs/images/timescale-cloud-pgadmin.png)

This page explains how to integrate pgAdmin with your $SERVICE_LONG.

## Prerequisites

<IntegrationPrereqs />

- [Download][download-pgadmin] and install pgAdmin. 

## Connect pgAdmin to your $SERVICE_LONG

To connect to $CLOUD_LONG:

<Procedure>

1.  **Start pgAdmin**
1.  **In the `Quick Links` section of the `Dashboard` tab, click `Add New Server`**
1.  **In `Register - Server` > `General`, fill in the `Name` and `Comments` fields with the server name and description, respectively**
1. **Configure the connection** 
   1. In the `Connection` tab, configure the connection using your [connection details][connection-info].
   1.  If you configured your $SERVICE_SHORT to connect using a [stricter SSL mode][ssl-mode], then in the `SSL` tab check `Use SSL`, set `SSL mode` to the configured mode, and in the `CA Certificate` field type the location of the SSL root CA certificate to use.
1.  **Click `Save`**

</Procedure>

You have successfully integrated pgAdmin with $CLOUD_LONG.

[pgadmin]: https://www.pgadmin.org/
[download-pgadmin]: https://www.pgadmin.org/download/
[connection-info]: /use-timescale/:currentVersion:/integrations/find-connection-details/
[ssl-mode]: /use-timescale/:currentVersion:/security/strict-ssl/