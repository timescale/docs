---
title: Integrate Decodable with Timescale Cloud 
excerpt: Decodable enables you to build, run, and manage data pipelines effortlessly. Seamlessly integrate Decodable with Timescale Cloud to unlock real-time data processing capabilities
products: [cloud, self_hosted]
keywords: [Decodable, Timescale Cloud]
---

import IntegrationPrereqs from "versionContent/_partials/_integration-prereqs.mdx";

# Integrate Decodable with $CLOUD_LONG

[Decodable][decodable] is a real-time data platform that allows you to build, run, and manage data pipelines effortlessly. 

![Decodable workflow](https://assets.timescale.com/docs/images/integrations-decodable-configuration.png)

This page explains how to integrate Decodable with your $SERVICE_LONG to enable efficient real-time streaming and analytics.

## Prerequisites

<IntegrationPrereqs />

- Sign up for [Decodable][sign-up-decodable].

   This page uses the pipeline you create using the [Decodable Quickstart Guide][decodable-quickstart].

## Connect Decodable to your $SERVICE_LONG

To stream data gathered in Decodable to a $SERVICE_LONG:

<Procedure>

1. **Create the sync to pipe a Decodable data stream into your $SERVICE_LONG** 

   1. Log in to your [Decodable account][decodable-app].
   1. Click `Connections`, then click `New Connection`.
   1. Select a `PostgreSQL sink` connection type, then click `Connect`.
   1. Using your [connection details][connection-info], fill in the connection information.
   
      Leave `schema` and `JDBC options` empty.
   1. Select the `http_events` source stream, then click `Next`.
   
      Decodable creates the table in your $SERVICE_LONG and starts streaming data.



1. **Test the connection**

   1. Connect to your $SERVICE_LONG.

      For $CLOUD_LONG, open an [SQL editor][run-queries] in [$CONSOLE][open-console]. For self-hosted, use [`psql`][psql].

   1. Check the data from Decodable is streaming into your $SERVICE_LONG.

      ```sql
      SELECT * FROM http_events;
      ```
      You see something like: 

      ![Decodable workflow](https://assets.timescale.com/docs/images/integrations-decodable-data-in-service.png)

</Procedure> 


You have successfully integrated Decodable with $CLOUD_LONG. 


[decodable]: https://www.decodable.co/
[decodable-app]:https://app.decodable.co/-/accounts
[sign-up-decodable]: https://auth.decodable.co/u/signup/
[decodable-quickstart]: https://docs.decodable.co/get-started/quickstart.html
[connection-info]: /integrations/:currentVersion:/find-connection-details/
[run-queries]: /getting-started/:currentVersion:/run-queries-from-console/
[open-console]: https://console.cloud.timescale.com/dashboard/services
[psql]: /integrations/:currentVersion:/psql/
[about-hypertables]: /use-timescale/:currentVersion:/hypertables/about-hypertables/
