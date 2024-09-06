---
title: Changelog
excerpt: A summary of the latest changes to all Timescale products.
keywords: [changelog, upgrades, updates, releases]
---

# Changelog

All the latest features and updates to Timescale products.

## One-click SQL statement execution from Timescale Console
<Label type="date">September 05, 2024</Label>

* Enable Continuous Aggregates from the CAGGs wizard by clicking **Run** below the SQL snippet.
![362465912-63b0d5c7-95ae-4f37-8beb-fe3918658b92](https://github.com/user-attachments/assets/cd9f7f99-2b1c-488c-9e40-bb01e325b279)

* Enable database extensions by clicking **Run** below the SQL statement.
![362884384-ec2822e8-fe0b-4bc2-8609-4d74848378ea](https://github.com/user-attachments/assets/9f48a08e-9882-493f-8c08-77e5fb87a99f)

* Query data instantly with a single click in the Console after successfully uploading a CSV file.
![362402890-2a0bd220-221d-4d3d-b031-f6a0f8122267](https://github.com/user-attachments/assets/e4914899-ba6f-43d4-8c84-9bb5a6001ef8)


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

  Improved upsert performance by more than 100x in some cases and more than 1000x in some update/delete scenarios.

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
