---
title: Migrate your data to Timescale
excerpt: Migrate existing database to Timescale
products: [cloud]
keywords: [data migration, postgresql, RDS]
tags: [ingest, migrate, RDS]
---

import OpenSupportRequest from "versionContent/_partials/_migrate_open_support_request.mdx"

# Migrate your data to Timescale

There are a number of different ways to migrate your data to Timescale. Which
option you choose depends on a few different factors, the most important of
which are:

- How much downtime you can afford (minutes, or hours?)
- How much data you are migrating (megabytes, or terabytes?)
- Where you are migrating your data from (PostgreSQL, TimescaleDB, Influx, or MySQL?)

Below are the different migration options we offer. You can choose the one that best suits your requirements:

| Migration strategy | Supported sources | Use when | Downtime requirements |
| ---------------- | --- | --- | --- |
| [pg_dump and pg_restore][pg-dump-restore] | Postgres,  TimescaleDB | Downtime is okay | Requires some downtime |
| [Dual writes and backfill][dual-write] | Postgres, TimescaleDB and others | Append-only data, heavy insert workload (~20,000 inserts per second) | Optimized for minimal downtime |
| [Live migrations][live-migrations] | Postgres | Simplified end-to-end migration with almost zero downtime | Optimized for minimal downtime |

If you are using PostgreSQL or TimescaleDB and can afford to take your
application offline for a few hours, the simplest option is to migrate data
from another database into Timescale using PostgreSQL's `pg_dump` and
`pg_restore` commands. 

You can also use these tools to migrate your data from Managed Service for TimescaleDB, from a self-hosted TimescaleDB instance, or from another
PostgreSQL database, including Amazon RDS.

If you are looking for a low-downtime alternative (with downtime on the order of minutes), you can choose one of our low downtime migration offerings:

1. Live migrations
2. Dual writes and backfill

The difference between live migrations and dual writes and backfill strategies is that with live migrations, we provide end-to-end migration that includes schema, data backfill, and real-time changes from the source to the target. On the other hand, with dual writes and backfill, you need to modify your ingest code to perform dual writes for your existing source and target databases, while our provided tooling takes care of the schema and data backfill migration.

Live migrations do not require any code changes to your application. They also offer support for updates and deletes during the migration from the source to the target. On the other hand, if you only perform inserts (i.e., append-only operations) in the database during migration, you may opt to use dual writes.

We recommend using live migrations if modifying your application logic to perform dual writes is a significant effort on your end and you want support for updates and deletes for real-time changes at the source. On the other hand, we recommend using dual writes and backfill if updating application logic is not an issue and you can easily perform dual writes. This strategy is suitable for append-only operations in the database and if you are ingesting a write load of more than ~20,000 inserts per second and the bulk of your data
is stored in time-series tables, you can use the dual-write and backfill. This strategy also works if you are not migrating from PostgreSQL.

<Highlight type="note">
If you're using PostgreSQL, you may also have heard of logical replication
being the recommended strategy for migrations with low downtime. Currently,
TimescaleDB doesn't work with logical replication, so this is not a viable
option.
</Highlight>

If you're migrating from something other than PostgreSQL, and don't want to use
above listed migration options, then the easiest way to move your data to
Timescale is by exporting the data from your existing database as a `.csv` file,
and importing it with [timescaledb-parallel-copy][parallel-copy].

For other ingestion methods, see the [data ingest section][data-ingest].

If you encounter any difficulties while migrating, consult the
[troubleshooting] documentation, or open a support request or hit us up on [Slack (](https://slack.timescale.com/)#migrations channel). We’d love to hear from you!

<OpenSupportRequest />

[data-ingest]: /use-timescale/:currentVersion:/ingest-data/
[dual-write]: /migrate/:currentVersion:/dual-write-and-backfill/
[pg-dump-restore]: /migrate/:currentVersion:/pg-dump-and-restore/
[parallel-copy]: /use-timescale/:currentVersion:/ingest-data/import-csv/
[troubleshooting]: /migrate/:currentVersion:/troubleshooting/
[live-migrations]: /migrate/:currentVersion:/live-migrations/
