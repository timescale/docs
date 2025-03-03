---
title: Integrate Decodable with Timescale Cloud 
excerpt: Seamlessly integrate Decodable with Timescale Cloud to unlock real-time data processing capabilities.
products: [cloud, mst, self_hosted]
keywords: [Decodable, Timescale Cloud]
---

import IntegrationPrereqs from "versionContent/_partials/_integration-prereqs.mdx";

# Integrate Decodable with $CLOUD_LONG

[Decodable][decodable] is a real-time data platform that allows you to build, run, and manage data pipelines effortlessly. 

This page explains how to integrate Decodable with your $SERVICE_LONG to enable efficient real-time streaming and analytics.

## Prerequisites

<IntegrationPrereqs />

- [Sign up for Decodable][sign-up-decodable].
   This page uses the pipeline you create following the [Decodable Quickstart Guide][decodable-quickstart].

## Connect Decodable to your $SERVICE_LONG

To stream data gathered in Decodable to a $SERVICE_LONG:

<Procedure>

1. **Create the schema to pipe a Decodable data stream into**
   1. 

2. **Create a Decodable sink to your $SERVICE_LONG**

   1. Log in to Decodable 
   1. Navigate to the `Connections` tab in the Decodable UI and click `Create Connection`.
   1. Select `PostgreSQL` as the connection type.
   1. Configure other fields using your [connection details][connection-info].

1. **Test the connection**

   1. Click `Test Connection` in the Decodable UI.
   1. Ensure the connection status changes to `Connected`.
   1. Click `Save` to save the connection.

</Procedure> 

[decodable]: https://www.decodable.co/
[sign-up-decodable]: https://auth.decodable.co/u/signup/
[decodable-quickstart]: https://docs.decodable.co/get-started/quickstart.html
[connection-info]: /use-timescale/:currentVersion:/integrations/find-connection-details/
