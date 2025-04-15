---
title: Integrations
excerpt: Built on PostgreSQL, Timescale Cloud can integrate with the same array of third-party solutions. See integration procedures for the most popular and requested third-party services
products: [cloud]
keywords: [integrations]
tags: [integrations]
---

# Integrations

You can integrate your $SERVICE_LONG with third-party solutions to expand and extend what you can do with your data. 

## Integrates with PostgreSQL? Integrates with your $SERVICE_SHORT!

A $SERVICE_LONG is a PostgreSQL database instance extended by $COMPANY with custom capabilities. This means that any third-party solution that you can integrate with PostgreSQL, you can also integrate with $CLOUD_LONG. See the full list of PostgreSQL integrations [here][postgresql-integrations].

Some of the most in-demand integrations are listed below.

## Authentication and security

|                Name                | Description                                                               |
|:----------------------------------:|---------------------------------------------------------------------------|
|         [Auth.js][auth-js]         | Implement authentication and authorization for web applications.          |
|       [Auth0][auth0]               | Securely manage user authentication and access controls for applications. |
|            [Okta][okta]            | Secure authentication and user identity management for applications.      |

## Business intelligence and data visualization

|            Name            | Description                                                             |
|:--------------------------:|-------------------------------------------------------------------------|
|     [Cube.js][cube-js]     | Build and optimize data APIs for analytics applications.                |
|      [Looker][looker]      | Explore, analyze, and share business insights with a BI platform.       |
| [Materialize][materialize] | Process and query real-time data with incremental materialized views.   |
|    [Metabase][metabase]    | Create dashboards and visualize business data without SQL expertise.    |
|   [Power BI][power-bi]     | Visualize data, build interactive dashboards, and share insights.       |
|   [Snowflake][snowflake]   | Store, process, and analyze large-scale data in a cloud data warehouse. |
|    [Superset][superset]    | Create and explore data visualizations and dashboards.                  |

## Configuration and deployment

|                Name                | Description                                                                    |
|:----------------------------------:|--------------------------------------------------------------------------------|
| [Azure Functions][azure-functions] | Run event-driven serverless code in the cloud without managing infrastructure. |
|     [Deno Deploy][deno-deploy]     | Deploy and run JavaScript and TypeScript applications at the edge.             |
|          [Flyway][flyway]          | Manage and automate database migrations using version control.                 |
|       [Liquibase][liquibase]       | Track, version, and automate database schema changes.                          |
|  [MinIO][minio]                    | Store and retrieve unstructured data with an S3-compatible object storage.     |
|          [Pulumi][pulumi]          | Define and manage cloud infrastructure using code in multiple languages.       |
|          [Render][render]          | Deploy and scale web applications, databases, and services easily.             |
|    [Terraform][terraform]          | Safely and predictably provision and manage infrastructure in any cloud.       |
| [Kubernetes][kubernetes] | Deploy, scale, and manage containerized applications automatically. |


## Data engineering and extract, transform, load

|            Name                      | Description                                                                              |
|:------------------------------------:|------------------------------------------------------------------------------------------|
|          [Airbyte][airbyte]          | Sync data between various sources and destinations.                                      |
| [Amazon SageMaker][amazon-sagemaker] | Build, train, and deploy ML models into a production-ready hosted environment.           |
|   [Apache Airflow][apache-airflow]   | Programmatically author, schedule, and monitor workflows.                                |
|      [Apache Beam][apache-beam]      | Build and execute batch and streaming data pipelines across multiple processing engines. |
|        [Apache Kafka][kafka]         | Stream high-performance data pipelines, analytics, and data integration.                 |
|       [AWS Lambda][aws-lambda]       | Run code without provisioning or managing servers, scaling automatically as needed.      |
|              [dbt][dbt]              | Transform and model data in your warehouse using SQL-based workflows.                    |
|         [Debezium][debezium]         | Capture and stream real-time changes from databases.                                     |
|        [Decodable][decodable]        | Build, run, and manage data pipelines effortlessly.                                      |
|        [DeltaLake][deltalake]        | Enhance data lakes with ACID transactions and schema enforcement.                        |
| [Firebase Wrapper][firebase-wrapper] | Simplify interactions with Firebase services through an abstraction layer.               |
|           [Stitch][stitch]           | Extract, load, and transform data from various sources to data warehouses.               |

## Data ingestion and streaming

|             Name             | Description                                                                                                                       |
|:----------------------------:|-----------------------------------------------------------------------------------------------------------------------------------|
| [Apache Spark][apache-spark] | Process large-scale data workloads quickly using distributed computing.                                                           |
|    [Confluent][confluent]    | Manage and scale Apache Kafka-based event streaming applications. You can also [set up PostgreSQL as a source][confluent-source]. |
|  [ElectricSQL][electricsql]  | Enable real-time synchronization between databases and frontend applications.                                                     |
|         [EMQX][emqx]         | Deploy an enterprise-grade MQTT broker for IoT messaging.                                                                         |
|      [Estuary][estuary]      | Stream and synchronize data in real time between different systems.                                                               |
|        [Flink][flink]        | Process real-time data streams with fault-tolerant distributed computing.                                                         |
|    [Fivetran][fivetran]      | Sync data from multiple sources to your data warehouse.                                                                           |
|     [Redpanda][redpanda]     | Stream and process real-time data as a Kafka-compatible platform.                                                                 |
|       [Striim][striim]       | Ingest, process, and analyze real-time data streams.                                                                              |

## Development tools

|                  Name                   | Description                                                                          |
|:---------------------------------------:|--------------------------------------------------------------------------------------|
| [Deepnote][deepnote]                    | Collaborate on data science projects with a cloud-based notebook platform.           |
|            [Django][django]             | Develop scalable and secure web applications using a Python framework.               |
|         [LangChain][langchain]          | Build applications that integrate with language models like GPT.                     |
|              [Rust][rust]               | Build high-performance, memory-safe applications with a modern programming language. |
|         [Streamlit][streamlit]          | Create interactive data applications and dashboards using Python.                    |

## Language-specific integrations

|        Name        | Description                                       |
|:------------------:|---------------------------------------------------|
|  [Golang][golang]  | Integrate $CLOUD_LONG with a Golang application.  |
|    [Java][java]    | Integrate $CLOUD_LONG with a Java application.    |
| [Node.js][node-js] | Integrate $CLOUD_LONG with a Node.js application. |
|  [Python][python]  | Integrate $CLOUD_LONG with a Python application.  |
|    [Ruby][ruby]    | Integrate $CLOUD_LONG with a Ruby application.    |

## Logging and system administration

|          Name          | Description                                                               |
|:----------------------:|---------------------------------------------------------------------------|
|   [RSyslog][rsyslog]   | Collect, filter, and forward system logs for centralized logging.         |
| [SchemaSpy][schemaspy] | Generate database schema documentation and visualization.                 |

## Observability and alerting

|                          Name                          | Description                                                                                                                                               |
|:------------------------------------------------------:|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
|            [Amazon Cloudwatch][cloudwatch]             | Collect, analyze, and act on data from applications, infrastructure, and services running in AWS and on-premises environments.                            |
|         [Apache SkyWalking][apache-skywalking]         | Monitor, trace, and diagnose distributed applications for improved observability. You can also [set up PostgreSQL as storage][apache-skywalking-storage]. |
|             [Azure Monitor][azure-monitor]             | Collect and analyze telemetry data from cloud and on-premises environments.                                                                               |
|                   [Datadog][datadog]                   | Gain comprehensive visibility into applications, infrastructure, and systems through real-time monitoring, logging, and analytics.                        |
|             [Elasticsearch][elasticsearch]             | Search, analyze, and visualize structured and unstructured data efficiently.                                                                              |
|                   [Grafana][grafana]                   | Query, visualize, alert on, and explore your metrics and logs.                                                                                            |
|               [IBM Instana][ibm-instana]               | Monitor application performance and detect issues in real-time.                                                                                           |
|                    [Jaeger][jaeger]                    | Trace and diagnose distributed transactions for observability.                                                                                            |
|                 [New Relic][new-relic]                 | Monitor applications, infrastructure, and logs for performance insights.                                                                                  |
|          [OpenTelemetry Beta][opentelemetry]           | Collect and analyze telemetry data for observability across systems.                                                                                      |
|                [Prometheus][prometheus]                | Track the performance and health of systems, applications, and infrastructure.                                                                            |
|                             [SigNoz][signoz]           | Monitor application performance with an open-source observability tool.                                                                                   |
|                   [Tableau][tableau]                   | Connect to data sources, analyze data, and create interactive visualizations and dashboards.                                                              |

## Query and administration

|                      Name                               | Description                                                                                                                               |
|:-------------------------------------------------------:|-------------------------------------------------------------------------------------------------------------------------------------------|
|                [Azure Data Studio][ads]                 | Query, manage, visualize, and develop databases across SQL Server, Azure SQL, and PostgreSQL.                                             |
|          [BigQuery Wrapper][bigquery-wrapper]           | Interact with Google BigQuery through simplified programmatic access.                                                                     |
|                [ClickHouse][clickhouse]                 | Run high-performance real-time analytics on large datasets.                                                                               |
| [ClickHouse Monitoring Dashboard][clickhouse-dashboard] | Visualize and monitor ClickHouse database performance in real-time.                                                                       |
|                   [DBeaver][dbeaver]                    | Connect to, manage, query, and analyze multiple database in a single interface with SQL editing, visualization, and administration tools. |
|              [Forest Admin][forest-admin]               | Create admin panels and dashboards for business applications.                                                                             |
|                    [Hasura][hasura]                     | Instantly generate GraphQL APIs from databases with access control.                                                                       |
|            [Mode Analytics][mode-analytics]             | Analyze data, create reports, and share insights with teams.                                                                              |
|                   [MongoDB][mongodb]                    | Store and query document-based data with a flexible NoSQL database.                                                                       |
|                     [MySQL][mysql]                      | Manage structured relational data with an open-source SQL database.                                                                       |
|                      [Neon][neon]                       | Run a cloud-native, serverless PostgreSQL database with automatic scaling.                                                                |
|                   [pgAdmin][pgadmin]                    | Manage, query, and administer PostgreSQL databases through a graphical interface.                                                         |
|                [PostgreSQL][postgresql]                 | Access and query data from external sources as if they were regular PostgreSQL tables.                                                    |
|                    [Prisma][prisma]                     | Simplify database access with an open-source ORM for Node.js.                                                                             |
|                      [psql][psql]                       | Run SQL queries, manage databases, automate tasks, and interact directly with PostgreSQL.                                                 |
|            [Qlik Replicate][qlik-replicate]             | Move and synchronize data across multiple database platforms. You an also [set up PostgreSQL as a source][qlik-source].                   |
|                   [qStudio][qstudio]                    | Write and execute SQL queries, manage database objects, and analyze data in a user-friendly interface.                                    |
|                    [Redash][redash]                     | Query, visualize, and share data from multiple sources.                                                                                   |
|                     [Redis][redis]                      | Cache, store, and process data in-memory with low latency.                                                                                |
|                [SQLalchemy][sqlalchemy]                 | Manage database operations using a Python SQL toolkit and ORM.                                                                            |
|                 [Sqquelize][sqquelize]                  | Interact with SQL databases in Node.js using an ORM.                                                                                      |
|                   [StepZen][stepzen]                    | Build and deploy GraphQL APIs with data from multiple sources.                                                                            |
|                   [TypeORM][typeorm]                    | Work with databases in TypeScript and JavaScript using an ORM.                                                                            |

## Secure connectivity to $CLOUD_LONG

|                 Name                 | Description                                                                 |
|:------------------------------------:|-----------------------------------------------------------------------------|
|      [Amazon Web Services][aws]      | Connect your other services and applications running in AWS to $CLOUD_LONG. |
| [Corporate data center][data-center] | Connect your on-premise data center to $CLOUD_LONG.
|     [Google Cloud][google-cloud]     | Connect your Google Cloud infrastructure to $CLOUD_LONG.                    |
|       [Microsoft Azure][azure]       | Connect your Microsoft Azure infrastructure to $CLOUD_LONG.                 |

## Workflow automation and no-code tools

|       Name           | Description                                                               |
|:--------------------:|---------------------------------------------------------------------------|
| [Appsmith][appsmith] | Create internal business applications with a low-code platform.           |
|      [n8n][n8n]      | Automate workflows and integrate services with a no-code platform.        |
|   [Retool][retool]   | Build custom internal tools quickly using a drag-and-drop interface.      |
|  [Tooljet][tooljet]  | Develop internal tools and business applications with a low-code builder. |
|   [Zapier][zapier]   | Automate workflows by connecting different applications and services.     |

[ads]: /integrations/:currentVersion:/azure-data-studio/
[airbyte]: https://docs.airbyte.com/integrations/sources/postgres
[amazon-sagemaker]: /integrations/:currentVersion:/amazon-sagemaker
[apache-airflow]: /integrations/:currentVersion:/apache-airflow
[apache-beam]: https://beam.apache.org/releases/javadoc/current/org/apache/beam/sdk/io/jdbc/JdbcIO.html
[apache-skywalking]: https://skywalking.apache.org/docs/main/next/en/setup/backend/backend-postgresql-monitoring/
[apache-skywalking-storage]: https://skywalking.apache.org/docs/main/next/en/setup/backend/storages/postgresql/
[apache-spark]: https://spark.apache.org/docs/3.5.4/sql-data-sources-jdbc.html
[appsmith]: https://docs.appsmith.com/connect-data/reference/querying-postgres
[auth-js]: https://authjs.dev/getting-started/adapters/pg?framework=next-js
[auth0]: https://auth0.com/blog/configuring-postgresql-as-auth0-custom-database/
[aws]: /integrations/:currentVersion:/aws
[aws-lambda]: /integrations/:currentVersion:/aws-lambda
[azure]: /integrations/:currentVersion:/microsoft-azure
[azure-functions]: https://github.com/Azure/azure-functions-postgresql-extension
[azure-monitor]: https://learn.microsoft.com/en-us/azure/postgresql/flexible-server/concepts-monitoring
[bigquery-wrapper]: https://cloud.google.com/dataflow/docs/guides/templates/provided/postgresql-to-bigquery
[clickhouse]: https://clickhouse.com/docs/integrations/postgresql
[clickhouse-dashboard]: https://clickhouse.com/docs/integrations/postgresql
[cloudwatch]: /integrations/:currentVersion:/cloudwatch/
[confluent]: https://docs.confluent.io/cloud/current/connectors/cc-postgresql-sink.html
[confluent-source]: https://docs.confluent.io/cloud/current/connectors/cc-postgresql-source.html
[cube-js]: https://cube.dev/integrations/Timescale-API
[data-center]: /integrations/:currentVersion:/corporate-data-center
[datadog]: /integrations/:currentVersion:/datadog/
[dbt]: https://dbt-timescaledb.debruyn.dev/
[dbeaver]: /integrations/:currentVersion:/dbeaver/
[debezium]: /integrations/:currentVersion:/debezium/
[decodable]: /integrations/:currentVersion:/decodable
[deepnote]: https://deepnote.com/docs/postgresql
[deltalake]: https://github.com/delta-io/delta/blob/master/connectors/sql-delta-import/readme.md
[deno-deploy]: https://docs.deno.com/deploy/manual/postgres/
[django]: https://docs.djangoproject.com/en/5.1/ref/databases/#postgresql-notes
[elasticsearch]: https://www.elastic.co/guide/en/elasticsearch/reference/current/es-connectors-postgresql.html
[electricsql]: https://electric-sql.com/docs/intro
[emqx]: https://docs.emqx.com/en/emqx/latest/data-integration/data-bridge-timescale.html
[estuary]: https://docs.estuary.dev/reference/Connectors/materialization-connectors/timescaledb/
[firebase-wrapper]: https://firebase.google.com/products/data-connect
[fivetran]: /integrations/:currentVersion:/fivetran
[flink]: https://nightlies.apache.org/flink/flink-cdc-docs-release-3.1/docs/connectors/flink-sources/postgres-cdc/
[flyway]: https://documentation.red-gate.com/flyway/reference/database-driver-reference/timescaledb
[forest-admin]: https://www.forestadmin.com/integrations/postgresql
[golang]: /getting-started/:currentVersion:/start-coding-with-timescale/
[google-cloud]: /integrations/:currentVersion:/google-cloud
[grafana]: /integrations/:currentVersion:/grafana/
[hasura]: https://hasura.io/docs/2.0/databases/postgres/timescale-cloud/
[ibm-instana]: https://www.ibm.com/docs/en/instana-observability/current?topic=technologies-monitoring-postgresql
[jaeger]: https://www.jaegertracing.io/docs/2.0/storage/
[java]: /getting-started/:currentVersion:/start-coding-with-timescale/
[kafka]: /integrations/:currentVersion:/apache-kafka
[langchain]: https://api.python.langchain.com/en/latest/postgres/index.html#
[liquibase]: https://docs.liquibase.com/start/tutorials/postgresql/postgresql.html
[looker]: https://cloud.google.com/looker/docs/db-config-postgresql
[materialize]: https://materialize.com/docs/ingest-data/postgres/
[metabase]: https://www.metabase.com/data_sources/postgresql
[minio]: https://min.io/docs/minio/linux/administration/monitoring/publish-events-to-postgresql.html
[mode-analytics]: https://mode.com/integrations/postgresql
[mongodb]: https://www.postgresql.org/about/news/mongodb-mysql-hadoop-hdfs-foreign-data-wrappers-updated-to-support-postgresql-16-2678/
[mysql]: https://github.com/EnterpriseDB/mysql_fdw
[n8n]: https://n8n.io/integrations/redis/and/timescaledb/
[neon]: https://neon.tech/docs/extensions/timescaledb
[new-relic]: https://docs.newrelic.com/docs/infrastructure/host-integrations/host-integrations-list/postgresql/postgresql-integration/
[node-js]: /getting-started/:currentVersion:/start-coding-with-timescale/
[okta]: https://help.okta.com/oag/en-us/content/topics/access-gateway/integrate-app-datastores.htm
[opentelemetry]: https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/postgresqlreceiver
[pgadmin]: /integrations/:currentVersion:/pgadmin/
[postgresql]: /integrations/:currentVersion:/postgresql
[postgresql-integrations]: https://slashdot.org/software/p/PostgreSQL/integrations/
[power-bi]: /integrations/:currentVersion:/power-bi
[prisma]: https://www.prisma.io/docs/orm/overview/databases/postgresql
[prometheus]: /integrations/:currentVersion:/prometheus
[kubernetes]: /integrations/:currentVersion:/kubernetes
[psql]: /integrations/:currentVersion:/psql/
[pulumi]: https://www.pulumi.com/registry/packages/timescale/
[python]: /getting-started/:currentVersion:/start-coding-with-timescale/
[qlik-replicate]: https://help.qlik.com/en-US/replicate/November2024/Content/Replicate/Main/PostgreSQL/postgresql.htm#ar_postgresds_802412600_1325150
[qlik-source]: https://help.qlik.com/en-US/replicate/November2024/Content/Replicate/Main/PostgreSQL/postgresql_source.htm
[qstudio]: /integrations/:currentVersion:/qstudio/
[redash]: https://redash.io/data-sources/postgresql/
[redis]: https://redis.io/docs/latest/integrate/redis-data-integration/data-pipelines/prepare-dbs/postgresql/
[redpanda]: https://www.redpanda.com/blog/build-data-stream-detect-anomalies-timescale-kafka-connect
[render]: https://render.com/docs/postgresql
[retool]: https://retool.com/integrations/postgresql
[rsyslog]: https://www.rsyslog.com/doc/configuration/modules/ompgsql.html
[ruby]: /getting-started/:currentVersion:/start-coding-with-timescale/
[rust]: https://github.com/sfackler/rust-postgres
[schemaspy]: https://wiki.postgresql.org/wiki/SchemaSpy
[signoz]: https://signoz.io/docs/integrations/postgresql/
[snowflake]: https://other-docs.snowflake.com/en/connectors/postgres6/about
[sqlalchemy]: https://docs.sqlalchemy.org/en/20/dialects/postgresql.html
[sqquelize]: https://sequelize.org/docs/v7/databases/postgres/
[stepzen]: https://stepzen.com/docs/quick-start/with-database-postgresql
[stitch]: https://stitch-docs.netlify.app/docs/integrations/databases/postgresql
[streamlit]: https://docs.streamlit.io/develop/tutorials/databases/postgresql
[striim]: https://www.striim.com/connectors/postgresql/
[superset]: https://superset.apache.org/docs/configuration/databases#timescaledb
[tableau]: /integrations/:currentVersion:/tableau/
[terraform]: /integrations/:currentVersion:/terraform
[tooljet]: https://docs.tooljet.ai/docs/data-sources/postgresql/
[typeorm]: https://typeorm.biunav.com/en/connection-options.html#postgres-cockroachdb-connection-options
[zapier]: https://zapier.com/apps/postgresql/integrations

