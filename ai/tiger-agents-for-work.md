---
title: Incorporate Slack-native AI agents
excerpt: Unify company knowledge with slack-native AI agents
products: [cloud]
keywords: [ai, vector, pgvector, TigerData vector, pgvectorizer]
tags: [ai, vector, pgvectorizer]
---

# Incorporate Slack-native AI agents 

import RESTPrereqs from "versionContent/_partials/_prereqs-cloud-account-only.mdx";

$AGENTS_LONG is a Slack-native AI agent that you use to unify the knowledge in your company. This includes your Slack 
history, docs, GitHub repositories, Salesforce and so on. You use your $AGENTS_LONG to get instant answers for real 
business, technical, and operations questions in your Slack channels. 

![Query Tiger Agent](https://assets.timescale.com/docs/images/tiger-agent/query-in-slack.png)

$AGENTS_SHORT is a production-ready library and CLI for building Slack-native agents. $AGENTS_SHORTs can 
handle concurrent conversations with enterprise-grade reliability. It has the following features:

- **Durable and atomic event handling**: $PG-backed event claiming ensures exactly-once processing, even under high concurrency and failure conditions
- **Bounded concurrency**: fixed worker pools prevent resource exhaustion while maintaining predictable performance under load
- **Immediate event processing**: $AGENTS_SHORT provide real-time responsiveness. Events are processed within milliseconds of arrival rather than waiting for polling cycles 
- **Resilient retry logic**: automatic retry with visibility thresholds, plus stuck or expired event cleanup
- **Horizontal scalability**: run multiple $AGENTS_SHORT instances simultaneously with coordinated work distribution across all instances
- **AI-Powered Responses**: use the AI model of your choice, you can also integrate with MCP servers 
- **Extensible architecture**: zero code integration for basic agents. For more specialized use cases, easily customize your agent using [Jinja templates][jinja-templates] 
- **Complete Observability**: detailed tracing of event flow, worker activity, and database operations with full [Logfire][logfire] instrumentation 

This page shows you how to install the $AGENTS_CLI, connect to the $COMPANY MCP server, and customize prompts for
your specific needs.

## Prerequisites

* A [Tiger Cloud service][create-a-service]
* The [uv package manager][uv-install]
* An [Anthropic API key][claude-api-key]
* Optional: [Logfire token][logfire]

## Create a Slack app

Before installing $AGENTS_SHORT, you need to create a Slack app that the $AGENTS_SHORT will connect to. This app 
provides the security tokens for Slack integration with your $AGENTS_SHORT:

<Procedure>

1. **Create a manifest for your Slack App**

   1. In a temporary directory, download the $AGENTS_SHORT Slack manifest template:

      ```bash
      curl -O https://raw.githubusercontent.com/timescale/tiger-agents-for-work/main/slack-manifest.json
      ```

   1. Edit `slack-manifest.json` and customize your name and description of your Slack App app. For example:

      ```json
      "display_information": {
        "name": "Tiger Agent",
        "description": "Tiger AI Agent helps you easily access your business information, and tune your Tiger services",
        "background_color": "#000000"
      },
      "features": {
        "bot_user": {
          "display_name": "Tiger Agent",
          "always_online": true
        }
      },
      ```
      
   1. Copy the contents of `slack-manifest.json` to the clipboard:
   
      ```shell
      cat slack-manifest.json| pbcopy
      ```

1. **Create the Slack app**

    1. Go to [api.slack.com/apps](https://api.slack.com/apps).
    1. Click `Create New App`.
    1. Select `From a manifest`.
    1. Choose your workspace, then click `Next`.
    1. Paste the contents of `slack-manifest.json` and click `Next`.  
    1. Click `Create`.
1. **Generate an app-level token**

    1. In your app settings, go to `Basic Information`.
    1. Scroll to `App-Level Tokens`.
    1. Click `Generate Token and Scopes`.
    1. Add a `Token Name`, then click `Add Scope`, add `connections:write` then click `Generate`.
    1. Copy the `xapp-*` token locally and click `Done`. 

1. **Install your app to a Slack workspace**

    1. In the sidebar, under `Settings`, click `Install App`. 
    1. Click `Install to <workspace name>`, then click `Allow`.
    1. Copy the `xoxb-` Bot User OAuth Token locally.

</Procedure>

You have created a Slack app and obtained the necessary tokens for $AGENTS_SHORT integration.


## Install and configure your $AGENTS_SHORT instance

$AGENTS_SHORT is a production-ready library and CLI written in Python that you use to create Slack-native AI agents.
This section shows you how to configure $AGENTS_SHORT to connect to your Slack app, and give it access to your
data and analytics stored in $CLOUD_LONG.

<Procedure>

1. **Create a project directory**

   ```bash
   mkdir my-tiger-agent
   cd my-tiger-agent
   ```

1. **Create an $AGENTS_SHORT environment with your Slack, AI Assistant and database configuration**

   1. Download `.env.sample` to a local `,env` file:
     ```shell
     curl -L -o .env https://raw.githubusercontent.com/timescale/tiger-agent/refs/heads/main/.env.sample
     ```
   1. In `.env`, add your Slack tokens and Anthropic API key: 

     ```bash
     # Slack tokens (from the Slack app you created)
     SLACK_APP_TOKEN=xapp-your-app-token
     SLACK_BOT_TOKEN=xoxb-your-bot-token

     # Anthropic API key
     ANTHROPIC_API_KEY=sk-ant-your-api-key

     # Optional: Logfire token for enhanced logging
     LOGFIRE_TOKEN=your-logfire-token
     ```
   1. Add the [connection details][connection-info] for the $SERVICE_LONG you are using for this $AGENTS_SHORT: 
     ```bash
     PGHOST=<host>
     PGDATABASE=tsdb
     PGPORT=<port>
     PGUSER=tsdbadmin
     PGPASSWORD=<password> 
     ```
   1. Save and close `.env`.

1. **Add the default $AGENTS_SHORT prompts to your project**
     ```bash
     mkdir prompts
     curl -L -o prompts/system_prompt.md https://raw.githubusercontent.com/timescale/tiger-agent/refs/heads/main/prompts/system_prompt.md
     curl -L -o prompts/user_prompt.md https://raw.githubusercontent.com/timescale/tiger-agent/refs/heads/main/prompts/user_prompt.md
     ```  

1. **Install $AGENTS_CLI to manage and run your AI-powered Slack bots**

   1. Install $AGENTS_SHORT using uv

      ```bash
      uv tool install --from git+https://github.com/timescale/tiger-agents-for-work.git tiger-agent
      ```
      `tiger-agent` is installed in `~/.local/bin/tiger-agent`. If necessary, add this folder to your `PATH`.

   1. Verify the installation

      ```bash
      tiger-agent --help
      ```

      You see the $AGENTS_CLI help output with the available commands and options.


1. **Connect your $AGENTS_SHORT with Slack**

    1. Run your $AGENTS_SHORT:
       ```bash
       tiger-agent run --prompts prompts/  --env .env
       ```
       If you open the explorer in [$CONSOLE][portal-ops-mode], you can see the tables used by your $AGENTS_SHORT.          

    1. In Slack, open a public channel app and ask $AGENT_SHORT a couple of questions. You see the response in your 
       public channel, the output and from the $AGENTS_CLI in the Terminal and your $SERVICE_LONG.
   
      ![Query Tiger Agent](https://assets.timescale.com/docs/images/tiger-agent/query-in-terminal.png)
       

## Add information from MCP servers to your $AGENTS_SHORT

To increase the amount of specialized information your AI Assistant can use, you can add MCP servers supplying data 
your users need. For example, to add the $COMPANY MCP server to your $AGENTS_SHORT:

<Procedure>

1. **Copy the example `mcp_config.json` to your project**

   In `my-tiger-agent`, run the following command.

       ```bash
        curl -L -o mcp_config.json https://raw.githubusercontent.com/timescale/tiger-agent/refs/heads/main/examples/mcp_config.json
        ```

1. **Configure your $AGENTS_SHORT to connect to the most useful MCP servers for your organization**

    For example, to add the $COMPANY documentation MCP server to your $AGENTS_SHORT, update the docs entry to the 
    following: 
    ```json
    "docs": {
      "tool_prefix": "docs",
      "url": "https://mcp.tigerdata.com/docs",
      "allow_sampling": false
    },
    ```

1. **Restart your $AGENTS_SHORT**
   ```bash
   tiger-agent run --prompts prompts/ --mcp-config mcp_config.json
   ```

</Procedure>

You have configured your $AGENTS_SHORT to connect to the $MCP_SHORT. For more information, 
see [MCP Server Configuration][mcp-configuration-docs].

## Customize prompts for personalization

$AGENTS_SHORT uses Jinja2 templates for dynamic, context-aware prompt generation. This system allows for sophisticated 
prompts that adapt to conversation context, user preferences, and event metadata. $AGENTS_SHORT uses the following templates:

- `system_prompt.md`: defines the AI Assistant;s role, capabilities, and behavior patterns. This template sets the 
   foundation for the way your $AGENTS_SHORT will respond and interact.
- `user_prompt.md`: formats the user's request with relevant context, providing the AI Assistant with the 
   information necessary to generate an appropriate response.

To change the way your $AGENTS_SHORT interacts with users in your Slack app:

1. **Update the prompt**

   For example, in `prompts/system_prompt.md`, add another item in the `Response Protocol` section to fine tune 
   the behaviour of $AGENTS_SHORT. For example:
   ```shell
   5. Be snarky but vaguely amusing 
   ```

1. **Test your configuration**

   Run $AGENTS_SHORT with your custom prompt:

   ```bash
   tiger-agent run --mcp-config mcp_config.json --prompts prompts/
   ```

</Procedure>

For more information, see [Prompt tempates][prompt-templates].

## Advanced configuration options

For additional customization, you can modify the following $AGENTS_SHORT parameters:

* `--model`: Change AI model (default: `anthropic:claude-sonnet-4-20250514`)
* `--num-workers`: Adjust concurrent workers (default: 5)
* `--max-attempts`: Set retry attempts per event (default: 3)

Example with custom settings:

```bash
tiger-agent run \
  --model claude-3-5-sonnet-latest \
  --mcp-config mcp_config.json \
  --prompts prompts/ \
  --num-workers 10 \
  --max-attempts 5
```

Your $AGENTS_SHORT is now configured with TigerData MCP server access and personalized prompts, ready to help users analyze data from your Tiger Cloud service.




[jinja-templates]: https://jinja.palletsprojects.com/en/stable/
[logfire]: https://pydantic.dev/logfire
[claude-api-key]: https://console.anthropic.com/settings/keys
[create-a-service]: /getting-started/:currentVersion:/services
[uv-install]: https://docs.astral.sh/uv/getting-started/installation/
[connection-info]: /integrations/:currentVersion:/find-connection-details/
[portal-ops-mode]: https://console.cloud.timescale.com/dashboard/services
[mcp-configuration-docs]: https://github.com/timescale/tiger-agents-for-work/blob/main/docs/mcp_config.md
[prompt-templates]: https://github.com/timescale/tiger-agents-for-work/blob/main/docs/prompt_templates.md