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

Dual-write and backfill is a migration strategy to move a large amount of
time-series data (100&nbsp;GB-10&nbsp;TB+) with low downtime (on the order of
minutes of downtime). It is significantly more complicated to execute than a
migration with downtime using [pg_dump/restore][pg-dump-and-restore], and has
some prerequisites on the data ingest patterns of your application, so it may
not be universally applicable.

Dual-write and backfill can be used for any source database type, as long as it
can provide data in csv format. It can be used to move data from a PostgresSQL
source, and from TimescaleDB to TimescaleDB.

Dual-write and backfill works well when:
1. The bulk of the (on-disk) data is in time-series tables.
1. Writes by the application do not reference historical time-series data.
1. Writes to time-series data are append-only.
1. No `UPDATE` or `DELETE` queries will be run on time-series data in the
   source database during the migration process (or if they are, it happens in
   a controlled manner, such that it's possible to either ignore, or
   re-backfill).
1. Either the relational (non-time-series) data is small enough to be copied
   from source to target in an acceptable amount of time for this to be done
   with downtime, or the relational data can be copied asynchronously while the
   application continues to run (that is, changes relatively infrequently).

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
