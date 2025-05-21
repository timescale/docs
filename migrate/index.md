---
title: Migrate your data to Timescale Cloud
excerpt: Migrate your existing database to Timescale Cloud - with downtime, live, or using dual-write and backfill
products: [cloud, self_hosted]
keywords: [data migration, postgresql, RDS]
tags: [ingest, migrate, RDS]
---

import OpenSupportRequest from "versionContent/_partials/_migrate_open_support_request.mdx"

# Migrate and sync data to Timescale Cloud

You have chosen to migrate or sync your data to $CLOUD_LONG, thank you. 

## Migrate your data 

Depending on the amount of data you need to migrate, and the amount of downtime you can afford. $COMPANY offers 
the following ways to migrate your data:

| Migration strategy                         | Use when                                                                                                                    | Downtime requirements |
|--------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------|-----------------------|
| [Migrate with downtime][pg-dump-restore]   | Use `pg_dump` and `pg_restore` to migrate when you can afford downtime.                                                     | Some downtime         |
| [Live migration][live-migration]           | Simplified end-to-end migration with almost zero downtime.                                                                  | Minimal downtime      |
| [Dual-write and backfill][dual-write]      | Append-only data, heavy insert workload (~20,000 inserts per second) when modifying your ingestion pipeline is not an issue. | Minimal downtime      |

All strategies work to migrate from PostgreSQL, TimescaleDB, AWS RDS, and Managed Service for Timescale. Migration 
assistance is included with Timescale support. If you encounter any difficulties while migrating your data,
consult the [troubleshooting] page, open a support request, or take your issue to the `#migration` channel
in the [community slack](https://slack.timescale.com/), the developers of this migration method are there to help.

<OpenSupportRequest />

If you're migrating your data from another source database type, best practice is export the data from your source database as 
a `.csv` file, then import to your Timescale Cloud Service using [timescaledb-parallel-copy][parallel-copy]. For other ingestion methods, 
see [Ingest data from other sources][data-ingest].

## Livesync your data

You use $LIVESYNC to synchronize all or some of your data to your $SERVICE_LONG in real time. You run $LIVESYNC 
continuously, using your data as a primary database and your $SERVICE_LONG as a logical replica. This enables you 
to leverage $CLOUD_LONG’s real-time analytics capabilities on your replica data.

| $LIVESYNC_CAP options                      |  Downtime requirements |
|--------------------------------------------|-----------------------|
| [$LIVESYNC_CAP for $PG][livesync-postgres] | None                  |
| [$LIVESYNC_CAP for S3][livesync-s3]        | None                  |



[data-ingest]: /use-timescale/:currentVersion:/ingest-data/
[dual-write]: /migrate/:currentVersion:/dual-write-and-backfill/
[pg-dump-restore]: /migrate/:currentVersion:/pg-dump-and-restore/
[parallel-copy]: /use-timescale/:currentVersion:/ingest-data/import-csv/
[livesync-postgres]: /migrate/:currentVersion:/livesync-for-postgresql/
[livesync-s3]: /migrate/:currentVersion:/livesync-for-s3/
[troubleshooting]: /migrate/:currentVersion:/troubleshooting/
[live-migration]: /migrate/:currentVersion:/live-migration/
[pgcopydb]: https://github.com/dimitri/pgcopydb
[playbooks]: /migrate/:currentVersion:/playbooks/
