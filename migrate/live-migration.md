---
title: Live migration
excerpt: Migrate your entire database to Tiger Cloud with low downtime
products: [cloud]
keywords: [migration, low-downtime, backup]
tags: [recovery, logical backup, replication]
---
import MigrationPrerequisites from "versionContent/_partials/_migrate_prerequisites.mdx";
import SourceTargetNote from "versionContent/_partials/_migrate_source_target_note.mdx";
import OpenSupportRequest from "versionContent/_partials/_migrate_open_support_request.mdx"
import DoNotRecommendForLargeMigration from "versionContent/_partials/_migrate_pg_dump_do_not_recommend_for_large_migration.mdx";
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

Live migration is an end-to-end solution that copies the database schema and data to
your target $SERVICE_LONG, then replicates the database activity in your source database to the target service in real time. Live migration uses the $PG logical decoding functionality and leverages [pgcopydb].

You use the live migration Docker image to move 100GB-10TB+ of data to a $SERVICE_LONG seamlessly with only a few minutes downtime.

<DoNotRecommendForLargeMigration />

Best practice is to use live migration when:
- Modifying your application logic to perform dual writes is a significant effort. 
- The insert workload does not exceed 20,000 rows per second, and inserts are batched.

  Use [Dual write and backfill][dual-write-and-backfill] for greater workloads.
- Your source database:
  - Uses `UPDATE` and `DELETE` statements on uncompressed time-series data.

    Live-migration does not support replicating `INSERT`/`UPDATE`/`DELETE` statements on compressed data.
  - Has large, busy tables with primary keys.
  - Does not have many `UPDATE` or `DELETE` statements.

This page shows you how to move your data from a self-hosted database to a $SERVICE_LONG using
the live-migration Docker image.  

## Prerequisites

<MigrationPrerequisites />

- [Install Docker][install-docker] on your migration machine.

  This machine needs sufficient space to store the buffered changes that occur while your data is 
  being copied. This space is proportional to the amount of new uncompressed data being written to 
  the $SERVICE_LONG during migration. A general rule of thumb is between 100GB and 500GB.
  The CPU specifications of this EC2 instance should match those of your $SERVICE_LONG for optimal performance. For example, if your $SERVICE_SHORT has an 8-CPU configuration, then your EC2 instance should also have 8 CPUs.

- Before starting live migration, read the [Frequently Asked Questions][FAQ].

### Migrate to $CLOUD_LONG

To move your data from a self-hosted database to a $SERVICE_LONG:

<Tabs label="Live migration" persistKey="source-database" >

<Tab title="From TimescaleDB" label="self-hosted">

This section shows you how to move your data from $SELF_LONG to a $SERVICE_LONG 
using live migration from Terminal.

<MigrateSetupEnvironment />

<MigrateDataToCloudTimescaleDB />

<ValidateDataInCloud />

</Tab>
<Tab title="From Postgres" label="postgres">

This section shows you how to move your data from self-hosted $PG to a $SERVICE_LONG using 
live migration from Terminal.

<MigrateSetupEnvironmentPostgres />

<MigrateDataToCloud />

<ValidateDataInCloud />

</Tab>
<Tab title="From AWS RDS/Aurora" label="aws-rds">

To migrate your data from an Amazon RDS/Aurora $PG instance to a $SERVICE_LONG, you extract the data to an intermediary
EC2 Ubuntu instance in the same AWS region as your RDS/Aurora instance. You then upload your data to a $SERVICE_LONG.
To make this process as painless as possible, ensure that the intermediary machine has enough CPU and disk space to
rapidly extract and store your data before uploading to $CLOUD_LONG.

Migration from RDS/Aurora gives you the opportunity to create [hypertables][hypertables-section] before copying the data. Once the migration is complete, you can manually enable $CLOUD_LONG features like [data compression][compression] or [data retention][data-retention].

This section shows you how to move your data from an Amazon RDS/Aurora instance to a $SERVICE_LONG
using live migration.


<MigrateAWSRDSConnectIntermediary />

<MigrateSetupEnvironmentAWSRDS />

<MigrateDataToCloud />

<ValidateDataInCloud />

</Tab>

<Tab title="From MST" label="mst">

This section shows you how to move your data from a $MST_SHORT instance to a
$SERVICE_LONG using live migration from Terminal. 

<MigrateSetupEnvironmentMST />

<MigrateDataToCloudTimescaleDB />

<ValidateDataInCloud />

</Tab>
</Tabs>

And you are done, your data is now in your $SERVICE_LONG. 

## Troubleshooting

This section shows you how to work around frequently seen issues when using live migration.

<Troubleshooting />

[FAQ]: /migrate/:currentVersion:/troubleshooting

[hypertables-section]: /use-timescale/:currentVersion:/hypertables/
[compression]: /use-timescale/:currentVersion:/compression/
[data-retention]: /use-timescale/:currentVersion:/data-retention/
[dual-write-and-backfill]: /migrate/:currentVersion:/dual-write-and-backfill/
[install-docker]: https://docs.docker.com/engine/install/
