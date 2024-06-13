---
title: Changelog
excerpt: A summery of the latest changes to all Timescale products.
keywords: [changelog, upgrades, updates, releases]
---

import ReleaseNotification from "versionContent/_partials/_release_notification.mdx";

# Changelog



This page provides a summery of the latest changes to all Timescale products. For information about TimescaleDB 
v2.15.1 and earlier, see the [Release notes][release-notes].

## June 2024 updates

Timescale has added the following new features.

### 🏎️💨 High performance AI apps with pgvectorscale

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

To enable pgvectorscale:

1. Connect to your Timescale Cloud service

    ```
    psql -d "postgres://<username>:<password>@<host>:<port>/<service-name>"
    ```

2. Add pgai to the service

   ```
   CREATE EXTENSION IF NOT EXISTS "vectorscale" VERSION '0.2.0' CASCADE;
   ```

For more details on how to use the extension, refer to the [pgvectorscale documentation][pgvectorscale].

### 🧐 Integrate AI into your database using pgai

<Label type="date">June 11, 2024</Label>

The [pgai extension][pgai] is now available on [Timescale Cloud][signup].

pgai brings embedding and generation AI models closer to the database. With pgai, you can now do the following directly 
from within PostgreSQL in a SQL query:

* Create embeddings for your data.
* Retrieve LLM chat completions from models like OpenAI GPT4o.
* Reason over your data and facilitate use cases like classification, summarization, and data enrichment on your existing relational data in PostgreSQL.

To enable pgaudit:

1. Connect to your Timescale Cloud service

    ```
    psql -d "postgres://<username>:<password>@<host>:<port>/<service-name>"
    ```

2. Add pgai to the service

   ```
   CREATE EXTENSION IF NOT EXISTS "ai" VERSION '0.1.0' CASCADE;
   ```

For more details on how to use the extension, refer to the [pgai documentation][pgai].


### 🐛 Bugfixes for TimescaleDB

<Label type="date">June 7, 2024</Label>

This section lists updates included in [TimescaleDB 2.15.2][timescaledb-releases].

#### Bugfixes

This release contains bug fixes introduced since TimescaleDB v2.15.1.
Best practice is to upgrade at the next available opportunity.

- [#6975](https://github.com/timescale/timescaledb/issues/6975): Fix sort pushdown for partially compressed chunks.
- [#6976](https://github.com/timescale/timescaledb/issues/6976): Fix removal of the metadata function and the update script.
- [#6978](https://github.com/timescale/timescaledb/issues/6978): Fix segfault in compress_chunk with primary space partition.
- [#6993](https://github.com/timescale/timescaledb/issues/6993): Disallow hash partitioning on the primary column.

#### Migrate from self-hosted TimescaleDB v2.14.x and earlier

After you run `ALTER EXTENSION`, you must run [this SQL script](https://github.com/timescale/timescaledb-extras/blob/master/utils/2.15.X-fix_hypertable_foreign_keys.sql). For more details, see [#6797](https://github.com/timescale/timescaledb/pull/6797).

If you are migrating from TimescaleDB v2.15.0 or v2.15.1, no changes are required.

#### Thanks

* @gugu for reporting the issue with catalog corruption due to update.
* @srieding for reporting the issue with partially compressed chunks and ordering on joined columns.


<ReleaseNotification />

## May 2024 updates

Timescale has added the following new features. 

### 🔍 Database audit logging with pgaudit

<Label type="date">May 31, 2024</Label>

The [PostgreSQL Audit extension(pgaudit)](https://github.com/pgaudit/pgaudit/) is now available on [Timescale Cloud][signup]. 
pgaudit provides detailed database session and object audit logging in the Timescale 
Cloud logs.

If you have strict security and compliance requirements and need to log all operations 
on the database level, pgaudit can help. You can also export these audit logs to
[Amazon CloudWatch](https://aws.amazon.com/cloudwatch/).

To enable pgaudit:

1. Connect to your Timescale Cloud service

    ```
    psql -d "postgres://<username>:<password>@<host>:<port>/<service-name>"
    ```

2. Add pgaudit to the service

   ```
   CREATE EXTENSION IF NOT EXISTS "pgaudit" VERSION '16.0' CASCADE;
   ```

For more details on how to use the extension, refer to the [pgaudit documentation](https://github.com/pgaudit/pgaudit/).

### 🌡 International System of Unit support with postgresql-unit

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

To enable postgresql-unit:

1. Connect to your Timescale Cloud service

   ```
   psql -d "postgres://<username>:<password>@<host>:<port>/<service-name>"
   ```

2. Add `unit` to the service

   ```
   CREATE EXTENSION IF NOT EXISTS "unit" VERSION '7' CASCADE;
   ```

### 🎨 PopSQL improvements
<Label type="date">May 31, 2024</Label>

PopSQL's theme now matches the Timescale brand, and it is now faster to open within Timescale Console.

[release-notes]: /about/:currentVersion:/release-notes/
[timescaledb-releases]: https://github.com/timescale/timescaledb/releases/
[pgai]: https://github.com/timescale/pgai
[pgvectorscale]: https://github.com/timescale/pgvectorscale/
[signup]: https://console.cloud.timescale.com/signup