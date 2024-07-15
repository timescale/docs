---
title: Live migration
excerpt: Migrate an entire database with low downtime
products: [cloud]
keywords: [migration, low-downtime, backup]
tags: [recovery, logical backup, replication]
---
import MigrationPrerequisites from "versionContent/_partials/_migrate_prerequisites.mdx";
import SourceTargetNote from "versionContent/_partials/_migrate_source_target_note.mdx";
import OpenSupportRequest from "versionContent/_partials/_migrate_open_support_request.mdx"
import DoNotRecommendForLargeMigration from "versionContent/_partials/_migrate_pg_dump_do_not_recommend_for_large_migration.mdx";

# Live migration

You use the Live Migration to move 100GB-10TB+ of data to a Timescale Cloud service 
seamlessly with a few minutes downtime. 

Live migration is a Docker image developed by Timescale that uses the Postgres 
logical replication functionality and leverages [pgcopydb]. Live migration is an 
end-to-end solution that copies the database schema and data to your target Timescale 
Cloud service, then replicates updates in your source database to the target service
in real-time.

Best practice is to use live migration when:
- Modifying your application logic to perform dual writes is a significant effort. 
- The insert workload does not exceed 20,000 rows per second, and inserts are batched.

  Use [Dual write and backfill][dual-write-and-backfill] for greater workloads.
- Your source database:
  - Uses `UPDATE` and `DELETE` statements on uncompressed time-series data.

    Live migration does not support replicating `INSERT`/`UPDATE`/`DELETE` statements on compressed data.
  - Has Large, busy tables with primary keys.
  - Does not have many `UPDATE` or `DELETE` statements.

<DoNotRecommendForLargeMigration />

This page shows you how to move your data from a self-hosted database to a Timescale Cloud service using
the Live Migration Docker image.  

## Prerequisites

<MigrationPrerequisites />

- [Install Docker][install-docker] on your migration machine.

  This machine needs sufficient space to store the buffered changes that occur 
  while your data is being copied. This space is proportional to the amount 
  of new uncompressed data being written to the Timescale Cloud service during migration. 
  A general rule of thumb is between 100GB and 500GB.
- Before starting live migration, read the [Frequently Asked Questions][FAQ].

## Migrate to Timescale Cloud

To move your data from a self-hosted database to a Timescale Cloud service:

<Tabs label="Live migration">

<Tab title="From TimescaleDB">

</Tab>
<Tab title="From PostgreSQL">

</Tab>
<Tab title="From AWS RDS">

</Tab>
</Tabs>

[from-postgres]: /migrate/:currentVersion:/live-migration/live-migration-from-postgres/
[from-timescaledb]: /migrate/:currentVersion:/live-migration/live-migration-from-timescaledb/
[pg-dump-and-restore]: /migrate/:currentVersion:/pg-dump-and-restore/
[dual-write-and-backfill]: /migrate/:currentVersion:/dual-write-and-backfill/
[live-migration-playbook]: /migrate/:currentVersion:/playbooks/rds-timescale-live-migration/
[FAQ]: /migrate/:currentVersion:/troubleshooting
[pgcopydb]: https://github.com/dimitri/pgcopydb
[install-docker]: https://docs.docker.com/engine/install/