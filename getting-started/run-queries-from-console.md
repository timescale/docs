---
title: Run your queries from Timescale Console
excerpt: Choose the right tool to manage your data. Timescale Cloud offers the data mode, the SQL editor, and the SQL Assistant to better address your needs
keywords: [popsql, sql editor, chart, dashboard]
layout_components: [next_prev_large]
content_group: Getting started
---

import WhereNext from "versionContent/_partials/_where-to-next.mdx";

# Run your queries from $CONSOLE

As $CLOUD_LONG is based on $PG, you can use lots of [different tools][integrations] to 
connect to your $SERVICE_SHORT and interact with your data. 

In $CONSOLE you can use the following ways to run SQL queries against your $SERVICE_SHORT:

- [$DATA_MODE_CAP][run-popsql]: a rich experience powered by $POPSQL. You can write queries with 
  autocomplete, save them in folders, share them, create charts/dashboards, and much more.

- [$SQL_ASSISTANT_SHORT in the $DATA_MODE][sql-assistant]: write, fix, and organize SQL faster and more accurately.

- [$SQL_EDITOR in the $OPS_MODE][run-sqleditor]: a simple $SQL_EDITOR in the $OPS_MODE that lets you run ad-hoc ephemeral 
  queries. This is useful for quick one-off tasks like creating an index on a small table or 
  inspecting `pg_stat_statements`.

If you prefer the command line to the $OPS_MODE $SQL_EDITOR in $CONSOLE, use [psql][install-psql].

## $DATA_MODE_CAP

You use the $DATA_MODE in $CONSOLE to write queries, visualize data, and share your results. 

![$CONSOLE $DATA_MODE](https://assets.timescale.com/docs/images/data-mode-schema-chart.png)

Available features are:

- **Real-time collaboration**: work with your team directly in the $DATA_MODE query editor with live presence and multiple 
   cursors.
- **[Schema browser](https://docs.popsql.com/docs/schema)**: understand the structure of your $SERVICE_SHORT and see usage data on tables and columns.
- **[$SQL_ASSISTANT_SHORT][sql-assistant]**: write, fix, and organize SQL faster and more accurately using AI.
- **Autocomplete**: get suggestions as you type your queries.
- **[Version history](https://docs.popsql.com/docs/version-history)**: access previous versions of a query from the built-in revision history, or connect to a 
  git repo.
- **[Charts](https://docs.popsql.com/docs/creating-charts)**: visualize data from inside the UI rather than switch to Sheets or Excel.
- **[Schedules](https://docs.popsql.com/docs/scheduled-queries)**: automatically refresh queries and dashboards to create push alerts.
- **[Query variables](https://docs.popsql.com/docs/query-variables)**: use Liquid to parameterize your queries or use `if` statements.
- **Cross-platform**:  works from [$CONSOLE][portal-data-mode] or download the 
  [desktop](https://popsql.com/download) app for macOS, Windows, and Linux.
- **Easy connection**: to $CLOUD_LONG, $PG, Redshift, Snowflake, BigQuery, MySQL, SQL Server, [and more](https://popsql.com/connections).

### Connect to your $SERVICE_LONG in the $DATA_MODE

<Procedure>

To connect to a $SERVICE_SHORT:

1. **Check your $SERVICE_SHORT is running correctly**

   In [$CONSOLE][services-portal], check that your $SERVICE_SHORT is marked as `Running`.

   ![Check $SERVICE_LONG is running](https://assets.timescale.com/docs/images/console-services-view.png)

1. **Connect to your $SERVICE_SHORT**

   1. In the [$DATA_MODE][portal-data-mode] in $CONSOLE, select a $SERVICE_SHORT in the connection drop-down. 
   1. Click the pencil icon next to the $SERVICE_SHORT name. 

      ![Select a connection](https://assets.timescale.com/docs/images/data-mode-connections.png)
   
   1. Click `Edit` next to `Username/Password` and enter [your connection details][connection-info] for this $SERVICE_SHORT, then click `Connect`.

1. **Run a test query**

   Type `SELECT CURRENT_DATE;` in `Scratchpad` and press `Run`: 

   ![Run a simple query](https://assets.timescale.com/docs/images/data-mode-scratchpad.png)

Quick recap. You:
- Manage your $SERVICE_SHORTS in the [$OPS_MODE in $CONSOLE][portal-ops-mode]
- Manage your data in the [$DATA_MODE in $CONSOLE][portal-data-mode]
- Store configuration and security information in your config file.

</Procedure>

Now you have used the $DATA_MODE in $CONSOLE, see how to easily do the following:

- [Write a query](https://docs.popsql.com/docs/writing-a-query)
- [Share a query with your
  teammates](https://docs.popsql.com/docs/sharing-a-link-to-your-query-and-results)
- [Create a chart from your
  data](https://docs.popsql.com/docs/creating-charts)
- [Create a dashboard of multiple query
  results](https://docs.popsql.com/docs/creating-dashboards)
- [Create schedules for your
  queries](https://docs.popsql.com/docs/scheduled-queries)

### $DATA_MODE_CAP FAQ

#### What if my $SERVICE_SHORT is within a $VPC?

If your $SERVICE_LONG runs inside a $VPC, do one of the following to enable access for the $POPSQL desktop app:

- Use $POPSQL's [bridge connector](https://docs.popsql.com/docs/bridge-connector).
- Use an SSH tunnel: when you configure the connection in $POPSQL, under `Advanced Options` enable `Connect over SSH`.
- Add $POPSQL's static IPs (`23.20.131.72, 54.211.234.135`) to your allowlist.

#### What happens if another member of my $COMPANY project uses the $DATA_MODE?

The number of $DATA_MODE seats you are allocated depends on your [$PRICING_PLAN][pricing-plan-features].

#### Will using the $DATA_MODE affect the performance of my $SERVICE_LONG?

There are a few factors to consider:

1. What instance size is your $SERVICE_SHORT?
1. How many users are running queries?
1. How computationally intensive are the queries?

If you have a small number of users running performant SQL queries against a
$SERVICE_SHORT with sufficient resources, then there should be no degradation to
performance. However, if you have a large number of users running queries, or if
the queries are computationally expensive, best practice is to create
a [$READ_REPLICA][readreplica] and send analytical queries there.

If you'd like to prevent write operations such as insert or update, instead
of using the `tsdbadmin` user, create a read-only user for your $SERVICE_SHORT and
use that in the $DATA_MODE.

## $SQL_ASSISTANT_SHORT

$SQL_ASSISTANT_SHORT in [$CONSOLE][portal-data-mode] helps you write, fix, and organize SQL faster and more accurately.

<div class="relative w-fit mx-auto">

<iframe width="1120" height="630" style="max-width:100%"  src="https://www.youtube.com/embed/3Droej_E0cQ?si=C4RoL_PFpr8E5QtC" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

</div>

### Key capabilities

$SQL_ASSISTANT_SHORT offers a range of features to improve your SQL workflow, including:

- **Real-time help**: $SQL_ASSISTANT_SHORT provides in-context help for writing and understanding SQL. Use it to:

  - **Understand functions**: need to know how functions like `LAG()` or `ROW_NUMBER()` work? $SQL_ASSISTANT_SHORT explains it with examples.
  - **Interpret complex queries**: $SQL_ASSISTANT_SHORT breaks down dense queries, giving you a clear view of each part.

- **Error resolution**: $SQL_ASSISTANT_SHORT diagnoses errors as they happen, you can resolve issues without leaving your editor. Features include:

  - **Error debugging**: if your query fails, $SQL_ASSISTANT_SHORT identifies the issue and suggests a fix.
  - **Performance tuning**: for slow queries, $SQL_ASSISTANT_SHORT provides optimization suggestions to improve performance immediately.

- **Query organization**: to keep your query library organized, and help your team understand the
  purpose of each query, $SQL_ASSISTANT_SHORT automatically adds titles and summaries to your queries.

### Limitations to keep in mind

For best results with $SQL_ASSISTANT_SHORT:

* **Schema awareness**: $SQL_ASSISTANT_SHORT references schema data but may need extra context
  in complex environments. Specify tables, columns, or joins as needed.
* **Business logic**: $SQL_ASSISTANT_SHORT does not inherently know specific business terms
  such as _active user_. Define these terms clearly to improve results.


### Security, privacy, and data usage

Security and privacy is prioritized in $CONSOLE. In [$DATA_MODE][portal-data-mode], project members
manage $SQL_ASSISTANT_SHORT settings under [`User name` > `Settings` > `SQL Assistant`][sql-editor-settings].

![$SQL_ASSISTANT_SHORT settings](https://assets.timescale.com/docs/images/sql-editor-preferences.png)

$SQL_ASSISTANT_SHORT settings are:
* **Opt-in features**: all AI features are off by default. Only [members][project-members] of your $CLOUD_LONG project
  can enable them.
* **Data protection**: your queries and data remain private and are not used for AI training.
  $SQL_ASSISTANT_SHORT operates with strict security protocols.
* **Data usage**: to provide AI support, $COMPANY may share the query title, description and body, also the
  database connection type such as $PG, and the schema.
* **Sample data**: to give the LLM more context so you have better SQL suggestions, enable sample data sharing in the
  $SQL_ASSISTANT_SHORT preferences.
* **Telemetry**: to improve $SQL_ASSISTANT_SHORT, $COMPANY collects telemetry and usage data, including prompts, responses,
  and query metadata.


## $OPS_MODE_CAP $SQL_EDITOR

$SQL_EDITOR is an integrated secure UI that you use to run queries and see the results
for a $SERVICE_LONG.

![$CONSOLE $SQL_EDITOR](https://assets.timescale.com/docs/images/sqleditor.png)

To enable or disable $SQL_EDITOR in your $SERVICE_SHORT, click `Operations` > `Service management`, then
update the setting for $SQL_EDITOR.

### Run queries from the $OPS_MODE in $CONSOLE

<Procedure>

To use $SQL_EDITOR:

1.  **Open $SQL_EDITOR from $CONSOLE**

    In the [$OPS_MODE][portal-ops-mode] in $CONSOLE, select a $SERVICE_SHORT, then click `SQL editor`.

    ![Check $SERVICE_SHORT is running](https://assets.timescale.com/docs/images/ops-view-sql-editor.png)

1. **Run a test query**

   Type your query in the UI, then click `Run`. The results appear in the lower window.

</Procedure>


## Cloud $SQL_EDITOR licenses

* **$SQL_EDITOR in the $OPS_MODE**: free for anyone with a [$CLOUD_LONG account][create-cloud-account].
* **Data mode**: the number of seats you are allocated depends on your [$PRICING_PLAN][pricing-plan-features].
  [$SQL_ASSISTANT_SHORT][sql-assistant] is currently free for all users. In the future, limits or paid options may be
  introduced as we work to build the best experience.
* **$POPSQL standalone**: there is a free plan available to everyone, as well as paid plans. See  [$POPSQL Pricing][popsql-pricing] for full 
  details.


<WhereNext />

[readreplica]: /use-timescale/:currentVersion:/ha-replicas/read-scaling/
[run-popsql]: /getting-started/:currentVersion:/run-queries-from-console/#data-mode
[run-sqleditor]: /getting-started/:currentVersion:/run-queries-from-console/#sql-editor
[integrations]: /use-timescale/:currentVersion:/integrations/
[timescale-console]: https://console.cloud.timescale.com/
[portal-ops-mode]: https://console.cloud.timescale.com/dashboard/services
[pricing-plan-features]: https://www.timescale.com/pricing#features
[install-psql]: /use-timescale/:currentVersion:/integrations/psql/
[create-cloud-account]: /getting-started/:currentVersion:/services/#create-a-timescale-cloud-account
[portal-data-mode]: https://console.cloud.timescale.com/dashboard/services?popsql
[services-portal]: https://console.cloud.timescale.com/dashboard/services
[project-members]: /use-timescale/:currentVersion:/members/
[console]: https://console.cloud.timescale.com
[sql-editor-settings]: https://console.cloud.timescale.com/dashboard/settings?popsql=%2Fpreferences%2Fai
[portal-data-mode]: https://console.cloud.timescale.com/dashboard/services?popsql
[sql-assistant]: /getting-started/:currentVersion:/run-queries-from-console/#sql-assistant
[connection-info]: /use-timescale/:currentVersion:/integrations/find-connection-details/
[popsql-pricing]: https://popsql.com/pricing