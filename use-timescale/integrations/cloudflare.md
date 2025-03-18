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

    Run the following command to create a Worker project:

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

    - `What would you like to start with?`:`Hello World example`.
    - `Which template would you like to use?`: `Hello World Worker`.
    - `Which language do you want to use?`: `TypeScript`.
    - `Do you want to use git for version control?`: `Yes`.
    - `Do you want to deploy your application?`: `No`.

    You should see the following:
    
    ```bash
     SUCCESS  Application created successfully!
     ```

1. **Create a Hyperdrive Configuration**

    1. Run the `create` command with the `--connection-string` argument to pass the name of your Hyperdrive and your $SERVICE_SHORT URL from your [connection details][connection-info]:

       ```shell
       npx wrangler hyperdrive create hyperdrive --connection-string="SERVICEURL"
       ```

       Hyperdrive attempts to connect to your $SERVICE_SHORT with the provided credentials. In case of an error, refer to the [Hyperdrive's troubleshooting documentation][hyperdrive-troubleshoot]. This command outputs your Hyperdrive ID. 
   
    1. Bind your Hyperdrive configuration to your Worker in your [Wrangler configuration file][wrangler-configuration] by replacing the content with the following:

       <Terminal>

       <tab label='wrangler.jsonc'>

       ```json
       {
        "name": "timescale-api",
        "main": "src/index.ts",
        "compatibility_date": "2024-09-23",
        "compatibility_flags": [
          "nodejs_compat"
        ],
        "hyperdrive": [
          {
            "binding": "HYPERDRIVE",
            "id": "YOUR_HYPERDRIVE_ID"
          }
        ]
      }
       ```

       </tab>

       <tab label="wrangler.toml">

       ```toml
       name = "timescale-api"
       main = "src/index.ts"
       compatibility_date = "2024-09-23"
       compatibility_flags = [ "nodejs_compat"]

       [[hyperdrive]]
       binding = "HYPERDRIVE"
       id = "YOUR_HYPERDRIVE_ID"
       ```

       </tab>

       </Terminal>
    
    1. Install the Postgres driver into your Worker project: 

       ```shell
       npm install pg
       ```
       
    1. Replace the current code in `./src/index.ts` with the following: 

       ```typescript
       import { Client } from "pg";

       export interface Env {
         HYPERDRIVE: Hyperdrive;
       }

       export default {
         async fetch(request, env, ctx): Promise<Response> {
           const client = new Client({
             connectionString: env.HYPERDRIVE.connectionString,
           });
           await client.connect();

           const url = new URL(request.url);
           // Create a route for inserting JSON as readings
           if (request.method === "POST" && url.pathname === "/readings") {
             // Parse the request's JSON payload
             const productData = await request.json();

             // Write the raw query. You are using jsonb_to_recordset to expand the JSON
             // to PG INSERT format to insert all items at once, and using coalesce to
             // insert with the current timestamp if no ts field exists
             const insertQuery = `
             INSERT INTO readings (ts, sensor, metadata, value)
             SELECT coalesce(ts, now()), sensor, metadata, value FROM jsonb_to_recordset($1::jsonb)
             AS t(ts timestamptz, sensor UUID, metadata jsonb, value numeric)
         `;

             const insertResult = await client.query(insertQuery, [
               JSON.stringify(productData),
             ]);

             // Collect the raw row count inserted to return
             const resp = new Response(JSON.stringify(insertResult.rowCount), {
               headers: { "Content-Type": "application/json" },
             });

             ctx.waitUntil(client.end());
             return resp;

             // Create a route for querying within a time-frame
           } else if (request.method === "GET" && url.pathname === "/readings") {
             const limit = url.searchParams.get("limit");

             // Query the readings table using the limit param passed
             const result = await client.query(
               "SELECT * FROM readings ORDER BY ts DESC LIMIT $1",
               [limit],
             );

             // Return the result as JSON
             const resp = new Response(JSON.stringify(result.rows), {
               headers: { "Content-Type": "application/json" },
             });

             ctx.waitUntil(client.end());
             return resp;
           }
         },
       } satisfies ExportedHandler<Env>;
       ``` 

       This code:

       - Uses Hyperdrive to connect to $CLOUD_LONG using the connection string.
       - Creates a POST route which accepts an array of JSON readings to insert into  $CLOUD_LONG in one transaction.
       - Creates a GET route which takes a limit parameter and returns the most recent readings. This could be adapted to filter by ID or by timestamp.

1. **Deploy your Worker**

    Run the following command:

    ```shell
    npx wrangler deploy
    ```

    The output shows the exact URI of your running application in the following format:` timescale-api.<YOUR_SUBDOMAIN>.workers.dev`.

1. **Interact with your $SERVICE_LONG**

    You can now interact with the IoT readings in your $SERVICE_SHORT using your Cloudflare Worker. For example:

    - Insert new rows into the `readings` hypertable you have created earlier. To do this, send a `POST` request to your Worker’s URL with the `/readings` path, along with a JSON payload containing the new product data. Replace `<YOUR_SUBDOMAIN>` with the deploy command output from the previous step. For example:

       ```curl
       curl --request POST --data @- 'https://timescale-api.<YOUR_SUBDOMAIN>.workers.dev/readings' <<EOF
       [
       { "sensor": "6f3e43a4-d1c1-4cb6-b928-0ac0efaf84a5", "value":0.3},
       { "sensor": "d538f9fa-f6de-46e5-9fa2-d7ee9a0f0a68", "value":10.8},
       { "sensor": "5cb674a0-460d-4c80-8113-28927f658f5f", "value":18.8},
       { "sensor": "03307bae-d5b8-42ad-8f17-1c810e0fbe63", "value":20.0},
       { "sensor": "64494acc-4aa5-413c-bd09-2e5b3ece8ad7", "value":13.1},
       { "sensor": "0a361f03-d7ec-4e61-822f-2857b52b74b3", "value":1.1},
       { "sensor": "50f91cdc-fd19-40d2-b2b0-c90db3394981", "metadata": {"color": "blue" }, "value":10.3}
       ]
       EOF
       ```

       This command omits the `ts` (the timestamp) and `metadata` (the JSON blob) so they will be set to `now()` and `NULL`, respectively.

    - Query the `readings` hypertable by sending a `GET` request to your Worker’s URL with the `/readings` path. Set the `limit` parameter to control the amount of returned records:

       ```curl
       curl "https://timescale-api.<YOUR_SUBDOMAIN>.workers.dev/readings?limit=10"
       ```

</Procedure>

You have successfully integrated Cloudflare Hyperdrive with $CLOUD_LONG.

[connection-info]: /use-timescale/:currentVersion:/integrations/find-connection-details/
[hyperdrive]: https://developers.cloudflare.com/hyperdrive/
[cloudflare-account]: https://dash.cloudflare.com/sign-up
[wrangler-cli]: https://developers.cloudflare.com/workers/wrangler/get-started/
[run-queries]: /getting-started/:currentVersion:/run-queries-from-console/
[psql]: /use-timescale/:currentVersion:/integrations/psql/
[hyperdrive-troubleshoot]: https://developers.cloudflare.com/hyperdrive/observability/troubleshooting/
[wrangler-configuration]: https://developers.cloudflare.com/workers/wrangler/configuration/