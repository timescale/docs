---
title: Run your queries from Timescale Console
excerpt: Use the data mode or SQL editor to run SQL queries, create charts and dashboards, and collaborate with teammates.
keywords: [popsql, sql editor, chart, dashboard]
layout_components: [next_prev_large]
content_group: Getting started
---

# Run your queries from $CONSOLE

As $CLOUD_LONG is based on PostgreSQL, you can use lots of [different tools][integrations] to 
connect to your $SERVICE_SHORT and interact with your data. 

In $CONSOLE you can use the following ways to run SQL queries against your database:

- [$DATA_MODE_CAP][run-popsql]: a rich experience powered by $POPSQL. You can write queries with 
  autocomplete, save them in folders, share them, create charts/dashboards, and much more.

- [$SQL_EDITOR in the $OPS_MODE][run-sqleditor]: a simple $SQL_EDITOR in the $OPS_MODE that lets you run ad-hoc ephemeral 
  queries. This is useful for quick one-off tasks like creating an index on a small table or 
  inspecting `pg_stat_statements`.

If you prefer the command line to the $OPS_MODE $SQL_EDITOR in $CONSOLE, use [psql][install-psql].

## $DATA_MODE_CAP

You use the $DATA_MODE in $CONSOLE to write queries, visualize data, and share your results. 

![Screenshot of data mode](https://assets.timescale.com/docs/images/data-mode-schema-chart.png)

Available features are:

- **Real-time collaboration**: work with your team directly in the $DATA_MODE query editor with live presence and multiple 
   cursors.
- **[Schema browser](https://docs.popsql.com/docs/schema)**: understand the structure of your database and see usage data on tables and columns.
- **Autocomplete**: get suggestions as you type your queries.
- **[Version history](https://docs.popsql.com/docs/version-history)**: access previous versions of a query from the built-in revision history, or connect to a 
  git repo.
- **[Charts](https://docs.popsql.com/docs/creating-charts)**: visualize data from inside the UI rather than switch to Sheets or Excel.
- **[Schedules](https://docs.popsql.com/docs/scheduled-queries)**: automatically refresh queries and dashboards to create push alerts.
- **[Query variables](https://docs.popsql.com/docs/query-variables)**: use Liquid to parameterize your queries or use `if` statements.
- **Cross-platform**:  work from [$CONSOLE][portal-data-mode] or download the 
  [desktop](https://popsql.com/download) app for macOS, Windows, and Linux.
- **Easy connection**: to $CLOUD_LONG, PostgreSQL, Redshift, Snowflake, BigQuery, MySQL, SQL Server, [and more](https://popsql.com/connections).

### Connect to your $SERVICE_LONG in the $DATA_MODE

<Procedure>

To connect to a $SERVICE_SHORT:

1. **Check your $SERVICE_SHORT is running correctly**

   In [$CONSOLE][services-portal], check that your $SERVICE_SHORT is marked as `Running`.

   ![Check $SERVICE_SHORT is running](https://assets.timescale.com/docs/images/console-services-view.png)

1. **Connect to your $SERVICE_SHORT**

   In the [$DATA_MODE][portal-data-mode] in $CONSOLE, select a $SERVICE_SHORT and enter your password, then click **Connect**.

   ![Select a connection](https://assets.timescale.com/docs/images/data-mode-connections.png)

   You find your password in the config file you downloaded when you created the $SERVICE_SHORT.

1. **Run a test query**

   Type `SELECT CURRENT_DATE;` in `Scratchpad` and press `Run`: 

   ![Run a simple query](https://assets.timescale.com/docs/images/data-mode-scratchpad.png)


Quick recap. You:
- Manage your $SERVICE_SHORTs in the [$OPS_MODE in $CONSOLE][portal-ops-mode].
- Manage your data in the [$DATA_MODE in $CONSOLE][portal-data-mode].
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

### FAQ

#### What if my $SERVICE_SHORT is within a VPC?

If your $SERVICE_LONG runs inside a VPC, do one of the following to enable access for the $POPSQL desktop app:

- Use $POPSQL's [bridge connector](https://docs.popsql.com/docs/bridge-connector)
- Use an SSH tunnel
  - When you configure the connection in $POPSQL, under `Advanced Options`, enable `Connect over SSH`
- Add $POPSQL's static IPs (`23.20.131.72, 54.211.234.135`) to your allowlist

#### What happens if another member of my $COMPANY project uses the $DATA_MODE?

The number of $DATA_MODE seats you are allocated depends on your
[Pricing Plan][pricing-plan-features].

#### Will using the $DATA_MODE affect the performance of my $SERVICE_LONG?

There are a few factors to consider:

1. What instance size is your database?
1. How many users are running queries?
1. How computationally intensive are the queries?

If you have a small number of users running performant SQL queries against a
$SERVICE_SHORT with sufficient resources, then there should be no degradation to
performance. However, if you have a large number of users running queries, or if 
the queries are computationally expensive, best practice is to create 
a [$READ_REPLICA][readreplica] and send analytical queries there.

If you'd like to prevent write operations such as insert or update, instead 
of using the `tsdbadmin` superuser, create a read-only user for your $SERVICE_SHORT and
use that in the $DATA_MODE.



## $OPS_MODE_CAP $SQL_EDITOR

$SQL_EDITOR is an integrated secure UI that you use to run queries and see the results
for a $SERVICE_LONG.

![Screenshot of SQL editor](https://assets.timescale.com/docs/images/sqleditor.png)

To enable or disable $SQL_EDITOR in your $SERVICE_SHORT, click `Operations` > `Service management`, then
update the setting for $SQL_EDITOR.

### Run queries from the $OPS_MODE in $CONSOLE

<Procedure>

To use $SQL_EDITOR with $COMPANY:

1.  **Open $SQL_EDITOR from $CONSOLE**

    In the [$OPS_MODE][portal-ops-mode] in $CONSOLE, select a $SERVICE_SHORT, then click **$SQL_EDITOR**.

    ![Check service is running](https://assets.timescale.com/docs/images/ops-view-sql-editor.png)

4. **Run a test query**

   Type your query in the UI, then click `Run`. The results appear in the lower window.

</Procedure>


## $CLOUD_EDITOR licenses

* **$SQL_EDITOR in the $OPS_MODE**: free for anyone with a [$CLOUD_LONG account][create-cloud-account].
* **$DATA_MODE_CAP**: the number of seats you are allocated depends on your [Pricing Plan][pricing-plan-features].
* **$POPSQL standalone**: there is a free plan available to everyone, as well as paid plans. See [$POPSQL Pricing](https://popsql.com/pricing) for full 
  details.



[readreplica]: /use-timescale/:currentVersion:/ha-replicas/read-scaling/
[run-popsql]: /getting-started/:currentVersion:/run-queries-from-console/#data-mode
[run-sqleditor]: /getting-started/:currentVersion:/run-queries-from-console/#sql-editor
[integrations]: /use-timescale/:currentVersion:/integrations/query-admin/
[timescale-console]: https://console.cloud.timescale.com/
[portal-ops-mode]: https://console.cloud.timescale.com/dashboard/services
[pricing-plan-features]: https://www.timescale.com/pricing#features
[install-psql]: /use-timescale/:currentVersion:/integrations/query-admin/psql/
[create-cloud-account]: /getting-started/:currentVersion:/services/#create-a-timescale-cloud-account
[portal-data-mode]: https://console.cloud.timescale.com/dashboard/services?popsql
[services-portal]: https://console.cloud.timescale.com/dashboard/services
