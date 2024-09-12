---
title: Low-downtime migrations with dual-write and backfill
excerpt: Migrate a hypertable or entire database with low downtime
products: [cloud, self_hosted]
keywords: [backups, restore]
tags: [recovery, logical backup, pg_dump, pg_restore]
---

import MigrationPrerequisites from "versionContent/_partials/_migrate_prerequisites.mdx";
import MigrationPrerequisitesDumpRestore from "versionContent/_partials/_migrate_prerequisites_tools_dump_restore.mdx";
import SourceTargetNote from "versionContent/_partials/_migrate_source_target_note.mdx";
import GettingHelp from "versionContent/_partials/_migrate_dual_write_backfill_getting_help.mdx";
import MigrateFromTimescaleDB from "versionContent/_partials/_migrate_backfill_timescaledb.mdx";


# Migrate time-series data using dual-write and backfill

You use dual-write and backfill to migrate 100GB-10TB+ of time-series data to a <Variable name="SERVICE"/> seamlessly, 
with only a few minutes downtime. You use Dual-write and backfill to migrate from any source database that can 
export your data to csv format. For example, from PostgresSQL or <Variable name="TIMESCALE_DB"/>.

Best practice is to use dual-write and backfill when:

1. The bulk of the on-disk data is already in time-series tables.
1. Writes by the app:
   - Do not reference historical time-series data.
   - Are append-only for time-series data.
1. During migration, no `UPDATE` or `DELETE` queries are run on time-series data in the source database.
   If queries are run, it is done in a controlled manner so you can ignore them, or re-backfill.
1. The relational (non-time-series) data in the source database is either:
   - Small enough to be copied from source to target with downtime.
   - Has infrequent changes and can be copied asynchronously while your app continues to run.

Dual-write and backfill is significantly more complicated to execute than [Migrate with downtime][pg-dump-and-restore],
and has some prerequisites on the data ingest patterns of your app, so it may not be universally applicable. If the
time-series data in your source database has foreign-key references in a plain table, best practice is to follow
[live migration].

This page shows you how to move your data to a <Variable name="SERVICE"/> using dual-write and backfill.

## Prerequisites

<MigrationPrerequisites />

<MigrationPrerequisitesDumpRestore />

### Migrate to Timescale Cloud

To move your data from a self-hosted database to a <Variable name="SERVICE"/>:

<Tabs label="Dual write and backfill">

<Tab title="From TimescaleDB">

<MigrateFromTimescaleDB />

</Tab>
<Tab title="From PostgreSQL">

</Tab>
<Tab title="From AWS RDS">

</Tab>
<Tab title="From Non-PostgreSQL">

</Tab>
</Tabs>


[pg-dump-and-restore]: /migrate/:currentVersion:/pg-dump-and-restore/
[live migration]: /migrate/:currentVersion:/live-migration/
