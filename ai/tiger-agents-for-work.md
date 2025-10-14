---
title: Incorporate Slack-native AI agents
excerpt: Unify company knowledge with slack-native AI agents
products: [cloud, self_hosted]
keywords: [ai, vector, pgvector, TigerData vector, pgvectorizer]
tags: [ai, vector, pgvectorizer]
---

import ImportPrerequisites from "versionContent/_partials/_prereqs-cloud-and-self.mdx";

# Incorporate Slack-native AI agents

$EON_LONG is a Slack-native AI agent that you use to unify the knowledge in your company. This includes your Slack
history, docs, GitHub repositories, Salesforce and so on. You use $EON_SHORT to get instant answers for real
business, technical, and operations questions in your Slack channels.

![Query Tiger Agent](https://assets.timescale.com/docs/images/tiger-agent/query-in-slack.png)

$EON_LONG can handle concurrent conversations with enterprise-grade reliability. It has the following features:

- **Durable and atomic event handling**: $PG-backed event claiming ensures exactly-once processing, even under high concurrency and failure conditions
- **Bounded concurrency**: fixed worker pools prevent resource exhaustion while maintaining predictable performance under load
- **Immediate event processing**: $EON_LONG provide real-time responsiveness. Events are processed within milliseconds of arrival rather than waiting for polling cycles
- **Resilient retry logic**: automatic retry with visibility thresholds, plus stuck or expired event cleanup
- **Horizontal scalability**: run multiple $EON_SHORT instances simultaneously with coordinated work distribution across all instances
- **AI-Powered Responses**: use the AI model of your choice, you can also integrate with MCP servers
- **Extensible architecture**: zero code integration for basic agents. For more specialized use cases, easily customize your agent using [Jinja templates][jinja-templates]
- **Complete observability**: detailed tracing of event flow, worker activity, and database operations with full [Logfire][logfire] instrumentation

This page shows you how to install the $AGENTS_CLI, connect to the $COMPANY MCP server, and customize prompts for
your specific needs.

## Prerequisites

<ImportPrerequisites />

- [Install Docker][install-docker] on your developer device

* IAIN, let's see. An [Anthropic API key][claude-api-key]
* Optional: [Logfire token][logfire]


## Interactive setup

$EON_LONG is a production-ready repository running [$CLI_LONG][tiger-cli] and [$AGENTS_LONG][tiger-agents] that creates 
and runs the following components for you:

- An ingest Slack app that receive all messages and reactions from the public channels in your Slack workspace
- A listener Slack App for the agent that receive @mentions to it
- A $SERVICE_LONG instance that stores data from the Slack apps

If [$CLI_LONG][tiger-cli] and [$AGENTS_LONG][tiger-agents] are installed locally, $EON_LONG calls the local apps. If not,
$EON_LONG runs them in Docker. 

This section shows you how to configure $EON_SHORT to connect to your Slack app, and give them access to your
data and analytics stored in $CLOUD_LONG.

<Procedure>

1. **Install $EON_LONG to manage and run your AI-powered Slack bots**

    In a local folder, run the following command from the terminal.
    ```shell
    git clone git@github.com:timescale/tiger-eon.git
    ```

1. **Configure $EON_SHORT**

   The interactive setup creates and configures the Slack apps and the $SERVICE_LONG for $EON_SHORT to run correctly:
   
1. **Start the interactive setup**
   
   ```shell
   cd tiger-eon
   ./setup-tiger-eon.sh
   ```
   You see a resume of the setup procedure. Type `y` and press `Enter`.
   
1. **Create the $SERVICE_LONG to use with $EON_SHORT**
   
    You see `Do you want to use a free tier Tiger Cloud Database? [y/N]:`. Press `Y` to create a free
    $SERVICE_LONG.

    $EON_SHORT opens the $CLOUD_LONG authentication page in your browser. Click `Authorize`. $EON_SHORT creates a 
    $SERVICE_LONG called [tiger-eon][services-portal] and stores the credentials in your local keychain. 

    If you press `N`, the interactive setup creates and runs $TIMESCALE_DB in a local Docker container. 

1. **Create the ingest Slack app**

   1. In terminal, name your ingest Slack app:

      1. $EON_SHORT proposes to create an ingest app called `tiger-slack-ingest`, press `Enter`. 
      1. Do the same for the App description.

      $EON_SHORT opens `Your Apps` in `api.slack.com`.
   
   1. Start configuring your ingest app in Slack:
      In the Slack `Your Apps` page: 
      1. Click `Create New App`, click `From an manifest`, then select a workspace. 
      1. Click `Next`. Slack opens `Create app from manifest`. 
  
   1. Add the Slack app manifest:
      1. In terminal press `Enter`. The setup prints the Slack app manifest to terminal. 
      1. In the Slack `Create app from manifest` window, paste the manifest, 
      1. Click `Next`, then click `Create`.   

   1. Configure an app-level token

       1. In your app settings, go to `Basic Information`.
       1. Scroll to `App-Level Tokens`.
       1. Click `Generate Token and Scopes`.
       1. Add a `Token Name`, then click `Add Scope`, add `connections:write` then click `Generate`.
       1. Copy the `xapp-*` token and click `Done`.
       1. In terminal, paste the token, then press `Enter`.

   1. Configure a bot user OAuth token:

       1. In your app settings, under `Features`, click `App Home`.
       1. Scroll down, then enable `Allow users to send Slash commands and messages from the messages tab`.
       1. In your app settings, under `Settings`, click `Install App`.
       1. Click `Install to <workspace name>`, then click `Allow`.
       1. Copy the `xoxb-` Bot User OAuth Token locally.
       1. In terminal, paste the token, then press `Enter`.    

1. **Create the $AGENT_SHORT Slack app**

    Follow the same procedure as you did for the ingest Slack app.

1. **Add your Anthropic API key**

   The interactive setup opens https://console.anthropic.com/settings/keys. Create a Claude Code key, then
   paste it in the terminal. 

1. **Add your Logfire token**
 
   If you would like to integrate logfire with $EON_SHORT, paste your token and press `Enter`. If not, press `Enter`.
    
</Procedure> 



[jinja-templates]: https://jinja.palletsprojects.com/en/stable/
[logfire]: https://pydantic.dev/logfire
[claude-api-key]: https://console.anthropic.com/settings/keys
[create-a-service]: /getting-started/:currentVersion:/services
[uv-install]: https://docs.astral.sh/uv/getting-started/installation/
[connection-info]: /integrations/:currentVersion:/find-connection-details/
[portal-ops-mode]: https://console.cloud.timescale.com/dashboard/services
[mcp-configuration-docs]: https://github.com/timescale/tiger-agents-for-work/blob/main/docs/mcp_config.md
[prompt-templates]: https://github.com/timescale/tiger-agents-for-work/blob/main/docs/prompt_templates.md
[install-docker]: https://docs.docker.com/engine/install/
[tiger-cli]: https://github.com/timescale/tiger-cli/
[tiger-agents]: https://github.com/timescale/tiger-agents-for-work
[services-portal]: https://console.cloud.timescale.com/dashboard/services