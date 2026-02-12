---
title: Integrations
excerpt: Built on Postgres, Tiger Cloud can integrate with the same array of third-party solutions. See integration procedures for the most popular and requested third-party services
products: [cloud, self_hosted]
keywords: [integrations]
tags: [integrations]
---

# Integrations

You can integrate your $SERVICE_LONG with third-party solutions to expand and extend what you can do with your data. 

## Integrates with $PG? Integrates with your $SERVICE_SHORT!

A $SERVICE_LONG is a $PG database instance extended by $COMPANY with custom capabilities. This means that any third-party solution that you can integrate with $PG, you can also integrate with $CLOUD_LONG. See the full list of $PG integrations [here][postgresql-integrations].

Some of the most in-demand integrations are listed below.

## Authentication and security


|                                                                Name                                                                 | Description                                                               |
|:-----------------------------------------------------------------------------------------------------------------------------------:|---------------------------------------------------------------------------|
| <img isIcon src='https://assets.timescale.com/docs/icons/auth-logo.png' alt='auth-logo'  />[Auth.js][auth-js] | Implement authentication and authorization for web applications.          |
|                                                           <img isIcon src='https://assets.timescale.com/docs/icons/auth0-logo.png' alt='auth0-logo'  />[Auth0][auth0]                                                            | Securely manage user authentication and access controls for applications. |
|                                                            <img isIcon src='https://assets.timescale.com/docs/icons/okta-logo.png' alt='okta-logo'  />[Okta][okta]                                                             | Secure authentication and user identity management for applications.      |

## Business intelligence and data visualization

|                                                                Name                                                                | Description                                                             |
|:----------------------------------------------------------------------------------------------------------------------------------:|-------------------------------------------------------------------------|
|                                                         <img isIcon src='https://assets.timescale.com/docs/icons/cube-js-logo.png' alt='cubejs-logo'  />[Cube.js][cube-js]                                                         | Build and optimize data APIs for analytics applications.                |
| <img isIcon src='https://assets.timescale.com/docs/icons/looker-logo.png' alt='looker-logo'  />[Looker][looker] | Explore, analyze, and share business insights with a BI platform.       |
|                                                        <img isIcon src='https://assets.timescale.com/docs/icons/metabase-logo.png' alt='metabase-logo'  />[Metabase][metabase]                                                        | Create dashboards and visualize business data without SQL expertise.    |
|                                                        <img isIcon src='https://assets.timescale.com/docs/icons/power-bi-logo.png' alt='power-bi-logo'  />[Power BI][power-bi]                                                        | Visualize data, build interactive dashboards, and share insights.       |
|                                                        <img isIcon src='https://assets.timescale.com/docs/icons/superset-logo.png' alt='superset-logo'  />[Superset][superset]                                                        | Create and explore data visualizations and dashboards.                  |

## Configuration and deployment

|                Name                | Description                                                                    |
|:----------------------------------:|--------------------------------------------------------------------------------|
| <img isIcon src='https://assets.timescale.com/docs/icons/azure-functions-logo.png' alt='azure-functions-logo'  />[Azure Functions][azure-functions] | Run event-driven serverless code in the cloud without managing infrastructure. |
|     <img isIcon src='https://assets.timescale.com/docs/icons/deno-deploy-logo.png' alt='deno-deploy-logo'  />[Deno Deploy][deno-deploy]     | Deploy and run JavaScript and TypeScript applications at the edge.             |
|          <img isIcon src='https://assets.timescale.com/docs/icons/flyway-logo.png' alt='flyway-logo'  />[Flyway][flyway]          | Manage and automate database migrations using version control.                 |
|       <img isIcon src='https://assets.timescale.com/docs/icons/liquibase-logo.png' alt='liquibase-logo'  />[Liquibase][liquibase]       | Track, version, and automate database schema changes.                          |
|          <img isIcon src='https://assets.timescale.com/docs/icons/pulimi-logo.png' alt='pulimi-logo'  />[Pulumi][pulumi]          | Define and manage cloud infrastructure using code in multiple languages.       |
|          <img isIcon src='https://assets.timescale.com/docs/icons/render-logo.png' alt='render-logo'  />[Render][render]          | Deploy and scale web applications, databases, and services easily.             |
|    <img isIcon src='https://assets.timescale.com/docs/icons/terraform-logo.png' alt='terraform-logo'  />[Terraform][terraform]          | Safely and predictably provision and manage infrastructure in any cloud.       |
| <img isIcon src='https://assets.timescale.com/docs/icons/kubernets-logo.png' alt='kubernets-logo'  />[Kubernetes][kubernetes] | Deploy, scale, and manage containerized applications automatically. |


## Data engineering and extract, transform, load

|            Name                      | Description                                                                                                                                                                                                                                         |
|:------------------------------------:|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|          <img isIcon src='https://assets.timescale.com/docs/icons/airbyte-logo.png' alt='airbyte-logo'  />[Airbyte][airbyte]          | Sync data between various sources and destinations.                                                                                                                                                                                                 |
| <img isIcon src='https://assets.timescale.com/docs/icons/amazon-sagemaker-logo.png' alt='amazon-sagemaker-logo'  />[Amazon SageMaker][amazon-sagemaker] | Build, train, and deploy ML models into a production-ready hosted environment.                                                                                                                                                                      |
|   <img isIcon src='https://assets.timescale.com/docs/icons/airflow-logo.png' alt='airflow-logo'  />[Apache Airflow][apache-airflow]   | Programmatically author, schedule, and monitor workflows.                                                                                                                                                                                           |
|      <img isIcon src='https://assets.timescale.com/docs/icons/beam-logo.png' alt='beam-logo'  />[Apache Beam][apache-beam]      | Build and execute batch and streaming data pipelines across multiple processing engines.                                                                                                                                                            |
|        <img isIcon src='https://assets.timescale.com/docs/icons/kafka-logo.png' alt='kafka-logo'  />[Apache Kafka][kafka]         | Stream high-performance data pipelines, analytics, and data integration.                                                                                                                                                                            |
|       <img isIcon src='https://assets.timescale.com/docs/icons/lambda-logo.png' alt='lambda-logo'  />[AWS Lambda][aws-lambda]       | Run code without provisioning or managing servers, scaling automatically as needed.                                                                                                                                                                 |
|              <img isIcon src='https://assets.timescale.com/docs/icons/dbt-logo.png' alt='dbt-logo'  />[dbt][dbt]              | Transform and model data in your warehouse using SQL-based workflows. <br /><br /> **Note:** dbt uses `DELETE` with `ctid`. In hypertables, `ctid` can match rows across multiple chunks. Use `(tableoid, ctid)` to uniquely identify rows instead. |
|         <img isIcon src='https://assets.timescale.com/docs/icons/debezium-logo.png' alt='debezium-logo'  />[Debezium][debezium]         | Capture and stream real-time changes from databases.                                                                                                                                                                                                |
|        <img isIcon src='https://assets.timescale.com/docs/icons/decodable-logo.png' alt='decodable-logo'  />[Decodable][decodable]        | Build, run, and manage data pipelines effortlessly.                                                                                                                                                                                                 |
|        <img isIcon src='https://assets.timescale.com/docs/icons/delta-lake-logo.png' alt='delta-lake-logo'  />[DeltaLake][deltalake]        | Enhance data lakes with ACID transactions and schema enforcement.                                                                                                                                                                                   |
| <img isIcon src='https://assets.timescale.com/docs/icons/firebase-logo.png' alt='firebase-logo'  />[Firebase Wrapper][firebase-wrapper] | Simplify interactions with Firebase services through an abstraction layer.                                                                                                                                                                          |
|           <img isIcon src='https://assets.timescale.com/docs/icons/stitch-logo.png' alt='stitch-logo'  />[Stitch][stitch]           | Extract, load, and transform data from various sources to data warehouses.                                                                                                                                                                          |

## Data ingestion and streaming

|                                                                 Name                                                                  | Description                                                                                                                |
|:-------------------------------------------------------------------------------------------------------------------------------------:|----------------------------------------------------------------------------------------------------------------------------|
|       <img isIcon src='https://assets.timescale.com/docs/icons/spark-logo.png' alt='spark-logo' />[Apache Spark][apache-spark]        | Process large-scale data workloads quickly using distributed computing.                                                    |
|      <img isIcon src='https://assets.timescale.com/docs/icons/confluent-logo.png' alt='confluent-logo'  />[Confluent][confluent]      | Manage and scale Apache Kafka-based event streaming applications. You can also [set up $PG as a source][confluent-source]. |
| <img isIcon src='https://assets.timescale.com/docs/icons/electric-sql-logo.png' alt='electric-sql-logo'  />[ElectricSQL][electricsql] | Enable real-time synchronization between databases and frontend applications.                                              |
|                <img isIcon src='https://assets.timescale.com/docs/icons/emqx-logo.png' alt='emqx-logo'  />[EMQX][emqx]                | Deploy an enterprise-grade MQTT broker for IoT messaging.                                                                  |
|          <img isIcon src='https://assets.timescale.com/docs/icons/estuary-logo.png' alt='estuary-logo'  />[Estuary][estuary]          | Stream and synchronize data in real time between different systems.                                                        |
|              <img isIcon src='https://assets.timescale.com/docs/icons/flink-logo.png' alt='flink-logo'  />[Flink][flink]              | Process real-time data streams with fault-tolerant distributed computing.                                                  |
|        <img isIcon src='https://assets.timescale.com/docs/icons/fivetran-logo.png' alt='fivetran-logo'  />[Fivetran][fivetran]        | Sync data from multiple sources to your data warehouse.                                                                    |
|        <img isIcon src='https://assets.timescale.com/docs/icons/highbyte-logo.svg' alt='highbyte-logo'  />[HighByte][highbyte]        | Connect operational technology sources, model the data, and stream it into $PG.                                            |
|       <img isIcon src='https://assets.timescale.com/docs/icons/red-panda-logo.png' alt='red-panda-logo'  />[Redpanda][redpanda]       | Stream and process real-time data as a Kafka-compatible platform.                                                          |
|            <img isIcon src='https://assets.timescale.com/docs/icons/striim-logo.png' alt='strimm-logo'  />[Striim][striim]            | Ingest, process, and analyze real-time data streams.                                                                       |

## Development tools

|                  Name                   | Description                                                                          |
|:---------------------------------------:|--------------------------------------------------------------------------------------|
| <img isIcon src='https://assets.timescale.com/docs/icons/deepnote-logo.png' alt='deepnote-logo' />[Deepnote][deepnote]                    | Collaborate on data science projects with a cloud-based notebook platform.           |
|            <img isIcon src='https://assets.timescale.com/docs/icons/django-logo.png' alt='django-logo' />[Django][django]             | Develop scalable and secure web applications using a Python framework.               |
|         <img isIcon src='https://assets.timescale.com/docs/icons/long-chain-logo.png' alt='long-chain-logo' />[LangChain][langchain]          | Build applications that integrate with language models like GPT.                     |
|              <img isIcon src='https://assets.timescale.com/docs/icons/rust-logo.png' alt='rust-logo' />[Rust][rust]               | Build high-performance, memory-safe applications with a modern programming language. |
|         <img isIcon src='https://assets.timescale.com/docs/icons/streamlit-logo.png' alt='streamlit-logo' />[Streamlit][streamlit]          | Create interactive data applications and dashboards using Python.                    |

## Language-specific integrations

|        Name        | Description                                       |
|:------------------:|---------------------------------------------------|
|  <img isIcon src='https://assets.timescale.com/docs/icons/golang-logo.png' alt='golang-logo' />[Golang][connect-with-code]  | Integrate $CLOUD_LONG with a Golang application.  |
|    <img isIcon src='https://assets.timescale.com/docs/icons/java-logo.png' alt='java-logo' />[Java][connect-with-code]    | Integrate $CLOUD_LONG with a Java application.    |
| <img isIcon src='https://assets.timescale.com/docs/icons/node-logo.png' alt='node-logo' />[Node.js][connect-with-code] | Integrate $CLOUD_LONG with a Node.js application. |
|  <img isIcon src='https://assets.timescale.com/docs/icons/python-logo.png' alt='python-logo' />[Python][connect-with-code]  | Integrate $CLOUD_LONG with a Python application.  |
|    <img isIcon src='https://assets.timescale.com/docs/icons/ruby-logo.png' alt='ruby-logo' />[Ruby][connect-with-code]    | Integrate $CLOUD_LONG with a Ruby application.    |

## Logging and system administration

|          Name          | Description                                                               |
|:----------------------:|---------------------------------------------------------------------------|
|   <img isIcon src='https://assets.timescale.com/docs/icons/rsyslog-logo.png' alt='rsyslog-logo' />[RSyslog][rsyslog]   | Collect, filter, and forward system logs for centralized logging.         |
| <img isIcon src='https://assets.timescale.com/docs/icons/schemaspy-logo.png' alt='schemaspy-logo' />[SchemaSpy][schemaspy] | Generate database schema documentation and visualization.                 |

## Observability and alerting

|                          Name                          | Description                                                                                                                                               |
|:------------------------------------------------------:|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
|            <img isIcon src='https://assets.timescale.com/docs/icons/cloudwatch-logo.png' alt='cloudwatch-logo' />[Amazon Cloudwatch][cloudwatch]             | Collect, analyze, and act on data from applications, infrastructure, and services running in AWS and on-premises environments.                            |
|         <img isIcon src='https://assets.timescale.com/docs/icons/skywalking-logo.png' alt='skywalking-logo' />[Apache SkyWalking][apache-skywalking]         | Monitor, trace, and diagnose distributed applications for improved observability. You can also [set up $PG as storage][apache-skywalking-storage]. |
|             <img isIcon src='https://assets.timescale.com/docs/icons/azure-monitor-logo.png' alt='azure-monitor-logo' />[Azure Monitor][azure-monitor]             | Collect and analyze telemetry data from cloud and on-premises environments.   
|                   <img isIcon src='https://assets.timescale.com/docs/icons/dash0-logo.png' alt='dash0-logo' />[Dash0][dash0]                   | OpenTelemetry Native Observability, built on CNCF Open Standards like PromQL, Perses, and OTLP, and offering full cost control.     |
|                   <img isIcon src='https://assets.timescale.com/docs/icons/datadog-logo.png' alt='datadog-logo' />[Datadog][datadog]                   | Gain comprehensive visibility into applications, infrastructure, and systems through real-time monitoring, logging, and analytics.                        |
|                   <img isIcon src='https://assets.timescale.com/docs/icons/grafana-logo.png' alt='grafana-logo' />[Grafana][grafana]                   | Query, visualize, alert on, and explore your metrics and logs.                                                                                            |
|               <img isIcon src='https://assets.timescale.com/docs/icons/instana-logo.png' alt='instana-logo' />[IBM Instana][ibm-instana]               | Monitor application performance and detect issues in real-time.                                                                                           |
|                    <img isIcon src='https://assets.timescale.com/docs/icons/jaeger-logo.png' alt='jaeger-logo' />[Jaeger][jaeger]                    | Trace and diagnose distributed transactions for observability.                                                                                            |
|                 <img isIcon src='https://assets.timescale.com/docs/icons/new-relic-logo.png' alt='new-relic-logo' />[New Relic][new-relic]                 | Monitor applications, infrastructure, and logs for performance insights.                                                                                  |
|          <img isIcon src='https://assets.timescale.com/docs/icons/open-telemetery-logo.png' alt='open-telemetery-logo' />[OpenTelemetry Beta][opentelemetry]           | Collect and analyze telemetry data for observability across systems.                                                                                      |
|                <img isIcon src='https://assets.timescale.com/docs/icons/prometheus-logo.png' alt='prometheus-logo' />[Prometheus][prometheus]                | Track the performance and health of systems, applications, and infrastructure.                                                                            |
|                             <img isIcon src='https://assets.timescale.com/docs/icons/signoz-logo.png' alt='signoz-logo' />[SigNoz][signoz]           | Monitor application performance with an open-source observability tool.                                                                                   |
|                   <img isIcon src='https://assets.timescale.com/docs/icons/tableau-logo.png' alt='tableau-logo' />[Tableau][tableau]                   | Connect to data sources, analyze data, and create interactive visualizations and dashboards.                                                              |
|              <img isIcon src='https://assets.timescale.com/docs/icons/Influx-telegraf.svg' alt='telegraf-logo' />[Telegraf][telegraf]               | Collect, process, and ship metrics and events into databases or monitoring platforms.                             |


## Query and administration

|                                                                     Name                                                                     | Description                                                                                                                               |
|:--------------------------------------------------------------------------------------------------------------------------------------------:|-------------------------------------------------------------------------------------------------------------------------------------------|
| <img isIcon src='https://assets.timescale.com/docs/icons/azure-data-studio-logo.png' alt='azure-data-studio-logo' />[Azure Data Studio][ads] | Query, manage, visualize, and develop databases across SQL Server, Azure SQL, and $PG.                                                    |
|              <img isIcon src='https://assets.timescale.com/docs/icons/dbeaver-logo.png' alt='dbeaver-logo' />[DBeaver][dbeaver]              | Connect to, manage, query, and analyze multiple database in a single interface with SQL editing, visualization, and administration tools. |
|    <img isIcon src='https://assets.timescale.com/docs/icons/forest-admin-logo.png' alt='forest-admin-logo' />[Forest Admin][forest-admin]    | Create admin panels and dashboards for business applications.                                                                             |
|                <img isIcon src='https://assets.timescale.com/docs/icons/hasura-logo.png' alt='hasura-logo' />[Hasura][hasura]                | Instantly generate GraphQL APIs from databases with access control.                                                                       |
|          <img isIcon src='https://assets.timescale.com/docs/icons/mode-logo.png' alt='mode-logo' />[Mode Analytics][mode-analytics]          | Analyze data, create reports, and share insights with teams.                                                                              |
|                    <img isIcon src='https://assets.timescale.com/docs/icons/neon-logo.png' alt='neon-logo' />[Neon][neon]                    | Run a cloud-native, serverless $PG database with automatic scaling.                                                                       |
|              <img isIcon src='https://assets.timescale.com/docs/icons/pgadmin-logo.png' alt='pgadmin-logo' />[pgAdmin][pgadmin]              | Manage, query, and administer $PG databases through a graphical interface.                                                                |
|           <img isIcon src='https://assets.timescale.com/docs/icons/postgresql-logo.png' alt='postgresql-logo' />[$PG][postgresql]            | Access and query data from external sources as if they were regular $PG tables.                                                           |
|                <img isIcon src='https://assets.timescale.com/docs/icons/prisma-logo.png' alt='prisma-logo' />[Prisma][prisma]                | Simplify database access with an open-source ORM for Node.js.                                                                             |
|                    <img isIcon src='https://assets.timescale.com/docs/icons/psql-logo.png' alt='psql-logo' />[psql][psql]                    | Run SQL queries, manage databases, automate tasks, and interact directly with $PG.                                                 |
|          <img isIcon src='https://assets.timescale.com/docs/icons/qlik-logo.png' alt='qlik-logo' />[Qlik Replicate][qlik-replicate]          | Move and synchronize data across multiple database platforms. You an also [set up $PG as a source][qlik-source].                   |
|              <img isIcon src='https://assets.timescale.com/docs/icons/qstudio-logo.png' alt='qstudio-logo' />[qStudio][qstudio]              | Write and execute SQL queries, manage database objects, and analyze data in a user-friendly interface.                                    |
|                <img isIcon src='https://assets.timescale.com/docs/icons/redash-logo.png' alt='redash-logo' />[Redash][redash]                | Query, visualize, and share data from multiple sources.                                                                                   |
|       <img isIcon src='https://assets.timescale.com/docs/icons/sql-alchemy-logo.png' alt='sqlalchemy-logo' />[SQLalchemy][sqlalchemy]        | Manage database operations using a Python SQL toolkit and ORM.                                                                            |
|          <img isIcon src='https://assets.timescale.com/docs/icons/sequelize-logo.png' alt='sequelize-logo' />[Sequelize][sequelize]          | Interact with SQL databases in Node.js using an ORM.                                                                                      |
|              <img isIcon src='https://assets.timescale.com/docs/icons/stepzen-logo.png' alt='stepzen-logo' />[StepZen][stepzen]              | Build and deploy GraphQL APIs with data from multiple sources.                                                                            |
|              <img isIcon src='https://assets.timescale.com/docs/icons/typeorm-logo.png' alt='typeorm-logo' />[TypeORM][typeorm]              | Work with databases in TypeScript and JavaScript using an ORM.                                                                            |

## Secure connectivity to $CLOUD_LONG

|                 Name                 | Description                                                                 |
|:------------------------------------:|-----------------------------------------------------------------------------|
|      <img isIcon src='https://assets.timescale.com/docs/icons/aws-logo.png' alt='aws-logo' />[Amazon Web Services][aws]      | Connect your other services and applications running in AWS to $CLOUD_LONG. |
| <img isIcon src='https://assets.timescale.com/docs/icons/corporate-data-center-logo.png' alt='corporate-data-center-logo' />[Corporate data center][data-center] | Connect your on-premise data center to $CLOUD_LONG.
|     <img isIcon src='https://assets.timescale.com/docs/icons/google-cloud-logo.png' alt='google-cloud-logo' />[Google Cloud][google-cloud]     | Connect your Google Cloud infrastructure to $CLOUD_LONG.                    |
|       <img isIcon src='https://assets.timescale.com/docs/icons/azure-logo.png' alt='azure-logo' />[Microsoft Azure][azure]       | Connect your Microsoft Azure infrastructure to $CLOUD_LONG.                 |

## Workflow automation and no-code tools

|                                                          Name                                                          | Description                                                                  |
|:----------------------------------------------------------------------------------------------------------------------:|------------------------------------------------------------------------------|
| <img isIcon src='https://assets.timescale.com/docs/icons/appsmith-logo.png' alt='appsmith-logo' />[Appsmith][appsmith] | Create internal business applications with a low-code platform.              |
|         <img isIcon src='https://assets.timescale.com/docs/icons/dbos-logo.png' alt='n8n-logo' />[DBOS][dbos]          | Add durable workflows to your code and make apps resilient to any failure.   |
|           <img isIcon src='https://assets.timescale.com/docs/icons/n8n-logo.png' alt='n8n-logo' />[n8n][n8n]           | Automate workflows and integrate services with a no-code platform.           |
|     <img isIcon src='https://assets.timescale.com/docs/icons/retool-logo.png' alt='retool-logo' />[Retool][retool]     | Build custom internal tools quickly using a drag-and-drop interface.         |
|   <img isIcon src='https://assets.timescale.com/docs/icons/tooljet-logo.png' alt='tooljet-logo' />[Tooljet][tooljet]   | Develop internal tools and business applications with a low-code builder.    |
|     <img isIcon src='https://assets.timescale.com/docs/icons/zapier-logo.png' alt='zapier-logo' />[Zapier][zapier]     | Automate workflows by connecting different applications and services.        |

[ads]: /integrations/:currentVersion:/azure-data-studio/
[airbyte]: https://docs.airbyte.com/integrations/sources/postgres
[amazon-sagemaker]: /integrations/:currentVersion:/amazon-sagemaker
[apache-airflow]: /integrations/:currentVersion:/apache-airflow
[apache-beam]: https://beam.apache.org/releases/javadoc/current/org/apache/beam/sdk/io/jdbc/JdbcIO.html
[apache-skywalking-storage]: https://skywalking.apache.org/docs/main/next/en/setup/backend/storages/postgresql/
[apache-skywalking]: https://skywalking.apache.org/docs/main/next/en/setup/backend/backend-postgresql-monitoring/
[apache-spark]: https://spark.apache.org/docs/latest/sql-data-sources-jdbc.html
[appsmith]: https://docs.appsmith.com/connect-data/reference/querying-postgres
[auth-js]: https://authjs.dev/getting-started/adapters/pg?framework=next-js
[auth0]: https://auth0.com/blog/configuring-postgresql-as-auth0-custom-database/
[aws-lambda]: /integrations/:currentVersion:/aws-lambda
[aws]: /integrations/:currentVersion:/aws
[azure-functions]: https://github.com/Azure/azure-functions-postgresql-extension
[azure-monitor]: https://learn.microsoft.com/en-us/azure/postgresql/flexible-server/concepts-monitoring
[azure]: /integrations/:currentVersion:/microsoft-azure
[cloudwatch]: /integrations/:currentVersion:/cloudwatch/
[confluent-source]: https://docs.confluent.io/cloud/current/connectors/cc-postgresql-source.html
[confluent]: https://docs.confluent.io/cloud/current/connectors/cc-postgresql-sink.html
[connect-with-code]: /getting-started/:currentVersion:/start-coding-with-timescale/
[cube-js]: https://cube.dev/integrations/Timescale-API
[dash0]: https://www.dash0.com/hub/integrations/int_tiger_service/overview
[data-center]: /integrations/:currentVersion:/corporate-data-center
[datadog]: /integrations/:currentVersion:/datadog/
[dbeaver]: /integrations/:currentVersion:/dbeaver/
[dbos]: https://docs.dbos.dev/integrations/tigerdata
[dbt]: https://dbt-timescaledb.debruyn.dev/
[debezium]: /integrations/:currentVersion:/debezium/
[decodable]: /integrations/:currentVersion:/decodable
[deepnote]: https://deepnote.com/docs/postgresql
[deltalake]: https://github.com/delta-io/delta/blob/master/connectors/README.md
[deno-deploy]: https://docs.deno.com/deploy/manual/postgres/
[django]: https://docs.djangoproject.com/en/5.1/ref/databases/#postgresql-notes
[electricsql]: https://electric-sql.com/docs/intro
[emqx]: https://docs.emqx.com/en/emqx/latest/data-integration/data-bridge-timescale.html
[estuary]: https://docs.estuary.dev/reference/Connectors/materialization-connectors/timescaledb/
[firebase-wrapper]: https://firebase.google.com/products/data-connect
[fivetran]: /integrations/:currentVersion:/fivetran
[flink]: https://nightlies.apache.org/flink/flink-cdc-docs-release-3.1/docs/connectors/flink-sources/postgres-cdc/
[flyway]: https://documentation.red-gate.com/flyway/reference/database-driver-reference/timescaledb
[forest-admin]: https://www.forestadmin.com/integrations/postgresql
[google-cloud]: /integrations/:currentVersion:/google-cloud
[grafana]: /integrations/:currentVersion:/grafana/
[hasura]: https://hasura.io/docs/2.0/databases/postgres/timescale-cloud/
[highbyte]: https://guide.highbyte.com/configuration/connect/connections/historians/timescaledb/
[ibm-instana]: https://www.ibm.com/docs/en/instana-observability/current?topic=technologies-monitoring-postgresql
[jaeger]: https://www.jaegertracing.io/docs/2.0/storage/
[kafka]: /integrations/:currentVersion:/apache-kafka
[kubernetes]: /integrations/:currentVersion:/kubernetes
[langchain]: https://api.python.langchain.com/en/latest/postgres/index.html#
[liquibase]: https://docs.liquibase.com/start/tutorials/postgresql/postgresql.html
[looker]: https://cloud.google.com/looker/docs/db-config-postgresql
[metabase]: https://www.metabase.com/data_sources/postgresql
[mode-analytics]: https://mode.com/integrations/postgresql/
[n8n]: https://n8n.io/integrations/redis/and/timescaledb/
[neon]: https://neon.com/docs/extensions/timescaledb
[new-relic]: https://docs.newrelic.com/docs/infrastructure/host-integrations/host-integrations-list/postgresql/postgresql-integration/
[okta]: https://help.okta.com/oag/en-us/content/topics/access-gateway/integrate-app-datastores.htm
[opentelemetry]: https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/postgresqlreceiver
[pgadmin]: /integrations/:currentVersion:/pgadmin/
[postgresql-integrations]: https://slashdot.org/software/p/PostgreSQL/integrations/
[postgresql]: /integrations/:currentVersion:/postgresql
[power-bi]: /integrations/:currentVersion:/power-bi
[prisma]: https://www.prisma.io/docs/orm/overview/databases/postgresql
[prometheus]: /integrations/:currentVersion:/prometheus
[psql]: /integrations/:currentVersion:/psql/
[pulumi]: https://www.pulumi.com/registry/packages/timescale/
[qlik-replicate]: https://help.qlik.com/en-US/replicate/November2024/Content/Replicate/Main/PostgreSQL/postgresql.htm#ar_postgresds_802412600_1325150
[qlik-source]: https://help.qlik.com/en-US/replicate/November2024/Content/Replicate/Main/PostgreSQL/postgresql_source.htm
[qstudio]: /integrations/:currentVersion:/qstudio/
[redash]: https://redash.io/data-sources/postgresql/
[redpanda]: https://www.redpanda.com/blog/build-data-stream-detect-anomalies-timescale-kafka-connect
[render]: https://render.com/docs/postgresql
[retool]: https://retool.com/integrations/postgresql
[rsyslog]: https://www.rsyslog.com/doc/configuration/modules/ompgsql.html
[rust]: https://github.com/sfackler/rust-postgres
[schemaspy]: https://wiki.postgresql.org/wiki/SchemaSpy
[sequelize]: https://sequelize.org/docs/v7/databases/postgres/
[signoz]: https://signoz.io/docs/integrations/postgresql/
[sqlalchemy]: https://docs.sqlalchemy.org/en/20/dialects/postgresql.html
[stepzen]: https://www.ibm.com/docs/en/api-connect-graphql/saas?topic=apis-tutorial-create-graphql-api-postgresql-database
[stitch]: https://stitch-docs.netlify.app/docs/integrations/databases/postgresql
[streamlit]: https://docs.streamlit.io/develop/tutorials/databases/postgresql
[striim]: https://www.striim.com/connectors/postgresql/
[superset]: https://superset.apache.org/docs/configuration/databases#timescaledb
[tableau]: /integrations/:currentVersion:/tableau/
[telegraf]: /integrations/:currentVersion:/telegraf/
[terraform]: /integrations/:currentVersion:/terraform
[tooljet]: https://docs.tooljet.ai/docs/data-sources/postgresql/
[typeorm]: https://typeorm.biunav.com/en/connection-options.html#postgres-cockroachdb-connection-options
[zapier]: https://zapier.com/apps/postgresql/integrations
