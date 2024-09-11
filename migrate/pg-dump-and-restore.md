---
title: Migrate with downtime
excerpt: Migrate a hypertable or entire database with native PostgreSQL commands
products: [cloud, self_hosted]
keywords: [backups, restore]
tags: [recovery, logical backup, pg_dump, pg_restore]
---

import DoNotRecommendForLargeMigration from "versionContent/_partials/_migrate_pg_dump_do_not_recommend_for_large_migration.mdx";
import MigrationPrerequisites from "versionContent/_partials/_migrate_prerequisites.mdx";
import MigrateFromTimescaleDB from "versionContent/_partials/_migrate_dump_timescaledb.mdx";
import MigrateFromPostgres from "versionContent/_partials/_migrate_dump_postgresql.mdx";
import MigrateFromMST from "versionContent/_partials/_migrate_dump_mst.mdx";
import MigrateFromAWSRDS from "versionContent/_partials/_migrate_dump_awsrds.mdx";
import MigrationSetupFirstSteps from "versionContent/_partials/_migrate_set_up_database_first_steps.mdx";
import MigrationSetupDBConnectionPostgres from "versionContent/_partials/_migrate_set_up_align_db_extensions_postgres_based.mdx";
import MigrationSetupDBConnectionTimescaleDB from "versionContent/_partials/_migrate_set_up_align_db_extensions_timescaledb.mdx";
import MigrationProcedureDumpSchemaPostgres from "versionContent/_partials/_migrate_dump_roles_schema_data_postgres.mdx";
import MigrationProcedureDumpSchemaMST from "versionContent/_partials/_migrate_dump_roles_schema_data_mst.mdx";
import MigrationValidateRestartApp from "versionContent/_partials/_migrate_validate_and_restart_app.mdx";
import MigrateAWSRDSConnectIntermediary from "versionContent/_partials/_migrate_awsrds_connect_intermediary.mdx";
import MigrateAWSRDSMigrateData from "versionContent/_partials/_migrate_awsrds_migrate_data_downtime.mdx";


# Migrate with downtime

You use downtime migration to move less than 100GB of data from self-hosted database to a Timescale Cloud 
service.

Downtime migration uses the native PostgreSQL [`pg_dump`][pg_dump] and [`pg_restore`][pg_restore] commands. 
If you are migrating from self-hosted TimescaleDB, this method works for compressed hypertables without having 
to decompress data before you begin. 

<DoNotRecommendForLargeMigration />

However, downtime migration for large amounts of data takes a large amount of time. For more than 100GB of data, best
practice is to follow [live migration].

This page shows you how to move your data from a self-hosted database to a Timescale Cloud service using 
shell commands.

## Prerequisites

<MigrationPrerequisites />


- Install the PostgreSQL client tools on your migration machine. 

  This includes `psql`, `pg_dump`, and `pg_dumpall`. 

- Install the GNU implementation of `sed`.

  Run `sed --version` on your migration machine. GNU sed identifies itself 
  as GNU software, BSD sed returns `sed: illegal option -- -`.


### Migrate to Timescale Cloud

To move your data from a self-hosted database to a Timescale Cloud service:

<Tabs label="Migrate with downtime">

<Tab title="From TimescaleDB">

This section shows you how to move your data from self-hosted TimescaleDB to a Timescale Cloud service 
using `pg_dump` and `psql` from Terminal.

<MigrateFromTimescaleDB />

And that is it, you have migrated your data from a self-hosted instance running TimescaleDB to a Timescale Cloud service. 

</Tab>
<Tab title="From PostgreSQL">

This section shows you how to move your data from self-hosted PostgreSQL to a Timescale Cloud service
using `pg_dump` and `psql` from Terminal.

Migration from PostgreSQL moves the data only. You must manually enable Timescale Cloud features like
[hypertables][about-hypertables], [data compression][data-compression] or [data retention][data-retention] after the migration is complete. You enable Timescale Cloud 
features while your database is offline.


<MigrateFromPostgres />


And that is it, you have migrated your data from a self-hosted instance running PostgreSQL to a Timescale Cloud service.

</Tab>

<Tab title="From AWS RDS">

To migrate your data from an Amazon RDS instance to a Timescale Cloud service, you extract the data to an intermediary 
EC2 Ubuntu instance in the same AWS region as your RDS instance. You then upload your data to a Timescale Cloud service. 
To make this process as painless as possible, ensure that the intermediary machine has enough CPU and disk space to 
rapidy extract and store your data before uploading to Timescale Cloud.  

Migration from RDS moves the data only. You must manually enable Timescale Cloud features like
[hypertables][about-hypertables], [data compression][data-compression] or [data retention][data-retention] after the migration is complete. You enable Timescale Cloud
features while your database is offline.

This section shows you how to move your data from a PostgreSQL database running in an Amazon RDS instance to a 
Timescale Cloud service using `pg_dump` and `psql` from Terminal.


<MigrateFromAWSRDS />

And that is it, you have migrated your data from an RDS instance to a Timescale Cloud service.

</Tab>


<Tab title="From MST">

This section shows you how to move your data from a Managed Service for Timescale (MST) instance to a 
Timescale Cloud service using `pg_dump` and `psql` from Terminal.

<MigrateFromMST />

And that is it, you have migrated your data from a Managed Service for Timescale (MST) instance to a Timescale Cloud service.


</Tab>

</Tabs>



[list of compatible extensions]: /use-timescale/:currentVersion:/extensions/
[pg_dump]: https://www.postgresql.org/docs/current/app-pgdump.html
[pg_restore]: https://www.postgresql.org/docs/current/app-pgrestore.html
[migrate-from-timescaledb]: /migrate/:currentVersion:/pg-dump-and-restore/#migrate-from-timescaledb-using-pg_dumprestore
[migrate-from-postgresql]: /migrate/:currentVersion:/pg-dump-and-restore/#migrate-from-postgresql-using-pg_dumprestore
[dumping-with-concurrency]: /migrate/:currentVersion:/troubleshooting/#dumping-with-concurrency
[restoring-with-concurrency]: /migrate/:currentVersion:/troubleshooting/#restoring-with-concurrency 
[long-running-pgdump]: /migrate/:currentVersion:/troubleshooting/#dumping-and-locks
[Upgrade TimescaleDB]: https://docs.timescale.com/self-hosted/latest/upgrades/
[timescaledb_pre_restore]: /api/:currentVersion:/administration/#timescaledb_post_restore
[timescaledb_post_restore]: /api/:currentVersion:/administration/#timescaledb_post_restore
[about-hypertables]: /use-timescale/:currentVersion:/hypertables/about-hypertables/
[data-compression]: /use-timescale/:currentVersion:/compression/about-compression/
[data-retention]: /use-timescale/:currentVersion:/data-retention/about-data-retention/
[live migration]: /migrate/:currentVersion:/live-migration
[space-partitioning]: /use-timescale/:currentVersion:/hypertables/about-hypertables#space-partitioning
