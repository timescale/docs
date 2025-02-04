---
title: Run your queries from Timescale Console
excerpt: Use the data mode or SQL editor to run SQL queries, create charts and dashboards, and collaborate with teammates.
keywords: [popsql, sql editor, chart, dashboard]
layout_components: [next_prev_large]
content_group: Getting started
---

# Run your queries from Timescale Console

As Timescale Cloud is based on PostgreSQL, you can use lots of [different tools][integrations] to 
connect to your service and interact with your data. 

In Timescale Console you can use the following ways to run SQL queries against your database:

- [Data mode][run-popsql]: a rich experience powered by PopSQL. You can write queries with 
  autocomplete, save them in folders, share them, create charts/dashboards, and much more.

- [SQL Assistant in Data mode][sql-assistant]: write, fix, and organize SQL faster and more accurately.

- [SQL editor in Ops mode][run-sqleditor]: a simple SQL editor in Ops mode that lets you run ad-hoc ephemeral 
  queries. This is useful for quick one-off tasks like creating an index on a small table or 
  inspecting `pg_stat_statements`.


If you prefer the command line to the ops mode SQL editor in Timescale Console, use [psql][install-psql].

## Data mode

You use the data mode in Timescale Console to write queries, visualize data, and share your results. 

![Screenshot of data mode](https://assets.timescale.com/docs/images/data-mode-schema-chart.png)

Available features are:

- **Real-time collaboration**: work with your team directly in the data mode query editor with live presence and multiple 
   cursors.
- **[Schema browser](https://docs.popsql.com/docs/schema)**: understand the structure of your database and see usage data on tables and columns.
- **[SQL Assistant][sql-assistant]**: write, fix, and organize SQL faster and more accurately using AI.
- **Autocomplete**: get suggestions as you type your queries.
- **[Version history](https://docs.popsql.com/docs/version-history)**: access previous versions of a query from the built-in revision history, or connect to a 
  git repo.
- **[Charts](https://docs.popsql.com/docs/creating-charts)**: visualize data from inside the UI rather than switch to Sheets or Excel.
- **[Schedules](https://docs.popsql.com/docs/scheduled-queries)**: automatically refresh queries and dashboards to create push alerts.
- **[Query variables](https://docs.popsql.com/docs/query-variables)**: use Liquid to parameterize your queries or use `if` statements.
- **Cross platform**:  works from [Timescale Console][portal-data-mode] or download the 
  [desktop](https://popsql.com/download) app for macOS, Windows, and Linux.
- **Easy connection**: to Timescale Cloud, PostgreSQL, Redshift, Snowflake, BigQuery, MySQL, SQL Server, [and more](https://popsql.com/connections).

### Connect to your Timescale Cloud service in the data mode

<Procedure>

To connect to a service:

1. **Check your service is running correctly**

   In [Timescale Console][services-portal], check that your service is marked as `Running`.

   ![Check service is running](https://assets.timescale.com/docs/images/console-services-view.png)

1. **Connect to your service**

   1. In the [data mode][portal-data-mode] in $CONSOLE, select a service in the connection drop-down. 
   1. Click the pencil icon next to the service name. 

      ![Select a connection](https://assets.timescale.com/docs/images/data-mode-connections.png)
   
   1. Click `Edit` next to `Username/Password` and enter [your connection details][connection-info] for this service, then click `Connect`.

1. **Run a test query**

   Type `SELECT CURRENT_DATE;` in `Scratchpad` and press `Run`: 

   ![Run a simple query](https://assets.timescale.com/docs/images/data-mode-scratchpad.png)


Quick recap. You:
- Manage your services in the [ops mode in Timescale Console][portal-ops-mode]
- Manage your data in the [data mode in Timescale Console][portal-data-mode]
- Store configuration and security information in your config file.

</Procedure>


Now you have used the data mode in Timescale Console, see how to easily do the following:

- [Write a query](https://docs.popsql.com/docs/writing-a-query)
- [Share a query with your
  teammates](https://docs.popsql.com/docs/sharing-a-link-to-your-query-and-results)
- [Create a chart from your
  data](https://docs.popsql.com/docs/creating-charts)
- [Create a dashboard of multiple query
  results](https://docs.popsql.com/docs/creating-dashboards)
- [Create schedules for your
  queries](https://docs.popsql.com/docs/scheduled-queries)

### Data Mode FAQ

#### What if my service is within a VPC?

If your Timescale Service runs inside a VPC, do one of the following to enable access for the PopSQL desktop app:

- Use PopSQL's [bridge connector](https://docs.popsql.com/docs/bridge-connector)
- Use an SSH tunnel
  - When you configure the connection in PopSQL, under `Advanced Options`, enable `Connect over SSH`
- Add PopSQL's static IPs (`23.20.131.72, 54.211.234.135`) to your allowlist

#### What happens if another member of my Timescale project uses data mode?

The number of data mode seats you are allocated depends on your
[Pricing Plan][pricing-plan-features].

#### Will using the data mode affect the performance of my Timescale Cloud service?

There are a few factors to consider:

1. What instance size is your database?
1. How many users are running queries?
1. How computationally intensive are the queries?

If you have a small number of users running performant SQL queries against a
service with sufficient resources, then there should be no degradation to
performance. However, if you have a large number of users running queries, or if
the queries are computationally expensive, best practice is to create
a [read replica][readreplica] and send analytical queries there.

If you'd like to prevent write operations such as insert or update. Instead
of using the `tsdbadmin` superuser, create a read-only user for your service and
use that in the data mode.


## SQL Assistant

SQL Assistant in [$CONSOLE][portal-data-mode] helps you write, fix, and organize SQL faster and more accurately.

<div class="relative w-fit mx-auto">

<iframe width="1120" height="630" style="max-width:100%"  src="https://www.youtube.com/embed/3Droej_E0cQ?si=C4RoL_PFpr8E5QtC" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

</div>

### Key Capabilities

SQL Assistant offers a range of features to improve your SQL workflow, including:

- **Real-Time Help**: SQL Assistant provides in-context help for writing and understanding SQL. Use it to:

  - **Understand functions**: need to know how functions like `LAG()` or `ROW_NUMBER()` work? SQL Assistant explains it with examples.
  - **Interpret complex queries**: SQL Assistant breaks down dense queries, giving you a clear view of each part.

- **Error resolution**: SQL Assistant diagnoses errors as they happen, you can resolve issues without leaving your editor. Features include:

  - **Error debugging**: if your query fails, SQL Assistant identifies the issue and suggests a fix.
  - **Performance tuning**: for slow queries, SQL Assistant provides optimization suggestions to improve performance immediately.

- **Query organization**: to keep your query library organized, and help your team understand the
  purpose of each query, SQL Assistant automatically adds titles and summaries to your queries.

### Limitations to keep in mind

For best results with SQL Assistant:

* **Schema Awareness**: SQL Assistant references schema data but may need extra context
  in complex environments. Specify tables, columns, or joins as needed.
* **Business Logic**: SQL Assistant does not inherently know specific business terms
  such as _active user_. Define these terms clearly to improve results.


### Security, privacy and data usage

Security and privacy is prioritized in $CONSOLE. In [Data Mode][portal-data-mode], project members
manage SQL Assistant settings under [**User name** > **Settings** > **SQL Assistant**][sql-editor-settings].

![SQL Assistant settings](https://assets.timescale.com/docs/images/sql-editor-preferences.png)

SQL Assistant settings are:
* **Opt-In Features**: all AI features are off by default. Only [members][project-members] of your $CLOUD_LONG project
  can enable them.
* **Data Protection**: your queries and data remain private and are not used for AI training.
  SQL Assistant operates with strict security protocols.
* **Data Usage**: to provide AI support, $COMPANY may share the query title, description and body, also the
  database connection type such as PostgreSQL, and the schema.
* **Sample data**: to give the LLM more context so you have better SQL suggestions, enable sample data sharing in the
  SQL assistant preferences.
* **Telemetry**: to improve SQL Assistant, $COMPANY collects telemetry and usage data, including prompts, responses,
  and query metadata.


## Ops mode SQL editor

SQL editor is an integrated secure UI that you use to run queries and see the results
for an Timescale Cloud service.

![Screenshot of SQL editor](https://assets.timescale.com/docs/images/sqleditor.png)

To enable or disable SQL editor in your service, click `Operations` > `Service management`, then
update the setting for SQL editor.

### Run queries from the ops mode in Timescale Console

<Procedure>

To use SQL editor with Timescale:

1.  **Open SQL editor from Timescale Console**

    In the [ops mode][portal-ops-mode] in Timescale Console, select a service, then click **SQL editor**.

    ![Check service is running](https://assets.timescale.com/docs/images/ops-view-sql-editor.png)

4. **Run a test query**

   Type your query in the UI, then click `Run`. The results appear in the lower window.

</Procedure>


## Cloud SQL editor licenses

* **SQL editor in the ops mode**: free for anyone with a [Timescale Cloud account][create-cloud-account].
* **Data mode**: the number of seats you are allocated depends on your [Pricing Plan][pricing-plan-features].
  [SQL Assistant][sql-assistant] is currently free for all users. In the future, limits or paid options may be
  introduced as we work to build the best experience.
* **PopSQL standalone**: there is a free plan available to everyone, as well as paid plans. See  [PopSQL Pricing](https://popsql.com/pricing) for full 
  details.



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