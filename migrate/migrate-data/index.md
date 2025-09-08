---
title: Migrate your data to Tiger Cloud
excerpt: Migrate your data to Tiger Cloud with no or minimal downtime
products: [cloud]
keywords: [migrate]
tags: [migrate]
---

# Migrate your data

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

[dual-write]: /migrate/:currentVersion:/migrate-data/dual-write-and-backfill/
[pg-dump-restore]: /migrate/:currentVersion:/migrate-data/pg-dump-and-restore/
[live-migration]: /migrate/:currentVersion:/migrate-data/live-migration/
[troubleshooting]: /migrate/:currentVersion:/troubleshooting/
[import-terminal]: /migrate/:currentVersion:/import-data-using-terminal/