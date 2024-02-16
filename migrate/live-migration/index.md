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
(100&nbsp;GB-10&nbsp;TB+) with low downtime (on the order of few minutes). It requires
more steps to execute than a migration with downtime using [pg_dump/restore][pg-dump-and-restore],
but supports more use-cases and has less requirements than the [dual-write and backfill] method.

<SourceTargetNote />

Live migration leverages Postgres' built-in replication functionality to
provide a seamless migration with very little application downtime.

Roughly, it consists of four steps:

1. Prepare and create replication slot in source database.
2. Copy schema from source to target, optionally enabling hypertables.
3. Copy data from source to target while capturing changes.
4. Apply captured changes from source to target.

Live migration works well when:
- Large, busy tables have primary keys, or don't have many `UPDATE` or
  `DELETE` statements.
- The insert workload does not exceed 20,000 rows per second, and
  inserts are batched. If your application exceeds this, you should use
  the [dual-write and backfill] migration method.

Live migration has the following shortcomings:
- It does not support schema changes (DDL) during the migration process

For more information, refer to the step-by-step migration guide:

- [Live migration from PostgreSQL][from-postgres]
- [Live migration from TimescaleDB][from-timescaledb]

If you want to manually migrate data from PostgreSQL, refer to
[Live migration from PostgreSQL manually][live-migration-manual].

If you are migrating from AWS RDS to Timescale, you can refer to [this][live-migration-playbook] playbook
for a detailed migration guide.

[from-postgres]: /migrate/:currentVersion:/live-migration/live-migration-from-postgres/
[from-timescaledb]: /migrate/:currentVersion:/live-migration/live-migration-from-timescaledb/
[live-migration-manual]: /migrate/:currentVersion:/playbooks/live-migration-from-timescaledb-manually/
[pg-dump-and-restore]: /migrate/:currentVersion:/pg-dump-and-restore/
[dual-write and backfill]: /migrate/:currentVersion:/dual-write-and-backfill/
[live-migration-playbook]: /migrate/:currentVersion:/playbooks/rds-timescale-live-migration/