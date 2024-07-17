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
import MigrateSetupEnvironment from "versionContent/_partials/_migrate_live_setup_environment.mdx";
import MigrateSetupEnvironmentMST from "versionContent/_partials/_migrate_live_setup_environment_mst.mdx";
import MigrateDataToCloud from "versionContent/_partials/_migrate_live_migrate_data.mdx";


# Live migration

You use the [live-migration][live-migration-docker-image] Docker image to move 100GB-10TB+ of data to a Timescale Cloud service 
seamlessly with only a few minutes downtime. 

[live-migration][live-migration-docker-image] is an end-to-end solution that copies the database schema and data to 
your target Timescale Cloud service, then replicates updates in your source database 
to the target service in real-time. live-migration uses the Postgres logical replication 
functionality and leverages [pgcopydb]. 

Best practice is to use live-migration when:
- Modifying your application logic to perform dual writes is a significant effort. 
- The insert workload does not exceed 20,000 rows per second, and inserts are batched.

  Use [Dual write and backfill][dual-write-and-backfill] for greater workloads.
- Your source database:
  - Uses `UPDATE` and `DELETE` statements on uncompressed time-series data.

    live-migration does not support replicating `INSERT`/`UPDATE`/`DELETE` statements on compressed data.
  - Has large, busy tables with primary keys.
  - Does not have many `UPDATE` or `DELETE` statements.

<DoNotRecommendForLargeMigration />

This page shows you how to move your data from a self-hosted database to a Timescale Cloud service using
the live-migration Docker image.  

## Prerequisites

<MigrationPrerequisites />

- [Install Docker][install-docker] on your migration machine.

  This machine needs sufficient space to store the buffered changes that occur 
  while your data is being copied. This space is proportional to the amount 
  of new uncompressed data being written to the Timescale Cloud service during migration. 
  A general rule of thumb is between 100GB and 500GB.
- Before starting live-migration, read the [Frequently Asked Questions][FAQ].

To move your data from a self-hosted database to a Timescale Cloud service:

<Tabs label="Live migration">

<Tab title="From TimescaleDB">

This section shows you how to move your data from self-hosted TimescaleDB to a Timescale Cloud service 
using live-migration from Terminal.

<MigrateSetupEnvironment />

<MigrateDataToCloud />

</Tab>
<Tab title="From PostgreSQL">

</Tab>
<Tab title="From AWS RDS">

</Tab>

<Tab title="From MST">

This section shows you how to move your data from a Managed Service for Timescale (MST) instance to a 
Timescale Cloud service using live-migration from Terminal. 

<MigrateSetupEnvironmentMST />

<MigrateDataToCloud />

</Tab>
</Tabs>

And you are done, your data is now in your Timescale Cloud service. 

[from-postgres]: /migrate/:currentVersion:/live-migration/live-migration-from-postgres/
[from-timescaledb]: /migrate/:currentVersion:/live-migration/live-migration-from-timescaledb/
[pg-dump-and-restore]: /migrate/:currentVersion:/pg-dump-and-restore/
[dual-write-and-backfill]: /migrate/:currentVersion:/dual-write-and-backfill/
[live-migration-playbook]: /migrate/:currentVersion:/playbooks/rds-timescale-live-migration/
[FAQ]: /migrate/:currentVersion:/troubleshooting
[pgcopydb]: https://github.com/dimitri/pgcopydb
[install-docker]: https://docs.docker.com/engine/install/
[live-migration-docker-image]: https://hub.docker.com/r/timescale/live-migration