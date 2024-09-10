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
import MigrateSetupEnvironment from "versionContent/_partials/_migrate_live_setup_environment.mdx";
import MigrateSetupEnvironmentPostgres from "versionContent/_partials/_migrate_live_setup_environment_postgres.mdx";
import MigrateSetupEnvironmentMST from "versionContent/_partials/_migrate_live_setup_environment_mst.mdx";
import MigrateSetupEnvironmentAWSRDS from "versionContent/_partials/_migrate_live_setup_environment_awsrds.mdx";
import MigrateDataToCloud from "versionContent/_partials/_migrate_live_migrate_data.mdx";
import MigrateDataToCloudTimescaleDB from "versionContent/_partials/_migrate_live_migrate_data_timescaledb.mdx";
import ValidateDataInCloud from "versionContent/_partials/_migrate_live_validate_data.mdx";
import MigrateAWSRDSConnectIntermediary from "versionContent/_partials/_migrate_awsrds_connect_intermediary.mdx";
import Troubleshooting from "versionContent/_partials/_migrate_live_migrate_faq_all.mdx";

# Live migration

You use the [live-migration][live-migration-docker-image] Docker image to move 100GB-10TB+ of data to a Timescale Cloud service 
seamlessly with only a few minutes downtime. 

[Live-migration][live-migration-docker-image] is an end-to-end solution that copies the database schema and data to 
your target Timescale Cloud service, then replicates the database activity in your source database 
to the target service in real-time. Live-migration uses the Postgres logical decoding 
functionality and leverages [pgcopydb]. 

Best practice is to use live-migration when:
- Modifying your application logic to perform dual writes is a significant effort. 
- The insert workload does not exceed 20,000 rows per second, and inserts are batched.

  Use [Dual write and backfill][dual-write-and-backfill] for greater workloads.
- Your source database:
  - Uses `UPDATE` and `DELETE` statements on uncompressed time-series data.

    Live-migration does not support replicating `INSERT`/`UPDATE`/`DELETE` statements on compressed data.
  - Has large, busy tables with primary keys.
  - Does not have many `UPDATE` or `DELETE` statements.

This page shows you how to move your data from a self-hosted database to a Timescale Cloud service using
the live-migration Docker image.  

## Prerequisites

<MigrationPrerequisites />

- [Install Docker][install-docker] on your migration machine.

  This machine needs sufficient space to store the buffered changes that occur while your data is 
  being copied. This space is proportional to the amount of new uncompressed data being written to 
  the Timescale Cloud service during migration. A general rule of thumb is between 100GB and 500GB.

- Before starting live-migration, read the [Frequently Asked Questions][FAQ].

### Migrate to Timescale Cloud

To move your data from a self-hosted database to a Timescale Cloud service:

<Tabs label="Live migration">

<Tab title="From TimescaleDB">

This section shows you how to move your data from self-hosted TimescaleDB to a Timescale Cloud service 
using live-migration from Terminal.

<MigrateSetupEnvironment />

<MigrateDataToCloudTimescaleDB />

<ValidateDataInCloud />

</Tab>
<Tab title="From PostgreSQL">

This section shows you how to move your data from self-hosted PostgreSQL to a Timescale Cloud service using 
live-migration from Terminal.

<MigrateSetupEnvironmentPostgres />

<MigrateDataToCloud />

<ValidateDataInCloud />

</Tab>
<Tab title="From AWS RDS">

To migrate your data from an Amazon RDS Postgres instance to a Timescale Cloud service, you extract the data to an intermediary
EC2 Ubuntu instance in the same AWS region as your RDS instance. You then upload your data to a Timescale Cloud service.
To make this process as painless as possible, ensure that the intermediary machine has enough CPU and disk space to
rapidy extract and store your data before uploading to Timescale Cloud.

Migration from RDS moves the data only. You manually enable Timescale Cloud features like
[hypertables][about-hypertables], [data compression][data-compression] or [data retention][data-retention] after the migration is complete. You enable Timescale Cloud
features while your database is offline.

This section shows you how to move your data from an Amazon RDS instance to a Timescale Cloud service
using live-migration.


<MigrateAWSRDSConnectIntermediary />

<MigrateSetupEnvironmentAWSRDS />

<MigrateDataToCloud />

<ValidateDataInCloud />

</Tab>

<Tab title="From MST">

This section shows you how to move your data from a Managed Service for Timescale (MST) instance to a 
Timescale Cloud service using live-migration from Terminal. 

<MigrateSetupEnvironmentMST />

<MigrateDataToCloudTimescaleDB />

<ValidateDataInCloud />

</Tab>
</Tabs>

And you are done, your data is now in your Timescale Cloud service. 

## Troubleshooting

This section shows you how to workaround issues frequently seen issues using Live-migration.

<Troubleshooting />

[from-postgres]: /migrate/:currentVersion:/live-migration/live-migration-from-postgres/
[from-timescaledb]: /migrate/:currentVersion:/live-migration/live-migration-from-timescaledb/
[pg-dump-and-restore]: /migrate/:currentVersion:/pg-dump-and-restore/
[dual-write-and-backfill]: /migrate/:currentVersion:/dual-write-and-backfill/
[live-migration-playbook]: /migrate/:currentVersion:/playbooks/rds-timescale-live-migration/
[FAQ]: /migrate/:currentVersion:/troubleshooting
[pgcopydb]: https://github.com/dimitri/pgcopydb
[install-docker]: https://docs.docker.com/engine/install/
[live-migration-docker-image]: https://hub.docker.com/r/timescale/live-migration
