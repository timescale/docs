---
title: Migrate and ingest data
excerpt: Install and manage your deployment, control user access, and integrate third party tooling.   
products: [cloud]
keywords: [ai, vector, ]
tags: [ai, vector]
---


# Data ingestion and migration

Intro sentence explaining what data security and reliability is and how the information in the section helps the end user perform
common tasks.

![Pricing plans in the console](https://assets.timescale.com/docs/images/tsc-vpc-architecture.svg)

You have chosen to migrate your data to Timescale Cloud, thank you. Depending on the amount of data
you need to migrate, and the amount of downtime you can afford, we offer the following ways to migrate
your data:


- **[Migrate with downtime][pg-dump-restore]**: use `pg_dump` and `pg_restore` to migrate when you can afford downtime.                                                     | Some downtime         |
- **[Live migration][live-migration]**: simplified end-to-end migration with almost zero downtime.                                                                  | Minimal downtime      |
- **[Dual-write and backfill][dual-write]**: append-only data, heavy insert workload (~20,000 inserts per second) when modifying your ingestion pipeline is not an issue. | Minimal downtime      |
- **Ingesting data with Kafka**: ipsum lorum etc.
- **Ingesting data with Timescale parallel copy**: ipsum lorum etc.
- **Ingesting data from a .csv file**: ipsum lorum etc.

All strategies work to migrate from PostgreSQL, TimescaleDB, AWS RDS, and Managed Service for Timescale. Migration
assistance is included with Timescale support. If you encounter any difficulties while migrating your data,
consult the [troubleshooting] page, open a support request, or take your issue to the `#migration` channel
in the [community slack](https://slack.timescale.com/), the developers of this migration method are there to help.

<OpenSupportRequest />

If you're migrating your data from another source database type, best practice is export the data from your source database as
a `.csv` file, then import to your Timescale Cloud Service using [timescaledb-parallel-copy][parallel-copy]. For other ingestion methods,
see [Ingest data from other sources][data-ingest].



[data-ingest]: /use-timescale/:currentVersion:/ingest-data/
[dual-write]: /migrate/:currentVersion:/dual-write-and-backfill/
[pg-dump-restore]: /migrate/:currentVersion:/pg-dump-and-restore/
[parallel-copy]: /use-timescale/:currentVersion:/ingest-data/import-csv/
[troubleshooting]: /migrate/:currentVersion:/troubleshooting/
[live-migration]: /migrate/:currentVersion:/live-migration/
[pgcopydb]: https://github.com/dimitri/pgcopydb
[playbooks]: /migrate/:currentVersion:/playbooks/
