---
title: Integrate Cloudflare Hyperdrive with Timescale Cloud  
excerpt: 
products: [cloud, mst, self_hosted]  
keywords: [Cloudflare Hyperdrive, Timescale Cloud, database integration]  
---

import IntegrationPrereqs from "versionContent/_partials/_integration-prereqs.mdx";

# Integrate Cloudflare Hyperdrive with $CLOUD_LONG

[Cloudflare Hyperdrive][hyperdrive] is a global caching and query acceleration service for databases. It enables faster access by caching queries at Cloudflare’s edge locations. 

This page explains how to integrate Cloudflare Hyperdrive with $CLOUD_LONG to create a serverless, globally distributed API. 

## Prerequisites

<IntegrationPrereqs />

- Create a [Cloudflare account][cloudflare-account] and enable Hyperdrive.
- Install [Wrangler CLI][wrangler-cli].

## Connect your $SERVICE_LONG to Cloudflare Hyperdrive

To connect to $CLOUD_LONG:

<Procedure>

1. **Connect to your $SERVICE_LONG using your [connection details][connection-info]**

    Use an [SQL editor][run-queries] in $CONSOLE. For self-hosted $TIMESCALE_DB, use [psql][psql]. 

1. **In your $SERVICE_SHORT, create a hypertable**

    Create a regular table, then convert it to a hypertable. For example:

    ```sql
    CREATE TABLE readings(
    ts timestamptz DEFAULT now() NOT NULL,
    sensor UUID NOT NULL,
    metadata jsonb,
    value numeric NOT NULL
    );

    SELECT create_hypertable('readings', 'ts'); 
    ```

1. **Create a Worker project**

    1. Run the following command to create a Worker project:

       <Terminal>

       <tab label='npm'>
    
       ```shell
       npm create cloudflare@latest -- timescale-api
       ```
    
       </tab>
    
       <tab label="pnpm">
    
       ```shell
       pnpm create cloudflare@latest timescale-api
       ```
    
       </tab>
    
       <tab label="yarn">
    
       ```shell
       yarn create cloudflare timescale-api
       ```
    
       </tab>
    
       </Terminal>

   Specify the following options for setup:

    - `What would you like to start with?`:`Hello World`.
    - `Which template would you like to use?`: `Hello World Worker`.
    - `Which language do you want to use?`: `TypeScript`.
    - `Do you want to use git for version control?`: `Yes`.
    - `Do you want to deploy your application?`: `No`.

1. **Create a Hyperdrive Configuration**

1. **Deploy your Worker**

</Procedure>

You have successfully integrated Cloudflare Hyperdrive with Timescale Cloud.

[connection-info]: /use-timescale/:currentVersion:/integrations/find-connection-details/
[hyperdrive]: https://developers.cloudflare.com/hyperdrive/
[cloudflare-account]: https://dash.cloudflare.com/sign-up
[wrangler-cli]: https://developers.cloudflare.com/workers/wrangler/get-started/
[run-queries]: /getting-started/:currentVersion:/run-queries-from-console/
[psql]: /use-timescale/:currentVersion:/integrations/psql/
