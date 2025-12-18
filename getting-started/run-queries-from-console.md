---
title: Run your queries from Tiger Cloud Console
excerpt: Choose the right tool to manage your data. Tiger Cloud on AWS and Tiger Cloud on Azure offer Data view, SQL editor, and SQL Assistant to better address your needs
products: [cloud]
content_group: Getting started
---

import WhereNext from "versionContent/_partials/_where-to-next.mdx";
import NotAvailableFreePlan from "versionContent/_partials/_not-available-in-free-plan.mdx";

# Run your queries from $CONSOLE

As $CLOUD_LONG is based on $PG, you can use lots of [different tools][integrations] to
connect to your $SERVICE_SHORT and interact with your data.

In $CONSOLE you can use the following ways to run SQL queries against your $SERVICE_SHORT:

- [$DATA_MODE][popsql]: a rich experience powered by $POPSQL. You can write queries with
  autocomplete, save them in folders, share them, create charts/dashboards, and much more.

- [$SQL_ASSISTANT_SHORT in $DATA_MODE][sql-assistant]: write, fix, and organize SQL faster and more accurately.

- [$SQL_EDITOR][sql-editor]: a simple $SQL_EDITOR that lets you run ad-hoc ephemeral
  queries. This is useful for quick one-off tasks like creating an index on a small table or inspecting `pg_stat_statements`.

If you prefer the command line to $CONSOLE editors, use [psql][psql].

## $DATA_MODE

You use $DATA_MODE in $CONSOLE to write queries, visualize data, and share your results.

![$CONSOLE $DATA_MODE][console-data_mode]

<NotAvailableFreePlan />

To start using $DATA_MODE, open $CONSOLE and click `Data view`. This includes the following tabs:

- **Files**: browse all your personal and shared queries, dashboards, notebooks, and folders. 
- **Schemas**: view the schemas in your $SERVICE_SHORT.
- **dbt**: [create dbt macros and models][popsql-dbt].
- **$SQL_ASSISTANT_SHORT**: [write, fix, and organize SQL][sql-assistant] faster and more accurately using AI.

Available features are:

- **Real-time collaboration**: work with your team directly in $DATA_MODE with live presence and multiple
  cursors.
- **[Schema browser][schema-browser]**: understand the structure of your $SERVICE_SHORT and see usage data on tables and columns.
- **Autocomplete**: get suggestions as you type your queries.
- **[Version history][version-history]**: access previous versions of a query from the built-in revision history, or connect to a git repo.
- **[Charts][charts]**: visualize data from inside the UI rather than switch to Sheets or Excel.
- **[Schedules][create-schedule]**: automatically refresh queries and dashboards to create push alerts.
- **[Query variables][query-variables]**: use Liquid to parameterize your queries or use `if` statements.
- **Cross-platform support**: work from [$CONSOLE][portal-data-mode] or download the [desktop app][popsql-desktop] for macOS, Windows, and Linux.
- **Easy connection**: connect to $CLOUD_LONG, $PG, Redshift, Snowflake, BigQuery, MySQL, SQL Server, [and more][popsql-connections].

To connect to a $SERVICE_SHORT in $DATA_MODE:

<Procedure>

1. **Check your $SERVICE_SHORT is running correctly**

   In [$CONSOLE][services-portal], check that your $SERVICE_SHORT is marked as `Running`:

   ![Check $SERVICE_LONG is running][check-service_long-is-running]

1. **Connect to your $SERVICE_SHORT**

   Click [`Data view`][portal-data-mode] in $CONSOLE, then select a $SERVICE_SHORT in the connection drop-down:

   ![Select a connection][select-a-connection]

1. **Run a test query**

   Type `SELECT CURRENT_DATE;` in `Scratchpad` and click `Run`:

   ![Run a simple query][run-a-simple-query]

Quick recap. You:
- Manage your $SERVICE_SHORTs in [$CONSOLE][services-portal]
- Manage your data in [$DATA_MODE in $CONSOLE][portal-data-mode]
- Store configuration and security information in your config file.

</Procedure>

Now you have used $DATA_MODE in $CONSOLE, see how to easily do the following:

- [Write a query][write-query]
- [Share a query with your teammates][share-query]
- [Create a chart from your data][charts]
- [Create a dashboard of multiple query results][create-dashboard]
- [Create schedules for your queries][create-schedule]

### $SQL_ASSISTANT_SHORT

$SQL_ASSISTANT_SHORT in [$DATA_MODE][portal-data-mode] is a chat-like interface that harnesses the power of AI to help you write, fix, and organize SQL faster and more accurately. Ask $SQL_ASSISTANT_SHORT to change existing queries, write new ones from scratch, debug error messages, optimize for query performance, add comments, improve readability—and really, get answers to any questions you can think of.

![$SQL_ASSISTANT](https://assets.timescale.com/docs/images/tiger-cloud-console/sql-assistant-in-action.png)

<!--
<div class="relative w-fit mx-auto">

<iframe width="1120" height="630" style="max-width:100%"  src="https://www.youtube.com/embed/3Droej_E0cQ?si=C4RoL_PFpr8E5QtC" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

</div>
-->

#### Key capabilities

$SQL_ASSISTANT_SHORT offers a range of features to improve your SQL workflow, including:

- **Real-time help**: $SQL_ASSISTANT_SHORT provides in-context help for writing and understanding SQL. Use it to:

  - **Understand functions**: need to know how functions like `LAG()` or `ROW_NUMBER()` work? $SQL_ASSISTANT_SHORT explains it with examples.
  - **Interpret complex queries**: $SQL_ASSISTANT_SHORT breaks down dense queries, giving you a clear view of each part.

- **Error resolution**: $SQL_ASSISTANT_SHORT diagnoses errors as they happen, you can resolve issues without leaving your editor. Features include:

  - **Error debugging**: if your query fails, $SQL_ASSISTANT_SHORT identifies the issue and suggests a fix.
  - **Performance tuning**: for slow queries, $SQL_ASSISTANT_SHORT provides optimization suggestions to improve performance immediately.

- **Query organization**: to keep your query library organized, and help your team understand the
  purpose of each query, $SQL_ASSISTANT_SHORT automatically adds titles and summaries to your queries.

- **Agent mode**: to get results with minimal involvement from you, $SQL_ASSISTANT_SHORT autopilots through complex tasks and troubleshoots its own problems. No need to go step by step, analyze errors, and try out solutions. Simply turn on the agent mode in the LLM picker and watch $SQL_ASSISTANT_SHORT do all the work for you. Recommended for use when your database connection is configured with read-only credentials.

#### Supported LLMs

$SQL_ASSISTANT_SHORT supports a large number of LLMs, including:

- GPT-4o mini
- GPT-4o
- GPT-4.1 nano
- GPT-4.1 mini
- GPT-4.1
- o4-mini (low)
- o4-mini
- o4-mini (high)
- o3 (low)
- o3
- o3 (high)
- Claude 3.5 Haiku
- Claud 3.7 Sonnet
- Claud 3.7 Sonnet (extended thinking)
- Llama 3.3 70B Versatile
- Llama 3.3 70B Instruct
- Llama 3.1 405B Instruct
- Llama 4 Scout
- Llama 4 Maverick
- DeepSeek R1 Distill - Llama 3.3. 70B
- DeepSeek R1
- Gemini 2.0 Flash
- Sonnet 4
- Sonnet 4 (extended thinking)
- Opus 4
- Opus 4 (extended thinking)

Choose the LLM based on the particular task at hand. For simpler tasks, try the smaller and faster models like Gemini Flash, Haiku, or o4-mini. For more complex tasks, try the larger reasoning models like Claude Sonnet, Gemini Pro, or o3. We provide a description of each model to help you decide.

#### Limitations to keep in mind

For best results with $SQL_ASSISTANT_SHORT:

* **Schema awareness**: $SQL_ASSISTANT_SHORT references schema data but may need extra context
  in complex environments. Specify tables, columns, or joins as needed.
* **Business logic**: $SQL_ASSISTANT_SHORT does not inherently know specific business terms
  such as active user. Define these terms clearly to improve results.

#### Security, privacy, and data usage

Security and privacy is prioritized in $CONSOLE. In [$DATA_MODE][portal-data-mode], $PROJECT_SHORT members
manage $SQL_ASSISTANT_SHORT settings under [`Preferences` > `SQL Assistant`][sql-editor-settings].

![SQL assistant settings][sql-assistant-settings]

$SQL_ASSISTANT_SHORT settings are:

* **Opt-in features**: all AI features are off by default. Only [members][projects] of your $PROJECT_LONG
  can enable them.
* **Data protection**: your data remains private as $SQL_ASSISTANT_SHORT operates with strict security protocols. To provide AI support, $CONSOLE_LONG may share your currently open SQL document, some basic metadata about your database, and portions of your database schema. By default, $CONSOLE_LONG **does not include** any data from query results, but you can opt in to include this context to improve the results.
* **Sample data**: to give the LLM more context so you have better SQL suggestions, enable sample data sharing in the $SQL_ASSISTANT_SHORT preferences.
* **Telemetry**: to improve $SQL_ASSISTANT_SHORT, $COMPANY collects telemetry and usage data, including prompts, responses, and query metadata.

### $DATA_MODE FAQ

#### What if my service is within a vpc?

If your $SERVICE_LONG runs inside a $VPC, do one of the following to enable access for the $POPSQL desktop app:

- Use $POPSQL's [bridge connector][bridge-connector].
- Use an SSH tunnel: when you configure the connection in $POPSQL, under `Advanced Options` enable `Connect over SSH`.
- Add $POPSQL's static IPs (`23.20.131.72, 54.211.234.135`) to your allowlist.

#### What happens if another member of my $PROJECT_LONG uses $DATA_MODE?

The number of $DATA_MODE seats you are allocated depends on your [$PRICING_PLAN][pricing-plan-features].

#### Will using $DATA_MODE affect the performance of my $SERVICE_LONG?

There are a few factors to consider:

1. What instance size is your $SERVICE_SHORT?
1. How many users are running queries?
1. How computationally intensive are the queries?

If you have a small number of users running performant SQL queries against a
$SERVICE_SHORT with sufficient resources, then there should be no degradation to
performance. However, if you have a large number of users running queries, or if
the queries are computationally expensive, best practice is to create
a [$READ_REPLICA][read-replica] and send analytical queries there.

If you'd like to prevent write operations such as insert or update, instead
of using the `tsdbadmin` user, create a read-only user for your $SERVICE_SHORT and
use that in $DATA_MODE.


## $SQL_EDITOR

$SQL_EDITOR is an integrated secure UI that you use to run queries and see the results
for a $SERVICE_LONG.

![$CONSOLE $SQL_EDITOR][console-sql_editor]

To enable or disable $SQL_EDITOR in your $SERVICE_SHORT, click `Operations` > `Service management`, then
update the setting for $SQL_EDITOR.

To use $SQL_EDITOR:

<Procedure>

1.  **Open $SQL_EDITOR from $CONSOLE**

    In $CONSOLE, select a $SERVICE_SHORT, then click `SQL editor`.

    ![Check $SERVICE_SHORT is running][check-service_short-is-running]

1. **Run a test query**

    Type `SELECT CURRENT_DATE;` in the UI and click `Run`. The results appear in the lower window:

    ![Run a simple query][run-a-simple-query-1]

</Procedure>

## Cloud $SQL_EDITOR licenses

* **$SQL_EDITOR**: free for anyone with a [$ACCOUNT_LONG][create-cloud-account].
* **$DATA_MODE**: the number of seats you are allocated depends on your [$PRICING_PLAN][pricing-plan-features].

  [$SQL_ASSISTANT_SHORT][sql-assistant] is currently free for all users. In the future, limits or paid options may be
  introduced as we work to build the best experience.
* **$POPSQL standalone**: there is a free plan available to everyone, as well as paid plans. See  [$POPSQL Pricing][popsql-pricing] for full details.

<WhereNext />

[bridge-connector]: https://docs.popsql.com/docs/bridge-connector
[charts]: https://docs.popsql.com/docs/creating-charts
[check-service_long-is-running]: https://assets.timescale.com/docs/images/tiger-on-azure/tiger-console-services-view.png
[check-service_short-is-running]: https://assets.timescale.com/docs/images/tiger-on-azure/tiger-console-ops-mode-sql-editor-empty.png
[console-data_mode]: https://assets.timescale.com/docs/images/tiger-cloud-console/tiger-console-data-mode.png
[console-sql_editor]: https://assets.timescale.com/docs/images/tiger-on-azure/tiger-console-ops-mode-sql-editor.png
[create-cloud-account]: /getting-started/:currentVersion:/services/#create-an-account
[create-dashboard]: https://docs.popsql.com/docs/creating-dashboards
[create-schedule]: https://docs.popsql.com/docs/scheduled-queries
[integrations]: /integrations/:currentVersion:/
[popsql-connections]: https://popsql.com/connections
[popsql-desktop]: https://popsql.com/download
[popsql-pricing]: https://popsql.com/pricing
[popsql]: /getting-started/:currentVersion:/run-queries-from-console/#data-mode
[portal-data-mode]: https://console.cloud.timescale.com/dashboard/services?popsql
[pricing-plan-features]: https://www.tigerdata.com/pricing#features
[projects]: /use-timescale/:currentVersion:/security/members/
[psql]: /integrations/:currentVersion:/psql/
[query-variables]: https://docs.popsql.com/docs/query-variables
[readreplica]: /use-timescale/:currentVersion:/ha-replicas/read-scaling/
[run-a-simple-query-1]: https://assets.timescale.com/docs/images/tiger-on-azure/run-a-query-in-tiger-ops-mode-sql-editor.png
[run-a-simple-query]: https://assets.timescale.com/docs/images/tiger-cloud-console/run-query-in-scratchpad-tiger-console.png
[schema-browser]: https://docs.popsql.com/docs/schema
[select-a-connection]: https://assets.timescale.com/docs/images/tiger-cloud-console/tiger-console-data-mode-connection-dropdown.png
[services-portal]: https://console.cloud.timescale.com/dashboard/services
[share-query]: https://docs.popsql.com/docs/sharing-a-link-to-your-query-and-results
[sql-assistant-settings]: https://assets.timescale.com/docs/images/tiger-console-sql-editor-preferences.png
[popsql-dbt]: https://popsql.com/dbt
[read-replica]: /use-timescale/:currentVersion:/ha-replicas/read-scaling/
[sql-assistant]: /getting-started/:currentVersion:/run-queries-from-console/#sql-assistant
[sql-editor-settings]: https://console.cloud.timescale.com/dashboard/settings?popsql=%2Fpreferences%2Fai
[sql-editor]: /getting-started/:currentVersion:/run-queries-from-console/#ops-mode-sql-editor
[version-history]: https://docs.popsql.com/docs/version-history
[write-query]: https://docs.popsql.com/docs/writing-a-query
