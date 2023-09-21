---
title: Low-downtime migrations with dual-write and backfill
excerpt: Migrate a hypertable or entire database with low downtime
products: [cloud, self_hosted]
keywords: [backups, restore]
tags: [recovery, logical backup, pg_dump, pg_restore]
---

import SourceTargetNote from "versionContent/_partials/_migrate_source_target_note.mdx";
import GettingHelp from "versionContent/_partials/_migrate_dual_write_backfill_getting_help.mdx";

# Dual-write and backfill

Dual-write and backfill is a migration strategy to move a large amount of
time-series data (100&nbsp;GB-10&nbsp;TB+) with low downtime (on the order of
minutes of downtime). It is significantly more complicated to execute than a
migration with downtime using [pg_dump/restore][pg-dump-and-restore], and has
some prerequisites on the data ingest patterns of your application, so it may
not be universally applicable.

<SourceTargetNote />

Roughly, it consists of three steps:

1. Clone schema and relational data from source to target
1. Dual-write to source and target
1. Backfill time-series data

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

For more information, consult the step-by-step guide for your source database:

- [Dual-write and backfill from TimescaleDB][from-timescaledb]
- [Dual-write and backfill from PostgreSQL][from-postgres]

[//]: # (- [Dual-write and backfill from other][from-other])

<GettingHelp />

[from-timescaledb]: /migrate/:currentVersion:/dual-write-and-backfill/dual-write-from-timescaledb/
[from-postgres]: /migrate/:currentVersion:/dual-write-and-backfill/dual-write-from-postgres/
[from-other]: /migrate/:currentVersion:/dual-write-and-backfill/from-other/
[pg-dump-and-restore]: /migrate/:currentVersion:/pg-dump-and-restore/
