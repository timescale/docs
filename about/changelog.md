---
title: Changelog
excerpt: A summary of the latest changes to all Timescale products.
keywords: [changelog, upgrades, updates, releases]
---

import ReleaseNotification from "versionContent/_partials/_release_notification.mdx";

# Changelog

All the latest features and updates to Timescale products.

## 🏎️💨 High performance AI apps with pgvectorscale

<Label type="date">June, 2024</Label>

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

To enable pgvectorscale, run the following command in your [Timescale Cloud][signup] service:
```
CREATE EXTENSION IF NOT EXISTS "vectorscale" VERSION '0.2.0' CASCADE;
```

Want to use this extension? See the [pgvectorscale documentation][pgvectorscale].

## 🧐 Integrate AI into your database using pgai

<Label type="date">June, 2024</Label>

The [pgai extension][pgai] is now available on [Timescale Cloud][signup].

pgai brings embedding and generation AI models closer to the database. With pgai, you can now do the following directly 
from within PostgreSQL in a SQL query:

* Create embeddings for your data.
* Retrieve LLM chat completions from models like OpenAI GPT4o.
* Reason over your data and facilitate use cases like classification, summarization, and data enrichment on your existing relational data in PostgreSQL.

To enable pgai, run the following command in your [Timescale Cloud][signup] service::

```
CREATE EXTENSION IF NOT EXISTS "ai" VERSION '0.1.0' CASCADE;
```

Want to use this extension? See the [pgai documentation][pgai].


## 🐛 Bugfixes for TimescaleDB
<Label type="date">June, 2024</Label>

This release contains bug fixes introduced since TimescaleDB v2.15.1.
Best practice is to upgrade at the next available opportunity.

- [#6975](https://github.com/timescale/timescaledb/issues/6975): Fix sort pushdown for partially compressed chunks.
- [#6976](https://github.com/timescale/timescaledb/issues/6976): Fix removal of the metadata function and the update script.
- [#6978](https://github.com/timescale/timescaledb/issues/6978): Fix segfault in compress_chunk with primary space partition.
- [#6993](https://github.com/timescale/timescaledb/issues/6993): Disallow hash partitioning on the primary column.

Want to know more? See the [release notes][timescaledb-releases].

## 🔍 Database audit logging with pgaudit
<Label type="date">May, 2024</Label>

The [PostgreSQL Audit extension(pgaudit)](https://github.com/pgaudit/pgaudit/) is now available on [Timescale Cloud][signup]. 
pgaudit provides detailed database session and object audit logging in the Timescale 
Cloud logs.

If you have strict security and compliance requirements and need to log all operations 
on the database level, pgaudit can help. You can also export these audit logs to
[Amazon CloudWatch](https://aws.amazon.com/cloudwatch/).

To enable pgaudit, run the following command in your [Timescale Cloud][signup] service:

```
CREATE EXTENSION IF NOT EXISTS "pgaudit" VERSION '16.0' CASCADE;
```

Want to use this extension? See the [pgaudit documentation](https://github.com/pgaudit/pgaudit/).

## 🌡 International System of Unit support with postgresql-unit
<Label type="date">May, 2024</Label>

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

To enable postgresql-unit, run the following command in your [Timescale Cloud][signup] service:

```
CREATE EXTENSION IF NOT EXISTS "unit" VERSION '7' CASCADE;
```

Want to use this extension? See the [postgresql-unit documentation](https://github.com/df7cb/postgresql-unit).

## 🎨 PopSQL improvements
<Label type="date">May, 2024</Label>

PopSQL's theme now matches the Timescale brand, and it is now faster to open within Timescale Console.

[release-notes]: /about/:currentVersion:/release-notes/
[timescaledb-releases]: https://github.com/timescale/timescaledb/releases/
[pgai]: https://github.com/timescale/pgai
[pgvectorscale]: https://github.com/timescale/pgvectorscale/
[signup]: https://console.cloud.timescale.com/signup