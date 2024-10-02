---
title: Run your queries from Timescale Console
excerpt: Use Data mode or SQL editor to run SQL queries, create charts and dashboards, and collaborate with teammates.
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

- [SQL editor][run-sqleditor]: a simple UI in Ops mode that you use to run ad-hoc ephemeral 
  queries. This is useful for quick one-off tasks like creating an index on a small table or 
  inspecting pg_stat_statements.


If you prefer the command line to Ops mode SQL editors in Timescale Console, use [psql][install-psql].

## Data mode

You use `Data` in Timescale Console to write queries, visualize data, and share your results. 

![Screenshot of Data](https://assets.timescale.com/docs/images/data-mode-schema-chart.png)

Available features are:

- **Real-time collaboration**: work with your team directly in the Data query editor with live presence and multiple 
   cursors.
- **[Schema browser](https://docs.popsql.com/docs/schema)**: understand the structure of your database and see usage data on tables and columns.
- **Autocomplete**: get suggestions as you type your queries.
- **[Version history](https://docs.popsql.com/docs/version-history)**: access previous versions of a query from the built-in revision history, or connect to a 
  git repo.
- **[Charts](https://docs.popsql.com/docs/creating-charts)**: visualize data from inside the UI rather than switch to Sheets or Excel.
- **[Schedules](https://docs.popsql.com/docs/scheduled-queries)**: automatically refresh queries and dashboards to create push alerts.
- **[Query variables](https://docs.popsql.com/docs/query-variables)**: use Liquid to parameterize your queries or use `if` statements.
- **Cross platform**:  works from [Timescale Console][portal-data-mode] or download the 
  [desktop](https://popsql.com/download) app for macOS, Windows, and Linux.
- **Easy connection**: to Timescale Cloud, PostgreSQL, Redshift, Snowflake, BigQuery, MySQL, SQL Server, [and more](https://popsql.com/connections).

### Connect to your Timescale Cloud service in Data mode

<Procedure>

To connect to a service:

1. **Check your service is running correctly**

   In [Timescale Console][services-portal], check that your service is marked as `Running`.

   ![Check service is running](https://assets.timescale.com/docs/images/console-services-view.png)

1. **Connect to your service**

   1. In [`Data` in Timescale Console][portal-data-mode], select a service and enter your password, then click `Connect`.

      ![Select a connection](https://assets.timescale.com/docs/images/data-mode-connections.png)

      You find your password in the config file you downloaded when you created the service.

1. **Run a test query**

   Type `SELECT CURRENT_DATE;` in `Scratchpad` and press `Run`: 

   ![Run a simple query](https://assets.timescale.com/docs/images/data-mode-scratchpad.png)


Quick recap. You:
- Manage your services in the [`Ops` in Timescale Console][portal-ops-mode]
- Manage your data in [`Data` in Timescale Console][portal-data-mode]
- Store configuration and security information in your config file.

</Procedure>


Now you have used Data mode in Timescale Console, see how to easily do the following:

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

#### What if my service is within a VPC?

If your Timescale Service runs inside a VPC, do one of the following to enable access for the PopSQL desktop app:

- Use PopSQL's [bridge connector](https://docs.popsql.com/docs/bridge-connector)
- Use an SSH tunnel
  - When you configure the connection in PopSQL, under `Advanced Options`, enable `Connect over SSH`
- Add PopSQL's static IPs (`23.20.131.72, 54.211.234.135`) to your allowlist

#### What happens if another member of my Timescale project Data mode?

The number of Data mode seats you are allocated depends on your
[Pricing Plan][pricing-plan-features].

#### Will using Data mode affect the performance of my Timescale Cloud service?

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
use that in Data mode.



## Ops mode SQL editor

SQL editor is an integrated secure UI that you use to run queries and see the results
for an Timescale Cloud service.

![Screenshot of SQL editor](https://assets.timescale.com/docs/images/sqleditor.png)

To enable or disable SQL editor in your service, click `Operations` > `Service management`, then
update the setting for SQL editor.

### Run queries from Ops Mode in Timescale Console

<Procedure>

To use SQL editor with Timescale:

1.  **Open SQL editor from Timescale Console**

    In [`Ops` in Timescale Console][portal-ops-mode], select a service, then click `SQL editor`.

    ![Check service is running](https://assets.timescale.com/docs/images/ops-view-sql-editor.png)

4. **Run a test query**

   Type your query in the UI, then click `Run`. The results appear in the lower window.

</Procedure>


## Cloud SQL editor licenses

* **SQL editor**: free for anyone with a [Timescale Cloud account][create-cloud-account].
* **Data mode with Timescale Cloud**: the number of Cloud SQL editor seats you are allocated depends on your 
  [Pricing Plan][pricing-plan-features].
* **PopSQL standalone**: there is a free plan available to everyone, as well as paid plans. See  [PopSQL Pricing](https://popsql.com/pricing) for full 
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
