---
title: Integrate Fivetran with Timescale Cloud
excerpt: Integrate Fivetran with Timescale Cloud for seamless data synchronization.
products: [cloud, mst, self_hosted]
keywords: [Fivetran, Timescale Cloud]

---

import IntegrationPrereqs from "versionContent/_partials/_integration-prereqs.mdx";

# Integrate Fivetran with $CLOUD_LONG

[Fivetran][fivetran] is a fully managed data pipeline platform that simplifies ETL (Extract, Transform, Load) processes by automatically syncing data from multiple sources to your data warehouse. 

This page shows you how to use Fivetran connectors to integrate Fivetran with $CLOUD_LONG.

## Prerequisites

<IntegrationPrereqs />

- [Sign up for Fivetran][sign-up-fivetran].

## Connect Fivetran with your $SERVICE_LONG

To connect Fivetran with $CLOUD_LONG:

<Procedure>

1. **Log in to Fivetran**

    Navigate to the [Fivetran login page][fivetran-login] and sign in with your credentials.

1. **Set up a PostgreSQL connector**

   1. In the Fivetran dashboard, click `Connectors` and then `+ Add Connector`.
   1. Select `PostgreSQL` as your data destination.
   1. Enter a name for your connector and click `Next`.
   1. Configure the connection to your $SERVICE_LONG using your [connection details][connection-info].

1. **Test the connection**

   1. Click `Test Connection` on the Fivetran setup page.
   1. If there are errors, double-check your connection details.
   1. Save the connector configuration.
   
Fivetran initiates the first sync with your $SERVICE_LONG. Monitor the progress on the `Connectors` page.

</Procedure>

You have successfully integrated Fivetran with $CLOUD_LONG.

[connection-info]: /use-timescale/:currentVersion:/integrations/find-connection-details/
[fivetran]: https://www.fivetran.com/docs
[sign-up-fivetran]: https://www.fivetran.com/
[fivetran-login]: https://www.fivetran.com/login