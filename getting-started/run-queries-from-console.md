---
title: Run your queries from Timescale Console
excerpt: Use PopSQL or SQL editor to run SQL queries, create charts and dashboards, and collaborate with teammates.
keywords: [popsql, sql editor, chart, dashboard]
---

# Run your queries from Timescale Console

As Timescale Cloud is based on PostgreSQL, you can use lots of [different tools][integrations] to 
connect to your service and interact with your data. To securely manage your date from inside 
Console, Timescale offers the following Cloud SQL editors:

- [SQL editor][run-sqleditor]: a simple UI to run queries for each individual service.
- [PopSQL][run-popsql]: a comprehensive UI that you use to write queries, visualize data, 
   and share your results.

If you prefer the command line to a Cloud SQL editor, use [psql][install-psql].

## SQL editor

SQL editor is an integrated secure UI that you use to run queries and see the results 
for an Timescale Cloud service.

![Screenshot of SQL editor](https://assets.timescale.com/docs/images/sqleditor.png)

To enable or disable SQL editor in your service, click `Operations` > `Service management`, then 
update the setting for SQL editor.

### Run queries from Console with SQL editor

<Procedure>

To use SQL editor with Timescale:

1.  **Open SQL editor from Timescale Console**

    1. In [Timescale Console][timescale-console-services], select a service.
    1. Click `SQL editor`. You can now run queries for this service. 

4. **Run a test query**

    Type your query in the UI, then click `Run`. The results appear in the lower window. 

</Procedure>

## PopSQL

You use [PopSQL](https://popsql.com) to write queries, visualize data, and share your results. 

![Screenshot of PopSQL](https://assets.timescale.com/docs/images/popsql_product_screenshot.png)

Available features are:

- **Cross platform**:  Works as a [web app](https://app.popsql.com) or for [desktop](https://popsql.com/download) on macOS, Windows, and Linux.
- **Easy connection**: To PostgreSQL, Timescale, Redshift, Snowflake, BigQuery, MySQL, SQL
  Server, [and more](https://popsql.com/connections).
- **Real-time collaboration**: Work with your team directly in the SQL query
  editor with live presence and multiple cursors.
- **[Schema browser](https://docs.popsql.com/docs/schema)**: Understand the
  structure of your database and see usage data on tables and columns.
- **Autocomplete**: Get suggestions as you type your queries.
- **[Version history](https://docs.popsql.com/docs/version-history)**: Access previous versions of a query from the built-in revision history, or connect to a git repo.
- **[Charts](https://docs.popsql.com/docs/creating-charts)**: Visualize data from inside your SQL editor rather than 
  switch to Sheets or Excel.
- **[Dashboards](https://docs.popsql.com/docs/creating-dashboards)**: Create
  beautiful SQL-based dashboards.
- **[Schedules](https://docs.popsql.com/docs/scheduled-queries)**: Automatically
  refresh queries and dashboards to create push alerts.
- **[Query variables](https://docs.popsql.com/docs/query-variables)**: Use Liquid to
  parameterize your queries or use `if` statements.

### Connect to your Timescale Cloud service with PopSQL 
<Procedure>

To use PopSQL with Timescale:

1.  **Open PopSQL from Timescale Console**

    Log in to [Timescale Console][timescale-console], then click `PopSQL`. 
  
    ![PopSQL button within Timescale
    Console](https://assets.timescale.com/docs/images/popsql_button_in_console.png)

    You may be prompted to sign into Timescale again.

2. **Link your Timescale and PopSQL accounts** 

   If you use the same email for existing Timescale and PopSQL accounts, these accounts are linked automatically. If you are using PopSQL for the first time, confirm that you want to create a PopSQL account. 

    ![Agree to PopSQL terms](https://assets.timescale.com/docs/images/popsql_terms.png)

   This creates a new PopSQL organization that is associated with your Timescale project.

3. **Connect to a Timescale Service**

    Select a service and enter your credentials, then click `Connect`.

   ![Enter service credentials](https://assets.timescale.com/docs/images/popsql_enter_service_credentials.png)

    If your Timescale service runs in a VPC, follow the instructions in [What if my service
    is inside a VPC?](#what-if-my-service-is-within-a-vpc).

4. **Run a test query**

      You've successfully connected PopSQL to your Timescale service!
      Try running a test query like `select current_date`.
      
      ![Running a test query in PopSQL](https://assets.timescale.com/docs/images/popsql_test_query.png)

</Procedure>

Now you have set up PopSQL, see how to easily do the following:

- [Write a query](https://docs.popsql.com/docs/writing-a-query)
- [Share a query with your
  teammates](https://docs.popsql.com/docs/sharing-a-link-to-your-query-and-results)
- [Create a chart from your
  data](https://docs.popsql.com/docs/creating-charts)
- [Create a dashboard of multiple query
  results](https://docs.popsql.com/docs/creating-dashboards)
- [Create schedules for your
  queries](https://docs.popsql.com/docs/scheduled-queries)



### PopSQL FAQ

#### How do I access PopSQL?

Either:

- When you open Timescale Console, click `PopSQL`:

    ![PopSQL button within Timescale
    Console](https://assets.timescale.com/docs/images/popsql_button_in_console.png)

- In Timescale Console, click  `Project settings`, then click `View Project in
  PopSQL`. 

  ![Timescale project settings](https://assets.timescale.com/docs/images/popsql_project_settings.png)

  This resyncs your Timescale project with your PopSQL organization. Any new services are added automatically.


#### What if my service is within a VPC?

If your Timescale Service runs inside a VPC, do one of the following to enable access for PopSQL:

- Use PopSQL's [bridge connector](https://docs.popsql.com/docs/bridge-connector)
- Use an SSH tunnel
  - When you configure the connection in PopSQL, under `Advanced Options`, enable `Connect over SSH`
- Add PopSQL's static IPs (`23.20.131.72, 54.211.234.135`) to your allowlist

#### What happens if another member of my Timescale project opens PopSQL?

A PopSQL user account is created for the Timescale project member. This 
user is automatically added to your PopSQL organization. Unless you 
[share the connection within PopSQL](https://docs.popsql.com/docs/shared-connections), this 
new user must input their own credentials for each service/connection.

#### Will using PopSQL affect the performance of my Timescale Cloud service?

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
use that within PopSQL.

## Cloud SQL editor seats

* **Timescale Cloud**: the number of Cloud SQL editor seats you are allocated depends on your 
  [Pricing Plan][pricing-plan-features].
* **PopSQL**: there is a free plan available to everyone, as well as paid plans. See  [PopSQL Pricing](https://popsql.com/pricing) for full 
  details.



[readreplica]: /use-timescale/:currentVersion:/ha-replicas/read-scaling/
[run-popsql]: /getting-started/:currentVersion:/run-queries-from-console/#popsql
[run-sqleditor]: /getting-started/:currentVersion:/run-queries-from-console/#sql-editor
[integrations]: /use-timescale/:currentVersion:/integrations/query-admin/
[timescale-console]: https://console.cloud.timescale.com/
[timescale-console-services]: https://console.cloud.timescale.com/dashboard/services
[pricing-plan-features]: https://www.timescale.com/pricing#features
[install-psql]: /use-timescale/:currentVersion:/integrations/query-admin/psql/
