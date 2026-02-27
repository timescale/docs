---
title: Changelog
excerpt: Get a weekly summary of the latest changes to TigerData products with links to detailed documentation
keywords: [changelog, upgrades, updates, releases]
products: [cloud]
---

# Changelog

All the latest features and updates to $CLOUD_LONG.

## Jobs timeline view 
<Label type="date">February 25, 2026</Label>

**Jobs Timeline view added to Jobs page**

We have added a timeline view to the Jobs page so customers can easily see the status of all of their recent job runs at a glance. Users can hover over each run for more detail, or click on a specific job to go into the deep dive jobs view. 


## Azure Marketplace automation and UI updates
<Label type="date">February 18, 2026</Label>

**Azure Marketplace automation**

Microsoft customers can quickly sign up for Tiger Cloud through Azure Marketplace, enabling streamlined procurement and consolidated billing. Previously the signup process was manual, requiring help from us at Tiger Data. Now it's completely self-serve! You can find the product under the [annual commit](https://marketplace.microsoft.com/en-us/product/timescale1759504210261.tigerdata-annualcommit?tab=Overview) and [pay as you go](https://marketplace.microsoft.com/en-us/product/timescale1759504210261.tigerdata-payg?tab=Overview) pricing options at the marketplace.

![Azure marketplace Tiger Cloud entry](https://assets.timescale.com/docs/images/azure-marketplace-automation-1.png)

![Azure marketplace Tiger Cloud integration](https://assets.timescale.com/docs/images/azure-marketplace-automation-3.png)

**Floating SQL editor**

We have changed the interface for the SQL editor to be floating, as opposed to a dedicated tab. Now SQL editor follows you as you navigate around the UI within an individual service. This change improves the usability and allows you to easily reference your schema (through Explorer) when writing SQL queries.

![Floating SQL editor](https://assets.timescale.com/docs/images/floating-sql-editor-tiger-cloud.png)

**Data/Ops view toggle added at the service level**

We brought back the toggle between the Ops view and Data view within the context of a service. You can now easily switch to Data view from inside an individual service. The toggle is available above the top navigation in the UI.

![View toggle](https://assets.timescale.com/docs/images/tiger-cloud-view-toggle.png)

## pg_textsearch v0.5.0
<Label type="date">February 13, 2026</Label>

`pg_textsearch` v0.5.0 is now available on Tiger Cloud!

This release includes the following highlights: 

- Parallel index builds: `CREATE INDEX` now uses multiple workers for faster indexing of large tables. $PG automatically allocates workers based on the table size and `max_parallel_maintenance_workers` setting.
- Improvements for bm25 indexes on hypertables.
- Stability fixes.

See [Optimize full text search with BM25](https://www.tigerdata.com/docs/use-timescale/latest/extensions/pg-textsearch) for how to use it. 

## Tiered Storage on Microsoft Azure
<Label type="date">February 11, 2026</Label>

Tiered Storage is now available for Tiger Cloud services running on Microsoft Azure, bringing cost-effective data management to our Azure customers. This feature enables you to automatically move rarely accessed data to low-cost storage on Azure Blob Storage while maintaining the ability to query it seamlessly with standard SQL. Customers typically see a reduction of 2-5x in storage costs depending on data compression rates.

Azure Tiered Storage works just like the AWS version: enable it in Tiger Console, set tiering policies on your hypertables, and Tiger Cloud handles the rest. With this release, Tiger Cloud services on Azure offer the same powerful data lifecycle management capabilities as those running on AWS.

## Europe (Zurich) is now available
<Label type="date">February 11, 2026</Label>

Starting today, you can use Tiger Cloud in the AWS Europe (Zurich) Region. This enables applications to have low-latency access to Tiger Cloud services while meeting data residency requirements.

To create your first service, see [Get started with Tiger Data](https://www.tigerdata.com/docs/getting-started/latest). For a complete list of regional availability, see [available regions](https://www.tigerdata.com/docs/about/latest/supported-platforms#available-regions).

## pg_textsearch improvements (v0.3.0 and v0.4.0)
<Label type="date">January 16, 2026</Label>

Tiger Cloud now includes significant improvements to `pg_textsearch`, bringing major gains in query performance, index size, and scalability as we move toward GA.

**What’s new:**
- **Block MAX-WAND ranked search (v0.3.0):**  
  Introduces the Block MAX-WAND algorithm for ranked keyword search, delivering substantial performance improvements. Query performance is now competitive with the fastest Postgres-based search solutions, including ParadeDB.
- **Posting-list compression (v0.4.0):**  
  Reduces index sizes by **40% or more**, making `pg_textsearch` indexes smaller than ParadeDB in many cases.
- **Improved partition handling (v0.4.0):**  
  Fixes and stability improvements for indexes on tables with large numbers of partitions.

Additional optimizations, including block compression and parallel indexing, are in progress as `pg_textsearch` continues its sprint toward GA.

**Learn more:**
- [pg_textsearch v0.3.0 release notes](https://github.com/timescale/pg_textsearch/releases/tag/v0.3.0)  
- [pg_textsearch v0.4.0 release notes](https://github.com/timescale/pg_textsearch/releases/tag/v0.4.0)

## Postgres 18 support
<Label type="date">January 13, 2026</Label>

Tiger Cloud now supports **Postgres 18**. All new services are created with Postgres 18 by default, and existing services will be able to upgrade to Postgres 18 over the next few weeks.

**Postgres 18 highlights include:**
- **Asynchronous I/O (AIO), including `io_uring` on Linux**, for significantly faster read-heavy workloads
- **Faster, less disruptive major upgrades**, including improved `pg_upgrade` and the ability to **preserve planner statistics** across upgrades
- **Virtual generated columns** (now the default for generated columns) and the **`uuidv7()`** function for better UUID indexing behavior
- **Query performance improvements**, including expanded index usage (for example, skip-scan on multicolumn B-tree indexes) and **parallel GIN index builds**
- **Security and operability enhancements**, including **OAuth 2.0 authentication support** and **page checksums enabled by default for new clusters**

For more details about Postgres 18, check the [official announcement](https://www.postgresql.org/about/news/postgresql-18-released-3142/)

## 🧱 Terraform Support for S3 Source Connectors and pg_textsearch update
<Label type="date">January 09, 2026</Label>

### Terraform Support for S3 Source Connectors
We’ve added a new `timescale_connector_s3` resource to the Tiger Data (TimescaleDB) Terraform provider, enabling full 
Infrastructure as Code management of S3 source connectors. Teams can now declaratively create, update, and manage S3 
connectors supporting CSV and Parquet files, multiple auth methods, and configurable sync options—directly alongside 
their TimescaleDB infrastructure.

Available in [Terraform provider v2.7.0+](https://releases.hashicorp.com/terraform-provider-archive).

### pg_textsearch v0.2.0 released and on Tiger Cloud
The newest version of pg_textsearch has:
- Automated benchmark infrastructure
- Groundwork for storage and query optimizations in upcoming releases
- Numerous bugfixes

See more details in the [pg_textsearch GitHub release notes](https://github.com/timescale/pg_textsearch/releases/tag/v0.2.0)

The new extension version is also available for all services on Tiger Cloud.

## 🧭  Activity log and TimescaleDB v2.24
<Label type="date">December 12, 2025</Label>

### Activity log
Tiger Console now offers the `Activity` tab that displays the activity log for all your services. This serves as a record of actions that have happened to your services and Tiger Cloud account, such as service resizes and project invitations. The activity log includes the corresponding service (where applicable), the user who performed the action, and a description of the action itself. You can suggest new actions to record on the `Activity` tab.

![Activity log on Tiger Cloud](https://assets.timescale.com/docs/images/tiger-cloud-console/activity-log.png)

### TimescaleDB 2.24
TimescaleDB 2.24 was released on December 3rd and is now available to all users on Tiger Cloud. TimescaleDB 2.24 delivers more efficient recompression operations, expanded use of continuous aggregates, and better invalidation behavior. It also brings back support for bloom filters on ARM-based architectures. 

#### Highlighted features in TimescaleDB 2.24

**In-memory recompression**

A new `recompress := true` option for `convert_to_columnstore()` performs batch compaction entirely in memory. 

For example: `CALL convert_to_columnstore('<chunk_name>', recompress := true);`

This approach is 4–5 times faster than the previous spill-to-disk method, and reduces I/O for workloads with many small or uneven batches. This can be helpful if you are ingesting unordered data via direct compress and need to optimize your batches, or when you add new sparse indexes and need to build them on existing chunks.

**Bloom filters on ARM-based Tiger Cloud services**

On ARM-based Tiger Cloud services, bloom filters return with corrected hashing support for the ARM architecture. A misconfigured hashing library previously required disabling bloom indexes on ARM-based services. This release restores bloom filter functionality with a new index version.

For self-hosted TimescaleDB users, nothing changes if you're using an AMD64 architecture. Otherwise, please [see here](https://github.com/timescale/timescaledb/pull/8761#user-content-changelog). For Tiger Cloud customers, recompression is only required for services where you want to rebuild bloom filters on existing chunks. New chunks receive bloom indexes automatically.

**Continuous aggregate updates**

- **Smarter invalidation range capping** prevents massive refresh windows when out-of-order or faulty timestamps span large gaps. Invalidation now stays bounded to chunk ranges, reducing unnecessary refresh work.

- **Direct compress invalidation support** enables continuous aggregates on hypertables that ingest directly into the columnstore. Min/max batch timestamps now generate invalidation entries without needing row-level WAL.

- **UUIDv7 support** unlocks continuous aggregates on UUIDv7-partitioned tables through an extended `time_bucket()` that accepts UUIDv7 and outputs a timestamp.

For complete details, refer to the [TimescaleDB 2.24 release notes](https://github.com/timescale/timescaledb/releases/tag/2.24.0).

## New navigation in Console
<Label type="date">December 5, 2025</Label>

We have updated the design of the navigation in Console to improve consistency, reduce distractions, and make it easier and faster to navigate through the different menus.

![New console navigation](https://assets.timescale.com/docs/images/console-new-navigation.png)

## S3 connector GA and Tiger Lake public beta
<Label type="date">November 28, 2025</Label>

### S3 source connector general availability

The S3 source connector is now production-ready, delivering major improvements in reliability, performance, and correctness across the entire ingestion pipeline. We resolved extensive issues related to file state transitions, workflow ordering, live sync consistency, and error handling, while adding support for retries, skipping files, better conflict handling, and more stable pause/resume behavior. Import operations are now more resilient, deterministic, and traceable, with clearer progress reporting and more accurate file and worker state visibility.

Performance and scalability have been significantly enhanced through better autoscaling, improved worker resource allocation, faster preview and import operations, optimized scheduling, reduced memory usage, and higher throughput for small and large files.

The user experience has been upgraded across the UI with improved file filtering, pagination, column mapping, input validation, clearer states and sizes, and more robust multi-step flows. Numerous bugs affecting import previews, table selection, schema handling, hypertable creation, and navigation were fixed. Combined, these changes make the S3 source connector significantly more stable, predictable, and user-friendly—ready for GA adoption.

### Tiger Lake public beta

Tiger Lake is now available in public beta and ready for broader use. The public beta includes:

**Full DML support**
* Replication of INSERT, UPDATE, and DELETE operations on hypertables and regular Postgres tables to Iceberg.

**High-performance ingestion**
* Decoupled CDC and full table import pipelines.
* CDC ingest throughput: ~30,000 records/second.
* Initial full table import throughput: ~300,000 records/second.

**Enhanced resilience and self-healing**
* Automatic recovery when a replication slot disappears—all data is correctly replayed, keeping Iceberg tables eventually consistent.
* Seamless recovery in case of hardware failure without restarting ingestion from scratch.

**Improved deployment experience**
* Validation of ARNs before service deployment to prevent misconfiguration.
* Compatibility against hypertables with data in rowstore and columnstore.

Read the [documentation](https://www.tigerdata.com/docs/use-timescale/latest/tigerlake) to get started.


## TimescaleDB v2.23 – improved getting started, automatic columnstore, and faster continuous aggregate invalidation tracking
<Label type="date">November 14, 2025</Label>

TimescaleDB v2.23 was released on October 29th and is now available on Tiger Cloud. 

### Highlighted features in TimescaleDB v2.23.0

- Simplified hypertable creation: now even easier with less configuration and smarter defaults. [Create a hypertable](https://www.tigerdata.com/docs/api/latest/hypertable/create_table/#samples) in only one step with automatic selection of all parameters. This includes:
    - Automatic selection of the partitioning column: TimescaleDB automatically selects a partitioning column so you no longer need to specify which column to use during creation.
    - Automatic columnstore policy: TimescaleDB enables the columnstore by default and automatically creates a columnstore policy that runs after one chunk interval (defaults to 7 days).
- UUIDv7 compression enabled by default: the UUIDv7 vectorized compression and query acceleration introduced in 2.22 are now enabled by default. You automatically benefit from ~30% storage savings and up to 2x faster query performance.
- Direct-to-Columnstore (tech preview): this release adds `INSERT` support to Direct-to-Columnstore (Direct Compress), which previously supported only `COPY`. For more information, see our [documentation](https://www.tigerdata.com/docs/use-timescale/latest/write-data/insert/#direct-compress-on-insert) and [blog post](https://www.tigerdata.com/blog/introducing-direct-compress-up-to-40x-faster-leaner-data-ingestion-for-developers-tech-preview).
- Relaxed locking for chunk merging: concurrency during chunk merges has been improved to eliminate potential deadlocks, enabling safer, faster background merges.
- Unlogged hypertables: added the ability to set hypertables as `UNLOGGED`, improving insert and update performance for workloads where durability is not required. Ideal for large imports or transient datasets.
- Continuous aggregates improvements: continuous aggregates no longer use triggers for invalidation tracking. The approach has been refactored resulting in 10–20% faster DML performance. [Set-returning functions](https://www.postgresql.org/docs/current/functions-srf.html) are now supported in continuous aggregate materialization queries ([community request #1717](https://github.com/timescale/timescaledb/issues/1717)).

### Deprecations

- Postgres 15 deprecation: TimescaleDB will continue supporting Postgres 15 until June 2026, after which support will be removed. We recommend that you begin planning upgrades to Postgres 16 or higher to ensure continued access to performance improvements, security updates, and new TimescaleDB features. See [Supported platforms](https://www.tigerdata.com/docs/about/latest/supported-platforms/#postgres-timescaledb-support-matrix) for currently supported versions. 
- WAL-based invalidation: introduced as a tech preview in 2.22, WAL-based invalidation will be sunset in the upcoming releases. The approach was not the right architecture to address customers hitting IOPS limits during continuous aggregate invalidation tracking. This release already removes the trigger, and we are adding more improvements in upcoming releases to address IOPS. The first step is to gate the feature behind a GUC, and remove it in an upcoming release.

For a comprehensive list of changes, refer to the [TimescaleDB 2.23 release notes](https://github.com/timescale/timescaledb/blob/main/CHANGELOG.md#2230-2025-10-29).

## S3 source connector and crypto payments
<Label type="date">October 31, 2025</Label>

### 🔐 Crypto payments — early access!

You can now pay your Tiger Cloud invoices with stablecoins through Stripe’s crypto payments. Each month, you can receive a Stripe crypto payment link to pay the prior month’s invoice in USD. Request access via the `Billing` page in Tiger Console.

![Crypto payments](https://assets.timescale.com/docs/images/tiger-on-azure/tiger-cloud-crypto-payment.png)

**Note:** Payments must be completed within 7 days.

Supported currencies:

- **USDC** (Ethereum, Solana, Polygon, Base)
- **USDP** (Ethereum, Solana)
- **USDG** (Ethereum)

Eligibility:

- Paid customer for 1 month or more  
- No outstanding invoices  
- $500–$10,000 monthly spend  

For a higher spend, simply contact us!

### ✨ Detailed S3 source connector progress screen

We’ve introduced major improvements to the S3 source connector on Tiger Cloud, to enhance observability and provide deeper visibility into connector performance. This update will help you quickly understand the overall state of the connector, take action faster, and trace the complete lifecycle of every imported file.

![S3 connector stats](https://assets.timescale.com/docs/images/tiger-on-azure/tiger-console-s3-connector-import-details.png)

The improvements include:

- **Cumulative summary** of total imported, queued, and failed files  
- **Search** capability across all files  
- **Detailed file statuses** including:
  - In-queue  
  - In-progress  
  - Completed  
  - Error  
  - Retry  
  - Resolve  
  - Cancelled  
- **Filtering** by file status  
- **Bulk retry** option for all failed files  
- **Lifecycle history** showing file progression across states and time spent in each  
- **Auto-refresh** option (every minute) for real-time updates

## 🧠 🐅 ☁️ AI and Tiger Cloud major changes!
<Label type="date">October 24, 2025</Label>

### 👋 Free pricing plan and free services 

We've added a [new pricing plan](https://www.tigerdata.com/blog/introducing-agentic-postgres-free-plan-experiment-ai-on-postgres) in Tiger Cloud—the Free one! This new plan sits alongside the Performance, Scale, and Enterprise plans. With the Free plan, you can create up to two free services for prototyping. No cost, no trial, just free. Our free services have shared compute and 750 MiB storage each. And if you are already on a different plan, you also get access to two free services in addition to your standard ones. The Free plan is great for using AI tools like Claude Code alongside Tiger CLI and Tiger MCP.

### **>_** Tiger CLI 

We have released a new [CLI](https://github.com/timescale/tiger-cli) that lets you control Tiger Cloud from the terminal.  Everything from signing up, to spinning up services, to executing SQL on running services is now possible outside of the Tiger Console. Check out [our docs](https://www.tigerdata.com/docs/getting-started/latest/get-started-devops-as-code/) for how to download and use this new tool.

### 🎓 Tiger MCP for Postgres and TimescaleDB

Our new [MCP server](https://www.tigerdata.com/docs/ai/latest/mcp-server/) enables AI agents to interact with the database and  understand how to use it well. We’ve taken our 10+ years of Postgres experience and distilled it into a set of built-in master prompts. This gives agents safe, structured access to the database through high-level tools for schema design, query tuning, migrations, and more.  You can install it locally with Tiger CLI.

### 🌊 Fluid Storage 

We are previewing a new distributed storage layer on Tiger Cloud that allows instant forks, snapshots, and automatic scaling up or down, without downtime or over-provisioning. In benchmark testing, a single volume sustains throughput of over 100,000 IOPS! Fluid Storage currently backs our new Tiger Cloud free services.

### 🔍 pg_textsearch extension preview

This new extension enables BM25 on Postgres, which leads to significant improvements in text search over vanilla keyword search.  See [our docs](https://www.tigerdata.com/docs/use-timescale/latest/extensions/pg-textsearch/) for details.

## TimescaleDB 2.22.1 – configurable indexing, enhanced partitioning, and faster queries
<Label type="date">October 10, 2025</Label>

[TimescaleDB 2.22.1](https://github.com/timescale/timescaledb/releases) introduces major performance and flexibility improvements across indexing, compression, and query execution. TimescaleDB 2.22.1 was released on September 30th and is now available to all users of Tiger Cloud.

### Highlighted features

* **Configurable sparse indexes:** manually configure sparse indexes (min-max or bloom) on one or more columns of compressed hypertables, optimizing query performance for specific workloads and reducing I/O. In previous versions, these were automatically created based on heuristics and could not be modified.

* **UUIDv7 support:** native support for UUIDv7 for both compression and partitioning. UUIDv7 embeds a time component, improving insert locality and enabling efficient time-based range queries while maintaining global uniqueness.

    * **Vectorized UUID compression:** new vectorized compression for UUIDv7 columns doubles query performance and improves storage efficiency by up to 30%.
    
    * **UUIDv7 partitioning:** hypertables can now be partitioned on UUIDv7 columns, combining time-based chunking with globally unique IDs—ideal for large-scale event and log data.

* **Multi-column SkipScan:** expands SkipScan to support multiple distinct keys, delivering millisecond-fast deduplication and `DISTINCT ON` queries across billions of rows. Learn more in our [blog post](https://www.tigerdata.com/blog/skipscan-in-timescaledb-why-distinct-was-slow-how-we-built-it-and-how-you-can-use-it) and [documentation](https://www.tigerdata.com/docs/use-timescale/latest/query-data/skipscan/).
* **Compression improvements:** default `segmentby` and `orderby` settings are now applied at compression time for each chunk, automatically adapting to evolving data patterns for better performance. This was previously set at the hypertable level and fixed across all chunks.

### Deprecations

The experimental Hypercore Table Access Method (TAM) has been removed in this release following advancements in the columnstore architecture.

For a comprehensive list of changes, refer to the TimescaleDB [2.22](https://github.com/timescale/timescaledb/releases/tag/2.22.0) & [2.22.1](https://github.com/timescale/timescaledb/releases/tag/2.22.1) release notes.

## Kafka Source Connector (beta)
<Label type="date">September 19, 2025</Label>

The new [Kafka Source Connector](https://www.tigerdata.com/docs/migrate/latest/livesync-for-kafka/) enables you to connect your existing Kafka clusters directly to Tiger Cloud and ingest data from Kafka topics into hypertables. Developers often build proxies or run JDBC Sink Connectors to bridge Kafka and Tiger Cloud, which is error-prone and time-consuming. With the Kafka Source Connector, you can seamlessly start ingesting your Kafka data natively without additional middleware.

- Supported formats: AVRO
- Supported platforms: Confluent Cloud and Amazon Managed Streaming for Apache Kafka

![Kafka source connector in Tiger Cloud](https://assets.timescale.com/docs/images/tiger-cloud-console/kafka-source-connector-tiger-data.png)

![Kafka source connector streaming in Tiger Cloud](https://assets.timescale.com/docs/images/tiger-cloud-console/kafka-source-connector-streaming.png)

## Phased update rollouts, `pg_cron`, larger compute options, and backup reports 
<Label type="date">September 12, 2025</Label>

### 🛡️ Phased rollouts for TimescaleDB minor releases

Starting with TimescaleDB 2.22.0, minor releases will now roll out in phases. Services tagged `#dev` will get upgraded first, followed by `#prod` after 21 days. This gives you time to validate upgrades in `#dev` before they reach `#prod` services. [Subscribe](https://status.timescale.com/?__hstc=231067136.cc62bfc44030d30e3b1c3d1bc78c9cab.1750169693582.1757669826871.1757685085606.116&__hssc=231067136.4.1757685085606&__hsfp=2801608430) to get an email notification before your `#prod` service is upgraded. See [Maintenance and upgrades](https://www.tigerdata.com/docs/use-timescale/latest/upgrades/) for details.

### ⏰ pg_cron extension

`pg_cron` is now available on Tiger Cloud! With `pg_cron`, you can:
- Schedule SQL commands to run automatically—like generating weekly sales reports or cleaning up old log entries every night at 2 AM.
- Automate routine maintenance tasks such as refreshing materialized views hourly to keep dashboards current.
- Eliminate external cron jobs and task schedulers, keeping all your automation logic within PostgreSQL.

To enable `pg_cron` on your service, contact our support team. We're working on making this self-service in future updates.

### ⚡️ Larger compute options: 48 and 64 CPU

For the most demanding workloads, you can now create services with 48 and 64 CPUs. These options are only available on our Enterprise plan, and they're dedicated instances that are not shared with other customers.

![CPU options in Tiger Cloud](https://assets.timescale.com/docs/images/tiger-cloud-console/tiger-cloud-cpu-options.png)

### 📋 Backup report for compliance

Scale and Enterprise customers can now see a list of their backups in Tiger Console. For customers with SOC 2 or other compliance needs, this serves as auditable proof of backups.

![Backup reports in Tiger Cloud](https://assets.timescale.com/docs/images/tiger-cloud-console/backup-history-tiger-cloud.png)

### 🗺️ New router for Tiger Console

The UI just got snappier and easier to navigate with improved interlinking. For example, click an object in the `Jobs` page to see what hypertable the job is associated with.

## New data import wizard
<Label type="date">September 5, 2025</Label>

To make navigation easier, we’ve introduced a cleaner, more intuitive UI for data import. It highlights the most common and recommended option, PostgreSQL Dump & Restore, while organizing all import options into clear categories, to make navigation easier.

The new categories include:
- **PostgreSQL Dump & Restore**
- **Upload Files**: CSV, Parquet, TXT
- **Real-time Data Replication**: source connectors
- **Migrations & Other Options**

  ![Data import in Tiger Cloud](https://assets.timescale.com/docs/images/tiger-cloud-console/data-import-wizard-in-tiger-cloud.png)

A new data import component has been added to the overview dashboard, providing a clear view of your imports. This includes quick start, in-progress status, and completed imports:

  ![Overview dashboard in Tiger Cloud](https://assets.timescale.com/docs/images/tiger-cloud-console/service-dashboard-tiger-cloud.png)

## 🚁 Enhancements to the Postgres source connector
<Label type="date">August 28, 2025</Label>

- **Easy table selection**: You can now sync the complete source schema in one go. Select multiple tables from the 
   drop-down menu and start the connector.
- **Sync metadata**: Connectors now display the following detailed metadata:
    - `Initial data copy`: The number of rows copied at any given point in time.
    - `Change data capture`: The replication lag represented in time and data size.
- **Improved UX design**: In-progress syncs with separate sections showing the tables and metadata for 
   `initial data copy` and `change data capture`, plus a dedicated tab where you can add more tables to the connector.

   ![Connectors UX](https://assets.timescale.com/docs/images/tiger-cloud-console/connectors-new-ui.png)

## 🦋 Developer role GA and hypertable transformation in Console
<Label type="date">August 21, 2025</Label>

### Developer role (GA)

The [Developer role in Tiger Cloud](https://www.tigerdata.com/docs/use-timescale/latest/security/members/) is now 
generally available. It’s a project‑scoped permission set that lets technical users build and 
operate services, create or modify resources, run queries, and use observability—without admin or billing access. 
This enforces least‑privilege by default, reducing risk and audit noise, while keeping governance with Admins/Owners and 
billing with Finance. This means faster delivery (fewer access escalations), protected sensitive settings, 
and clear boundaries, so the right users can ship changes safely, while compliance and cost control remain intact.

### Transform a table to a hypertable from the Explorer

In Console, you can now easily create hypertables from your regular Postgres tables directly from the Explorer. 
Clicking on any Postgres table shows an option to open up the hypertable action. Follow the simple steps to set up your 
partition key and transform the table to a hypertable.

![Transform a table to a hypertable](https://assets.timescale.com/docs/images/table_to_hypertable_1.png)

![Transform a table to a hypertable](https://assets.timescale.com/docs/images/table_to_hypertable_2.png)

## Cross-region backups, Postgres options, and onboarding
<Label type="date">August 14, 2025</Label>

### Cross-region backups

You can now store backups in a different region than your service, which improves resilience and helps meet enterprise compliance requirements. Cross‑region backups are available on our Enterprise plan for free at launch; usage‑based billing may be introduced later. For full details, please [see the docs](https://www.tigerdata.com/docs/use-timescale/latest/backup-restore/#enable-cross-region-backup).

### Standard Postgres instructions for onboarding
We have added basic instructions for INSERT, UPDATE, DELETE commands to the Tiger Console.  It's now shown as an option in the Import Data page.

### Postgres-only service type
In Tiger Cloud, you now have an option to choose Postgres-only in the service creation flow. Just click `Looking for plan PostgreSQL?` on the `Service Type` screen.

## Viewer role GA, EXPLAIN plans, and chunk index sizes in Explorer
<Label type="date">July 31, 2025</Label>

### GA release of the viewer role in role-based access

The viewer role is now **generally available** for all projects and
organizations. It provides **read-only access** to services, metrics, and logs
without modify permissions. Viewers **cannot** create, update, or delete
resources, nor manage users or billing. It's ideal for auditors, analysts, and
cross-functional collaborators who need visibility but not control.

### EXPLAIN plans in Insights

You can now find automatically generated EXPLAIN plans on queries that take
longer than 10 seconds within Insights. EXPLAIN plans can be very useful to
determine how you may be able to increase the performance of your queries.

### Chunk index size in Explorer

Find the index size of hypertable chunks in the Explorer.
This information can be very valuable to determine if a hypertable's chunk size
is properly configured.

## TimescaleDB v2.21 and catalog objects in the Console Explorer
<Label type="date">July 25, 2025</Label>

### 🏎️ TimescaleDB v2.21—ingest millions of rows/second and faster columnstore UPSERTs and DELETEs
   
TimescaleDB v2.21 was released on July 8 and is now available to all developers on Tiger Cloud.

Highlighted features in TimescaleDB v2.21 include:
- **High-scale ingestion performance (tech preview)**: introducing a new approach that compresses data directly into the columnstore during ingestion, demonstrating over 1.2M rows/second in tests with bursts over 50M rows/second. We are actively seeking design partners for this feature.
- **Faster data updates (UPSERTs)**: columnstore UPSERTs are now 2.5x faster for heavily constrained tables, building on the 10x improvement from v2.20.
- **Faster data deletion**: DELETE operations on non-segmentby columns are 42x faster, reducing I/O and bloat.
- **Reduced bloat after recompression**: optimized recompression processes lead to less bloat and more efficient storage.
- **Enhanced continuous aggregates**:
  - Concurrent refresh policies enable multiple continuous aggregates to update concurrently.
  - Batched refreshes are now enabled by default for more efficient processing.
- **Complete chunk management**: full support for splitting columnstore chunks, complementing the existing merge capabilities.

For a comprehensive list of changes, refer to the [TimescaleDB v2.21 release notes](https://github.com/timescale/timescaledb/releases/tag/2.21.0).

### 🔬 Catalog objects available in the Console Explorer

You can now view catalog objects in the Console Explorer. Check out the internal schemas for PostgreSQL and TimescaleDB to better understand the inner workings of your database. To turn on/off visibility, select your service in Tiger Console, then click `Explorer` and toggle `Show catalog objects`. 

![Explore catalog objects](https://assets.timescale.com/docs/images/tiger-cloud-console/tiger-cloud-explorer-catalog-objects.png)

## Iceberg Destination Connector (Tiger Lake)
<Label type="date">July 18, 2025</Label>

We have released a beta Iceberg destination connector that enables Scale and Enterprise users to integrate Tiger Cloud services with Amazon S3 tables. This enables you to connect Tiger Cloud to data lakes seamlessly. We are actively developing several improvements that will make the overall data lake integration process even smoother.

To use this feature, select your service in Tiger Console, then navigate to `Connectors` and select the `Amazon S3 Tables` destination connector. Integrate the connector to your S3 table bucket by providing the ARN roles, then simply select the tables that you want to sync into S3 tables. See the [documentation](https://www.tigerdata.com/docs/use-timescale/latest/tigerlake/) for details. 

## 🔆Console just got better
<Label type="date">July 11, 2025</Label>

### ✏️ Editable jobs in Console
   
You can now edit jobs directly in Console! We've added the handy pencil icon in the top right corner of any 
job view. Click a job, hit the edit button, then make your changes. This works for all jobs, even user-defined ones. 
Tiger Cloud jobs come with custom wizards to guide you through the right inputs. This means you can spot and fix 
issues without leaving the UI - a small change that makes a big difference!

![Edit jobs in console](https://assets.timescale.com/docs/images/console-jobs-edit.png)

### 📊 Connection history

Now you can see your historical connection counts right in the Connections tab! This helps spot those pesky connection 
management bugs before they impact your app. We're logging max connections every hour (sampled every 5 mins) and might 
adjust based on your feedback. Just another way we're making the Console more powerful for troubleshooting.

![View connection history in console](https://assets.timescale.com/docs/images/console-connection-history.png)


### 🔐 New in Public Beta: Read-Only Access through RBAC

We’ve just launched Read/Viewer-only access for Tiger Cloud projects into public beta!

You can now invite users with view-only permissions — perfect for folks who need to see dashboards, metrics, 
and query results, without the ability to make changes.

This has been one of our most requested RBAC features, and it's a big step forward in making Tiger Cloud more secure and 
collaborative.

No write access. No config changes. Just visibility.

In Console, Go to `Project Settings` > `Users & Roles` to try it out, and let us know what you think!

## 👀 Super useful doc updates
<Label type="date">July 4, 2025</Label>

### Updates to instructions for livesync

In the Console UI, we have clarified the step-by-step procedure for setting up your livesync from self-hosted installations by: 
- Adding definitions for some flags when running your Docker container.
- Including more detailed examples of the output from the table synchronization list.

### New optional argument for add_continuous_aggregate_policy API

Added the new `refresh_newest_first` optional argument that controls the order of incremental refreshes.

## 🚀 Multi-command queries in SQL editor, improved job page experience, multiple AWS Transit Gateways, and a new service creation flow
<Label type="date">June 20, 2025</Label>

### Run multiple statements in SQL editor
Execute complex queries with multiple commands in a single run—perfect for data transformations, table setup, and batch operations.

### Branch conversations in SQL assistant
Start new discussion threads from any point in your SQL assistant chat to explore different approaches to your data questions more easily.

### Smarter results table
- Expand JSON data instantly: turn complex JSON objects into readable columns with one click—no more digging through nested data structures.
- Filter with precision: use a new smart filter to pick exactly what you want from a dropdown of all available values.

### Jobs page improvements
Individual job pages now display their corresponding configuration for TimescaleDB job types—for example, columnstore, retention, CAgg refreshes, tiering, and others.

### Multiple AWS Transit Gateways

You can now connect multiple AWS Transit Gateways, when those gateways use overlapping CIDRs. Ideal for teams with zero-trust policies, this lets you keep each network path isolated.

How it works: when you create a new peering connection, Tiger Cloud reuses the existing Transit Gateway if you supply the same ID—otherwise it automatically creates a new, isolated Transit Gateway.

### Updated service creation flow

The new service creation flow makes the choice of service type clearer. You can now create distinct types with Postgres extensions for real-time analytics (TimescaleDB), AI (pgvectorscale, pgai), and RTA/AI hybrid applications.

![Create a $SERVICE_LONG](https://assets.timescale.com/docs/images/tiger-cloud-console/create-tiger-cloud-service.png)

## ⚙️ Improved Terraform support and TimescaleDB v2.20.3
<Label type="date">June 13, 2025</Label>

### Terraform support for Exporters and AWS Transit Gateway

The latest version of the Timescale Terraform provider (2.3.0) adds support for:
- Creating and attaching observability exporters to your services.
- Securing the connections to your Timescale Cloud services with AWS Transit Gateway.
- Configuring CIDRs for VPC and AWS Transit Gateway connections.

Check the [Timescale Terraform provider documentation](https://registry.terraform.io/providers/timescale/timescale/latest/docs) for more details.

### TimescaleDB v2.20.3

This patch release for TimescaleDB v2.20 includes several bug fixes and minor improvements. 
Notable bug fixes include:
- Adjustments to SkipScan costing for queries that require a full scan of indexed data.
- A fix for issues encountered during dump and restore operations when chunk skipping is enabled.
- Resolution of a bug related to dropped "quals" (qualifications/conditions) in SkipScan.

For a comprehensive list of changes, refer to the [TimescaleDB 2.20.3 release notes](https://github.com/timescale/timescaledb/releases/tag/2.20.3).

## 🧘 Read replica sets, faster tables, new anthropic models, and VPC support in data mode
<Label type="date">June 6, 2025</Label>

### Horizontal read scaling with read replica sets

[Read replica sets](https://docs.timescale.com/use-timescale/latest/ha-replicas/read-scaling/) are an improved version of read replicas. They let you scale reads horizontally by creating up to 10 replica nodes behind a single read endpoint. Just point your read queries to the endpoint and configure the number of replicas you need without changing your application logic. You can increase or decrease the number of replicas in the set dynamically, with no impact on the endpoint.

Read replica sets are used to:

- Scale reads for read-heavy workloads and dashboards.
- Isolate internal analytics and reporting from customer-facing applications.
- Provide high availability and fault tolerance for read traffic.

All existing read replicas have been automatically upgraded to a replica set with one node—no action required. Billing remains the same.

Read replica sets are available for all Scale and Enterprise customers.

![Create a read replica set in Timescale Console](https://assets.timescale.com/docs/images/create-read-replica-set-timescale-console.png)

### Faster, smarter results tables in data mode

We've completely rebuilt how query results are displayed in the data mode to give you a faster, more powerful way to work with your data. The new results table can handle millions of rows with smooth scrolling and instant responses when you sort, filter, or format your data. You'll find it today in notebooks and presentation pages, with more areas coming soon.

What's new:

- **Your settings stick around**: when you customize how your table looks—applying filters, sorting columns, or formatting data—those settings are automatically saved. Switch to another tab and come back, and everything stays exactly how you left it.
- **Better ways to find what you need**: filter your results by any column value, with search terms highlighted so you can quickly spot what you're looking for. The search box is now available everywhere you work with data.
- **Export exactly what you want**: download your entire table or just select the specific rows and columns you need. Both CSV and Excel formats are supported.
- **See patterns in your data**: highlight cells based on their values to quickly spot trends, outliers, or important thresholds in your results.
- **Smoother navigation**: click any row number to see the full details in an expanded view. Columns automatically resize to show your data clearly, and web links in your results are now clickable.

As a result, working with large datasets is now faster and more intuitive. Whether you're exploring millions of rows or sharing results with your team, the new table keeps up with how you actually work with data.

### Latest anthropic models added to SQL assistant

Data mode's [SQL assistant](https://docs.timescale.com/getting-started/latest/run-queries-from-console/#sql-assistant) now supports Anthropic's latest models:

- Sonnet 4
- Sonnet 4 (extended thinking)
- Opus 4
- Opus 4 (extended thinking)

### VPC support for passwordless data mode connections

We previously made it much easier to connect newly created services to Timescale's [data mode](https://docs.timescale.com/getting-started/latest/run-queries-from-console/#data-view). We have now expanded this functionality to services using a VPC.

## 🕵🏻️ Enhanced service monitoring, TimescaleDB v2.20, and livesync for $PG
<Label type="date">May 30, 2025</Label>

### Updated top-level navigation - Monitoring tab

In Timescale Console, we have consolidated multiple top-level service information tabs into the single Monitoring tab. 
This tab houses information previously displayed in the Recommendations, Jobs, Connections, Metrics, Logs, 
and `Insights` tabs.

![Insights](https://assets.timescale.com/docs/images/insights_overview_timescale.png)

### Monitor active connections

In the `Connections` section under `Monitoring`, you can now see information like the query being run, the application
name, and duration for all current connections to a service.

![Connections](https://assets.timescale.com/docs/images/console-monitoring-connections.png)

The information in `Connections` enables you to debug misconfigured applications, or 
cancel problematic queries to free up other connections to your database.

### TimescaleDB v2.20 - query performance and faster data updates

All new services created on Timescale Cloud are created using 
[TimescaleDB v2.20](https://github.com/timescale/timescaledb/releases/tag/2.20.0). Existing services will be 
automatically upgraded during their maintenance window.

Highlighted features in TimescaleDB v2.20 include:
* Efficiently handle data updates and upserts (including backfills, that are now up to 10x faster).
* Up to 6x faster point queries on high-cardinality columns using new bloom filters.
* Up to 2500x faster DISTINCT operations with SkipScan, perfect for quickly getting a unique list or the latest reading 
  from any device, event, or transaction.
* 8x more efficient Boolean column storage with vectorized processing, resulting in 30-45% faster queries.
* Enhanced developer flexibility with continuous aggregates now supporting window and mutable functions, plus 
  customizable refresh orders.

### $PG 13 and 14 deprecated on Tiger Cloud

[TimescaleDB version 2.20](https://github.com/timescale/timescaledb/releases/tag/2.20.0) is not compatible with $PG versions v14 and below.
TimescaleDB 2.19.3 is the last bug-fix release for $PG 14. Future fixes are for
$PG 15+ only. To continue receiving critical fixes and security patches, and to take
advantage of the latest TimescaleDB features, you must upgrade to $PG 15 or newer.
This deprecation affects all Tiger Cloud services currently running $PG 13 or
$PG 14.

The timeline for the $PG 13 and 14 deprecation is as follows:

- **Deprecation notice period begins**: starting in early June 2025, you will receive email communication.
- **Customer self-service upgrade window**: June 2025 through September 14, 2025. We strongly encourage you to
  [manually upgrade $PG](https://www.tigerdata.com/docs/use-timescale/latest/upgrades/#manually-upgrade-postgresql-for-a-service)
  during this period.
- **Automatic upgrade deadline**: your service will be
  [automatically upgraded](https://docs.timescale.com/use-timescale/latest/upgrades/#automatic-postgresql-upgrades-for-a-service)
  from September 15, 2025.

### Enhancements to livesync for $PG

You now can: 
* Edit a running livesync to add and drop tables from an existing configuration:
  - For existing tables, Timescale Console stops the livesync while keeping the target table intact.
  - Newly added tables sync their existing data and transition into the Change Data Capture (CDC) state.
* Create multiple livesync instances for $PG per service. This is an upgrade from our initial launch which 
  limited users to one LiveSync per service.

  This enables you to sync data from multiple $PG source databases into a single Timescale Cloud service.
* No more hassle looking up schema and table names for livesync configuration from the source. Starting today, all 
  schema and table names are available in a dropdown menu for seamless source table selection.

## ➕ More storage types and IOPS
<Label type="date">May 22, 2025</Label>

### 🚀 Enhanced storage: scale to 64 TB and 32,000 IOPS

We're excited to introduce enhanced storage, a new storage type in Timescale Cloud that significantly boosts both capacity and performance. Designed for customers with mission-critical workloads.

With enhanced storage, Timescale Cloud now supports:
- Up to 64 TB of storage per Timescale Cloud service (4x increase from the previous limit)
- Up to 32,000 IOPS, enabling high-throughput ingest and low-latency queries

Powered by AWS io2 volumes, enhanced storage gives your workloads the headroom they need—whether you're building financial data pipelines, developing IoT platforms, or processing billions of rows of telemetry. No more worrying about storage ceilings or IOPS bottlenecks.
Enable enhanced storage in Timescale Console under `Operations` → `Compute & Storage`. Enhanced storage is currently available on the Enterprise pricing plan only. [Learn more here](https://docs.timescale.com/use-timescale/latest/data-tiering/enabling-data-tiering/).

![I/O boost in Timescale Cloud](https://assets.timescale.com/docs/images/io-boost-timescale-cloud.png)

## ↔️ New export and import options
<Label type="date">May 15, 2025</Label>

### 🔥 Ship TimescaleDB metrics to Prometheus

We’re excited to release the Prometheus Exporter for Timescale Cloud, making it easy to ship TimescaleDB metrics to your Prometheus instance.
With the Prometheus Exporter, you can:

- Export TimescaleDB metrics like CPU, memory, and storage
- Visualize usage trends with your own Grafana dashboards
- Set alerts for high CPU load, low memory, or storage nearing capacity

To get started, create a Prometheus Exporter in the Timescale Console, attach it to your service, and configure Prometheus to scrape from the exposed URL. Metrics are secured with basic auth.
Available on Scale and Enterprise plans. [Learn more here](https://docs.timescale.com/use-timescale/latest/metrics-logging/metrics-to-prometheus/).

![Prometheus export user interface](https://assets.timescale.com/docs/images/timescale-create-prometheus-exporter.png)

### 📥 Import text files into $PG tables
Our import options in Timescale Console have expanded to include local text files.  You can add the content of multiple text files (one file per row) into a $PG table for use with Vectorizers while creating embeddings for evaluation and development. This new option is located in Service > Actions > Import Data.

## 🤖 Automatic document embeddings from S3 and a sample dataset for AI testing
<Label type="date">May 09, 2025</Label>

### Automatic document embeddings from S3

pgai vectorizer now supports automatic document vectorization. This makes it dramatically easier to build RAG and semantic search applications on top of unstructured data stored in Amazon S3. With just a SQL command, developers can create, update, and synchronize vector embeddings from a wide range of document formats—including PDFs, DOCX, XLSX, HTML, and more—without building or maintaining complex ETL pipelines.

Instead of juggling multiple systems and syncing metadata, vectorizer handles the entire process: downloading documents from S3, parsing them, chunking text, and generating vector embeddings stored right in $PG using pgvector. As documents change, embeddings stay up-to-date automatically—keeping your $PG database the single source of truth for both structured and semantic data.

![create a vectorizer](https://assets.timescale.com/docs/images/console-create-a-vectorizer.png)

### Sample dataset for AI testing

You can now import a dataset directly from Hugging Face using Timescale Console. This dataset is ideal for testing vectorizers, you find it in the Import Data page under the Service > Actions tab.

![hugging face sample data](https://assets.timescale.com/docs/images/console-import-huggingface-data.png)

## 🔁 Livesync for S3 and passwordless connections for data mode
<Label type="date">April 25, 2025</Label>

### Livesync for S3 (beta)

[Livesync for S3](https://docs.timescale.com/migrate/latest/livesync-for-s3/) is our second livesync offering in 
Timescale Console, following livesync for $PG. This feature helps users sync data in their S3 buckets to a
Timescale Cloud service, and simplifies data importing. Livesync handles both existing and new data in real time, 
automatically syncing everything into a Timescale Cloud service. Users can integrate Timescale Cloud alongside S3, where 
S3 stores data in raw form as the source for multiple destinations.

![Timescale Console new livesync](https://assets.timescale.com/docs/images/livesync-s3-start-new-livesync.png)

With livesync, users can connect Timescale Cloud with S3 in minutes, rather than spending days setting up and maintaining
an ingestion layer.

![Timescale Console livesync view status](https://assets.timescale.com/docs/images/livesync-s3-view-status.png)

### UX improvements to livesync for $PG

In [livesync for $PG](https://docs.timescale.com/migrate/latest/livesync-for-postgresql/), getting started 
requires setting the `WAL_LEVEL` to `logical`, and granting specific permissions to start a publication 
on the source database. To simplify this setup process, we have added a detailed two-step checklist with comprehensive 
configuration instructions to Timescale Console.

![Timescale Console livesync $PG instructions](https://assets.timescale.com/docs/images/livesync-postgres-console-config-instuctions.png)

### Passwordless data mode connections

We’ve made connecting to your Timescale Cloud services from [data mode](https://docs.timescale.com/getting-started/latest/run-queries-from-console/#connect-to-your-timescale-cloud-service-in-the-data-mode) 
in Timescale Console even easier! All new services created in Timescale Cloud are now automatically accessible from 
data mode without requiring you to enter your service credentials. Just open data mode, select your service, and 
start querying.

![Timescale Console passwordless data mode](https://assets.timescale.com/docs/images/data-mode-connections.png)

We will be expanding this functionality to existing services in the coming weeks (including services using VPC peering), 
so stay tuned.


## ☑️ Embeddings spot checks, TimescaleDB v2.19.3, and new models in SQL Assistant
<Label type="date">April 18, 2025</Label>

### Embeddings spot checks

In Timescale Cloud, you can now quickly check the quality of the embeddings from the vectorizers' outputs. Construct a similarity search query with additional filters on source metadata using a simple UI. Run the query right away, or copy it to the SQL editor or data mode and further customize it to your needs. Run the check in Timescale Console > `Services` > `AI`:

![Embedding Quality Inspection](https://assets.timescale.com/docs/images/ai-spot-checks.png)

### TimescaleDB v2.19.3

New services created in Timescale Cloud now use TimescaleDB v2.19.3. Existing services are in the process of being automatically upgraded to this version.

This release adds a number of bug fixes including:

- Fix segfault when running a query against columnstore chunks that group by multiple columns, including UUID segmentby columns.
- Fix hypercore table access method segfault on DELETE operations using a segmentby column.

### New OpenAI, Llama, and Gemini models in SQL Assistant

The data mode's SQL Assistant now includes support for the latest models from OpenAI and Llama: GPT-4.1 (including mini and nano) and Llama 4 (Scout and Maverick). Additionally, we've added support for Gemini models, in particular Gemini 2.0 Nano and 2.5 Pro (experimental and preview). With the new additions, SQL Assistant supports more than 20 language models so you can select the one best suited to your needs.

![SQL Assistant - New Models](https://assets.timescale.com/docs/images/sql-assistant-new-models.png)

## 🪵 TimescaleDB v2.19, new service overview page, and log improvements
<Label type="date">April 11, 2025</Label>

### TimescaleDB v2.19—query performance and concurrency improvements

Starting this week, all new services created on Timescale Cloud use [TimescaleDB v2.19](https://github.com/timescale/timescaledb/releases/tag/2.19.0). Existing services will be upgraded gradually during their maintenance window.

Highlighted features in TimescaleDB v2.19 include:

- Improved concurrency of `INSERT`, `UPDATE`, and `DELETE` operations on the columnstore by no longer blocking DML statements during the recompression of a chunk.
- Improved system performance during continuous aggregate refreshes by breaking them into smaller batches. This reduces systems pressure and minimizes the risk of spilling to disk.
- Faster and more up-to-date results for queries against continuous aggregates by materializing the most recent data first, as opposed to old data first in prior versions.
- Faster analytical queries with SIMD vectorization of aggregations over text columns and `GROUP BY` over multiple columns.
- Enable chunk size optimization for better query performance in the columnstore by merging them with `merge_chunk`.

### New service overview page

The service overview page in Timescale Console has been overhauled to make it simpler and easier to use. Navigate to the `Overview` tab for any of your services and you will find an architecture diagram and general information pertaining to it. You may also see recommendations at the top, for how to optimize your service. 

![New Service Overview page](https://assets.timescale.com/docs/images/new-timescale-service-overview.png)

To leave the product team your feedback, open `Help & Support` on the left and select `Send feedback to the product team`.

### Find logs faster

Finding logs just got easier! We've added a date, time, and timezone picker, so you can jump straight to the exact moment you're interested in—no more endless scrolling.

![Find logs faster](https://assets.timescale.com/docs/images/find-logs-faster-timescale-console.png)

## 📒Faster vector search and improved job information
<Label type="date">April 4, 2025</Label>

### pgvectorscale 0.7.0: faster filtered vector search with filtered indexes

This pgvectorscale release adds label-based filtered vector search to the StreamingDiskANN index.
This enables you to return more precise and efficient results by combining vector 
similarity search with label filtering while still uitilizing the ANN index. This is a common need for large-scale RAG and Agentic applications 
that rely on vector searches with metadata filters to return relevant results. Filtered indexes add 
even more capabilities for filtered search at scale, complementing the high accuracy streaming filtering already 
present in pgvectorscale. The implementation is inspired by Microsoft's Filtered DiskANN research.  
For more information, see the [pgvectorscale release notes][log-28032025-pgvectorscale-rn] and a 
[usage example][log-28032025-pgvectorscale-example].

### Job errors and individual job pages

Each job now has an individual page in Timescale Console, and displays additional details about job errors. You use 
this information to debug failing jobs. 

To see the job information page, in [Timescale Console][services-portal], select the service to check, then click `Jobs` > job ID to investigate.

- Successful jobs: 

  ![Log success in Timescale Console](https://assets.timescale.com/docs/images/changelog-job-success-page.png)

- Unsuccessful jobs with errors:

  ![Log errors in Timescale Console](https://assets.timescale.com/docs/images/changelog-job-error-page.png)

## 🤩 In-Console Livesync for $PG
<Label type="date">March 21, 2025</Label>

You can now set up an active data ingestion pipeline with livesync for $PG in Timescale Console. This tool enables you to replicate your source database tables into Timescale's hypertables indefinitely. Yes, you heard that right—keep livesync running for as long as you need, ensuring that your existing source $PG tables stay in sync with Timescale Cloud. Read more about setting up and using [Livesync for $PG](https://docs.timescale.com/migrate/latest/livesync-for-postgresql/). 

![Livesync in Timescale Console](https://assets.timescale.com/docs/images/timescale-cloud-livesync-tile.png)

![Set up Timescale Livesync](https://assets.timescale.com/docs/images/set-up-timescale-cloud-livesync.png)

![Select tables for Livesync](https://assets.timescale.com/docs/images/select-tables-for-timescale-cloud-livesync.png)

![Timescale Livesync running](https://assets.timescale.com/docs/images/livesync-view-status.png)

## 💾 16K dimensions on pgvectorscale plus new pgai Vectorizer support
<Label type="date">March 14, 2025</Label>

### pgvectorscale 0.6 — store up to 16K dimension embeddings

pgvectorscale 0.6.0 now supports storing vectors with up to 16,000 dimensions, removing the previous limitation of 2,000 from pgvector. This lets you use larger embedding models like OpenAI's text-embedding-3-large (3072 dim) with $PG as your vector database. This release also includes key performance and capability enhancements, including NEON support for SIMD distance calculations on aarch64 processors, improved inner product distance metric implementation, and improved index statistics. See the release details [here](https://github.com/timescale/pgvectorscale/releases/tag/0.6.0). 

### pgai Vectorizer supports models from AWS Bedrock, Azure AI, Google Vertex via LiteLLM

Access embedding models from popular cloud model hubs like AWS Bedrock, Azure AI Foundry, Google Vertex, as well as HuggingFace and Cohere as part of the LiteLLM integration with pgai Vectorizer. To use these models with pgai Vectorizer on Timescale Cloud, select `Other` when adding the API key in the credentials section of Timescale Console. 

## 🤖 Agent Mode for PopSQL and more
<Label type="date">March 7, 2025</Label>

### Agent Mode for PopSQL 

Introducing Agent Mode, a new feature in Timescale Console SQL Assistant. SQL Assistant lets you query your database using natural language. However, if you ran into errors, you have to approve the implementation of the Assistant's suggestions. 

With Agent Mode on, SQL Assistant automatically adjusts and executes your query without intervention. It runs, diagnoses, and fixes any errors that it runs into until you get your desired results.

Below you can see SQL Assistant run into an error, identify the resolution, execute the fixed query, display results, and even change the title of the query:

![Timescale SQL Assistant Agent Mode](https://assets.timescale.com/docs/images/timescale-sql-assistant-agent-mode.gif)

To use Agent Mode, make sure you have SQL Assistant enabled, then click on the model selector dropdown, and tick the `Agent Mode` checkbox.

### Improved AWS Marketplace integration for a smoother experience

We've enhanced the AWS Marketplace workflow to make your experience even better! Now, everything is fully automated, 
ensuring a seamless process from setup to billing. If you're using the AWS Marketplace integration, you'll notice a 
smoother transition and clearer billing visibility—your Timescale Cloud subscription will be reflected directly in AWS 
Marketplace!

### Timescale Console recommendations

Sometimes it can be hard to know if you are getting the best use out of your service. To help with this, Timescale 
Cloud now provides recommendations based on your service's context, assisting with onboarding or notifying if there is a configuration concern with your service, such as consistently failing jobs. 

To start, recommendations are focused primarily on onboarding or service health, though we will regularly add new ones. You can see if you have any existing recommendations for your service by going to the `Actions` tab in Timescale Console.

![Timescale Console recommendations](https://assets.timescale.com/docs/images/timescale-console-recommendations.png)

## 🛣️ Configuration Options for Secure Connections and More
<Label type="date">February 28, 2025</Label>

### Edit VPC and AWS Transit Gateway CIDRs

You can now modify the CIDRs blocks for your VPC or Transit Gateway directly from Timescale Console, giving you greater control over network access and security. This update makes it easier to adjust your private networking setup without needing to recreate your VPC or contact support.

![VPC connection wizard](https://assets.timescale.com/docs/images/2025-02-27changelog_VPC_transit_gateway.png)

### Improved log filtering

We’ve enhanced the `Logs` screen with the new `Warning` and `Log` filters to help you quickly find the logs you need. These additions complement the existing `Fatal`, `Error`, and `Detail` filters, making it easier to pinpoint specific events and troubleshoot issues efficiently.

![Logs with filters](https://assets.timescale.com/docs/images/2025-02-27changelog_log_filtering.png)

### TimescaleDB v2.18.2 on Timescale Cloud

New services created in Timescale Cloud now use [TimescaleDB v2.18.2](https://github.com/timescale/timescaledb/releases/tag/2.18.2). Existing services are in the process of being automatically upgraded to this version.

This new release fixes a number of bugs including:

- Fix `ExplainHook` breaking the call chain.
- Respect `ExecutorStart` hooks of other extensions. 
- Block dropping internal compressed chunks with `drop_chunk()`.

### SQL Assistant improvements

- Support for Claude 3.7 Sonnet and extended thinking including reasoning tokens.
- Ability to abort SQL Assistant requests while the response is streaming.

## 🤖 SQL Assistant Improvements and Pgai Docs Reorganization
<Label type="date">February 21, 2025</Label>

### New models and improved UX for SQL Assistant

We have added fireworks.ai and Groq as service providers, and several new LLM options for SQL Assistant:

- OpenAI o1
- DeepSeek R1
- Llama 3.3 70B
- Llama 3.1 405B
- DeepSeek R1 Distill - Llama 3.3

We've also improved the model picker by adding descriptions for each model:

![Timescale Cloud SQL Assistant AI model picker](https://assets.timescale.com/docs/images/sql-assistant-ai-models.png)

### Updated and reorganized docs for pgai

We have improved the GitHub docs for pgai. Now relevant sections have been grouped into their own folders and we've created a comprehensive summary doc.  Check it out [here](https://github.com/timescale/pgai/tree/main/docs).

## 💘 TimescaleDB v2.18.1 and AWS Transit Gateway Support Generally Available
<Label type="date">February 14, 2025</Label>

### TimescaleDB v2.18.1 
New services created in Timescale Cloud now use [TimescaleDB v2.18.1](https://github.com/timescale/timescaledb/releases/tag/2.18.1). Existing services will be automatically upgraded in their next maintenance window starting next week.

This new release includes a number of bug fixes and small improvements including:

* Faster columnar scans when using the hypercore table access method
* Ensure all constraints are always applied when deleting data on the columnstore
* Pushdown all filters on scans for UPDATE/DELETE operations on the columnstore
  
###  AWS Transit Gateway support is now generally available!

Timescale Cloud now fully supports [AWS Transit Gateway](https://docs.timescale.com/use-timescale/latest/security/transit-gateway/), making it even easier to securely connect your database to multiple VPCs across different environments—including AWS, on-prem, and other cloud providers.

With this update, you can establish a peering connection between your Timescale Cloud services and an AWS Transit Gateway in your AWS account. This keeps your Timescale Cloud services safely behind a VPC while allowing seamless access across complex network setups.

## 🤖 TimescaleDB v2.18 and SQL Assistant Improvements in Data Mode and PopSQL

<Label type="date">February 6, 2025</Label>

### TimescaleDB v2.18 - dense indexes in the columnstore and query vectorization improvements
Starting this week, all new services created on Timescale Cloud use [TimescaleDB v2.18](https://github.com/timescale/timescaledb/releases/tag/2.18.0). Existing services will be upgraded gradually during their maintenance window.

Highlighted features in TimescaleDB v2.18.0 include:

* The ability to add dense indexes (btree and hash) to the columnstore through the new hypercore table access method.
* Significant performance improvements through vectorization (SIMD) for aggregations using a group by with one column and/or using a filter clause when querying the columnstore.
* Hypertables support triggers for transition tables, which is one of the most upvoted community feature requests.
* Updated methods to manage Timescale's hybrid row-columnar store (hypercore). These methods highlight columnstore usage. The columnstore includes an optimized columnar format as well as compression.

### SQL Assistant improvements

We made a few improvements to SQL Assistant:

**Dedicated SQL Assistant threads** 🧵

Each query, notebook, and dashboard now gets its own conversation thread, keeping your chats organized.

![Dedicated threads](https://assets.timescale.com/docs/images/timescale-cloud-sql-assistant-threads.gif)

**Delete messages** ❌

Made a typo? Asked the wrong question? You can now delete individual messages from your thread to keep the conversation clean and relevant.

![Delete messages in SQL Assistant threads](https://assets.timescale.com/docs/images/timescale-cloud-sql-assistant-delete-messages.png)

**Support for OpenAI `o3-mini` ⚡**

We’ve added support for OpenAI’s latest `o3-mini` model, bringing faster response times and improved reasoning for SQL queries.

![SQL Assistant o3 mini](https://assets.timescale.com/docs/images/timescale-cloud-sql-assistant-o3-mini.png)

## 🌐 IP Allowlists in Data Mode and PopSQL

<Label type="date">January 31, 2025</Label>

For enhanced network security, you can now also create IP allowlists in the Timescale Console data mode and PopSQL. Similarly to the [ops mode IP allowlists][ops-mode-allow-list], this feature grants access to your data only to certain IP addresses. For example, you might require your employees to use a VPN and add your VPN static egress IP to the allowlist.

This feature is available in:

- [Timescale Console][services-portal] data mode, for all pricing tiers
- [PopSQL web][popsql-web]
- [PopSQL desktop][popsql-desktop]

Enable this feature in PopSQL/Timescale Console data mode > `Project` > `Settings` > `IP Allowlist`:

![Timescale Console data mode IP allowlist](https://assets.timescale.com/docs/images/timescale-data-mode-ip-allowlist.png)

## 🤖 pgai Extension and Python Library Updates
<Label type="date">January 24, 2025</Label>

### AI — pgai $PG extension 0.7.0
This release enhances the Vectorizer functionality by adding configurable `base_url` support for OpenAI API. This enables pgai Vectorizer to use all OpenAI-compatible models and APIs via the OpenAI integration simply by changing the `base_url`. This release also includes public granting of vectorizers, superuser creation on any table, an upgrade to the Ollama client to 0.4.5, a new `docker-start` command, and various fixes for struct handling, schema qualification, and system package management. [See all changes on Github](https://github.com/timescale/pgai/releases/tag/extension-0.7.0).

### AI - pgai python library 0.5.0
This release adds comprehensive SQLAlchemy and Alembic support for vector embeddings, including operations for migrations and improved model inheritance patterns. You can now seamlessly integrate vector search capabilities with SQLAlchemy models while utilizing Alembic for database migrations. This release also adds key improvements to the Ollama integration and self-hosted Vectorizer configuration. [See all changes on Github](https://github.com/timescale/pgai/releases/tag/pgai-v0.5.0).

## AWS Transit Gateway Support
<Label type="date">January 17, 2025</Label>

### AWS Transit Gateway Support (Early Access)
Timescale Cloud now enables you to connect to your Timescale Cloud services through AWS Transit Gateway. This feature is available to Scale and Enterprise customers. It will be in Early Access for a short time and available in the Timescale Console very soon. If you are interested in implementing this Early Access Feature, reach out to your Rep.

## 🇮🇳 New region in India, $PG 17 upgrades, and TimescaleDB on AWS Marketplace
<Label type="date">January 10, 2025</Label>

### Welcome India! (Support for a new region: Mumbai)
Timescale Cloud now supports the Mumbai region. Starting today, you can run Timescale Cloud services in Mumbai, bringing our database solutions closer to users in India.

### $PG major version upgrades to PG 17
Timescale Cloud services can now be upgraded directly to $PG 17 from versions 14, 15, or 16. Users running versions 12 or 13 must first upgrade to version 15 or 16, before upgrading to 17.

### Timescale Cloud available on AWS Marketplace
Timescale Cloud is now available in the [AWS Marketplace][aws-timescale]. This allows you to keep billing centralized on your AWS account, use your already committed AWS Enterprise Discount Program spend to pay your Timescale Cloud bill and simplify procurement and vendor management.

## 🎅 $PG 17, feature requests, and $PG Livesync
<Label type="date">December 20, 2024</Label>

### $PG 17
All new Timescale Cloud services now come with $PG 17.2, the latest version. Upgrades to $PG 17 for services running on prior versions will be available in January.
$PG 17 adds new capabilities and improvements to Timescale like:
* **System-wide Performance Improvements**. Significant performance boosts, particularly in high-concurrency workloads. Enhancements in the I/O layer, including improved Write-Ahead Log (WAL) processing, can result in up to a 2x increase in write throughput under heavy loads.
* **Enhanced JSON Support**. The new JSON_TABLE allows developers to convert JSON data directly into relational tables, simplifying the integration of JSON and SQL. The release also adds new SQL/JSON constructors and query functions, offering powerful tools to manipulate and query JSON data within a traditional relational schema. 
* **More Flexible MERGE Operations**. The MERGE command now includes a RETURNING clause, making it easier to track and work with modified data. You can now also update views using MERGE, unlocking new use cases for complex queries and data manipulation.
  
### Submit feature requests from Timescale Console
You can now submit feature requests directly from Console and see the list of feature requests you have made. Just click on `Feature Requests` on the right sidebar.
All feature requests are automatically published to the [Timescale Forum](https://forum.tigerdata.com/forum/c/cloud-feature-requests/39) and are reviewed by the product team, providing more visibility and transparency on their status as well as allowing other customers to vote for them.

![Submit a feature request in Timescale Console](https://assets.timescale.com/docs/images/submit-feature-request.png)

### $PG Livesync (Alpha release)
We have built a new solution that helps you continuously replicate all or some of your $PG tables directly into Timescale Cloud.

[Livesync](https://docs.timescale.com/migrate/latest/livesync-for-postgresql/) allows you to keep a current $PG instance such as RDS as your primary database, and easily offload your real-time analytical queries to Timescale Cloud to boost their performance. If you have any questions or feedback, talk to us in [#livesync in Timescale Community](https://app.slack.com/client/T4GT3N2JK/C086NU9EZ88).

This is just the beginning—you'll see more from livesync in 2025!

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

See our [blog post](https://www.tigerdata.com/blog/postgres-gui-sql-assistant/) or [docs](https://www.tigerdata.com/docs/getting-started/latest/run-queries-from-console/#sql-assistant) for full details!

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

Timescale Cloud's [Enterprise plan](https://docs.timescale.com/about/latest/pricing-and-account-management/#features-included-in-each-pricing-plan) is now HIPAA (Health Insurance Portability and Accountability Act) compliant. This allows organizations to securely manage and analyze sensitive healthcare data, ensuring they meet regulatory requirements while building compliant applications.

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
Navigate to the AI tab in your service overview and follow the instructions to add your OpenAI API key and set up your first vectorizer or read our [guide to automate embedding generation with pgai Vectorizer](https://github.com/timescale/pgai/blob/main/docs/vectorizer/overview.md) for more details.

![Vectorizer setup](https://s3.amazonaws.com/assets.timescale.com/docs/images/vectorizer-setup.png)

### $PG-to-$PG foreign data wrappers: 
Fetch and query data from multiple $PG databases, including time-series data in hypertables, directly within Timescale Cloud using [foreign data wrappers (FDW)](https://docs.timescale.com/use-timescale/latest/schema-management/foreign-data-wrappers/). No more complicated ETL processes or external tools—just seamless integration right within your SQL editor. This feature is ideal for developers who manage multiple $PG and time-series instances and need quick, easy access to data across databases.

### Faster queries over tiered data 
This release adds support for runtime chunk exclusion for queries that need to access [tiered storage](https://docs.timescale.com/use-timescale/latest/data-tiering/). Chunk exclusion now works with queries that use stable expressions in the `WHERE` clause. The most common form of this type of query is:

```
SELECT * FROM  hypertable WHERE timestamp_col > now() - '100 days'::interval
```

For more info on queries with immutable/stable/volatile filters, check our blog post on [Implementing constraint exclusion for faster query performance](https://www.tigerdata.com/blog/implementing-constraint-exclusion-for-faster-query-performance).

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

Last year, we began developing a solution for low-downtime migration from $PG and TimescaleDB. Since then, this solution has evolved significantly, featuring enhanced functionality, improved reliability, and performance optimizations. We're now proud to announce that **live migration is production-ready** with the release of version 1.0.

Many of our customers have successfully migrated databases to Timescale using [live migration](https://docs.timescale.com/migrate/latest/live-migration/), with some databases as large as a few terabytes in size.

### 🔁 Actions Tab

As part of the service creation flow, we offer the following: 

- Connect to services from different sources
- Import and migrate data from various sources
- Create hypertables

Previously, these actions were only visible during the service creation process and couldn't be accessed later. Now, these actions are **persisted within the service**, allowing users to leverage them on-demand whenever they're ready to perform these tasks.

![Timescale Console Actions tab](https://assets.timescale.com/docs/images/timescale-console-actions-tab.png)

### 🧭 Import Data from MySQL

We've noticed users struggling to convert their MySQL schema and data into their Timescale Cloud services. This was due to the semantic differences between MySQL and $PG. To simplify this process, we now offer **easy-to-follow instructions** to import data from MySQL to Timescale Cloud.  This feature is available as part of the data import wizard, under the **Import from MySQL** option.

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

* Released live-migration v0.0.26 and then v0.0.27 which includes multiple performance improvements and bugfixes as well as better support for $PG 12.

## One-click SQL statement execution from Timescale Console, and session support in the SQL editor
<Label type="date">September 05, 2024</Label>

### One-click SQL statement execution from Timescale Console

Now you can simply click to run SQL statements in various places in the Console. This requires that the [SQL Editor][run-sqleditor] is enabled for the service.

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
After service creation, we now offer a dedicated section for data import, including options to import from $PG as a source or from CSV files.

The enhanced $PG import instructions now offer several options: single table import, schema-only import, partial data import (allowing selection of a specific time range), and complete database import. Users can execute any of these data imports with just one or two simple commands provided in the data import section.

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

For more details take a look at [our documentation][integrations].

<img src="https://s3.amazonaws.com/assets.timescale.com/docs/images/cloudwatch-role-assumption.png" width="600px" alt="CloudWatch authentication via role assumption" />

### Two-factor authentication (2FA) indicator
We’ve added a 2FA status column to the Members page, allowing customers to easily see whether each project member has 2FA enabled or disabled.

![2FA status](https://s3.amazonaws.com/assets.timescale.com/docs/images/2FA-status-indicator.png)

### Anthropic and Cohere integrations in pgai
The pgai extension v0.3.0 now supports embedding creation and LLM reasoning using models from Anthropic and Cohere. For details and examples, see [this post for pgai and Cohere](https://www.tigerdata.com/blog/build-search-and-rag-systems-on-postgresql-using-cohere-and-pgai), and [this post for pgai and Anthropic](https://www.tigerdata.com/blog/use-anthropic-claude-sonnet-3-5-in-postgresql-with-pgai).

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

**$PG 13 support removal announcement**

Following the deprecation announcement for $PG 13 in TimescaleDB v2.13,
$PG 13 is no longer supported in TimescaleDB v2.16.

The currently supported $PG major versions are 14, 15, and 16.
 
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

To learn more, see the [pgai Ollama documentation](https://github.com/timescale/pgai/blob/main/docs/vectorizer/quick-start.md).

## 🧙 Compression Wizard

<Label type="date">June 13, 2024</Label>

The compression wizard is now available on Timescale Cloud. Select a hypertable and be guided through enabling compression through the UI!

To access the compression wizard, navigate to `Explorer`, and select the hypertable you would like to compress. In the top right corner, hover where it says `Compression off`, and open the wizard. You will then be guided through the process of configuring compression for your hypertable, and can compress it directly through the UI.

![Run the compression wizard in Timescale Console](https://assets.timescale.com/docs/images/compress-data-in-console.png)

## 🏎️💨 High Performance AI Apps With pgvectorscale

<Label type="date">June 11, 2024</Label>

The [vectorscale extension][pgvectorscale] is now available on [Timescale Cloud][timescale-signup].

pgvectorscale complements pgvector, the open-source vector data extension for $PG, and introduces the
following key innovations for pgvector data:

- A new index type called StreamingDiskANN, inspired by the DiskANN algorithm, based on research from Microsoft.
- Statistical Binary Quantization: developed by Timescale researchers, This compression method improves on
  standard Binary Quantization.

On benchmark dataset of 50 million Cohere embeddings (768 dimensions each), $PG with pgvector and
pgvectorscale achieves 28x lower p95 latency and 16x higher query throughput compared to Pinecone's storage
optimized (s1) index for approximate nearest neighbor queries at 99% recall, all at 75% less cost when
self-hosted on AWS EC2.

To learn more, see the [pgvectorscale documentation][pgvectorscale].

## 🧐Integrate AI Into Your Database Using pgai

<Label type="date">June 11, 2024</Label>

The [pgai extension][pgai] is now available on [Timescale Cloud][timescale-signup].

pgai brings embedding and generation AI models closer to the database. With pgai, you can now do the following directly
from within $PG in a SQL query:

* Create embeddings for your data.
* Retrieve LLM chat completions from models like OpenAI GPT4o.
* Reason over your data and facilitate use cases like classification, summarization, and data enrichment on your existing relational data in $PG.

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

The [$PG Audit extension(pgaudit)](https://github.com/pgaudit/pgaudit/) is now available on [Timescale Cloud][timescale-signup].
pgaudit provides detailed database session and object audit logging in the Timescale
Cloud logs.

If you have strict security and compliance requirements and need to log all operations
on the database level, pgaudit can help. You can also export these audit logs to
[Amazon CloudWatch](https://aws.amazon.com/cloudwatch/).

To learn more, see the [pgaudit documentation](https://github.com/pgaudit/pgaudit/).

## 🌡 International System of Unit Support with postgresql-unit
<Label type="date">May 31, 2024</Label>

The [SI Units for $PG extension(unit)](https://github.com/df7cb/postgresql-unit) provides support for the
[ISU](https://en.wikipedia.org/wiki/International_System_of_Units) in [Timescale Cloud][timescale-signup].

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

[aws-timescale]: https://aws.amazon.com/marketplace/seller-profile?id=seller-wbtecrjp3kxpm
[integrations]: /integrations/:currentVersion:/
[log-28032025-pgvectorscale-example]: https://github.com/timescale/pgvectorscale?tab=readme-ov-file#label-based-filtering-with-diskann
[log-28032025-pgvectorscale-rn]: https://github.com/timescale/pgvectorscale/releases/tag/0.7.0
[ops-mode-allow-list]: /about/:currentVersion:/changelog/#-ip-allow-lists
[pgai]: https://github.com/timescale/pgai
[pgvectorscale]: https://github.com/timescale/pgvectorscale/
[popsql-desktop]: https://popsql.com/download
[popsql-web]: https://app.popsql.com/login
[run-sqleditor]: /getting-started/:currentVersion:/run-queries-from-console/#sql-editor
[services-portal]: https://console.cloud.timescale.com/dashboard/services
[timescale-signup]: https://console.cloud.timescale.com/signup
