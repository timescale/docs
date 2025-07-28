---
title: Connect, import, ingest, and migrate your data to Tiger Cloud
excerpt: In Tiger Cloud, you can easily import individual files, ingest data in bulk, migrate from other databases, or connect directly so that your data from another source is continuously synced 
products: [cloud, self_hosted]
keywords: [import, ingest, connect, migrate, RDS]
tags: [import, ingest, connect, migrate, RDS]
---

import OpenSupportRequest from "versionContent/_partials/_migrate_open_support_request.mdx"

# Import and connect 

In $CLOUD_LONG, you can easily add and sync data to your $SERVICE_SHORT from other sources. This includes:

- Connecting directly, so that your data from another source is continuously synced to your $SERVICE_SHORT.
- Importing individual files via $CONSOLE_LONG and the command line.
- Migrating data from other databases.
- Ingesting metrics from Telegraf.

## Connect to $PG or S3

$CLOUD_LONG provides source connectors for Postgres and S3, which you can use to synchronize all or some of your data to your $SERVICE_LONG in real time. You run the connectors continuously, using your data as a primary database and your $SERVICE_LONG as a logical replica. This enables you
to leverage $CLOUD_LONG’s real-time analytics capabilities on your replica data.

| Connector options                      |  Downtime requirements |
|----------------------------------------|-----------------------|
| [$PG_CONNECTOR_CAP][livesync-postgres] | None                  |
| [$S3_CONNECTOR_CAP][livesync-s3]       | None                  |


## Import individual files

You can [import individual files via $CONSOLE_SHORT][import-console], from your local machine or S3. This includes CSV, Parquet, TXT, and MD files. Alternatively, [import data in the terminal][import-terminal].

## Migrate your data 

Depending on the amount of data you need to migrate, and the amount of downtime you can afford, $COMPANY offers 
the following ways to migrate your data:

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
a `.csv` file, then import to your $SERVICE_LONG using [timescaledb-parallel-copy][parallel-copy]. For other ingestion methods, 
see [Ingest data from other sources][data-ingest].

## Ingest data

Telegraf is a server-based agent that collects and sends metrics and events from databases, systems, and IoT sensors. You can [view metrics][ingest-telegraf] gathered by Telegraf and stored in a hypertable in a $SERVICE_LONG.


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
