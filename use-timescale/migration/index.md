---
title: Migrate your data to Timescale
excerpt: Migrate existing database to Timescale
products: [cloud]
keywords: [data migration, postgresql, RDS]
tags: [ingest, migrate, RDS]
---

# Migrate your data to Timescale

You can migrate data from another database into Timescale [using the PostgreSQL
`pg_dump` and `pg_restore` commands][pg-migrate]. You can also use these tools to migrate
your data from Managed Service for TimescaleDB, from a self-hosted Timescale
instance, or from another PostgreSQL database, including Amazon RDS.

If you want to import data from another format, such as a `.csv` file, into a
new Timescale service, see the [data ingest section][data-ingest].

[data-ingest]: /use-timescale/:currentVersion:/ingest-data/
[pg-migrate]: /use-timescale/:currentVersion:/migration/pg-dump-and-restore.md
