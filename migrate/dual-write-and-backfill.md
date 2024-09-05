---
title: Low-downtime migrations with dual-write and backfill
excerpt: Migrate a hypertable or entire database with low downtime
products: [cloud, self_hosted]
keywords: [backups, restore]
tags: [recovery, logical backup, pg_dump, pg_restore]
---

import MigrationPrerequisites from "versionContent/_partials/_migrate_prerequisites.mdx";
import SourceTargetNote from "versionContent/_partials/_migrate_source_target_note.mdx";
import GettingHelp from "versionContent/_partials/_migrate_dual_write_backfill_getting_help.mdx";

# Dual-write and backfill

You use dual-write and backfill to migrate 100GB-10TB+ of time-series data to a Timescale Cloud service seamlessly, 
with only a few minutes downtime. Dual-write and backfill migrates data from any source database that can export your 
data to csv format. For example, from PostgresSQL or TimescaleDB to a Timescale Cloud service .

Dual-write and backfill works well when:
1. The bulk of the on-disk data is already in time-series tables.
1. Writes by the app:
   - Do not reference historical time-series data.
   - Are append-only for time-series data.
1. No `UPDATE` or `DELETE` queries are run on time-series data in the source database during migration. 
   If queries are run, they are done in a controlled manner so you can ignore them, or re-backfill.
1. Either the relational (non-time-series) data in the source database is:
   - Small enough to be copied from source to target with downtime.
   - Has infrequent changes and can be copied asynchronously while your app continues to run.

Dual-write and backfill is significantly more complicated to execute than
[Migrate with downtime][pg-dump-and-restore], and has some prerequisites on the data ingest patterns of your app, so it may
not be universally applicable.

## Prerequisites

<MigrationPrerequisites />

## Migrate to Timescale Cloud

To move your data from a self-hosted database to a Timescale Cloud service:

<Tabs label="Live migration">

<Tab title="From TimescaleDB">

</Tab>
<Tab title="From PostgreSQL">

</Tab>
<Tab title="From AWS RDS">

</Tab>
<Tab title="From Non-PostgreSQL">

</Tab>
</Tabs>
