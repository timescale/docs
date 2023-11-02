---
title: Live migration
excerpt: Migrate an entire database with low downtime
products: [cloud]
keywords: [migration, low-downtime, backup]
tags: [recovery, logical backup, replication]
---
import SourceTargetNote from "versionContent/_partials/_migrate_source_target_note.mdx";

# Live migration

Live migration is a migration strategy to move a large amount of data
(100&nbsp;GB-10&nbsp;TB+) with low downtime (on the order of minutes of
downtime). It is significantly more complicated to execute than a migration
with downtime using [pg_dump/restore][pg-dump-and-restore], but supports more
use-cases and has less requirements than the [dual-write and backfill] method.

<SourceTargetNote />

Live migration leverages Postgres' built-in replication functionality to
provide a seamless migration with very little application downtime.

Roughly, it consists of four steps:

1. Prepare and create replication slot in source database.
2. Copy schema from source to target, optionally enabling hypertables.
3. Copy data from source to target while capturing changes.
4. Apply captured changes from source to target.

Currently live migration only supports migrating from PostgreSQL, but we are
actively working on supporting TimescaleDB.

Live migration works well when:
- Large, busy tables have primary keys, or don't have many `UPDATE` or
  `DELETE` statements.
- The insert workload does not exceed 20'000 rows per second, and
  inserts are batched. If your application exceeds this, you should use
  the [dual-write and backfill] migration method.

For more information, consult the step-by-step migration guide:

- [Live migration from PostgreSQL][from-postgres]

[from-postgres]: /migrate/:currentVersion:/live-migration/live-migration-from-postgres/
[pg-dump-and-restore]: /migrate/:currentVersion:/pg-dump-and-restore/
[dual-write and backfill]: /migrate/:currentVersion:/dual-write-and-backfill/