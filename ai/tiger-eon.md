---
title: Aggregate organizational data with AI agents
excerpt: Unify company knowledge with slack-native AI agents
products: [cloud, self_hosted]
keywords: [ai, vector, pgvector, TigerData vector, pgvectorizer]
tags: [ai, vector, pgvectorizer]
---

import PrereqAccount from "versionContent/_partials/_prereqs-cloud-project-and-self.mdx";

# Aggregate organizational data with AI agents

Your business already has the answers in Slack threads, GitHub pull requests, Linear tasks, your own docs, Salesforce 
service tickets, anywhere you store data. However, those answers are scattered, hard to find, and often forgotten. 
$EON_LONG automatically integrates $AGENTS_LONG with your organizational data so you can let AI assistants analyse your 
company data and give you the answers you need. For example:
- What did we ship last week?
- What's blocking the release?
- Summarize the latest GitHub pull requests.

Eon responds instantly, pulling from the tools you already use. No new UI, no new workflow — just answers in Slack.

![Query Tiger Agent](https://assets.timescale.com/docs/images/tiger-agent/query-in-slack.png)

$EON_LONG:

- **Unlocks hidden value**: your data in Slack, GitHub, and Linear already contain the insights you need. $EON_SHORT makes them accessible.
- **Enables faster decisions**: no need to search or ask around, you get answers in seconds.
- **Is easy to use**: $EON_SHORT runs a $AGENTS_SHORT and MCP servers statelessly in a lightweight Docker container.
- **Integrates seamless with $CLOUD_LONG**: $EON_SHORT creates a free $SERVICE_LONG so you securely and reliably store 
    your company data. Prefer to self-host? Use a [$PG instance with $TIMESCALE_DB][install-self-hosted].

This page shows you how to install and run $EON_SHORT.

## Prerequisites

<PrereqAccount />

- [Install Docker][install-docker] on your developer device
- Rights to create an [Anthropic API key][claude-api-key]
- Rights to create a [GitHub token][github-token] 

## Interactive setup

$EON_LONG is a production-ready repository running [$CLI_LONG][tiger-cli] and [$AGENTS_LONG][tiger-agents] that creates 
and runs the following components for you:

- An ingest Slack app that consumes all messages and reactions from public channels in your Slack workspace
- A [$AGENTS_SHORT][tiger-agents] that analyse your company data for you 
- A $SERVICE_LONG instance that stores data from the Slack apps
- MCP servers that connect data sources to $EON_SHORT 
- A listener Slack app that passes questions to the $AGENTS_SHORT when you @tag it in a public channel, and returns the 
  AI analysis on your data

All local components are run in a lightweight Docker container.

This section shows you how to run the interactive setup to configure $EON_SHORT to connect to your Slack app, and give them access to your
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

1. **Integrate $EON_SHORT with Anthropic**

   The interactive setup opens https://console.anthropic.com/settings/keys. Create a Claude Code key, then
   paste it in the terminal. 

1. **Integrate $EON_SHORT with Logfire**
 
   If you would like to integrate logfire with $EON_SHORT, paste your token and press `Enter`. If not, press `Enter`.

1. **Integrate $EON_SHORT with Github**

    The interactive setup asks if you would like to `Enable github MCP server?". For $EON_SHORT to answer questions 
    about the activity in your Github organization, press `y`. 

</Procedure> 

## Run $EON_SHORT


## Manual configuration

$EON_LONG is a production-ready repository running [$CLI_LONG][tiger-cli] and [$AGENTS_LONG][tiger-agents] that creates
and runs the following components for you:

- An ingest Slack app that consumes all messages and reactions from public channels in your Slack workspace
- A [$AGENTS_SHORT][tiger-agents] that analyse your company data for you
- A $SERVICE_LONG instance that stores data from the Slack apps
- MCP servers that connect data sources to $EON_SHORT
- A listener Slack app that passes questions to the $AGENTS_SHORT when you @tag it in a public channel, and returns the
  AI analysis on your data

All local components are run in a lightweight Docker container.

This section shows you how to manually configure $EON_SHORT and .


[jinja-templates]: https://jinja.palletsprojects.com/en/stable/
[logfire]: https://pydantic.dev/logfire
[claude-api-key]: https://console.anthropic.com/settings/keys
[github-token]: https://github.com/settings/tokens/new?description=Tiger%20Agent&scopes=repo,read:org
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
[install-self-hosted]: /self-hosted/:currentVersion:/install/