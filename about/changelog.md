---
title: Changelog
excerpt: A summary of the latest changes to all Timescale products.
keywords: [changelog, upgrades, updates, releases]
---

import ReleaseNotification from "versionContent/_partials/_release_notification.mdx";

# Changelog

All the latest features and updates to Timescale products.

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

See the [pgvectorscale documentation][pgvectorscale] to learn more.

## 🧐 Integrate AI Into Your Database Using pgai

<Label type="date">June 11, 2024</Label>

The [pgai extension][pgai] is now available on [Timescale Cloud][signup].

pgai brings embedding and generation AI models closer to the database. With pgai, you can now do the following directly
from within PostgreSQL in a SQL query:

* Create embeddings for your data.
* Retrieve LLM chat completions from models like OpenAI GPT4o.
* Reason over your data and facilitate use cases like classification, summarization, and data enrichment on your existing relational data in PostgreSQL.

See the [pgai documentation][pgai] to learn more.


## TimescaleDB 2.15.2
<Label type="date">June 7, 2024</Label>

This release contains bug fixes introduced since TimescaleDB v2.15.1.
Best practice is to upgrade at the next available opportunity.

- [#6975](https://github.com/timescale/timescaledb/issues/6975): Fix sort pushdown for partially compressed chunks.
- [#6976](https://github.com/timescale/timescaledb/issues/6976): Fix removal of the metadata function and the update script.
- [#6978](https://github.com/timescale/timescaledb/issues/6978): Fix segfault in compress_chunk with primary space partition.
- [#6993](https://github.com/timescale/timescaledb/issues/6993): Disallow hash partitioning on the primary column.

Want to know more? See the [release notes][timescaledb-releases].

## May 2024 Updates
<Label type="date">May 31, 2024</Label>

### TimescaleDB 2.15.0

We released TimescaleDB 2.15.0 with a ton of new features and bugfixes.

💡 Features

-   [#6382](https://github.com/timescale/timescaledb/pull/6382) Support for `time_bucket` with origin and offset in CAggs.
-   [#6696](https://github.com/timescale/timescaledb/pull/6696) Improve the defaults for compression `segment_by` and `order_by`.
-   [#6705](https://github.com/timescale/timescaledb/pull/6705) Add sparse minmax indexes for compressed columns that have uncompressed btree indexes.
-   [#6754](https://github.com/timescale/timescaledb/pull/6754) Allow `DROP CONSTRAINT` on compressed hypertables.
-   [#6767](https://github.com/timescale/timescaledb/pull/6767) Add metadata table `_timestaledb_internal.bgw_job_stat_history` for tracking job execution history.
-   [#6798](https://github.com/timescale/timescaledb/pull/6798) Prevent usage of the deprecated `time_bucket_ng` in the CAgg definition.
-   [#6810](https://github.com/timescale/timescaledb/pull/6810) Add telemetry for access methods.
-   [#6811](https://github.com/timescale/timescaledb/pull/6811) Remove the no longer relevant `timescaledb.allow_install_without_preload` GUC.
-   [#6837](https://github.com/timescale/timescaledb/pull/6837) Add migration path for CAggs using `time_bucket_ng`.
-   [#6865](https://github.com/timescale/timescaledb/pull/6865) Update the watermark when truncating a CAgg.

🐛 Bugfixes

-   [#6617](https://github.com/timescale/timescaledb/pull/6617) Fix error in show_chunks.
-   [#6621](https://github.com/timescale/timescaledb/pull/6621) Remove metadata when dropping chunks.
-   [#6677](https://github.com/timescale/timescaledb/pull/6677) Fix snapshot usage in CAgg invalidation scanner.
-   [#6698](https://github.com/timescale/timescaledb/pull/6698) Define meaning of 0 retries for jobs as no retries.
-   [#6717](https://github.com/timescale/timescaledb/pull/6717) Fix handling of compressed tables with primary or unique index in COPY path.
-   [#6726](https://github.com/timescale/timescaledb/pull/6726) Fix constify cagg_watermark using window function when querying a CAgg.
-   [#6729](https://github.com/timescale/timescaledb/pull/6729) Fix NULL start value handling in CAgg refresh.
-   [#6732](https://github.com/timescale/timescaledb/pull/6732) Fix CAgg migration with custom timezone / date format settings.
-   [#6752](https://github.com/timescale/timescaledb/pull/6752) Remove custom autovacuum setting from compressed chunks.
-   [#6770](https://github.com/timescale/timescaledb/pull/6770) Fix plantime chunk exclusion for OSM chunk.
-   [#6789](https://github.com/timescale/timescaledb/pull/6789) Fix deletes with subqueries and compression.
-   [#6796](https://github.com/timescale/timescaledb/pull/6796) Fix a crash involving a view on a hypertable.
-   [#6797](https://github.com/timescale/timescaledb/pull/6797) Fix foreign key constraint handling on compressed hypertables.
-   [#6816](https://github.com/timescale/timescaledb/pull/6816) Fix handling of chunks with no constraints.
-   [#6820](https://github.com/timescale/timescaledb/pull/6820) Fix a crash when the ts_hypertable_insert_blocker was called directly.
-   [#6849](https://github.com/timescale/timescaledb/pull/6849) Use non-orderby compressed metadata in compressed DML.
-   [#6867](https://github.com/timescale/timescaledb/pull/6867) Clean up compression settings when deleting compressed CAgg.
-   [#6869](https://github.com/timescale/timescaledb/pull/6869) Fix compressed DML with constraints of form value OP column.
-   [#6870](https://github.com/timescale/timescaledb/pull/6870) Fix bool expression pushdown for queries on compressed chunks.

### 🔍 Database Audit Logging with pgaudit

The [PostgreSQL Audit extension(pgaudit)](https://github.com/pgaudit/pgaudit/) is now available on [Timescale Cloud][signup].
pgaudit provides detailed database session and object audit logging in the Timescale
Cloud logs.

If you have strict security and compliance requirements and need to log all operations
on the database level, pgaudit can help. You can also export these audit logs to
[Amazon CloudWatch](https://aws.amazon.com/cloudwatch/).

See the [pgaudit documentation](https://github.com/pgaudit/pgaudit/) to learn more.

### 🌡 International System of Unit support with postgresql-unit

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

See the [postgresql-unit documentation](https://github.com/df7cb/postgresql-unit) to learn more.

[release-notes]: /about/:currentVersion:/release-notes/
[timescaledb-releases]: https://github.com/timescale/timescaledb/releases/
[pgai]: https://github.com/timescale/pgai
[pgvectorscale]: https://github.com/timescale/pgvectorscale/
[signup]: https://console.cloud.timescale.com/signup
