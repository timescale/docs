---
title: Live migration
excerpt: Migrate an entire database with low downtime
products: [cloud]
keywords: [migration, low-downtime, backup]
tags: [recovery, logical backup, replication]
---
import MigrationPrerequisites from "versionContent/_partials/_migration-prerequisites.mdx";
import SourceTargetNote from "versionContent/_partials/_migrate_source_target_note.mdx";
import OpenSupportRequest from "versionContent/_partials/_migrate_open_support_request.mdx"

# Live migration

You use the live migration Docker image to move 100GB-10TB+ of data to Timescale Cloud
within a few minutes. Live migration leverages Postgres' built-in replication functionality 
to provide a seamless migration with very little downtime. 

Live migration is more complicated  than [Migration with Downtime][pg-dump-and-restore], and more flexible than
[Dual write and backfill][dual-write-and-backfill]. Live migration works well when:

- Your source database has:
  - Large, busy tables with primary keys.
  - Does not have many `UPDATE` or `DELETE` statements.
- The insert workload does not exceed 20,000 rows per second, and inserts are batched. 

  If your application exceeds 20,000 rows per second, use [Dual write and backfill][dual-write-and-backfill].

Before starting live migration, have a look a the [Frequently Asked Questions][FAQ]. 

## Prerequisites

<MigrationPrerequisites />

- Install the PostgreSQL client tools on the machine you perform the migration from. This includes
  `psql`, `pg_dump`, and `pg_dumpall`.


## Migrate to Timescale Cloud

To move your data from a self-hosted database to a Timescale Cloud service:

<Tabs label="Live migration">

<Tab title="TimescaleDB to Timescale Cloud">

</Tab>
<Tab title="PostgreSQL to Timescale Cloud">

</Tab>
<Tab title="AWS RDS to Timescale Cloud">

</Tab>
</Tabs>

[from-postgres]: /migrate/:currentVersion:/live-migration/live-migration-from-postgres/
[from-timescaledb]: /migrate/:currentVersion:/live-migration/live-migration-from-timescaledb/
[pg-dump-and-restore]: /migrate/:currentVersion:/pg-dump-and-restore/
[dual-write-and-backfill]: /migrate/:currentVersion:/dual-write-and-backfill/
[live-migration-playbook]: /migrate/:currentVersion:/playbooks/rds-timescale-live-migration/
[FAQ]: /migrate/:currentVersion:/troubleshooting
