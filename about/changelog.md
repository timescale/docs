---
title: Changelog
excerpt: A summary of the latest changes to all Timescale products.
keywords: [changelog, upgrades, updates, releases]
---

# Changelog

All the latest features and updates to Timescale products.

## 🤖 TimescaleDB v2.18 and SQL Assistant Improvements in Data Mode and PopSQL

<Label type="date">February 6, 2025</Label>

### TimescaleDB v2.18 - dense indexes in the columnstore and query vectorization improvements
Starting this week, all new services created on Timescale Cloud use [TimescaleDB v2.18](https://github.com/timescale/timescaledb/releases/tag/2.18.0). Existing services will be upgraded gradually during their maintenance window.

Highlighted features in TimescaleDB v2.18.0 include:

* The ability to add dense indexes (btree and hash) to the columnstore through the new hypercore table access method.
* Significant performance improvements through vectorization (SIMD) for aggregations using a group by with one column and/or using a filter clause when querying the columnstore.
* Hypertables support triggers for transition tables, which is one of the most upvoted community feature requests.
* Updated methods to manage Timescale's hybrid row-columnar store (hypercore). These methods highlight columnstore usage. The columnstore includes an optimized columnar format as well as compression.

### SQL Assistant Improvements

We made a few improvements to SQL Assistant:

**Dedicated SQL Assistant threads** 🧵

Each query, notebook, and dashboard now gets its own conversation thread, keeping your chats organized.

![Dedicated threads](https://assets.timescale.com/docs/images/sql-assistant-threads.gif)

**Delete messages** ❌

Made a typo? Asked the wrong question? You can now delete individual messages from your thread to keep the conversation clean and relevant.

![Delete messages in SQL Assistant threads](https://assets.timescale.com/docs/images/sql-assistant-delete-messages.png)

**Support for OpenAI `o3-mini` ⚡**

We’ve added support for OpenAI’s latest `o3-mini` model, bringing faster response times and improved reasoning for SQL queries.

![Screenshot of o3-mini](https://assets.timescale.com/docs/images/sql-assistant-o3-mini.png)

## 🌐 IP Allowlists in Data Mode and PopSQL

<Label type="date">January 31, 2025</Label>

For enhanced network security, you can now also create IP allowlists in the $CONSOLE data mode and PopSQL. Similarly to the [ops mode IP allowlists][ops-mode-allow-list], this feature grants access to your data only to certain IP addresses. For example, you might require your employees to use a VPN and add your VPN static egress IP to the allowlist.

This feature is available in:

- [$CONSOLE][console] data mode, for all pricing tiers
- [PopSQL web][popsql-web]
- [PopSQL desktop][popsql-desktop]

Enable this feature in PopSQL/$CONSOLE data mode > `Project` > `Settings` > `IP Allowlist`:

![Timescale Console data mode IP allowlist](https://assets.timescale.com/docs/images/timescale-data-mode-ip-allowlist.png)

## 🤖 pgai Extension and Python Library Updates
<Label type="date">January 24, 2025</Label>

### AI — pgai PostgreSQL extension 0.7.0
This release enhances the Vectorizer functionality by adding configurable `base_url` support for OpenAI API. This enables pgai Vectorizer to use all OpenAI-compatible models and APIs via the OpenAI integration simply by changing the `base_url`. This release also includes public granting of vectorizers, superuser creation on any table, an upgrade to the Ollama client to 0.4.5, a new `docker-start` command, and various fixes for struct handling, schema qualification, and system package management. [See all changes on Github](https://github.com/timescale/pgai/releases/tag/extension-0.7.0).

### AI - pgai python library 0.5.0
This release adds comprehensive SQLAlchemy and Alembic support for vector embeddings, including operations for migrations and improved model inheritance patterns. You can now seamlessly integrate vector search capabilities with SQLAlchemy models while utilizing Alembic for database migrations. This release also adds key improvements to the Ollama integration and self-hosted Vectorizer configuration. [See all changes on Github](https://github.com/timescale/pgai/releases/tag/pgai-v0.5.0).

## AWS Transit Gateway Support
<Label type="date">January 17, 2025</Label>

### AWS Transit Gateway Support
Timescale Cloud now enables you to connect to your Timescale Cloud services through AWS Transit Gateway. This feature is available to Scale and Enterprise customers. It will be in Early Access for a short time and available in the Timescale Console very soon. If you are interested in implementing this Early Access Feature, reach out to your Rep.

## 🇮🇳 New region in India, PostgreSQL 17 upgrades, and TimescaleDB on AWS Marketplace
<Label type="date">January 10, 2025</Label>

### Welcome India! (Support for a new region: Mumbai)
Timescale Cloud now supports the Mumbai region. Starting today, you can run Timescale Cloud services in Mumbai, bringing our database solutions closer to users in India.

### PostgreSQL major version upgrades to PG 17
Timescale Cloud services can now be upgraded directly to PostgreSQL 17 from versions 14, 15, or 16. Users running versions 12 or 13 must first upgrade to version 15 or 16, before upgrading to 17.

### Timescale Cloud available on AWS Marketplace
Timescale Cloud is now available in the [AWS Marketplace][aws-timescale]. This allows you to keep billing centralized on your AWS account, use your already committed AWS Enterprise Discount Program spend to pay your Timescale Cloud bill and simplify procurement and vendor management.

## 🎅 Postgres 17, feature requests, and Postgres Livesync
<Label type="date">December 20, 2024</Label>

### Postgres 17
All new Timescale Cloud services now come with Postgres 17.2, the latest version. Upgrades to Postgres 17 for services running on prior versions will be available in January.
Postgres 17 adds new capabilities and improvements to Timescale like:
* **System-wide Performance Improvements**. Significant performance boosts, particularly in high-concurrency workloads. Enhancements in the I/O layer, including improved Write-Ahead Log (WAL) processing, can result in up to a 2x increase in write throughput under heavy loads.
* **Enhanced JSON Support**. The new JSON_TABLE allows developers to convert JSON data directly into relational tables, simplifying the integration of JSON and SQL. The release also adds new SQL/JSON constructors and query functions, offering powerful tools to manipulate and query JSON data within a traditional relational schema. 
* **More Flexible MERGE Operations**. The MERGE command now includes a RETURNING clause, making it easier to track and work with modified data. You can now also update views using MERGE, unlocking new use cases for complex queries and data manipulation.
  
### Submit feature requests from Timescale Console
You can now submit feature requests directly from Console and see the list of feature requests you have made. Just click on `Feature Requests` on the right sidebar.
All feature requests are automatically published to the [Timescale Forum](https://www.timescale.com/forum/c/cloud-feature-requests/39) and are reviewed by the product team, providing more visibility and transparency on their status as well as allowing other customers to vote for them.

![Submit a feature request in Timescale Console](https://assets.timescale.com/docs/images/submit-feature-request.png)

### Postgres Livesync (Alpha release)
We have built a new solution that helps you continuously replicate all or some of your Postgres tables directly into Timescale Cloud.

[Livesync](https://docs.timescale.com/migrate/latest/livesync/) allows you to keep a current Postgres instance such as RDS as your primary database, and easily offload your real-time analytical queries to Timescale Cloud to boost their performance. If you have any questions or feedback, talk to us in [#livesync in Timescale Community](https://app.slack.com/client/T4GT3N2JK/C086NU9EZ88).

This is just the beginning—you'll see more from Livesync in 2025!

## In-Console import from S3, I/O Boost, and Jobs Explorer
<Label type="date">December 13, 2024</Label>

### In-Console import from S3 (CSV and Parquet files)

Connect your S3 buckets to import data into Timescale Cloud. We support CSV (including `.zip` and `.gzip`) and Parquet files, with a 10 GB size limit in this initial release. This feature is accessible in the `Import your data` section right after service creation and through the `Actions` tab.

![Import data into Timescale with S3](https://assets.timescale.com/docs/images/import-your-data-s3.png)

![Import data into Timescale with S3 details](https://assets.timescale.com/docs/images/import-data-s3-details.png)

### Self-Serve I/O Boost 📈 

I/O Boost is an add-on for customers on Scale or Enterprise tiers that maximizes the I/O capacity of EBS storage to 16,000 IOPS and 1,000 MBps throughput per service. To enable I/O Boost, navigate to `Services` > `Operations` in Timescale Console. A simple toggle allows you to enable the feature, with pricing clearly displayed at $0.41/hour per node.

![Timescale I/O Boost](https://assets.timescale.com/docs/images/timescale-i-o-boost.png)

### Jobs Explorer 

See all the jobs associated with your service through a new `Jobs` tab. You can see the type of job, its status (`Running`, `Paused`, and others), and a detailed history of the last 100 runs, including success rates and runtime statistics.

![Timescale Console Jobs tab](https://assets.timescale.com/docs/images/timescale-console-jobs-tab.png)

![Timescale Console Jobs tab expanded](https://assets.timescale.com/docs/images/timescale-console-jobs-expanded.png)

## 🛝 New service creation flow
<Label type="date">December 6, 2024</Label>

- **AI and Vector:** the UI now lets you choose an option for creating AI and Vector-ready services right from the start. You no longer need to add the pgai, pgvector, and pgvectorscale extensions manually. You can combine this with time-series capabilities as well!

  ![Create Timescale Cloud service](https://assets.timescale.com/docs/images/create-timescale-service.png)

- **Compute size recommendations:** new (and old) users were sometimes unsure about what compute size to use for their workload.  We now offer compute size recommendations based on how much data you plan to have in your service.

  ![Service compute recommendation](https://assets.timescale.com/docs/images/timescale-service-compute-size.png)

- **More information about configuration options:** we've made it clearer what each configuration option does, so that you can make more informed choices about how you want your service to be set up.

## 🗝️ IP Allow Lists!
<Label type="date">November 21, 2024</Label>

IP Allow Lists let you specify a list of IP addresses that have access to your Timescale Cloud services and block any others. IP Allow Lists are a
lightweight but effective solution for customers concerned with security and compliance. They enable 
you to prevent unauthorized connections without the need for a [Virtual Private Cloud (VPC)](https://docs.timescale.com/use-timescale/latest/security/vpc/). 

To get started, in [Timescale Console](https://console.cloud.timescale.com/), select a service, then click
**Operations** > **Security** >  **IP Allow List**, then create an IP Allow List.

![IP Allow lists](https://assets.timescale.com/docs/images/IP-Allow-lists.png)

For more information, [see our docs](https://docs.timescale.com/use-timescale/latest/security/ip-allow-list/). 

## 🤩 SQL Assistant, TimescaleDB v2.17, HIPAA compliance, and better logging
<Label type="date">November 14, 2024</Label>

### 🤖 New AI companion: SQL Assistant

SQL Assistant uses AI to help you write SQL faster and more accurately.

- **Real-time help:** chat with models like OpenAI 4o and Claude 3.5 Sonnet to get help writing SQL. Describe what you want in natural language and have AI write the SQL for you.

  <div class="relative w-fit mx-auto">

  <iframe width="1120" height="630" style="max-width:100%"  src="https://www.youtube.com/embed/3Droej_E0cQ?si=9IFB1Pk8Cl1bVKtD" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
  
  </div>

- **Error resolution**: when you run into an error, SQL Assistant proposes a recommended fix that you can choose to accept.

    ![AI error fix](https://assets.timescale.com/docs/images/ai-error-fix.png)

- **Generate titles and descriptions**: click a button and SQL Assistant generates a title and description for your query. No more untitled queries!

   ![AI generated query title](https://assets.timescale.com/docs/images/ai-generate-title.png)

See our [blog post](https://www.timescale.com/blog/postgres-gui-sql-assistant/) or [docs](https://docs.timescale.com/getting-started/latest/run-queries-from-console/#sql-assistant) for full details!

### 🏄 TimescaleDB v2.17 - performance improvements for analytical queries and continuous aggregate refreshes

Starting this week, all new services created on Timescale Cloud use [TimescaleDB v2.17](https://github.com/timescale/timescaledb/releases/tag/2.17.0). Existing services are upgraded gradually during their maintenance windows.

TimescaleDB v2.17 significantly improves the performance of [continuous aggregate refreshes](https://docs.timescale.com/use-timescale/latest/continuous-aggregates/refresh-policies/), and contains performance improvements for [analytical queries and delete operations](https://docs.timescale.com/use-timescale/latest/compression/modify-compressed-data/) over compressed hypertables.

Best practice is to upgrade at the next available opportunity.

Highlighted features in TimescaleDB v2.17 are: 

* Significant performance improvements for continuous aggregate policies:

    * Continuous aggregate refresh now uses `merge` instead of deleting old materialized data and re-inserting.

    * Continuous aggregate policies are now more lightweight, use less system resources, and complete faster. This update:
  
      * Decreases dramatically the amount of data that must be written on the continuous aggregate in the presence of a small number of changes 
      * Reduces the i/o cost of refreshing a continuous aggregate 
      * Generates fewer Write-Ahead Logs (`WAL`)

* Increased performance for real-time analytical queries over compressed hypertables:

    * We are excited to introduce additional Single Instruction, Multiple Data (SIMD) vectorization optimization to TimescaleDB. This release supports vectorized execution for queries that _group by_ using the `segment_by` column(s), and _aggregate_ using the `sum`, `count`, `avg`, `min`, and `max` basic aggregate functions.

    * Stay tuned for more to come in follow-up releases! Support for grouping on additional columns, filtered aggregation, vectorized expressions, and `time_bucket` is coming soon.

    * Improved performance of deletes on compressed hypertables when a large amount of data is affected.

      This improvement speeds up operations that delete whole segments by skipping the decompression step. It is enabled for all deletes that filter by the `segment_by` column(s).

### HIPAA compliance

Timescale Cloud's [Enterprise plan](https://docs.timescale.com/about/latest/pricing-and-account-management/#features-included-in-each-plan) is now HIPAA (Health Insurance Portability and Accountability Act) compliant. This allows organizations to securely manage and analyze sensitive healthcare data, ensuring they meet regulatory requirements while building compliant applications.

### Expanded logging within Timescale Console

Customers can now access more than just the most recent 500 logs within the Timescale Console. We've updated the user experience, including scrollbar with infinite scrolling capabilities.

![Expanded console logs](https://assets.timescale.com/docs/images/console-expanded-logs.gif)

## ✨ Connect to Timescale from .NET Stack and check status of recent jobs
<Label type="date">November 07, 2024</Label>

### Connect to Timescale with your .NET stack
We've added instructions for connecting to Timescale using your .NET workflow. In Console after service creation, or in the **Actions** tab, you can now select .NET from the developer library list. The guide demonstrates how to use Npgsql to integrate Timescale with your existing software stack.

![.NET instructions](https://assets.timescale.com/docs/images/connect-via-net.png)

### ✅ Last 5 jobs status
In the **Jobs** section of the **Explorer**, users can now see the status (completed/failed) of the last 5 runs of each job.

![job status](https://assets.timescale.com/docs/images/explorer-job-list.png)

## 🎃 New AI, data integration, and performance enhancements
<Label type="date">October 31, 2024</Label>

### Pgai Vectorizer: vector embeddings as database indexes (early access)
This early access feature enables you to automatically create, update, and maintain embeddings as your data changes. Just like an index, Timescale handles all the complexity: syncing, versioning, and cleanup happen automatically.
This means no manual tracking, zero maintenance burden, and the freedom to rapidly experiment with different embedding models and chunking strategies without building new pipelines.
Navigate to the AI tab in your service overview and follow the instructions to add your OpenAI API key and set up your first vectorizer or read our [guide to automate embedding generation with pgai Vectorizer](https://github.com/timescale/pgai/blob/main/docs/vectorizer.md) for more details.

![Vectorizer setup](https://s3.amazonaws.com/assets.timescale.com/docs/images/vectorizer-setup.png)

### PostgreSQL-to-PostgreSQL foreign data wrappers: 
Fetch and query data from multiple PostgreSQL databases, including time-series data in hypertables, directly within Timescale Cloud using [foreign data wrappers (FDW)](https://docs.timescale.com/use-timescale/latest/schema-management/foreign-data-wrappers/). No more complicated ETL processes or external tools—just seamless integration right within your SQL editor. This feature is ideal for developers who manage multiple PostgreSQL and time-series instances and need quick, easy access to data across databases.

### Faster queries over tiered data 
This release adds support for runtime chunk exclusion for queries that need to access [tiered storage](https://docs.timescale.com/use-timescale/latest/data-tiering/). Chunk exclusion now works with queries that use stable expressions in the `WHERE` clause. The most common form of this type of query is:

```
SELECT * FROM  hypertable WHERE timestamp_col > now() - '100 days'::interval
```

For more info on queries with immutable/stable/volatile filters, check our blog post on [Implementing constraint exclusion for faster query performance](https://www.timescale.com/blog/implementing-constraint-exclusion-for-faster-query-performance/).

If you no longer want to use tiered storage for a particular hypertable, you can now disable tiering and drop the associated tiering metadata on the hypertable with a call to [disable_tiering function](https://docs.timescale.com/use-timescale/latest/data-tiering/enabling-data-tiering/#disable-tiering). 

### Chunk interval recommendations
Timescale Console now shows recommendations for services with too many small chunks in their hypertables. 
Recommendations for new intervals that improve service performance are displayed for each underperforming service and hypertable. Users can then change their chunk interval and boost performance within Timescale Console.

![Chunk interval recommendation](https://s3.amazonaws.com/assets.timescale.com/docs/images/chunk-interval-recommendation.png)

## 💡 Help with hypertables and faster notebooks
<Label type="date">October 18, 2024</Label>

### 🧙Hypertable creation wizard
After creating a service, users can now create a hypertable directly in Timescale Console by first creating a table, then converting it into a hypertable. This is possible using the in-console SQL editor. All standard hypertable configuration options are supported, along with any customization of the underlying table schema. 
![Hypertable creation wizard: image 1](https://assets.timescale.com/docs/images/hypertable-creation-wizard-1.png)

### 🍭 PopSQL Notebooks 
The newest version of Data Mode Notebooks is now waaaay faster.  Why? We've incorporated the newly developed v3 of our query engine that currently powers Timescale Console's SQL Editor.  Check out the difference in query response times.

## ✨ Production-Ready Low-Downtime Migrations, MySQL Import, Actions Tab, and Current Lock Contention Visibility in SQL Editor
<Label type="date">October 10, 2024</Label>

### 🏗️ Live Migrations v1.0 Release

Last year, we began developing a solution for low-downtime migration from PostgreSQL and TimescaleDB. Since then, this solution has evolved significantly, featuring enhanced functionality, improved reliability, and performance optimizations. We're now proud to announce that **live migration is production-ready** with the release of version 1.0.

Many of our customers have successfully migrated databases to Timescale using [live migration](https://docs.timescale.com/migrate/latest/live-migration/), with some databases as large as a few terabytes in size.

### 🔁 Actions Tab

As part of the service creation flow, we offer the following: 

- Connect to services from different sources
- Import and migrate data from various sources
- Create hypertables

Previously, these actions were only visible during the service creation process and couldn't be accessed later. Now, these actions are **persisted within the service**, allowing users to leverage them on-demand whenever they're ready to perform these tasks.

![Timescale Console Actions tab](https://assets.timescale.com/docs/images/timescale-console-actions-tab.png)

### 🧭 Import Data from MySQL

We've noticed users struggling to convert their MySQL schema and data into their Timescale Cloud services. This was due to the semantic differences between MySQL and PostgreSQL. To simplify this process, we now offer **easy-to-follow instructions** to import data from MySQL to Timescale Cloud.  This feature is available as part of the data import wizard, under the **Import from MySQL** option.

![MySQL import instructions](https://assets.timescale.com/docs/images/mysql-import-instructions.png)

### 🔐 Current Lock Contention

In Timescale Console, we offer the SQL editor so you can directly querying your service. As a new improvement,  **if a query is waiting on locks and can't complete execution**, Timescale Console now displays the current lock contention in the results section .

![View console services](https://assets.timescale.com/docs/images/current-lock-contention.png)

## CIDR & VPC Updates

<Label type="date">October 3, 2024</Label>

Timescale now supports multiple CIDRs on the customer VPC. Customers who want to take advantage of multiple CIDRs will need to recreate their peering.

## 🤝 New modes in Timescale Console: Ops and Data mode, and Console based Parquet File Import

<Label type="date">September 19, 2024</Label>

We've been listening to your feedback and noticed that Timescale Console users have diverse needs. Some of you are focused on operational tasks like adding replicas or changing parameters, while others are diving deep into data analysis to gather insights.

**To better serve you, we've introduced new modes to the Timescale Console UI—tailoring the experience based on what you're trying to accomplish.**

Ops mode is where you can manage your services, add replicas, configure compression, change parameters, and so on.

Data mode is the full PopSQL experience: write queries with autocomplete, visualize data with charts and dashboards, schedule queries and dashboards to create alerts or recurring reports, share queries and dashboards, and more.

Try it today and let us know what you think! 

![Timescale Console Ops and Data mode](https://assets.timescale.com/docs/images/ops-data-mode.gif)

## Console based Parquet File Import

Now users can upload from Parquet to Timescale Cloud by uploading the file from their local file system. For files larger than 250 MB, or if you want to do it yourself, follow the three-step process to upload Parquet files to Timescale.

![Upload from Parquet to Timescale Cloud](https://assets.timescale.com/docs/images/upload_parquet.gif)


### SQL editor improvements

* In the Ops mode SQL editor, you can now highlight a statement to run a specific statement.

## High availability, usability, and migrations improvements
<Label type="date">September 12, 2024</Label>

### Multiple HA replicas

Scale and Enterprise customers can now configure two new multiple high availability (HA) replica options directly through Timescale Console:

* Two HA replicas (both asynchronous) - our highest availability configuration.
* Two HA replicas (one asynchronous, one synchronous) - our highest data integrity configuration.

Previously, Timescale offered only a single synchronous replica for customers seeking high availability. The single HA option is still available.

![Change Replica Configuration](https://s3.amazonaws.com/assets.timescale.com/docs/images/change-replica-configuration.png)

![High Availability](https://s3.amazonaws.com/assets.timescale.com/docs/images/high-availability.png)

For more details on multiple HA replicas, see [Manage high availability](https://docs.timescale.com/use-timescale/latest/ha-replicas/high-availability/).

### Other improvements

* In the Console SQL editor, we now indicate if your database session is healthy or has been disconnected. If it's been disconnected, the session will reconnect on your next query execution.

   ![Session Status Indicator](https://s3.amazonaws.com/assets.timescale.com/docs/images/session-status-indicator.gif)

* Released live-migration v0.0.26 and then v0.0.27 which includes multiple performance improvements and bugfixes as well as better support for PostgreSQL 12.

## One-click SQL statement execution from Timescale Console, and session support in the SQL editor
<Label type="date">September 05, 2024</Label>

### One-click SQL statement execution from Timescale Console

Now you can simply click to run SQL statements in various places in the Console. This requires that the [SQL Editor][sql-editor] is enabled for the service.

* Enable Continuous Aggregates from the CAGGs wizard by clicking **Run** below the SQL statement.
![Enable Continuous Aggregates](https://s3.amazonaws.com/assets.timescale.com/docs/images/enable-continuous-aggregates.gif)

* Enable database extensions by clicking **Run** below the SQL statement.
![Enable extensions from Console](https://s3.amazonaws.com/assets.timescale.com/docs/images/enable-extensions-from-console.gif)

* Query data instantly with a single click in the Console after successfully uploading a CSV file.
![Query data after CSV import](https://s3.amazonaws.com/assets.timescale.com/docs/images/query-data-after-csv-import.gif)

### Session support in the SQL editor

Last week we announced the new in-console SQL editor. However, there was a limitation where a new database session was created for each query execution. 

Today we removed that limitation and added support for keeping one database session for each user logged in, which means you can do things like start transactions:

```
begin;
insert into users (name, email) values ('john doe', 'john@example.com');
abort; -- nothing inserted
```

Or work with temporary tables:

```
create temporary table temp_users (email text);
insert into temp_sales (email) values ('john@example.com');
-- table will automatically disappear after your session ends
```

Or use the `set` command:

```
set search_path to 'myschema', 'public';
```


## 😎 Query your database directly from the Console and enhanced data import and migration options
<Label type="date">August 30, 2024</Label>

### SQL Editor in Timescale Console 
We've added a new tab to the service screen that allows users to query their database directly, without having to leave the console interface.

* For existing services on Timescale, this is an opt-in feature. For all newly created services, the SQL Editor will be enabled by default.
* Users can disable the SQL Editor at any time by toggling the option under the Operations tab.
* The editor supports all DML and DDL operations (any single-statement SQL query), but doesn't support multiple SQL statements in a single query.
  
![SQL Editor](https://s3.amazonaws.com/assets.timescale.com/docs/images/sql-editor-query.png)

### Enhanced Data Import Options for Quick Evaluation
After service creation, we now offer a dedicated section for data import, including options to import from Postgres as a source or from CSV files.

The enhanced Postgres import instructions now offer several options: single table import, schema-only import, partial data import (allowing selection of a specific time range), and complete database import. Users can execute any of these data imports with just one or two simple commands provided in the data import section.

![Data import screen](https://s3.amazonaws.com/assets.timescale.com/docs/images/data-import-screen.png)

### Improvements to Live migration
We've released v0.0.25 of Live migration that includes the following improvements:
* Support migrating tsdb on non public schema to public schema
* Pre-migration compatibility checks
* Docker compose build fixes

## 🛠️ Improved tooling in Timescale Cloud and new AI and Vector extension releases
<Label type="date">August 22, 2024</Label>

### CSV import
We have added a CSV import tool to the Timescale Console.  For all TimescaleDB services, after service creation you can: 
* Choose a local file
* Select the name of the data collection to be uploaded (default is file name)
* Choose data types for each column
* Upload the file as a new hypertable within your service
Look for the `Import data from .csv` tile in the `Import your data` step of service creation.

![CSV import](https://s3.amazonaws.com/assets.timescale.com/docs/images/csv-import.png)

### Replica lag
Customers now have more visibility into the state of replicas running on Timescale Cloud. We’ve released a new parameter called Replica Lag within the Service Overview for both Read and High Availability Replicas. Replica lag is measured in bytes against the current state of the primary database. For questions or concerns about the relative lag state of your replica, reach out to Customer Support.

![Replica lag indicator](https://s3.amazonaws.com/assets.timescale.com/docs/images/replica-lag-indicator.png)

### Adjust chunk interval
Customers can now adjust their chunk interval for their hypertables and continuous aggregates through the Timescale UI. In the Explorer, select the corresponding hypertable you would like to adjust the chunk interval for. Under *Chunk information*, you can change the chunk interval. Note that this only changes the chunk interval going forward, and does not retroactively change existing chunks.

![Edit chunk interval](https://s3.amazonaws.com/assets.timescale.com/docs/images/edit-chunk-interval.png)


### CloudWatch permissions via role assumption
We've released permission granting via role assumption to CloudWatch. Role assumption is both more secure and more convenient for customers who no longer need to rotate credentials and update their exporter config.

For more details take a look at [our documentation](https://docs.timescale.com/use-timescale/latest/metrics-logging/integrations/).

<img src="https://s3.amazonaws.com/assets.timescale.com/docs/images/cloudwatch-role-assumption.png" width="600px" alt="CloudWatch authentication via role assumption" />

### Two-factor authentication (2FA) indicator
We’ve added a 2FA status column to the Members page, allowing customers to easily see whether each project member has 2FA enabled or disabled.

![2FA status](https://s3.amazonaws.com/assets.timescale.com/docs/images/2FA-status-indicator.png)

### Anthropic and Cohere integrations in pgai
The pgai extension v0.3.0 now supports embedding creation and LLM reasoning using models from Anthropic and Cohere. For details and examples, see [this post for pgai and Cohere](https://www.timescale.com/blog/build-search-and-rag-systems-on-postgresql-using-cohere-and-pgai/), and [this post for pgai and Anthropic](https://www.timescale.com/blog/use-anthropic-claude-sonnet-3-5-in-postgresql-with-pgai/).

### pgvectorscale extension: ARM builds and improved recall for low dimensional vectors
pgvectorscale extension [v0.3.0](https://github.com/timescale/pgvectorscale/releases/tag/0.3.0) adds support for ARM processors and improves recall when using StreamingDiskANN indexes with low dimensionality vectors. We recommend updating to this version if you are self-hosting.


## 🏄 Optimizations for compressed data and extended join support in continuous aggregates
<Label type="date">August 15, 2024</Label>

TimescaleDB v2.16.0 contains significant performance improvements when working with compressed data, extended join
support in continuous aggregates, and the ability to define foreign keys from regular tables towards hypertables.
We recommend upgrading at the next available opportunity.

Any new service created on Timescale Cloud starting today uses TimescaleDB v2.16.0.

In TimescaleDB v2.16.0 we:

* Introduced multiple performance focused optimizations for data manipulation operations (DML) over compressed chunks.

  Improved upsert performance by more than 100x in some cases and more than 500x in some update/delete scenarios.

* Added the ability to define chunk skipping indexes on non-partitioning columns of compressed hypertables.

  TimescaleDB v2.16.0 extends chunk exclusion to use these skipping (sparse) indexes when queries filter on the relevant columns,
  and prune chunks that do not include any relevant data for calculating the query response.

* Offered new options for use cases that require foreign keys defined.

  You can now add foreign keys from regular tables towards hypertables. We have also removed
  some really annoying locks in the reverse direction that blocked access to referenced tables
  while compression was running.

* Extended Continuous Aggregates to support more types of analytical queries.

  More types of joins are supported, additional equality operators on join clauses, and
  support for joins between multiple regular tables.

**Highlighted features in this release**

* Improved query performance through chunk exclusion on compressed hypertables.

  You can now define chunk skipping indexes on compressed chunks for any column with one of the following
  integer data types: `smallint`, `int`, `bigint`, `serial`, `bigserial`, `date`, `timestamp`, `timestamptz`.

  After calling `enable_chunk_skipping` on a column, TimescaleDB tracks the min and max values for
  that column, using this information to exclude chunks for queries filtering on that
  column, where no data would be found.

* Improved upsert performance on compressed hypertables.

  By using index scans to verify constraints during inserts on compressed chunks, TimescaleDB speeds
  up some ON CONFLICT clauses by more than 100x.

* Improved performance of updates, deletes, and inserts on compressed hypertables.

  By filtering data while accessing the compressed data and before decompressing, TimescaleDB has
  improved performance for updates and deletes on all types of compressed chunks, as well as inserts
  into compressed chunks with unique constraints.

  By signaling constraint violations without decompressing, or decompressing only when matching
  records are found in the case of updates, deletes and upserts, TimescaleDB v2.16.0 speeds
  up those operations more than 1000x in some update/delete scenarios, and 10x for upserts.

* You can add foreign keys from regular tables to hypertables, with support for all types of cascading options.
  This is useful for hypertables that partition using sequential IDs, and need to reference these IDs from other tables.

* Lower locking requirements during compression for hypertables with foreign keys

  Advanced foreign key handling removes the need for locking referenced tables when new chunks are compressed.
  DML is no longer blocked on referenced tables while compression runs on a hypertable.

* Improved support for queries on Continuous Aggregates

  `INNER/LEFT` and `LATERAL` joins are now supported. Plus, you can now join with multiple regular tables,
  and have more than one equality operator on join clauses.

**PostgreSQL 13 support removal announcement**

Following the deprecation announcement for PostgreSQL 13 in TimescaleDB v2.13,
PostgreSQL 13 is no longer supported in TimescaleDB v2.16.

The currently supported PostgreSQL major versions are 14, 15, and 16.
 
## 📦 Performance, packaging and stability improvements for Timescale Cloud
<Label type="date">August 8, 2024</Label>

### New plans
To support evolving customer needs, Timescale Cloud now offers three plans to provide more value, flexibility, and efficiency.
- **Performance:** for cost-focused, smaller projects. No credit card required to start.
- **Scale:** for developers handling critical and demanding apps.
- **Enterprise:** for enterprises with mission-critical apps.

Each plan continues to bill based on hourly usage, primarily for compute you run and storage you consume.  You can upgrade or downgrade between Performance and Scale plans via the Console UI at any time.  More information about the specifics and differences between these pricing plans can be found [here in the docs](https://docs.timescale.com/about/latest/pricing-and-account-management/).
![Pricing plans in the console](https://assets.timescale.com/docs/images/pricing-plans-in-console.png)

### Improvements to the Timescale Console
The individual tiles on the services page have been enhanced with new information, including high-availability status.  This will let you better assess the state of your services at a glance.
![New service tile](https://assets.timescale.com/docs/images/new-service-tile-high-availability.png)

### Live migration release v0.0.24
Improvements:
- Automatic retries are now available for the initial data copy of the migration
- Now uses pgcopydb for initial data copy for PG to TSDB migrations also (already did for TS to TS) which has a significant performance boost.
- Fixes issues with TimescaleDB v2.13.x migrations
- Support for chunk mapping for hypertables with custom schema and table prefixes


## ⚡ Performance and stability improvements for Timescale Cloud and TimescaleDB
<Label type="date">July 12, 2024</Label>

The following improvements have been made to Timescale products:

- **Timescale Cloud**:
  - The connection pooler has been updated and now avoids multiple reloads
  - The tsdbadmin user can now grant the following roles to other users: `pg_checkpoint`,`pg_monitor`,`pg_signal_backend`,`pg_read_all_stats`,`pg_stat_scan_tables`
  - Timescale Console is far more reliable.

- **TimescaleDB**
  - The TimescaleDB v2.15.3 patch release improves handling of multiple unique indexes in a compressed INSERT,
    removes the recheck of ORDER when querying compressed data, improves memory management in DML functions, improves
    the tuple lock acquisition for tiered chunks on replicas, and fixes an issue with ORDER BY/GROUP BY in our
    HashAggregate optimization on PG16. For more information, see the [release note](https://github.com/timescale/timescaledb/releases/tag/2.15.3).
  - The TimescaleDB v2.15.2 patch release improves sort pushdown for partially compressed chunks, and compress_chunk with
    a primary space partition. The metadata function is removed from the update script, and hash partitioning on a
    primary column is disallowed. For more information, see the [release note](https://github.com/timescale/timescaledb/releases/tag/2.15.2).



## ⚡ Performance improvements for live migration to Timescale Cloud
<Label type="date">June 27, 2024</Label>

The following improvements have been made to the Timescale [live-migration docker image](https://hub.docker.com/r/timescale/live-migration/tags):

- Table-based filtering is now available during live migration.  
- Improvements to pbcopydb increase performance and remove unhelpful warning messages.
- The user notification log enables you to always select the most recent release for a migration run.

For improved stability and new features, update to the latest [timescale/live-migration](https://hub.docker.com/r/timescale/live-migration/tags) docker image. To learn more, see the [live migration docs](https://docs.timescale.com/migrate/latest/live-migration/).

## 🦙Ollama integration in pgai

<Label type="date">June 21, 2024</Label>

Ollama is now integrated with [pgai](https://github.com/timescale/pgai).

Ollama is the easiest and most popular way to get up and running with open-source 
language models. Think of Ollama as _Docker for LLMs_, enabling easy access and usage 
of a variety of open-source models like Llama 3, Mistral, Phi 3, Gemma, and more. 

With the pgai extension integrated in your database, embed Ollama AI into your app using
SQL. For example:

```sql
select ollama_generate
( 'llava:7b'
, 'Please describe this image.'
, _images=> array[pg_read_binary_file('/pgai/tests/postgresql-vs-pinecone.jpg')]
, _system=>'you are a helpful assistant'
, _options=> jsonb_build_object
  ( 'seed', 42
  , 'temperature', 0.9
  )
)->>'response'
;
```

To learn more, see the [pgai Ollama documentation](https://github.com/timescale/pgai/blob/main/docs/ollama.md).

## 🧙 Compression Wizard

<Label type="date">June 13, 2024</Label>

The compression wizard is now available on Timescale Cloud. Select a hypertable and be guided through enabling compression through the UI!

To access the compression wizard, navigate to `Explorer`, and select the hypertable you would like to compress. In the top right corner, hover where it says `Compression off`, and open the wizard. You will then be guided through the process of configuring compression for your hypertable, and can compress it directly through the UI.

![Run the compression wizard in Timescale Console](https://assets.timescale.com/docs/images/compress-data-in-console.png)

## 🏎️💨 High Performance AI Apps With pgvectorscale

<Label type="date">June 11, 2024</Label>

The [vectorscale extension][pgvectorscale] is now available on [Timescale Cloud][signup].

pgvectorscale complements pgvector, the open-source vector data extension for PostgreSQL, and introduces the
following key innovations for pgvector data:

- A new index type called StreamingDiskANN, inspired by the DiskANN algorithm, based on research from Microsoft.
- Statistical Binary Quantization: developed by Timescale researchers, This compression method improves on
  standard Binary Quantization.

On benchmark dataset of 50 million Cohere embeddings (768 dimensions each), PostgreSQL with pgvector and
pgvectorscale achieves 28x lower p95 latency and 16x higher query throughput compared to Pinecone's storage
optimized (s1) index for approximate nearest neighbor queries at 99% recall, all at 75% less cost when
self-hosted on AWS EC2.

To learn more, see the [pgvectorscale documentation][pgvectorscale].

## 🧐Integrate AI Into Your Database Using pgai

<Label type="date">June 11, 2024</Label>

The [pgai extension][pgai] is now available on [Timescale Cloud][signup].

pgai brings embedding and generation AI models closer to the database. With pgai, you can now do the following directly
from within PostgreSQL in a SQL query:

* Create embeddings for your data.
* Retrieve LLM chat completions from models like OpenAI GPT4o.
* Reason over your data and facilitate use cases like classification, summarization, and data enrichment on your existing relational data in PostgreSQL.

To learn more, see the [pgai documentation][pgai].

## 🐅Continuous Aggregate and Hypertable Improvements for TimescaleDB
<Label type="date">June 7, 2024</Label>

The 2.15.x releases contains performance improvements and bug fixes. Highlights in these releases are:

- Continuous Aggregate now supports `time_bucket` with origin and/or offset.
- Hypertable compression has the following improvements:
  - Recommend optimized defaults for segment by and order by when configuring compression through analysis of table configuration and statistics.
  - Added planner support to check more kinds of WHERE conditions before decompression.
    This reduces the number of rows that have to be decompressed.
  - You can now use minmax sparse indexes when you compress columns with btree indexes.
  - Vectorize filters in the WHERE clause that contain text equality operators and LIKE expressions.

To learn more, see the [TimescaleDB release notes](https://github.com/timescale/timescaledb/releases).

## 🔍 Database Audit Logging with pgaudit
<Label type="date">May 31, 2024</Label>

The [PostgreSQL Audit extension(pgaudit)](https://github.com/pgaudit/pgaudit/) is now available on [Timescale Cloud][signup].
pgaudit provides detailed database session and object audit logging in the Timescale
Cloud logs.

If you have strict security and compliance requirements and need to log all operations
on the database level, pgaudit can help. You can also export these audit logs to
[Amazon CloudWatch](https://aws.amazon.com/cloudwatch/).

To learn more, see the [pgaudit documentation](https://github.com/pgaudit/pgaudit/).

## 🌡 International System of Unit Support with postgresql-unit
<Label type="date">May 31, 2024</Label>

The [SI Units for PostgreSQL extension(unit)](https://github.com/df7cb/postgresql-unit) provides support for the
[ISU](https://en.wikipedia.org/wiki/International_System_of_Units) in [Timescale Cloud][signup].

You can use Timescale Cloud to solve day-to-day questions. For example, to see what 50°C is in °F, run the following
query in your Timescale Cloud service:

```
SELECT '50°C'::unit @ '°F' as temp;
  temp
--------
 122 °F
(1 row)
```

To learn more, see the [postgresql-unit documentation](https://github.com/df7cb/postgresql-unit).

[release-notes]: /about/:currentVersion:/release-notes/
[timescaledb-releases]: https://github.com/timescale/timescaledb/releases/
[pgai]: https://github.com/timescale/pgai
[pgvectorscale]: https://github.com/timescale/pgvectorscale/
[signup]: https://console.cloud.timescale.com/signup
[sql-editor]: /getting-started/:currentVersion:/run-queries-from-console/#sql-editor
[aws-timescale]: https://aws.amazon.com/marketplace/seller-profile?id=seller-wbtecrjp3kxpm
[ops-mode-allow-list]: /about/:currentVersion:/changelog/#-ip-allow-lists
[popsql-web]: https://app.popsql.com/login
[popsql-desktop]: https://popsql.com/download
[console]: https://console.cloud.timescale.com/dashboard/services
