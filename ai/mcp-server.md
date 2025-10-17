---
title: Integrate Tiger Cloud with your AI Assistant
excerpt: Manage your services and optimize your schema and queries using your AI Assistant
products: [cloud, self_hosted]
keywords: [ai, mcp, server, security]
tags: [ai]
---

import RESTPrereqs from "versionContent/_partials/_prereqs-cloud-account-only.mdx";
import CLIINSTALL from "versionContent/_partials/_devops-cli-install.mdx";
import MCPCOMMANDS from "versionContent/_partials/_devops-mcp-commands.mdx";
import MCPCOMMANDSCLI from "versionContent/_partials/_devops-mcp-commands-cli.mdx";
import GLOBALFLAGS from "versionContent/_partials/_devops-cli-global-flags.mdx";


# Integrate Tiger Cloud with your AI Assistant

The $MCP_LONG provides access to your $CLOUD_LONG resources through Claude and other AI Assistants. $MCP_SHORT 
mirrors the functionality of $CLI_LONG and is integrated directly into the $CLI_SHORT binary. You manage your
$CLOUD_LONG resources including VPCs, services, read replicas, and related infrastructure using natural language 
from your AI Assistant. As $MCP_SHORT is integrated with the $COMPANY documentation, ask any question and you 
will get the best answer.

This page shows you how to install $CLI_LONG and set up secure authentication for $MCP_SHORT, then manage the
resources in your $ACCOUNT_LONG through the $MCP_LONG using your AI Assistant.

## Prerequisites

<RESTPrereqs />

* An AI Assistant installed on your developer device with an active API key

  Supported AI Assistants are: `claude-code`, `cursor`, `windsurf`, `codex`, `gemini/gemini-cli`, `vscode/code/vs-code`

## Install and configure $MCP_SHORT

The $MCP_SHORT is bundled with $CLI_LONG:

<Procedure>

<CLIINSTALL />

1. **Configure your AI Assistant to interact with the $PROJECT_SHORTs and $SERVICE_SHORTs in your $ACCOUNT_LONG**

   For example:
   ```shell
   tiger mcp install claude-code
   ```
   This command integrates Claude with a local $MCP_SHORT and the $COMPANY documentation.   

</Procedure>

And that is it, you are ready to use the $MCP_LONG to manage your $SERVICE_SHORTs in $CLOUD_LONG.

## Manage the resources in your $ACCOUNT_LONG through your AI Assistant

Your AI Assistant is connected to your $ACCOUNT_LONG and the $COMPANY documentation, you can now use it to
manage your $SERVICE_SHORTs and learn more about how to implement $CLOUD_LONG features. For example:

<Procedure>

1. **Run your AI Assistant**
   ```shell
   claude
   ```
   Claude automatically runs your $MCP_SHORT server that enables you to interact with $CLOUD_LONG from your
   AI Assistant. 

1. **Check your $MCP_LONG configuration**
   ```shell
   > is the tigerdata mcp server active for you?
   ```
   You see something like:
   ```shell
   MCP server is active. I can see the following TigerData-related tools available:

   - mcp__tiger__get_guide - Retrieve TimescaleDB guides and best practices
   - mcp__tiger__semantic_search_postgres_docs - Search PostgreSQL documentation
   - mcp__tiger__semantic_search_tiger_docs - Search Tiger Cloud and TimescaleDB documentation
   - mcp__tiger__tiger_service_create - Create new database services
   - mcp__tiger__tiger_service_list - List all database services
   - mcp__tiger__tiger_service_show - Show detailed service information
   - mcp__tiger__tiger_service_update_password - Update service passwords

   Is there something specific you'd like to do with the TigerData MCP server?
   ```

1. **Ask a basic question about your $SERVICE_SHORTs**
   ```shell
   > can you list my active services please
   ```
   You see something like:
   ```shell
   ⏺ You have 3 active services, all with the same name "my-first-service":

   1. tgrservice1 - READY - TimescaleDB - us-east-1 - 1 CPU/4GB - Created: 2025-09-30
   2. tgrservice1 - READY - TimescaleDB - us-east-1 - 1 CPU/4GB - Created: 2025-09-30
   3. tgrservice1 - READY - TimescaleDB - us-east-1 - 1 CPU/4GB - Created: 2025-09-30
   ```

1. **Manage your $SERVICE_SHORTs without having to learn how to**

   For example:
   ```shell
   Can you create a new ai service called bob with a read replica for me please
   ```
   You see something like:
   ```shell
    tiger - Create Database Service (MCP)(name: "bob", addons: ["ai"], replicas: 1, wait: false)
   ...
   Do you want to proceed?
   ❯ 1. Yes 
   ```

1. **Find best practice for things you need to do**

   For example:
   ```shell
   >  I need to migrate a database with 25 million rows of data to Tiger, 
   please tell me what service optimizations i should do before migration. 
   
   ```
   
   You see something like:

   ```shell
   ⏺ For migrating a database with 25 million rows to Tiger, here are the key service optimizations to do before migration:

   Pre-Migration Service Optimizations

   1. Right-size your compute resources:
     - For 25M rows, start with at least 2 CPU/8GB or 4 CPU/16GB
     - You can scale up during migration if needed, then scale down after

   2. Enable the appropriate add-ons:
     - Use time-series addon if you are working with time-series data
     - Use ai addon if you need vector/AI capabilities

   3. Choose optimal region:
     - Select the region closest to your current database to minimize network transfer time
     - This significantly reduces migration duration

   4. Consider enhanced storage (Enterprise only):
     - If you expect high write throughput during migration, enhanced storage provides better IOPS (up to 32,000)

   5. Skip replicas initially:
     - Start with 0 replicas during migration
     - Add replicas after migration completes to avoid duplicate data copying

   6. Plan for storage space:
     - Estimate your uncompressed data size
     - Allocate sufficient high-performance storage (scales automatically but good to plan)
     - You can enable tiered storage later for older data

   During Migration Best Practices

   Migration method selection:
     - 25M rows: Use schema-then-data migration (migrate schema first, then copy data in chunks)
     - Allows restart if a copy operation fails
     - Better for databases >10GB

   Database configuration to set AFTER migration:
     - Set up compression policies (once data is loaded)
     - Configure retention policies
     - Create continuous aggregates
     - Enable tiered storage for cost optimization

   Connection settings:
     - Use the pooled connection endpoint for better performance during bulk inserts
     - Disable unnecessary constraints/indexes during migration, re-enable after

   Would you like me to help you create an optimized service for this migration?
   ```

</Procedure>

That beats working. Let the $MCP_LONG do it all for you.

## $MCP_LONG commands

<MCPCOMMANDS />

## $CLI_LONG commands for $MCP_SHORT

<MCPCOMMANDSCLI />

## Global flags

You can use the following $CLI_LONG global flags when you run the $MCP_SHORT:

<GLOBALFLAGS />


[rest-api-reference]: /api/:currentVersion:/api-reference/
[rest-api-credentials]: https://console.cloud.timescale.com/dashboard/settings
[get-project-id]: /integrations/:currentVersion:/find-connection-details/#find-your-project-and-service-id
[create-client-credentials]: /integrations/:currentVersion:/find-connection-details/#create-client-credentials
[curl]: https://curl.se/
[cloud-regions]: /use-timescale/:currentVersion:/regions/
[readreplica]: /use-timescale/:currentVersion:/ha-replicas/read-scaling/