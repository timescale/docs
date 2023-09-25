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

If you are using PostgreSQL or TimescaleDB and can afford to take your
application offline for a few hours, the simplest option is to migrate data
from another database into Timescale using PostgreSQL's `pg_dump` and
`pg_restore` commands.
You can also use these tools to migrate your data from Managed Service for
TimescaleDB, from a self-hosted TimescaleDB instance, or from another
PostgreSQL database, including Amazon RDS. Consult the guide on [migrating with
pg_dump and pg_restore][pg-dump-restore].

If you are looking for a low-downtime alternative (downtime on the order of
minutes), are willing to modify your ingestion code, and the bulk of your data
is stored in time-series tables, you can use the [dual-write and backfill][dual-write]
strategy for a low-downtime migration. This strategy also works if you are not
migrating from PostgreSQL.

If you're using PostgreSQL, you may also have heard of logical replication
being the recommended strategy for migrations with low downtime. Currently,
TimescaleDB doesn't work with logical replication, so this is not a viable
option, but we are actively working on making this possible.

If you're migrating from something other than PostgreSQL, and don't want to use
the dual-write and backfill approach, then the easiest way to move your data to
Timescale is by exporting the data from your existing database as a `.csv` file,
and importing it with [timescaledb-parallel-copy][parallel-copy].

For other ingestion methods, see the [data ingest section][data-ingest].

If you encounter any difficulties while migrating, consult the
[troubleshooting] documentation, or open a support request.

<OpenSupportRequest />

[data-ingest]: /use-timescale/:currentVersion:/ingest-data/
[dual-write]: /migrate/:currentVersion:/dual-write-and-backfill/
[pg-dump-restore]: /migrate/:currentVersion:/pg-dump-and-restore/
[parallel-copy]: /use-timescale/:currentVersion:/ingest-data/import-csv/
[troubleshooting]: /migrate/:currentVersion:/troubleshooting/
