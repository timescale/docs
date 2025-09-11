---
title: Sync, import, and migrate your data to Tiger Cloud
excerpt: In Tiger Cloud, you can easily import individual files, migrate from other databases, or sync directly so that your data from another source is continuously updated 
products: [cloud, self_hosted]
keywords: [import, sync, migrate, RDS]
tags: [import, sync, migrate, RDS]
---

import OpenSupportRequest from "versionContent/_partials/_migrate_open_support_request.mdx"

# Import and sync 

In $CLOUD_LONG, you can easily add and sync data to your $SERVICE_SHORT from other sources. This includes:

- Sync directly, so data from another source is continuously updated in your $SERVICE_SHORT.
- Import individual files using $CONSOLE_LONG or the command line.
- Migrate data from other databases.

![Import and sync](https://assets.timescale.com/docs/images/tiger-cloud-console/import-sync-options-in-tiger-cloud.svg)

## Sync from $PG or S3

$CLOUD_LONG provides source connectors for $PG and S3. You use them to synchronize all or some of your data to your $SERVICE_LONG in real time. You run the connectors continuously, using your data as a primary database and your $SERVICE_LONG as a logical replica. This enables you
to leverage $CLOUD_LONG’s real-time analytics capabilities on your replica data.

| Connector options                      |  Downtime requirements |
|----------------------------------------|-----------------------|
| [$PG_CONNECTOR_CAP][livesync-postgres] | None                  |
| [$S3_CONNECTOR_CAP][livesync-s3]       | None                  |


## Import individual files

You can [import individual files using $CONSOLE_SHORT][import-console], from your local machine or S3. This includes CSV, Parquet, TXT, and MD files. Alternatively, [import files using the terminal][import-terminal].

## Migrate your data 

Depending on the amount of data you need to migrate, and the amount of downtime you can afford, $COMPANY offers the following migration options:

| Migration strategy                         | Use when                                                                                                                    | Downtime requirements |
|--------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------|-----------------------|
| [Migrate with downtime][pg-dump-restore]   | Use `pg_dump` and `pg_restore` to migrate when you can afford downtime.                                                     | Some downtime         |
| [Live migration][live-migration]           | Simplified end-to-end migration with almost zero downtime.                                                                  | Minimal downtime      |
| [Dual-write and backfill][dual-write]      | Append-only data, heavy insert workload (~20,000 inserts per second) when modifying your ingestion pipeline is not an issue. | Minimal downtime      |

All strategies work to migrate from $PG, $TIMESCALE_DB, AWS RDS, and $MST_LONG. Migration 
assistance is included with $CLOUD_LONG support. If you encounter any difficulties while migrating your data,
consult the [troubleshooting] page, open a support request, or take your issue to the `#migration` channel
in the [community slack](https://timescaledb.slack.com/signup#/domain-signup), the developers of this migration method are there to help.

<OpenSupportRequest />

If you're migrating your data from another source database type, best practice is export the data from your source database as 
a CSV file, then import to your $SERVICE_LONG using [timescaledb-parallel-copy][import-terminal].

[dual-write]: /migrate/:currentVersion:/dual-write-and-backfill/
[pg-dump-restore]: /migrate/:currentVersion:/pg-dump-and-restore/
[live-migration]: /migrate/:currentVersion:/live-migration/
[livesync-postgres]: /migrate/:currentVersion:/livesync-for-postgresql/
[livesync-s3]: /migrate/:currentVersion:/livesync-for-s3/
[troubleshooting]: /migrate/:currentVersion:/troubleshooting/
[import-console]: /migrate/:currentVersion:/upload-file-using-console/
[import-terminal]: /migrate/:currentVersion:/upload-file-using-terminal/